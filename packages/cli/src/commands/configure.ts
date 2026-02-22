import { createInterface } from "node:readline";
import { Command } from "commander";
import { writeConfig } from "../config.js";

function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export function registerConfigureCommand(program: Command) {
  program
    .command("configure")
    .description("Configure the CLI with your page secret key")
    .action(async () => {
      const secretKey = await prompt("Enter your page secret key: ");
      if (!secretKey) {
        console.error("No secret key provided.");
        process.exit(1);
      }
      writeConfig({ secret_key: secretKey });
      console.log("Secret key saved to ~/.changes-page/config.json");
    });
}
