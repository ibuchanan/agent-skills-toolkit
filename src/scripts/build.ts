import { join } from "node:path";

// Find all CLI entry points (*.ts in src/scripts/ root, not in lib/)
const scriptsDir = "src/scripts";
const glob = new Bun.Glob("*.ts");
const entrypoints = Array.from(glob.scanSync(scriptsDir))
  .filter((f) => f !== "build.ts")
  .sort()
  .map((f) => join(scriptsDir, f));

console.log(
  `Building ${entrypoints.length} executables: ${entrypoints.map((f) => f.split("/").pop()).join(", ")}`,
);

// Compile each entrypoint individually
const outputs = [];
for (const entrypoint of entrypoints) {
  const scriptName = entrypoint.split("/").pop()?.replace(".ts", "");
  const result = await Bun.build({
    entrypoints: [entrypoint],
    outdir: "./scripts",
    compile: true, // Equivalent to --compile
    // target: "bun", // (Optional) default is 'bun'
  });

  if (!result.success) {
    console.error(`Build failed for ${entrypoint}:`);
    for (const log of result.logs) {
      console.error(`  ${log}`);
    }
    process.exit(1);
  }

  const output = result.outputs[0];
  outputs.push(output);
  console.log(`  ✓ ${scriptName}`);
}

console.log(`\n✓ Successfully compiled ${outputs.length} executables.`);
