#!/usr/bin/env bun

/**
 * init-skill-eval: Initialize an evaluation suite for a skill.
 *
 * Usage: init-skill-eval <skill-directory>
 *
 * Creates an evaluation suite under skills/<skill-name>/evals/default/ with:
 * - promptfooconfig.yaml (Promptfoo configuration)
 * - prompts/ directory with main.txt template
 * - tests/ directory (empty, ready for test cases)
 *
 * Validates:
 * - Skill directory exists
 * - SKILL.md exists
 * - evals/default does not already exist
 *
 * Exit codes:
 * - 0: Success
 * - 1: General failure (I/O error, unsafe state)
 * - 2: Usage error (invalid arguments)
 */

import { isAbsolute, resolve } from "node:path";
import { argv } from "node:process";
import { initSkillEval } from "./lib/init-skill-eval.js";

async function main() {
  const skillPath = argv[2];

  // Validate arguments
  if (!skillPath) {
    console.error("Error: Skill directory path is required");
    console.error("Usage: init-skill-eval <skill-directory>");
    process.exit(2);
  }

  try {
    // Resolve to absolute path
    const skillDir = isAbsolute(skillPath) ? skillPath : resolve(skillPath);

    // Initialize evaluation suite
    await initSkillEval(skillDir);

    console.log(`Created evaluation suite: ${skillDir}/evals/default`);
    console.log(`  - promptfooconfig.yaml`);
    console.log(`  - prompts/main.txt`);
    console.log(`  - tests/ (empty)`);

    process.exit(0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

main();
