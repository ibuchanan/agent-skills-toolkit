#!/usr/bin/env bun

/**
 * validate-cff: Validate a CITATION.cff file.
 *
 * Usage: validate-cff <directory>
 *
 * Validates CITATION.cff in the given directory according to the CFF 1.2.0
 * minimal required fields:
 * - cff-version: must be "1.2.0"
 * - message: required
 * - title: required
 * - authors: required non-empty array; each author must be a person
 *   (family-names + given-names) or an entity (name).
 *
 * Exit codes:
 * - 0: Valid
 * - 1: Validation failed
 * - 2: Usage error (invalid arguments)
 */

import { isAbsolute, resolve } from "node:path";
import { argv } from "node:process";
import { validateCff } from "./lib/validate-cff.js";

async function main() {
  const dirPath = argv[2];

  if (!dirPath) {
    console.error("Error: Directory path is required");
    console.error("Usage: validate-cff <directory>");
    process.exit(2);
  }

  const dir = isAbsolute(dirPath) ? dirPath : resolve(dirPath);

  const result = await validateCff(dir);

  if (result.valid) {
    process.exit(0);
  }

  console.error("Validation failed:");
  for (const violation of result.violations) {
    console.error(`  - ${violation.field}: ${violation.reason}`);
  }
  process.exit(1);
}

main();
