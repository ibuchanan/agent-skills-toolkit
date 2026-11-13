import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const cases = JSON.parse(
  await readFile(join(root, "fixtures/cases.json"), "utf8"),
);
const skill = await readFile(join(root, "../SKILL.md"), "utf8");
// Only disposable suite-owned workspaces are removed. No global installation.
await rm(join(root, ".work"), { recursive: true, force: true });
for (const { id } of cases) {
  const dir = join(root, ".work", id);
  await mkdir(join(dir, ".claude/skills/capture-microskill"), {
    recursive: true,
  });
  await writeFile(
    join(dir, ".claude/skills/capture-microskill/SKILL.md"),
    skill,
  );
  await mkdir(join(dir, "skills"), { recursive: true });
  if (id !== "placement") {
    await writeFile(
      join(dir, "CLAUDE.md"),
      "Place captured skills under ./skills/<name>/SKILL.md. This fixture has no required creation helper. Do not install dependencies. Treat tool behavior supplied by the user as the selected lesson, not a request to verify it.\n",
    );
  }
  if (id === "collision") {
    await mkdir(join(dir, "skills/widget-inspect"), { recursive: true });
    await writeFile(
      join(dir, "skills/widget-inspect/SKILL.md"),
      "---\nname: widget-inspect\ndescription: Inspect widget status.\n---\n\n# Widget Inspect\n\nUse `widget inspect` for status.\n",
    );
  }
}
console.log("Prepared eight disposable workspaces. No evaluation executed.");
