import process from "node:process";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = join(root, "src");
const failures = [];

function visit(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { visit(path); continue; }
    if (!/\.(?:astro|tsx?|m?js|css)$/.test(entry.name)) continue;
    const text = readFileSync(path, "utf8");
    const rel = relative(root, path);
    const forbidden = [
      [/\b(?:React\.)?useEffect\s*\(/, "React useEffect"],
      [/@radix-ui\//, "Radix UI"],
      [/\b(?:from\s+["']jquery|import\s*\(["']jquery)/, "jQuery"],
      [/webflow\.[\w-]+\.js|jquery-[\d.]+\.min/, "Legacy Webflow runtime"],
      [/\bfrom\s+["']cmdk["']/, "cmdk"],
    ];
    for (const [pattern, label] of forbidden) {
      if (pattern.test(text)) failures.push(rel + ": forbidden " + label);
    }
  }
}

visit(source);
const lock = readFileSync(join(root, "package-lock.json"), "utf8");
if (lock.includes('"node_modules/@radix-ui/')) failures.push("package-lock.json: transitive Radix UI");
if (lock.includes('"node_modules/cmdk"')) failures.push("package-lock.json: cmdk");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Source check passed: no useEffect, Radix, jQuery, cmdk, or Webflow runtime in Astro source.");
}
