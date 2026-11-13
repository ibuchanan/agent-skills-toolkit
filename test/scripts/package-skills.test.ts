import { expect, it } from "bun:test";
import {
  cp,
  mkdir,
  readdir,
  readlink,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { join, resolve } from "node:path";
import { createTestTempDir } from "./shared/temp-dir.js";

const repoRoot = resolve(import.meta.dir, "../..");

it("prepares helpers from source and exposes them to a devDependency consumer", async () => {
  const tempDir = await createTestTempDir("consumer-");
  try {
    const source = join(tempDir, "source");
    const consumer = join(tempDir, "consumer");
    await mkdir(source);
    await mkdir(consumer);
    await cp(join(repoRoot, "package.json"), join(source, "package.json"));
    await cp(join(repoRoot, "src"), join(source, "src"), { recursive: true });
    // Supply only declared dependencies: Git consumers do not inherit dev tools.
    const manifest = await Bun.file(join(source, "package.json")).json();
    await mkdir(join(source, "node_modules"));
    for (const name of Object.keys(manifest.dependencies)) {
      const destination = join(source, "node_modules", name);
      await mkdir(resolve(destination, ".."), { recursive: true });
      await symlink(join(repoRoot, "node_modules", name), destination, "dir");
    }
    await mkdir(join(source, "skills/toolkit-example"), { recursive: true });
    await writeFile(
      join(source, "skills/toolkit-example/SKILL.md"),
      "# Toolkit example\n",
    );
    const archive = join(tempDir, "toolkit.tgz");
    const pack = Bun.spawnSync(
      [process.execPath, "pm", "pack", "--filename", archive],
      { cwd: source },
    );
    expect(pack.exitCode, pack.stderr.toString()).toBe(0);
    expect(await readlink(join(source, ".agents/skills/toolkit-example"))).toBe(
      "../../skills/toolkit-example",
    );
    const relink = Bun.spawnSync([process.execPath, "run", "link:skills"], {
      cwd: source,
    });
    expect(relink.exitCode, relink.stderr.toString()).toBe(0);
    expect(relink.stdout.toString()).toContain(
      "Already linked local skill: toolkit-example",
    );
    const listing = Bun.spawnSync(["tar", "-tzf", archive]);
    expect(listing.exitCode).toBe(0);
    expect(listing.stdout.toString()).not.toContain(".agents/");
    await rm(join(source, ".agents/skills/toolkit-example"));
    await writeFile(
      join(source, ".agents/skills/toolkit-example"),
      "preserve me",
    );
    const conflict = Bun.spawnSync([process.execPath, "run", "prepare"], {
      cwd: source,
    });
    expect(conflict.exitCode).toBe(1);
    expect(
      await Bun.file(join(source, ".agents/skills/toolkit-example")).text(),
    ).toBe("preserve me");
    expect(
      (await readdir(source)).filter((name) => name.endsWith(".bun-build")),
    ).toEqual([]);
    expect(await readdir(join(source, ".scratch/build"))).toEqual([]);

    const commands = Object.keys(manifest.bin);
    const entrypoints = (await readdir(join(source, "src/scripts")))
      .filter((name) => name.endsWith(".ts") && name !== "build.ts")
      .map((name) => name.slice(0, -3));
    expect(commands.sort()).toEqual(entrypoints.sort());
    expect((await readdir(join(source, "scripts"))).sort()).toEqual(commands);

    await writeFile(
      join(consumer, "package.json"),
      JSON.stringify({
        name: "toolkit-consumer",
        private: true,
        devDependencies: { [manifest.name]: `file:${archive}` },
      }),
    );
    const install = Bun.spawnSync(
      [process.execPath, "install", "--ignore-scripts"],
      { cwd: consumer },
    );
    expect(install.exitCode, install.stderr.toString()).toBe(0);
    // The helpers operate on the consumer's repository, not the toolkit package.
    await mkdir(join(consumer, ".git"));
    await mkdir(join(consumer, "skills"));
    const binary = (name: string) => join(consumer, "node_modules/.bin", name);
    for (const name of commands.filter((name) => name !== "find-skills")) {
      const result = Bun.spawnSync([binary(name)], { cwd: consumer });
      expect(result.exitCode, `${name}: ${result.stderr}`).toBe(2);
      expect(result.stderr.toString()).toContain("Usage:");
    }
    const init = Bun.spawnSync([binary("init-skill"), "example"], {
      cwd: consumer,
    });
    expect(init.exitCode, init.stderr.toString()).toBe(0);
    const discover = Bun.spawnSync([binary("find-skills")], { cwd: consumer });
    expect(discover.exitCode, discover.stderr.toString()).toBe(0);
    expect(discover.stdout.toString().trim()).toBe("skills/example/SKILL.md");
    const validate = Bun.spawnSync(
      [binary("validate-skill"), "skills/example"],
      { cwd: consumer },
    );
    expect(validate.exitCode, validate.stderr.toString()).toBe(0);
    expect(validate.stdout.toString()).toContain("Valid skill: example");
    for (const expected of ["Linked", "Already linked"]) {
      const link = Bun.spawnSync([binary("link-skills"), "--toolkit"], {
        cwd: consumer,
      });
      expect(link.exitCode, link.stderr.toString()).toBe(0);
      expect(link.stdout.toString()).toContain(
        `${expected} agent-skills-toolkit skill: toolkit-example`,
      );
    }
    const local = Bun.spawnSync([binary("link-skills"), "--local"], {
      cwd: consumer,
    });
    expect(local.exitCode, local.stderr.toString()).toBe(0);
    expect(await readlink(join(consumer, ".agents/skills/example"))).toBe(
      "../../skills/example",
    );
    const provider = join(consumer, "node_modules/@example/developer-tools");
    await mkdir(join(provider, "skills/provider-example"), { recursive: true });
    await writeFile(
      join(provider, "skills/provider-example/SKILL.md"),
      "# Provider example\n",
    );
    await writeFile(
      join(provider, "link.cjs"),
      `
      const { spawnSync } = require("node:child_process");
      process.exit(spawnSync(${JSON.stringify(binary("link-skills"))},
        ["--package", "@example/developer-tools"], { stdio: "inherit" }).status);
    `,
    );
    const downstream = Bun.spawnSync(
      [process.execPath, join(provider, "link.cjs")],
      { cwd: consumer },
    );
    expect(downstream.exitCode, downstream.stderr.toString()).toBe(0);
    expect(
      await readlink(join(consumer, ".agents/skills/provider-example")),
    ).toBe(
      "../../node_modules/@example/developer-tools/skills/provider-example",
    );
    expect(
      await Bun.file(
        join(consumer, ".agents/skills/toolkit-example/SKILL.md"),
      ).text(),
    ).toBe("# Toolkit example\n");
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}, 120_000);

it("copies every skill with symlinks dereferenced without fixture cycles", async () => {
  const tempDir = await createTestTempDir("copy-skills-");
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
  const tempDir = await createTestTempDir("package-skills-");
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
    ]
      .flatMap((pattern) => [
        ...new Bun.Glob(`skills/*/${pattern}`).scanSync({
          cwd: repoRoot,
          onlyFiles: true,
          dot: true,
        }),
      ])
      .filter(
        (path) =>
          !path
            .split("/")
            .some((part) => part === ".git" || part === ".gitignore"),
      );
    const expected = [
      "package.json",
      "README.md",
      "LICENSE",
      "CITATION.cff",
      ...resources,
      ...new Bun.Glob("scripts/*").scanSync({ cwd: repoRoot, onlyFiles: true }),
    ];
    expect(new Set(files)).toEqual(new Set(expected));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}, 120_000);
