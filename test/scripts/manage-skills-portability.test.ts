import { expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const script = resolve("skills/manage-skills/scripts/skills.mjs");

test("management bundle runs without external package resolution", async () => {
  const dir = await mkdtemp(resolve("tmp_rovo_manage-skills-"));
  try {
    const copied = resolve(dir, "copied cli.mjs");
    await writeFile(copied, await readFile(script, "utf8"));
    // A loader rejects bare package imports even though this checkout has
    // node_modules. File URLs and Node builtins remain available to the bundle.
    const loader = resolve(dir, "tmp_rovo_loader.mjs");
    await writeFile(
      loader,
      `export function resolve(specifier, context, next) {
      if (!/^(node:|file:|\\.\\.?\\/|\\/)/.test(specifier))
        throw new Error('External package dependency: ' + specifier);
      return next(specifier, context);
    }`,
    );
    for (const args of [
      ["--help"],
      ["validate", resolve("skills/manage-skills")],
    ]) {
      const result = Bun.spawnSync(
        [
          "node",
          "--no-warnings",
          "--experimental-loader",
          loader,
          copied,
          ...args,
        ],
        {
          cwd: dir,
          env: { ...process.env, NODE_PATH: "" },
        },
      );
      expect(result.stderr.toString()).toBe("");
      expect(result.exitCode).toBe(0);
      expect(result.stdout.length).toBeGreaterThan(0);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
