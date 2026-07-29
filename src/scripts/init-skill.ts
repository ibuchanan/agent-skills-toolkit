#!/usr/bin/env node

/**
 * init-skill: Initialize a new skill with directory structure and SKILL.md template.
 *
 * Usage: init-skill <skill-name>
 *
 * Creates:
 * - skills/<skill-name>/ directory
 * - skills/<skill-name>/SKILL.md with frontmatter
 * - Subdirectories: scripts/, assets/, references/, evals/
 *
 * Exit codes:
 * - 0: Success
 * - 1: General failure (I/O error, unsafe state)
 * - 2: Usage error (invalid arguments)
 */

import { argv } from "node:process";
import { join } from "node:path";
import { validateSkillName } from "./lib/validation.js";
import { createSkillDirectory, FileSystemError } from "./lib/io.js";
import { findRepositoryRoot } from "./lib/paths.js";

async function main() {
  const skillName = argv[2];

  // Validate arguments
  if (!skillName) {
    console.error("Error: Skill name is required");
    console.error("Usage: init-skill <skill-name>");
    process.exit(2);
  }

  // Validate skill name
  const validation = validateSkillName(skillName);
  if (!validation.valid) {
    console.error(`Error: ${validation.error}`);
    process.exit(2);
  }

  try {
    // Find repository root
    const repoRoot = await findRepositoryRoot();

    // Determine skills directory
    const skillsDir = join(repoRoot, "skills");

    // Create skill directory (atomically)
    await createSkillDirectory(skillName, skillsDir);
    console.log(`Created directory: skills/${skillName}`);
    console.log(`Created file: skills/${skillName}/SKILL.md`);
    console.log(`Created directory: skills/${skillName}/scripts`);
    console.log(`Created directory: skills/${skillName}/assets`);
    console.log(`Created directory: skills/${skillName}/references`);
    console.log(`Created directory: skills/${skillName}/evals`);

    process.exit(0);
  } catch (error) {
    if (error instanceof FileSystemError) {
      console.error(`Error: ${error.message}`);
      if (error.path) {
        console.error(`       Path: ${error.path}`);
      }
      process.exit(1);
    }

    if (
      error instanceof Error &&
      error.message.includes("Repository root not found")
    ) {
      console.error(`Error: ${error.message}`);
      process.exit(2);
    }

    // Unexpected error
    console.error(
      `Error: Unexpected failure: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

main();
