import { generateObject } from "ai";
import { z } from "zod";
import { PostType } from "@repo/supabase";
import { openRouter } from "./ai-gateway";
import { getPRCommits, getPRDetails, getPRFiles } from "./github";

export interface ChangelogInput {
  pr: Awaited<ReturnType<typeof getPRDetails>>;
  commits: Awaited<ReturnType<typeof getPRCommits>>;
  files: Awaited<ReturnType<typeof getPRFiles>>;
  userInstructions: string;
  previousDraft?: {
    title: string;
    content: string;
    tags: string[];
  };
}

const VALID_TAGS_SET = new Set<string>(Object.values(PostType));

const ChangelogOutputSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    summary: z.string().min(1, "Summary is required"),
  })
  .transform((data) => {
    const validTags = data.tags.filter((tag) => VALID_TAGS_SET.has(tag));
    return { ...data, tags: validTags.length > 0 ? validTags : [PostType.new] };
  });

export type ChangelogOutput = z.infer<typeof ChangelogOutputSchema>;

const MAX_COMMITS = 50;
const MAX_FILES = 100;

export async function generateChangelog(
  input: ChangelogInput,
): Promise<ChangelogOutput> {
  const truncatedCommits = input.commits.slice(0, MAX_COMMITS);
  const truncatedFiles = [...input.files]
    .sort((a, b) => b.additions + b.deletions - (a.additions + a.deletions))
    .slice(0, MAX_FILES);

  const { object } = await generateObject({
    model: openRouter("openai/gpt-5-mini"),
    headers: {
      "HTTP-Referer": "https://changes.page",
      "X-Title": "Changes.Page",
    },
    schema: ChangelogOutputSchema,
    system: `<instructions>
You are a changelog writer. Generate a changelog entry based on pull request information.

Generate:
- title: A clear, descriptive title for the changelog
- content: Well-formatted markdown content explaining the changes
- tags: One or more relevant tags from: fix, new, improvement, announcement, alert
- summary: A brief summary for the GitHub comment (see rules below)

<summary-rules>
The summary will be posted as a GitHub comment to inform the developer what was done.
${input.previousDraft ? "This is a REVISION of an existing draft based on user feedback." : "This is a NEW changelog draft."}

${
  input.previousDraft
    ? `Write the summary describing what you changed in this revision. Focus on what was updated or improved.
Example: "Updated the draft to emphasize the performance improvements and added details about the new caching mechanism as requested."`
    : `Write the summary describing what the changelog covers.
Example: "Created a changelog highlighting the new user authentication system with OAuth2 support and session management."`
}

Keep it to 1-2 sentences. Be specific about the main features/changes covered.
</summary-rules>
</instructions>

${input.userInstructions ? `<user-instructions>
"""${input.userInstructions}"""
</user-instructions>` : ""}`,
    prompt: `<input>
<pr-title>
"""${input.pr.title}"""
</pr-title>
<pr-description>
"""${input.pr.body || "No description provided"}"""
</pr-description>

<commits>
"""
${truncatedCommits.map((c) => c.commit.message).join("\n")}
"""
</commits>

<files-changed additions="${input.pr.additions}" deletions="${input.pr.deletions}">
"""
${truncatedFiles.map((f) => `${f.status}: ${f.filename}`).join("\n")}
"""
</files-changed>

${
  input.previousDraft
    ? `<previous-draft>
<title>
"""${input.previousDraft.title}"""
</title>
<content>
"""${input.previousDraft.content}"""
</content>
<tags>
"""${input.previousDraft.tags.join(", ")}"""
</tags>
</previous-draft>`
    : ""
}
</input>`,
  });

  return object;
}
