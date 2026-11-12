import { expect, it } from "bun:test";
import { rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { createTestTempDir } from "./shared/temp-dir.js";

const repoRoot = resolve(import.meta.dir, "../..");

it("creates unique repository-local fixtures under Git-ignored scratch storage", async () => {
  const directories: string[] = [];
  try {
    directories.push(await createTestTempDir("ignore-check-"));
    directories.push(await createTestTempDir("ignore-check-"));
    expect(directories[0]).not.toBe(directories[1]);
    for (const directory of directories) {
      expect(dirname(directory)).toBe(join(repoRoot, ".scratch/tests"));
      // An interrupted test must not expose even normally trackable files.
      const artifact = join(directory, "artifact.txt");
      await writeFile(artifact, "temporary test output\n");
      const ignored = Bun.spawnSync(
        ["git", "check-ignore", "--no-index", relative(repoRoot, artifact)],
        { cwd: repoRoot },
      );
      expect(ignored.exitCode, ignored.stderr.toString()).toBe(0);
      expect(ignored.stdout.toString().trim()).toBe(
        relative(repoRoot, artifact),
      );
    }
  } finally {
    await Promise.all(
      directories.map((directory) =>
        rm(directory, { recursive: true, force: true }),
      ),
    );
  }
});
