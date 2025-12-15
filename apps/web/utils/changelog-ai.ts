import { generateObject } from "ai";
import { z } from "zod";
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
  const truncatedCommits = input.commits.slice(0, MAX_COMMITS);
  const truncatedFiles = [...input.files]
    .sort((a, b) => (b.additions + b.deletions) - (a.additions + a.deletions))
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

Generate a concise, user-friendly changelog entry with:
- A clear, descriptive title
- Well-formatted markdown content explaining the changes
- Relevant tags (e.g., feature, bugfix, improvement, breaking-change)
</instructions>

${input.userInstructions ? `<user-instructions>${input.userInstructions}</user-instructions>` : ""}`,
    prompt: `<input>
<pr-title>${input.pr.title}</pr-title>
<pr-description>${input.pr.body || "No description provided"}</pr-description>

<commits>
${truncatedCommits.map((c) => c.commit.message).join("\n")}
</commits>

<files-changed additions="${input.pr.additions}" deletions="${input.pr.deletions}">
${truncatedFiles.map((f) => `${f.status}: ${f.filename}`).join("\n")}
</files-changed>

${input.previousDraft ? `<previous-draft>
<title>${input.previousDraft.title}</title>
<content>${input.previousDraft.content}</content>
<tags>${input.previousDraft.tags.join(", ")}</tags>
</previous-draft>` : ""}
</input>`,
  });

  return object;
}
