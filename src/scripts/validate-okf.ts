#!/usr/bin/env bun

/**
 * validate-okf: Validate an Open Knowledge Format (OKF) bundle.
 *
 * Usage: validate-okf <bundle-directory>
 *
 * Validates:
 * - The directory exists and is a bundle
 * - Every non-reserved .md file has parseable YAML frontmatter with a non-empty type
 * - Reserved filenames (index.md, log.md) are not used as concept documents
 * - When generated is present, generated.by is required
 *
 * Exit codes:
 * - 0: Valid
 * - 1: Validation failed
 * - 2: Usage error (invalid arguments)
 */

import { isAbsolute, resolve } from "node:path";
import { argv } from "node:process";
import { validateOkf } from "./lib/validate-okf.js";

async function main() {
  const bundlePath = argv[2];

  if (!bundlePath) {
    console.error("Error: Bundle directory path is required");
    console.error("Usage: validate-okf <bundle-directory>");
    process.exit(2);
  }

  const bundleDir = isAbsolute(bundlePath) ? bundlePath : resolve(bundlePath);

  try {
    const result = await validateOkf(bundleDir);

    if (result.valid) {
      console.log("✓ Valid OKF bundle");
      process.exit(0);
    } else {
      console.error("✗ Validation failed:");
      for (const violation of result.violations) {
        console.error(
          `  - ${violation.file}: ${violation.field}: ${violation.reason}`,
        );
      }
      process.exit(1);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`✗ Error: ${message}`);
    process.exit(1);
  }
}

main();
