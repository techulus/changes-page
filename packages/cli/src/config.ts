import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_DIR = join(homedir(), ".changes-page");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

interface Config {
  secret_key?: string;
}

function ensureDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function readConfig(): Config {
  if (!existsSync(CONFIG_FILE)) {
    return {};
  }
  try {
    const raw = readFileSync(CONFIG_FILE, "utf8");
    return JSON.parse(raw) as Config;
  } catch (err) {
    console.error(`Warning: failed to read config at ${CONFIG_FILE}: ${err instanceof Error ? err.message : String(err)}`);
    return {};
  }
}

export function writeConfig(config: Config) {
  ensureDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");
}

export function getSecretKey(opts: { secretKey?: string }): string | undefined {
  return opts.secretKey || process.env.CHANGESPAGE_SECRET_KEY || readConfig().secret_key;
}
