#!/usr/bin/env bun

/**
 * init-skill: Initialize starter skills by name or from root-level specs/.
 * Usage: init-skill <skill-name> | init-skill --specs
 * Exit codes: 0 success, 1 I/O or item failure, 2 usage/repository error.
 */

import { mkdir, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { argv } from "node:process";
import { createSkillDirectory, FileSystemError } from "./lib/io.js";
import { findRepositoryRoot } from "./lib/paths.js";
import { validateSkillName } from "./lib/validation.js";

function specificationName(content: string): string | undefined {
  let fence: string | undefined;
  for (const line of content.split(/\r?\n/)) {
    const marker = /^ {0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (marker) {
      if (!fence) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) {
        fence = undefined;
      }
      continue;
    }
    if (fence) continue;
    if (/^ {0,3}#[ \t]+/.test(line)) {
      const heading =
        /^ {0,3}#[ \t]+Skill specification:?[ \t]+(.*?)[ \t]*$/.exec(line);
      const name = heading?.[1];
      return name?.startsWith("`") && name.endsWith("`")
        ? name.slice(1, -1)
        : name;
    }
  }
  return undefined;
}

async function initializeSpecifications(repoRoot: string): Promise<number> {
  const specsDir = join(repoRoot, "specs");
  const skillsDir = join(repoRoot, "skills");
  const entries = await readdir(specsDir, { withFileTypes: true }).catch(
    (error) => {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    },
  );
  const files = entries
    .filter((entry) => entry.isFile() && /\.md$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();
  let recognized = 0;
  let errors = 0;
  for (const file of files) {
    const source = `specs/${file}`;
    let name: string | undefined;
    try {
      name = specificationName(await readFile(join(specsDir, file), "utf8"));
      if (name === undefined) continue;
      recognized += 1;
      const validation = validateSkillName(name);
      if (!validation.valid) throw new Error(validation.error);
      await mkdir(skillsDir, { recursive: true });
      try {
        await createSkillDirectory(name, skillsDir);
      } catch (error) {
        if (error instanceof FileSystemError && error.code === "EEXIST") {
          console.log(
            `Skipped existing skill: ${name} (${source}; skills/${name} already exists)`,
          );
          continue;
        }
        throw error;
      }
      console.log(`Created skill: ${name} (${source})`);
    } catch (error) {
      errors += 1;
      console.log(
        `Error: ${source}${name === undefined ? "" : ` (${JSON.stringify(name)})`}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  if (recognized === 0 && errors === 0) {
    console.log("No matching skill specifications found in specs/.");
  }
  return errors === 0 ? 0 : 1;
}

async function main() {
  const args = argv.slice(2);
  const skillName = args[0];
  if (args.length !== 1 || !skillName) {
    console.error("Error: Expected one skill name or --specs");
    console.error("Usage: init-skill <skill-name> | init-skill --specs");
    process.exit(2);
  }

  if (skillName !== "--specs") {
    const validation = validateSkillName(skillName);
    if (!validation.valid) {
      console.error(`Error: ${validation.error}`);
      process.exit(2);
    }
  }

  try {
    const repoRoot = await findRepositoryRoot();
    if (skillName === "--specs") {
      process.exit(await initializeSpecifications(repoRoot));
    }

    await createSkillDirectory(skillName, join(repoRoot, "skills"));
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
      if (error.path) console.error(`       Path: ${error.path}`);
      process.exit(1);
    }
    if (
      error instanceof Error &&
      error.message.includes("Repository root not found")
    ) {
      console.error(`Error: ${error.message}`);
      process.exit(2);
    }
    console.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

main();
