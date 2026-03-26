import { Command } from "commander";
import { registerConfigureCommand } from "./commands/configure.js";
import { registerPostsCommand } from "./commands/posts.js";

declare const __CLI_VERSION__: string;

const program = new Command();

program
  .name("chp")
  .description("CLI for changes.page")
  .version(__CLI_VERSION__)
  .option("--secret-key <key>", "Page secret key")
  .option("--json", "Output raw JSON");

registerConfigureCommand(program);
registerPostsCommand(program);

program.parse();
