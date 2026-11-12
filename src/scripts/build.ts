import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

const originalCwd = process.cwd();
// Resolve paths before changing cwd: Bun writes compile intermediates there,
// independently of outdir or TMPDIR.
const scriptsDir = resolve(originalCwd, "src/scripts");
const outputDir = resolve(originalCwd, "scripts");
const scratchRoot = resolve(originalCwd, ".scratch/build");
const glob = new Bun.Glob("*.ts");
const entrypoints = Array.from(glob.scanSync(scriptsDir))
  .filter((file) => file !== "build.ts")
  .sort()
  .map((file) => join(scriptsDir, file));

console.log(
  `Building ${entrypoints.length} executables: ${entrypoints.map((file) => basename(file)).join(", ")}`,
);

await mkdir(scratchRoot, { recursive: true });
const buildDir = await mkdtemp(join(scratchRoot, "compile-"));
try {
  process.chdir(buildDir);
  let completed = 0;
  for (const entrypoint of entrypoints) {
    const result = await Bun.build({
      entrypoints: [entrypoint],
      outdir: outputDir,
      compile: true,
    });

    if (!result.success) {
      console.error(`Build failed for ${entrypoint}:`);
      for (const log of result.logs) {
        console.error(`  ${log}`);
      }
      // Do not exit here: finally must restore cwd and remove intermediates.
      process.exitCode = 1;
      break;
    }

    completed += 1;
    console.log(`  ✓ ${basename(entrypoint, ".ts")}`);
  }

  if (completed === entrypoints.length) {
    console.log(`\n✓ Successfully compiled ${completed} executables.`);
  }
} finally {
  process.chdir(originalCwd);
  await rm(buildDir, { recursive: true, force: true });
}
