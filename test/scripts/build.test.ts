import { expect, it } from "bun:test";
import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { createTestTempDir } from "./shared/temp-dir.js";

const buildScript = resolve(import.meta.dir, "../../src/scripts/build.ts");

it("contains and cleans compile intermediates on successful and failed builds", async () => {
  const directory = await createTestTempDir("build-");
  try {
    const source = join(directory, "src/scripts");
    const scratch = join(directory, ".scratch/build");
    await mkdir(source, { recursive: true });
    await cp(buildScript, join(source, "build.ts"));
    // Leave another build's directory in place to verify scoped cleanup.
    await mkdir(join(scratch, "other-build"), { recursive: true });
    const sentinel = join(scratch, "other-build/keep.txt");
    await writeFile(sentinel, "leave untouched\n");
    const rootArtifact = join(directory, ".existing.bun-build");
    await writeFile(rootArtifact, "pre-existing artifact\n");
    await writeFile(join(source, "example.ts"), 'console.log("build-ok");\n');

    const runBuild = () =>
      Bun.spawnSync([process.execPath, join(source, "build.ts")], {
        cwd: directory,
      });
    const expectCleanup = async () => {
      expect(
        (await readdir(directory)).filter((name) =>
          name.endsWith(".bun-build"),
        ),
      ).toEqual([".existing.bun-build"]);
      expect(await readdir(scratch)).toEqual(["other-build"]);
      expect(await Bun.file(sentinel).text()).toBe("leave untouched\n");
      expect(await Bun.file(rootArtifact).text()).toBe(
        "pre-existing artifact\n",
      );
    };

    const success = runBuild();
    expect(success.exitCode, success.stderr.toString()).toBe(0);
    expect(success.stdout.toString()).toContain(
      "Successfully compiled 1 executables.",
    );
    const executable = join(
      directory,
      "scripts",
      process.platform === "win32" ? "example.exe" : "example",
    );
    const result = Bun.spawnSync([executable], { cwd: directory });
    expect(result.exitCode, result.stderr.toString()).toBe(0);
    expect(result.stdout.toString().trim()).toBe("build-ok");
    await expectCleanup();

    // A later entry fails after an earlier compile has created intermediates.
    await writeFile(join(source, "z-invalid.ts"), "export const invalid = ;\n");
    const failed = runBuild();
    expect(failed.exitCode).toBe(1);
    expect(failed.stderr.toString()).toContain("z-invalid.ts");
    expect(failed.stdout.toString()).not.toContain("Successfully compiled");
    await expectCleanup();

    // Exercise the unsuccessful-result branch as well as Bun's thrown errors.
    await writeFile(join(source, "example.ts"), 'console.log("build-ok");\n');
    const preload = join(directory, "fail-build.ts");
    await writeFile(
      preload,
      `Bun.build = async () => {
      await Bun.write(".simulated.bun-build", "temporary intermediate");
      return { success: false, logs: ["simulated compile failure"], outputs: [] };
    };\n`,
    );
    const unsuccessful = Bun.spawnSync(
      [process.execPath, "--preload", preload, join(source, "build.ts")],
      { cwd: directory },
    );
    expect(unsuccessful.exitCode).toBe(1);
    expect(unsuccessful.stderr.toString()).toContain(
      "simulated compile failure",
    );
    expect(unsuccessful.stdout.toString()).not.toContain(
      "Successfully compiled",
    );
    await expectCleanup();
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}, 120_000);
