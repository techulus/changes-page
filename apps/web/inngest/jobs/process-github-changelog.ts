import { supabaseAdmin } from "@changes-page/supabase/admin";
import { PostStatus } from "@changes-page/supabase/types/page";
import { v4 } from "uuid";
import { generateChangelog } from "../../utils/changelog-ai";
import {
  createPRComment,
  getPRCommits,
  getPRDetails,
  getPRFiles,
} from "../../utils/github";
import inngestClient from "../../utils/inngest";
import { createPost } from "../../utils/useDatabase";

export const processGitHubChangelog = inngestClient.createFunction(
  {
    id: "github-process-changelog",
    name: "GitHub: Process changelog from PR",
    retries: 3,
  },
  { event: "github/changelog.process" },
  async ({ event }) => {
    const {
      installationId,
      owner,
      repo,
      prNumber,
      issueNumber,
      userInstructions,
    } = event.data;

    console.log("Processing changelog for PR", { owner, repo, prNumber });

    const { data: installation, error: installationError } = await supabaseAdmin
      .from("github_installations")
      .select("page_id, enabled, ai_instructions")
      .eq("installation_id", installationId)
      .eq("repository_owner", owner)
      .eq("repository_name", repo)
      .single();

    if (installationError || !installation) {
      console.error("Installation not found:", installationError);
      return { error: "Installation not found for this repository" };
    }

    if (!installation.enabled) {
      console.log("Installation is disabled, skipping");
      return { error: "Integration is disabled for this repository" };
    }

    const { data: page, error: pageError } = await supabaseAdmin
      .from("pages")
      .select("id, user_id, url_slug, title")
      .eq("id", installation.page_id)
      .single();

    if (pageError || !page) {
      console.error("Page not found:", pageError);
      return { error: "Page not found" };
    }

    try {
      const { data: existingRef } = await supabaseAdmin
        .from("github_post_references")
        .select("post_id, comment_id, generation_count")
        .eq("repository_owner", owner)
        .eq("repository_name", repo)
        .eq("pr_number", prNumber)
        .single();

      let previousDraft:
        | { title: string; content: string; tags: string[] }
        | undefined;

      if (existingRef) {
        const { data: existingPost } = await supabaseAdmin
          .from("posts")
          .select("title, content, tags")
          .eq("id", existingRef.post_id)
          .single();

        if (existingPost) {
          previousDraft = {
            title: existingPost.title,
            content: existingPost.content,
            tags: existingPost.tags || [],
          };
        }
      }

      const [pr, commits, files] = await Promise.all([
        getPRDetails(owner, repo, prNumber, installationId),
        getPRCommits(owner, repo, prNumber, installationId),
        getPRFiles(owner, repo, prNumber, installationId),
      ]);

      const combinedInstructions = [
        installation.ai_instructions,
        userInstructions,
      ]
        .filter((s) => s?.trim())
        .join("\n\n");

      const changelog = await generateChangelog({
        pr,
        commits,
        files,
        userInstructions: combinedInstructions,
        previousDraft,
      });

      let postId: string;
      let dashboardUrl: string;

      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://changes.page";

      if (existingRef) {
        postId = existingRef.post_id;
        dashboardUrl = `${baseUrl}/page/${page.url_slug}/posts/${postId}`;

        const { data: newGenerationCount, error: updateError } =
          await supabaseAdmin.rpc("update_github_changelog_draft", {
            p_post_id: postId,
            p_title: changelog.title,
            p_content: changelog.content,
            p_tags: changelog.tags,
          });

        if (updateError) {
          console.error("Failed to update changelog draft:", {
            error: updateError,
            postId,
            context: { owner, repo, prNumber },
          });
          throw new Error(`Failed to update changelog draft: ${updateError.message}`);
        }

        await createPRComment(
          owner,
          repo,
          issueNumber,
          `📝 **Changelog draft updated!** (v${newGenerationCount})\n\n${changelog.summary}\n\n**[View and edit your draft →](${dashboardUrl})**\n\nOnce you're happy with it, you can publish it from the dashboard.`,
          installationId
        );
      } else {
        const post = await createPost({
          user_id: page.user_id,
          page_id: page.id,
          title: changelog.title,
          content: changelog.content,
          tags: changelog.tags,
          status: PostStatus.draft,
          images_folder: v4(),
          publication_date: null,
          notes: `Generated from PR #${prNumber}: ${pr.html_url}`,
          allow_reactions: true,
          email_notified: false,
        });

        postId = post.id;
        dashboardUrl = `${baseUrl}/page/${page.url_slug}/posts/${postId}`;

        const commentBody = `📝 **Changelog draft created!**\n\n${changelog.summary}\n\n**[View and edit your draft →](${dashboardUrl})**\n\nOnce you're happy with it, you can publish it from the dashboard.`;

        const commentId = await createPRComment(
          owner,
          repo,
          issueNumber,
          commentBody,
          installationId
        );

        const { error: insertError } = await supabaseAdmin
          .from("github_post_references")
          .insert({
            post_id: postId,
            installation_id: installationId,
            repository_owner: owner,
            repository_name: repo,
            pr_number: prNumber,
            pr_url: pr.html_url,
            comment_id: commentId,
          });

        if (insertError) {
          console.error("Failed to create GitHub post reference:", {
            error: insertError,
            postId,
            context: { owner, repo, prNumber },
          });
          throw new Error(`Failed to create GitHub post reference: ${insertError.message}`);
        }
      }

      return {
        success: true,
        postId,
        dashboardUrl,
        updated: !!existingRef,
      };
    } catch (error) {
      console.error("Error processing changelog:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        context: { installationId, owner, repo, prNumber, issueNumber },
      });
      throw error;
    }
  }
);
