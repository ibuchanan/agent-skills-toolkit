import { realpath, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { cwd } from "node:process";

/**
 * Error class for repository operations.
 */
export class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RepositoryError";
  }
}

/**
 * Finds the repository root by traversing upward from startPath until a .git directory is found.
 *
 * @param startPath - Starting directory (defaults to current working directory)
 * @returns Absolute path to repository root
 * @throws RepositoryError if repository root cannot be found
 */
export async function findRepositoryRoot(startPath?: string): Promise<string> {
  let current = startPath ? resolve(startPath) : cwd();
  const root = resolve("/");

  while (current !== root) {
    try {
      const gitPath = `${current}/.git`;
      const stats = await stat(gitPath);

      // If .git exists (either as directory or file for worktrees), we found the root
      if (stats.isDirectory() || stats.isFile()) {
        return current;
      }
    } catch {
      // .git doesn't exist, continue upward
    }

    current = dirname(current);
  }

  // Reached filesystem root without finding .git
  throw new RepositoryError(
    "Repository root not found. Ensure you are inside a git repository.",
  );
}

/**
 * Normalizes a file path to be relative to the repository root.
 * Removes leading ./ and uses forward slashes.
 *
 * @param absolutePath - Absolute file path
 * @param repoRoot - Repository root path
 * @returns Relative path with forward slashes, no leading ./
 */
export function normalizePath(absolutePath: string, repoRoot: string): string {
  const resolved = resolve(absolutePath);
  const relative = resolved.startsWith(repoRoot)
    ? resolved.slice(repoRoot.length).replace(/^\/+/, "")
    : resolved;

  // Convert backslashes to forward slashes (Windows compatibility)
  return relative.replace(/\\/g, "/");
}

/**
 * Resolves the full path to a skill directory.
 *
 * @param skillName - Name of the skill
 * @param repoRoot - Repository root path
 * @returns Absolute path to skills/<skill-name>
 */
export async function resolveSkillDir(
  skillName: string,
  repoRoot: string,
): Promise<string> {
  return resolve(repoRoot, "skills", skillName);
}

/**
 * Checks if a path is inside the repository.
 * Uses realpath to resolve symlinks.
 *
 * @param testPath - Path to test
 * @param repoRoot - Repository root path
 * @returns true if testPath is inside repoRoot, false otherwise
 */
export async function isPathInsideRepository(
  testPath: string,
  repoRoot: string,
): Promise<boolean> {
  try {
    const resolved = await realpath(testPath);
    const resolvedRepoRoot = await realpath(repoRoot);

    // Check if resolved path starts with repo root (with proper path separator handling)
    const normalizedResolved = resolve(resolved);
    const normalizedRepoRoot = resolve(resolvedRepoRoot);

    // Ensure we check with trailing separator to avoid false positives
    // e.g., /repo/foo should not match /repo/foobar
    return (
      normalizedResolved === normalizedRepoRoot ||
      normalizedResolved.startsWith(`${normalizedRepoRoot}/`)
    );
  } catch {
    // If realpath fails, assume path is not inside repository
    return false;
  }
}
