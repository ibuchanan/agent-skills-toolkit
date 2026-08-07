#!/usr/bin/env bun

/**
 * find-skills: Discover and list all SKILL.md files in the repository.
 *
 * Usage: find-skills
 *
 * Prints one relative path per line, sorted lexicographically.
 * Excludes SKILL.md files under node_modules.
 */

import { relative } from "node:path";
import { findRepositoryRoot, findSkillFiles } from "./lib/paths.js";

async function main() {
  const repoRoot = await findRepositoryRoot();
  const skillFiles = await findSkillFiles(repoRoot);

  const relativePaths = skillFiles.map((file) =>
    relative(repoRoot, file).replace(/^\.\//, ""),
  );

  relativePaths.sort();

  for (const path of relativePaths) {
    console.log(path);
  }
}

main();
