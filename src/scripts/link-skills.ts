#!/usr/bin/env bun

import { join } from "node:path";
import { linkSkills } from "./lib/link-skills.js";

const usage =
  "Usage: link-skills (--local | --toolkit | --package <name>) (from the consuming project root)";

async function main() {
  const args = process.argv.slice(2);
  let source: string | undefined;
  if (args.length === 1 && args[0] === "--local") source = "local";
  else if (args.length === 1 && args[0] === "--toolkit")
    source = "agent-skills-toolkit";
  else {
    const name =
      args.length === 2 && args[0] === "--package"
        ? args[1]
        : args.length === 1 && args[0]?.startsWith("--package=")
          ? args[0].slice("--package=".length)
          : undefined;
    // Registry names only: no versions, paths, traversal, or URL specifiers.
    const part = "[a-z0-9][a-z0-9._-]*";
    if (
      name &&
      name.length <= 214 &&
      new RegExp(`^(?:@${part}/)?${part}$`).test(name)
    )
      source = name;
  }
  if (!source) {
    console.error(usage);
    process.exitCode = 2;
    return;
  }

  const root = process.cwd();
  const local = args[0] === "--local";
  const sourceDir = local
    ? join(root, "skills")
    : join(root, "node_modules", source, "skills");
  try {
    const result = await linkSkills(sourceDir, join(root, ".agents", "skills"));
    for (const name of result.linked)
      console.log(`Linked ${source} skill: ${name}`);
    for (const name of result.unchanged)
      console.log(`Already linked ${source} skill: ${name}`);
    for (const name of result.removed)
      console.log(`Removed stale ${source} link: ${name}`);
    for (const name of result.conflicts)
      console.error(
        `Skipped existing .agents/skills/${name}; it is not this ${source} link.`,
      );
    if (result.conflicts.length > 0) process.exitCode = 1;
    if (Object.values(result).every((names) => names.length === 0))
      console.log(`No ${source} skills found to link.`);
  } catch (error) {
    console.error(
      `Unable to link ${source} skills: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = 1;
  }
}

void main();
