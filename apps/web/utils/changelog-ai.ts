import { z } from "zod";
import { getPRCommits, getPRDetails, getPRFiles } from "./github";
import { runWorkflow } from "./manageprompt";

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

const ChangelogOutputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

export type ChangelogOutput = z.infer<typeof ChangelogOutputSchema>;

const MAX_COMMITS = 50;
const MAX_FILES = 100;

export async function generateChangelog(
  input: ChangelogInput
): Promise<ChangelogOutput> {
  const workflowId = process.env.MANAGEPROMPT_CHANGELOG_WORKFLOW_ID;

  if (!workflowId) {
    throw new Error("MANAGEPROMPT_CHANGELOG_WORKFLOW_ID not configured");
  }

  const truncatedCommits = input.commits.slice(0, MAX_COMMITS);
  const truncatedFiles = [...input.files]
    .sort((a, b) => (b.additions + b.deletions) - (a.additions + a.deletions))
    .slice(0, MAX_FILES);

  const result = await runWorkflow(workflowId, {
    pr_title: input.pr.title,
    pr_body: input.pr.body || "",
    commits: truncatedCommits.map((c) => c.commit.message).join("\n"),
    files_changed: truncatedFiles
      .map((f) => `${f.status}: ${f.filename}`)
      .join("\n"),
    additions: input.pr.additions,
    deletions: input.pr.deletions,
    user_instructions: input.userInstructions,
    previous_draft_title: input.previousDraft?.title || "",
    previous_draft_content: input.previousDraft?.content || "",
    previous_draft_tags: input.previousDraft?.tags?.join(", ") || "",
  });

  const parsed = JSON.parse(result);
  return ChangelogOutputSchema.parse(parsed);
}
