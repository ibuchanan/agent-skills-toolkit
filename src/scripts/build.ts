import { readdirSync } from "fs";
import { join } from "path";

// Find all CLI entry points (*.ts in src/scripts/ root, not in lib/)
const scriptsDir = "src/scripts";
const files = readdirSync(scriptsDir);
const entrypoints = files
  .filter((f) => f.endsWith(".ts") && !f.includes("build"))
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
    result.logs.forEach((log) => console.error(`  ${log}`));
    process.exit(1);
  }

  const output = result.outputs[0];
  outputs.push(output);
  console.log(`  ✓ ${scriptName}`);
}

console.log(`\n✓ Successfully compiled ${outputs.length} executables.`);
