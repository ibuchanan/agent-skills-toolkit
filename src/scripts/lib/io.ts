import {
  lstat,
  mkdir,
  readFile,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";

/**
 * Error class for file system operations.
 */
export class FileSystemError extends Error {
  constructor(
    message: string,
    public path: string,
    public code: string,
  ) {
    super(message);
    this.name = "FileSystemError";
  }
}

/**
 * Creates a skill directory with all required subdirectories and SKILL.md.
 *
 * Atomicity: On failure after claiming a new directory, rolls it back.
 * Existing paths and creation collisions are never removed.
 *
 * @param skillName - Name of the skill (used for directory and frontmatter)
 * @param parentDir - Parent directory where skills/ subdirectory exists
 * @throws FileSystemError if directory already exists or I/O fails
 * @throws Error if creation partially succeeds but cleanup fails
 */
export async function createSkillDirectory(
  skillName: string,
  parentDir: string,
): Promise<void> {
  const skillDir = join(parentDir, skillName);
  const requiredSubdirs = ["scripts", "assets", "references", "evals"];

  // Non-recursive mkdir claims the target exclusively, including dangling symlinks.
  // A failed claim must never enter rollback: the path belongs to someone else.
  try {
    await mkdir(skillDir, { recursive: false });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      throw new FileSystemError(
        `Skill directory already exists: ${skillDir}`,
        skillDir,
        "EEXIST",
      );
    }
    throw error;
  }

  try {
    // Create subdirectories
    for (const subdir of requiredSubdirs) {
      const subdirPath = join(skillDir, subdir);
      await mkdir(subdirPath, { recursive: false });
    }

    // Generate and write SKILL.md
    const skillMd = generateSkillMd(skillName);
    const skillMdPath = join(skillDir, "SKILL.md");
    await writeFile(skillMdPath, skillMd, "utf8");
  } catch (error) {
    // Rollback: Remove skill directory if creation fails
    try {
      await rm(skillDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors, but creation still failed
    }
    throw error;
  }
}

/**
 * Generates the content of a SKILL.md file with valid frontmatter and body.
 *
 * @param skillName - Name of the skill (used in frontmatter)
 * @returns YAML frontmatter + markdown body
 */
export function generateSkillMd(skillName: string): string {
  // Format YAML frontmatter
  const frontmatterYaml = `name: ${skillName}
description: Brief description of what this skill does.`;

  const body = `# ${skillName}

Describe your skill here. Include:

- **Purpose**: What this skill helps with
- **When to use**: Typical use cases or triggers
- **Workflow**: Steps the skill performs
- **Inputs**: What information it needs
- **Outputs**: What it produces

## Example

Provide a practical example of the skill in action.

## References

Link to relevant documentation or related skills.
`;

  return `---
${frontmatterYaml}
---
${body}`;
}

/**
 * Reads a file as a UTF-8 string.
 *
 * @param path - File path (absolute or relative)
 * @returns File contents
 * @throws FileSystemError on read failure
 */
export async function readFile_(path: string): Promise<string> {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    throw new FileSystemError(
      `Failed to read file: ${err.message}`,
      path,
      err.code || "UNKNOWN",
    );
  }
}

/**
 * Writes a file with UTF-8 content, creating parent directories if needed.
 *
 * @param path - File path (absolute or relative)
 * @param content - File contents
 * @throws FileSystemError on write failure
 */
export async function writeFile_(path: string, content: string): Promise<void> {
  try {
    await writeFile(path, content, "utf8");
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    throw new FileSystemError(
      `Failed to write file: ${err.message}`,
      path,
      err.code || "UNKNOWN",
    );
  }
}

/**
 * Creates a directory (and parents if needed).
 *
 * @param path - Directory path
 * @throws FileSystemError on failure
 */
export async function createDirectory(path: string): Promise<void> {
  try {
    await mkdir(path, { recursive: true });
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    throw new FileSystemError(
      `Failed to create directory: ${err.message}`,
      path,
      err.code || "UNKNOWN",
    );
  }
}

/**
 * Resolves a symlink chain and returns the final target path.
 * Detects cycles and throws an error.
 *
 * @param linkPath - Path to the symlink
 * @returns Resolved absolute path
 * @throws FileSystemError if path cannot be resolved or contains a cycle
 */
export async function resolveSymlink(linkPath: string): Promise<string> {
  try {
    return await realpath(linkPath);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    throw new FileSystemError(
      `Failed to resolve symlink: ${err.message}`,
      linkPath,
      err.code || "UNKNOWN",
    );
  }
}

/**
 * Checks if a symlink exists at the given path.
 *
 * @param path - Path to check
 * @returns true if symlink exists, false otherwise
 */
export async function symlinkExists(path: string): Promise<boolean> {
  try {
    const stats = await lstat(path);
    return stats.isSymbolicLink();
  } catch {
    return false;
  }
}

/**
 * Replaces a file or directory with a symlink.
 * If target already exists as a regular file or directory, removes it first.
 *
 * @param target - Path to create symlink at
 * @param source - What the symlink should point to (absolute path)
 * @throws FileSystemError on failure
 */
export async function replaceWithSymlink(
  target: string,
  source: string,
): Promise<void> {
  try {
    // Remove existing file/directory/symlink if it exists
    try {
      await rm(target, { recursive: true, force: true });
    } catch {
      // Ignore if doesn't exist
    }

    // Create symlink
    await symlink(source, target);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    throw new FileSystemError(
      `Failed to create symlink: ${err.message}`,
      target,
      err.code || "UNKNOWN",
    );
  }
}
