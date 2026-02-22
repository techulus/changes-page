import { Command } from "commander";
import { registerConfigureCommand } from "./commands/configure.js";
import { registerPostsCommand } from "./commands/posts.js";

const program = new Command();

program
  .name("chp")
  .description("CLI for changes.page")
  .version("0.1.0")
  .option("--secret-key <key>", "Page secret key")
  .option("--pretty", "Pretty-print JSON output");

registerConfigureCommand(program);
registerPostsCommand(program);

program.parse();
