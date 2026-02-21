import { Command } from "commander";
import { ApiClient } from "../client.js";
import { getSecretKey } from "../config.js";

function readStdin(): Promise<string | null> {
  if (process.stdin.isTTY) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

function getClient(cmd: Command): ApiClient {
  const opts = cmd.optsWithGlobals();
  const secretKey = getSecretKey(opts);
  if (!secretKey) {
    console.error(
      "Error: secret key required. Use --secret-key, CHANGESPAGE_SECRET_KEY env var, or run `chp configure`."
    );
    process.exit(1);
  }
  return new ApiClient({
    apiUrl: process.env.CHANGESPAGE_API_URL || "https://changes.page",
    secretKey,
  });
}

function output(data: unknown, cmd: Command) {
  const opts = cmd.optsWithGlobals();
  if (opts.pretty) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(JSON.stringify(data));
  }
}

function parseTags(tags: string): string[] {
  return tags.split(",").map((t) => t.trim());
}

export function registerPostsCommand(program: Command) {
  const posts = program.command("posts").description("Manage posts");

  posts
    .command("list")
    .description("List posts")
    .option("--status <status>", "Filter by status (draft|published|archived)")
    .option("--limit <n>", "Max number of posts", "20")
    .option("--offset <n>", "Offset for pagination", "0")
    .action(async function (this: Command) {
      const client = getClient(this);
      const opts = this.opts();
      const data = await client.listPosts({
        status: opts.status,
        limit: Number(opts.limit),
        offset: Number(opts.offset),
      });
      output(data, this);
    });

  posts
    .command("get <id>")
    .description("Get a post by id")
    .action(async function (this: Command, id: string) {
      const client = getClient(this);
      const data = await client.getPost(id);
      output(data, this);
    });

  posts
    .command("create")
    .description("Create a new post")
    .requiredOption("--title <title>", "Post title")
    .requiredOption("--tags <tags>", "Comma-separated tags (new,fix,improvement,announcement,alert)")
    .option("--status <status>", "Post status", "draft")
    .option("--publish-at <date>", "ISO date for scheduled publish")
    .option("--allow-reactions", "Enable reactions (default: false)")
    .option("--no-allow-reactions", "Disable reactions")
    .option("--notes <notes>", "Internal notes")
    .action(async function (this: Command) {
      const client = getClient(this);
      const opts = this.opts();
      const content = await readStdin();

      if (!content) {
        console.error("Error: content required via stdin. Pipe content to this command.");
        process.exit(1);
      }

      const data = await client.createPost({
        title: opts.title,
        tags: parseTags(opts.tags),
        content,
        status: opts.status,
        publish_at: opts.publishAt ?? null,
        allow_reactions: opts.allowReactions,
        notes: opts.notes ?? null,
      });
      output(data, this);
    });

  posts
    .command("update <id>")
    .description("Update a post")
    .option("--title <title>", "Post title")
    .option("--tags <tags>", "Comma-separated tags")
    .option("--status <status>", "Post status")
    .option("--publish-at <date>", "ISO date for scheduled publish")
    .option("--allow-reactions", "Enable reactions")
    .option("--no-allow-reactions", "Disable reactions")
    .option("--notes <notes>", "Internal notes")
    .action(async function (this: Command, id: string) {
      const client = getClient(this);
      const opts = this.opts();
      const content = await readStdin();

      const body: Record<string, unknown> = {};
      if (opts.title !== undefined) body.title = opts.title;
      if (opts.tags !== undefined) body.tags = parseTags(opts.tags);
      if (content !== null) body.content = content;
      if (opts.status !== undefined) body.status = opts.status;
      if (opts.publishAt !== undefined) body.publish_at = opts.publishAt;
      if (opts.allowReactions !== undefined)
        body.allow_reactions = opts.allowReactions;
      if (opts.notes !== undefined) body.notes = opts.notes;

      if (Object.keys(body).length === 0) {
        console.error("Error: nothing to update. Provide at least one field or pipe content via stdin.");
        process.exit(1);
      }

      const data = await client.updatePost(id, body);
      output(data, this);
    });

  posts
    .command("delete <id>")
    .description("Delete a post")
    .action(async function (this: Command, id: string) {
      const client = getClient(this);
      await client.deletePost(id);
      console.log(JSON.stringify({ deleted: true, id }));
    });
}
