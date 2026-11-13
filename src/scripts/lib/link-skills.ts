import type { Dirent } from "node:fs";
import {
  lstat,
  mkdir,
  readdir,
  readlink,
  realpath,
  stat,
  symlink,
  unlink,
} from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";

export type LinkResult = {
  linked: string[];
  unchanged: string[];
  removed: string[];
  conflicts: string[];
};

/** Link immediate skill directories, preserving destinations not owned by this source. */
export async function linkSkills(
  sourceDir: string,
  targetDir: string,
): Promise<LinkResult> {
  const result: LinkResult = {
    linked: [],
    unchanged: [],
    removed: [],
    conflicts: [],
  };
  const sourceRoot = resolve(sourceDir);
  const targetRoot = resolve(targetDir);
  if (sourceRoot === targetRoot)
    throw new Error("Source and target directories must differ");
  let entries: Dirent[];
  try {
    entries = await readdir(sourceRoot, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return result;
    throw error;
  }

  // Compare physical roots too, without changing the paths stored in links.
  const physicalSource = await realpath(sourceRoot);
  try {
    if (physicalSource === (await realpath(targetRoot)))
      throw new Error("Source and target directories must differ");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  const skills: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      if ((await stat(join(sourceRoot, entry.name, "SKILL.md"))).isFile())
        skills.push(entry.name);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  skills.sort();
  await mkdir(targetRoot, { recursive: true });
  for (const name of skills) {
    const source = join(sourceRoot, name);
    const target = join(targetRoot, name);
    try {
      const targetStat = await lstat(target);
      if (
        targetStat.isSymbolicLink() &&
        resolve(dirname(target), await readlink(target)) === source
      ) {
        result.unchanged.push(name);
      } else {
        result.conflicts.push(name);
      }
      continue;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    await symlink(relative(dirname(target), source), target, "dir");
    result.linked.push(name);
  }

  const currentSkills = new Set(skills);
  const linkedEntries = await readdir(targetRoot, { withFileTypes: true });
  linkedEntries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of linkedEntries) {
    if (currentSkills.has(entry.name) || !entry.isSymbolicLink()) continue;
    const target = join(targetRoot, entry.name);
    const existingTarget = resolve(dirname(target), await readlink(target));
    // Only prune a same-name link to an immediate child of this source directory.
    if (existingTarget !== join(sourceRoot, entry.name)) continue;
    await unlink(target);
    result.removed.push(entry.name);
  }
  return result;
}
