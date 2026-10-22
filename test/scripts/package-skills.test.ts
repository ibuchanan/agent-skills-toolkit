import { expect, it } from "bun:test";
import { cp, mkdtemp, readdir, rm } from "node:fs/promises";
import { join, resolve } from "node:path";

const repoRoot = resolve(import.meta.dir, "../..");

it("copies every skill with symlinks dereferenced without fixture cycles", async () => {
  const tempDir = await mkdtemp(join(repoRoot, "tmp_rovo_copy_skills_"));
  try {
    for (const entry of await readdir(join(repoRoot, "skills"), {
      withFileTypes: true,
    })) {
      if (!entry.isDirectory()) continue;
      const source = join(repoRoot, "skills", entry.name);
      const destination = join(tempDir, entry.name);
      // The Skills CLI dereferences links when copying local skill directories.
      await cp(source, destination, { recursive: true, dereference: true });
      expect(await Bun.file(join(destination, "SKILL.md")).text()).toBe(
        await Bun.file(join(source, "SKILL.md")).text(),
      );
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

it("packs all skill resources without evaluation fixtures or contributor tooling", async () => {
  const tempDir = await mkdtemp(join(repoRoot, "tmp_rovo_package_skills_"));
  try {
    const archive = join(tempDir, "skills.tgz");
    const pack = Bun.spawnSync(
      [
        process.execPath,
        "pm",
        "pack",
        "--ignore-scripts",
        "--filename",
        archive,
      ],
      { cwd: repoRoot },
    );
    expect(pack.exitCode, pack.stderr.toString()).toBe(0);

    const listing = Bun.spawnSync(["tar", "-tzf", archive]);
    expect(listing.exitCode, listing.stderr.toString()).toBe(0);
    const files = listing.stdout
      .toString()
      .trim()
      .split("\n")
      .filter((path) => !path.endsWith("/"))
      .map((path) => path.replace(/^package\//, ""));

    const resources = [
      "SKILL.md",
      "CITATION.cff",
      "references/**/*",
      "assets/**/*",
      "scripts/**/*",
    ].flatMap((pattern) => [
      ...new Bun.Glob(`skills/*/${pattern}`).scanSync({
        cwd: repoRoot,
        onlyFiles: true,
      }),
    ]);
    const expected = [
      "package.json",
      "README.md",
      "LICENSE",
      "CITATION.cff",
      ...resources,
    ];
    expect(new Set(files)).toEqual(new Set(expected));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});
