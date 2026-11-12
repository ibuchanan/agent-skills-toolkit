import { afterEach, beforeEach, expect, it } from "bun:test";
import {
  lstat,
  mkdir,
  readlink,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { linkSkills } from "../../src/scripts/lib/link-toolkit-skills.js";
import { createTestTempDir } from "./shared/temp-dir.js";

let tempDir: string;
let source: string;
let target: string;
beforeEach(async () => {
  tempDir = await createTestTempDir("link-");
  source = join(tempDir, "node_modules/agent-skills-toolkit/skills");
  target = join(tempDir, ".agents/skills");
});
afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

async function skill(name: string) {
  await mkdir(join(source, name), { recursive: true });
  await writeFile(join(source, name, "SKILL.md"), `# ${name}\n`);
}

it("links immediate skills relatively and is idempotent", async () => {
  await skill("beta");
  await skill("alpha");
  await mkdir(join(source, "not-a-skill"));
  await mkdir(join(source, "invalid/SKILL.md"), { recursive: true });
  await skill("nested/child");
  expect(await linkSkills(source, target)).toEqual({
    linked: ["alpha", "beta"],
    unchanged: [],
    removed: [],
    conflicts: [],
  });
  const link = await readlink(join(target, "alpha"));
  expect(link.startsWith("/")).toBe(false);
  expect(resolve(target, link)).toBe(join(source, "alpha"));
  expect(await linkSkills(source, target)).toEqual({
    linked: [],
    unchanged: ["alpha", "beta"],
    removed: [],
    conflicts: [],
  });
});

it("preserves files, directories, and foreign or dangling symlinks", async () => {
  for (const name of ["file", "directory", "foreign"]) await skill(name);
  await mkdir(target, { recursive: true });
  await writeFile(join(target, "file"), "local content");
  await mkdir(join(target, "directory"));
  await symlink("missing-foreign", join(target, "foreign"), "dir");
  const result = await linkSkills(source, target);
  expect(result.conflicts).toEqual(["directory", "file", "foreign"]);
  expect(result.linked).toEqual([]);
  expect(await Bun.file(join(target, "file")).text()).toBe("local content");
  expect((await lstat(join(target, "directory"))).isDirectory()).toBe(true);
  expect(await readlink(join(target, "foreign"))).toBe("missing-foreign");
});

it("prunes only stale same-name toolkit links", async () => {
  await skill("obsolete");
  await linkSkills(source, target);
  await rm(join(source, "obsolete"), { recursive: true });
  await symlink(join(source, "other"), join(target, "alias"), "dir");
  await symlink(join(tempDir, "elsewhere"), join(target, "foreign"), "dir");
  await mkdir(join(target, "local"));
  expect((await linkSkills(source, target)).removed).toEqual(["obsolete"]);
  expect(await readlink(join(target, "alias"))).toBe(join(source, "other"));
  expect((await lstat(join(target, "foreign"))).isSymbolicLink()).toBe(true);
  expect((await lstat(join(target, "local"))).isDirectory()).toBe(true);
});

it("does not create destinations or prune links when the source is missing", async () => {
  expect(await linkSkills(source, target)).toEqual({
    linked: [],
    unchanged: [],
    removed: [],
    conflicts: [],
  });
  await expect(lstat(target)).rejects.toMatchObject({ code: "ENOENT" });
  await mkdir(target, { recursive: true });
  await symlink(join(source, "old"), join(target, "old"), "dir");
  await linkSkills(source, target);
  expect((await lstat(join(target, "old"))).isSymbolicLink()).toBe(true);
});

it("rejects identical directories and propagates filesystem errors", async () => {
  await skill("alpha");
  await expect(linkSkills(source, source)).rejects.toThrow("must differ");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, "not a directory");
  await expect(linkSkills(source, target)).rejects.toThrow();
});

it("reports CLI usage errors and missing-source no-ops", async () => {
  const script = resolve(
    import.meta.dir,
    "../../src/scripts/link-toolkit-skills.ts",
  );
  const invalid = Bun.spawnSync([process.execPath, script, "unexpected"], {
    cwd: tempDir,
  });
  expect(invalid.exitCode).toBe(2);
  expect(invalid.stderr.toString()).toContain("Usage:");
  const missing = Bun.spawnSync([process.execPath, script], { cwd: tempDir });
  expect(missing.exitCode).toBe(0);
  expect(missing.stdout.toString()).toContain("No toolkit skills found");
  await skill("alpha");
  await mkdir(target, { recursive: true });
  await writeFile(join(target, "alpha"), "local");
  const conflict = Bun.spawnSync([process.execPath, script], { cwd: tempDir });
  expect(conflict.exitCode).toBe(1);
  expect(conflict.stderr.toString()).toContain(
    "Skipped existing .agents/skills/alpha",
  );
});
