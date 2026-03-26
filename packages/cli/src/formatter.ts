import { Command } from "commander";

const isTTY = process.stdout.isTTY ?? false;
const BOLD = isTTY ? "\x1b[1m" : "";
const DIM = isTTY ? "\x1b[2m" : "";
const CYAN = isTTY ? "\x1b[36m" : "";
const RESET = isTTY ? "\x1b[0m" : "";

const DATE_KEYS = new Set(["created_at", "updated_at", "publish_at", "publication_date"]);

function formatValue(value: unknown, key?: string): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  if (key && DATE_KEYS.has(key) && typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d.toLocaleString();
  }
  return String(value);
}

function wrapText(str: string, width: number, indent: number): string {
  if (width < 10) width = 10;
  if (str.length <= width) return str;

  const lines: string[] = [];
  const pad = " ".repeat(indent);
  let remaining = str;

  while (remaining.length > 0) {
    const max = lines.length === 0 ? width : width;
    if (remaining.length <= max) {
      lines.push(remaining);
      break;
    }
    let breakAt = remaining.lastIndexOf(" ", max);
    if (breakAt <= 0) breakAt = max;
    lines.push(remaining.slice(0, breakAt));
    remaining = remaining.slice(breakAt).trimStart();
  }

  return lines.join("\n" + pad);
}

function formatList(rows: Record<string, unknown>[]) {
  const termWidth = process.stdout.columns ?? 80;

  for (let i = 0; i < rows.length; i++) {
    const entries = Object.entries(rows[i]).filter(([, v]) => v !== null && v !== undefined && v !== "");
    const maxKeyLen = entries.reduce((max, [k]) => Math.max(max, k.length), 0);
    const valueWidth = termWidth - maxKeyLen - 3;

    const indent = maxKeyLen + 3;
    for (const [key, value] of entries) {
      const label = `${BOLD}${CYAN}${key.padEnd(maxKeyLen)}${RESET}`;
      const formatted = wrapText(formatValue(value, key), Math.max(valueWidth, 20), indent);
      console.log(`${label}${DIM} : ${RESET}${formatted}`);
    }

    if (i < rows.length - 1) {
      console.log(`${DIM}${"─".repeat(Math.min(termWidth, 60))}${RESET}`);
    }
  }
}

function formatKeyValue(obj: Record<string, unknown>) {
  const termWidth = process.stdout.columns ?? 80;
  const entries = Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== "");
  const maxKeyLen = entries.reduce((max, [k]) => Math.max(max, k.length), 0);
  const valueWidth = termWidth - maxKeyLen - 3;
  const indent = maxKeyLen + 3;

  for (const [key, value] of entries) {
    const label = `${BOLD}${CYAN}${key.padEnd(maxKeyLen)}${RESET}`;
    const formatted = wrapText(formatValue(value, key), Math.max(valueWidth, 20), indent);
    console.log(`${label}${DIM} : ${RESET}${formatted}`);
  }
}

export function output(data: unknown, cmd: Command) {
  const opts = cmd.optsWithGlobals();
  if (opts.json) {
    console.log(JSON.stringify(data));
    return;
  }

  if (data === null || data === undefined) return;

  if (Array.isArray(data)) {
    if (data.length === 0) {
      console.log(DIM + "(no results)" + RESET);
      return;
    }
    formatList(data);
    return;
  }

  if (typeof data === "object") {
    formatKeyValue(data as Record<string, unknown>);
    return;
  }

  console.log(String(data));
}
