#!/usr/bin/env bun

/**
 * find-skills: Discover and list all SKILL.md files in the repository.
 *
 * Usage: find-skills
 *
 * Prints one relative path per line, sorted lexicographically.
 * Excludes SKILL.md files under node_modules.
 */

import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { findRepositoryRoot } from "./lib/paths.js";

async function findSkillFiles(dir: string): Promise<string[]> {
  const results: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules") {
        continue;
      }
      results.push(...(await findSkillFiles(path)));
    } else if (entry.isFile() && entry.name === "SKILL.md") {
      results.push(path);
    }
  }

  return results;
}

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
