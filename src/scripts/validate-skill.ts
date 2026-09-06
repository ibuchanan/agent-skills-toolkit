#!/usr/bin/env bun

/**
 * validate-skill: Validate a skill's SKILL.md file and structure.
 *
 * Usage: validate-skill <skill-directory>
 *
 * Validates:
 * - SKILL.md exists (prefer uppercase, fall back to lowercase)
 * - Frontmatter is valid YAML mapping
 * - Required fields: name, description
 * - name: lowercase, valid characters, matches directory name
 * - description: length ≤ 256 characters
 * - String frontmatter values: no colons or em dashes
 * - Optional fields: allowed-tools (array), compatibility (string)
 * - No unexpected fields in frontmatter
 *
 * Exit codes:
 * - 0: Valid
 * - 1: Validation failed (invalid SKILL.md)
 * - 2: Usage error (invalid arguments)
 */

import { isAbsolute, resolve } from "node:path";
import { argv } from "node:process";
import { validateSkill } from "./lib/validate-skill.js";
import { ValidationError } from "./lib/validation.js";

async function main() {
  const skillPath = argv[2];

  // Validate arguments
  if (!skillPath) {
    console.error("Error: Skill directory path is required");
    console.error("Usage: validate-skill <skill-directory>");
    process.exit(2);
  }

  try {
    // Resolve to absolute path
    const skillDir = isAbsolute(skillPath) ? skillPath : resolve(skillPath);

    // Validate skill
    const result = await validateSkill(skillDir);

    // Output validation result
    console.log(`✓ Valid skill: ${result.name}`);
    console.log(`  Description: ${result.description}`);
    if (result.allowedTools) {
      console.log(`  Allowed tools: ${result.allowedTools.join(", ")}`);
    }
    if (result.compatibility) {
      console.log(`  Compatibility: ${result.compatibility}`);
    }

    process.exit(0);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(`✗ Validation failed:`);
      console.error(`  ${error.message}`);
      if (error.violations && error.violations.length > 0) {
        for (const violation of error.violations) {
          console.error(`  - ${violation.field}: ${violation.reason}`);
        }
      }
      process.exit(1);
    }

    const message = error instanceof Error ? error.message : String(error);
    console.error(`✗ Error: ${message}`);
    process.exit(1);
  }
}

main();
