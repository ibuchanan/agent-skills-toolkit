#!/usr/bin/env bun

/**
 * check-skill: Run validation and lint checks against one or more skills.
 *
 * Usage:
 *   check-skill <skill-directory>
 *   check-skill --all
 *   check-skill <file-path>...
 *
 * Exit codes:
 *   0: All applicable checks passed
 *   1: One or more applicable checks failed
 *   2: Usage error (invalid arguments, missing skill directory, etc.)
 */

import { stat } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { argv } from "node:process";
import {
  checkSkill,
  createDefaultToolRunners,
  findToolkitRoot,
} from "./lib/check-skill.js";
import { findRepositoryRoot } from "./lib/paths.js";

function getToolkitRoot(): string {
  return findToolkitRoot(__dirname);
}

async function main() {
  const args = argv.slice(2);

  if (args.length === 0) {
    return printUsageError("Missing required argument");
  }

  if (args.length === 1 && args[0] === "--all") {
    return runRepoWide();
  }

  if (args.length === 1) {
    const arg = args[0]!;
    if (await isDirectory(arg)) {
      return runSingleSkill(arg);
    }
    return runFileList([arg]);
  }

  return runFileList(args);
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

async function runRepoWide(): Promise<void> {
  const repoRoot = await findRepositoryRoot();
  const toolkitRoot = getToolkitRoot();
  const result = await checkSkill({
    repoRoot,
    mode: { type: "all" },
    tools: createDefaultToolRunners(toolkitRoot),
  });
  printResult(result);
  process.exit(result.success ? 0 : 1);
}

async function runSingleSkill(skillPath: string): Promise<void> {
  const repoRoot = await findRepositoryRoot();
  const toolkitRoot = getToolkitRoot();
  const skillDir = isAbsolute(skillPath) ? skillPath : resolve(skillPath);

  const result = await checkSkill({
    repoRoot,
    mode: { type: "skill", skillDir },
    tools: createDefaultToolRunners(toolkitRoot),
  });
  printResult(result);
  process.exit(result.success ? 0 : 1);
}

async function runFileList(files: string[]): Promise<void> {
  const repoRoot = await findRepositoryRoot();
  const toolkitRoot = getToolkitRoot();
  const result = await checkSkill({
    repoRoot,
    mode: { type: "files", files },
    tools: createDefaultToolRunners(toolkitRoot),
  });
  printResult(result);
  process.exit(result.success ? 0 : 1);
}

function printResult(result: Awaited<ReturnType<typeof checkSkill>>): void {
  if (result.skillResults.length === 0) {
    console.log("No skills found to check.");
    return;
  }

  for (const skill of result.skillResults) {
    const failed = skill.toolResults.filter((t) => !t.success && !t.skipped);
    const skipped = skill.toolResults.filter((t) => t.skipped);

    if (skill.success) {
      const parts = [`✓ ${skill.skillName}`];
      if (skipped.length > 0) {
        parts.push(`(${skipped.length} skipped)`);
      }
      console.log(parts.join(" "));
    } else {
      console.log(`✗ ${skill.skillName}`);
    }

    for (const tool of failed) {
      console.error(`Error: ${skill.skillName} — ${tool.name} failed`);
      if (tool.error) {
        for (const line of tool.error.split("\n")) {
          console.error(`  ${line}`);
        }
      }
    }

    for (const tool of skipped) {
      console.error(
        `Note: ${skill.skillName} — ${tool.name} skipped${tool.skipReason ? `: ${tool.skipReason}` : ""}`,
      );
    }
  }
}

function printUsageError(message: string): never {
  console.error(`Error: ${message}`);
  console.error("Usage:");
  console.error("  check-skill <skill-directory>");
  console.error("  check-skill --all");
  console.error("  check-skill <file-path>...");
  process.exit(2);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(2);
});
