#!/usr/bin/env bun

import { join } from "node:path";
import { linkSkills } from "./lib/link-toolkit-skills.js";

async function main() {
  if (process.argv.length > 2) {
    console.error(
      "Usage: link-toolkit-skills (from the consuming project root)",
    );
    process.exit(2);
  }

  const root = process.cwd();
  const result = await linkSkills(
    join(root, "node_modules", "agent-skills-toolkit", "skills"),
    join(root, ".agents", "skills"),
  );
  for (const name of result.linked)
    console.log(`Linked toolkit skill: ${name}`);
  for (const name of result.unchanged) console.log(`Already linked: ${name}`);
  for (const name of result.removed)
    console.log(`Removed stale toolkit link: ${name}`);
  for (const name of result.conflicts) {
    console.error(
      `Skipped existing .agents/skills/${name}; it is not this toolkit link.`,
    );
  }
  if (result.conflicts.length > 0) process.exitCode = 1;
  if (Object.values(result).every((names) => names.length === 0)) {
    console.log("No toolkit skills found to link.");
  }
}

main().catch((error) => {
  console.error(
    `Unable to link toolkit skills: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});
