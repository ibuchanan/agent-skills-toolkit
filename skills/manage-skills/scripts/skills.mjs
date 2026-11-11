#!/usr/bin/env node
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { Command } from "commander";
import YAML from "yaml";
//#region src/skill-metadata.ts
const maxSkillNameLength = 64;
const maxDescriptionLength = 1024;
const maxCompatibilityLength = 500;
const allowedFields = /* @__PURE__ */ new Set([
  "name",
  "description",
  "license",
  "allowed-tools",
  "metadata",
  "compatibility",
]);
var ParseError = class extends Error {};
var ValidationError = class extends Error {};
function toStringRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      String(key),
      String(entryValue),
    ]),
  );
}
function splitParsedMetadata(metadata) {
  return {
    license: typeof metadata.license === "string" ? metadata.license : void 0,
    compatibility:
      typeof metadata.compatibility === "string"
        ? metadata.compatibility
        : void 0,
    allowedTools:
      typeof metadata["allowed-tools"] === "string"
        ? metadata["allowed-tools"]
        : void 0,
    metadata: toStringRecord(metadata.metadata),
  };
}
function rewriteSkillNameInContent(content, overrideName) {
  const { metadata, body } = parseFrontmatter(content);
  const updatedMetadata = {
    ...metadata,
    name: overrideName,
  };
  return `---\n${YAML.stringify(updatedMetadata).trimEnd()}\n---\n\n${body}\n`;
}
function findSkillMd(skillDir) {
  for (const name of ["SKILL.md", "skill.md"]) {
    const candidate = join(skillDir, name);
    if (existsSync(candidate)) return candidate;
  }
}
function readSkillContent(skillDir) {
  const resolvedDir = resolve(skillDir);
  const skillFile = findSkillMd(resolvedDir);
  if (!skillFile) throw new ParseError(`SKILL.md not found in ${resolvedDir}`);
  return {
    skillFile,
    content: readFileSync(skillFile, "utf8"),
  };
}
function parseFrontmatter(content) {
  if (!content.startsWith("---"))
    throw new ParseError("SKILL.md must start with YAML frontmatter (---)");
  const parts = content.split("---", 3);
  if (parts.length < 3)
    throw new ParseError("SKILL.md frontmatter not properly closed with ---");
  const frontmatter = parts[1] ?? "";
  const body = (parts[2] ?? "").trim();
  let parsed;
  try {
    parsed = YAML.parse(frontmatter);
  } catch (error) {
    throw new ParseError(
      `Invalid YAML in frontmatter: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    throw new ParseError("SKILL.md frontmatter must be a YAML mapping");
  const metadata = { ...parsed };
  if (
    metadata.metadata &&
    typeof metadata.metadata === "object" &&
    !Array.isArray(metadata.metadata)
  )
    metadata.metadata = Object.fromEntries(
      Object.entries(metadata.metadata).map(([key, value]) => [
        String(key),
        String(value),
      ]),
    );
  return {
    metadata,
    body,
  };
}
function parseSkill(skillDir) {
  const resolvedDir = resolve(skillDir);
  const { skillFile, content } = readSkillContent(resolvedDir);
  const { metadata, body } = parseFrontmatter(content);
  if (!("name" in metadata))
    throw new ValidationError("Missing required field in frontmatter: name");
  if (!("description" in metadata))
    throw new ValidationError(
      "Missing required field in frontmatter: description",
    );
  if (typeof metadata.name !== "string" || !metadata.name.trim())
    throw new ValidationError("Field 'name' must be a non-empty string");
  if (typeof metadata.description !== "string" || !metadata.description.trim())
    throw new ValidationError("Field 'description' must be a non-empty string");
  if (metadata.license !== void 0 && typeof metadata.license !== "string")
    throw new ValidationError("Field 'license' must be a string");
  if (
    metadata.compatibility !== void 0 &&
    typeof metadata.compatibility !== "string"
  )
    throw new ValidationError("Field 'compatibility' must be a string");
  if (
    metadata["allowed-tools"] !== void 0 &&
    typeof metadata["allowed-tools"] !== "string"
  )
    throw new ValidationError("Field 'allowed-tools' must be a string");
  const extras = splitParsedMetadata(metadata);
  return {
    name: metadata.name.trim(),
    description: metadata.description.trim(),
    ...extras,
    rawMetadata: metadata,
    skillDir: resolvedDir,
    skillFile,
    body,
  };
}
function normalizeSkillName(name) {
  return name.normalize("NFKC").trim();
}
function validateName(name, skillDir) {
  if (typeof name !== "string" || !name.trim())
    return ["Field 'name' must be a non-empty string"];
  const normalizedName = normalizeSkillName(name);
  const errors = [];
  if (normalizedName.length > maxSkillNameLength)
    errors.push(
      `Skill name '${normalizedName}' exceeds ${maxSkillNameLength} character limit (${normalizedName.length} chars)`,
    );
  if (normalizedName !== normalizedName.toLowerCase())
    errors.push(`Skill name '${normalizedName}' must be lowercase`);
  if (normalizedName.startsWith("-") || normalizedName.endsWith("-"))
    errors.push("Skill name cannot start or end with a hyphen");
  if (normalizedName.includes("--"))
    errors.push("Skill name cannot contain consecutive hyphens");
  if (![...normalizedName].every((char) => /[\p{L}\p{N}-]/u.test(char)))
    errors.push(
      `Skill name '${normalizedName}' contains invalid characters. Only letters, digits, and hyphens are allowed.`,
    );
  if (basename(skillDir).normalize("NFKC") !== normalizedName)
    errors.push(
      `Directory name '${basename(skillDir)}' must match skill name '${normalizedName}'`,
    );
  return errors;
}
function validateDescription(description) {
  if (typeof description !== "string" || !description.trim())
    return ["Field 'description' must be a non-empty string"];
  if (description.length > maxDescriptionLength)
    return [
      `Description exceeds ${maxDescriptionLength} character limit (${description.length} chars)`,
    ];
  return [];
}
function validateCompatibility(compatibility) {
  if (typeof compatibility !== "string")
    return ["Field 'compatibility' must be a string"];
  if (compatibility.length > maxCompatibilityLength)
    return [
      `Compatibility exceeds ${maxCompatibilityLength} character limit (${compatibility.length} chars)`,
    ];
  return [];
}
function validateSkill(skillDir) {
  const resolvedDir = resolve(skillDir);
  if (!existsSync(resolvedDir)) return [`Path does not exist: ${resolvedDir}`];
  if (!statSync(resolvedDir).isDirectory())
    return [`Not a directory: ${resolvedDir}`];
  const skillFile = findSkillMd(resolvedDir);
  if (!skillFile) return ["Missing required file: SKILL.md"];
  let metadata;
  try {
    ({ metadata } = parseFrontmatter(readFileSync(skillFile, "utf8")));
  } catch (error) {
    return [error instanceof Error ? error.message : String(error)];
  }
  const errors = [];
  const unexpectedFields = Object.keys(metadata).filter(
    (key) => !allowedFields.has(key),
  );
  if (unexpectedFields.length > 0)
    errors.push(
      `Unexpected fields in frontmatter: ${unexpectedFields.sort().join(", ")}. Only ${JSON.stringify([...allowedFields].sort())} are allowed.`,
    );
  if (!("name" in metadata))
    errors.push("Missing required field in frontmatter: name");
  else errors.push(...validateName(metadata.name, resolvedDir));
  if (!("description" in metadata))
    errors.push("Missing required field in frontmatter: description");
  else errors.push(...validateDescription(metadata.description));
  if ("compatibility" in metadata)
    errors.push(...validateCompatibility(metadata.compatibility));
  return errors;
}
function validateImportedSkill(skillDir, allowDirectoryMismatch) {
  const errors = validateSkill(skillDir);
  if (!allowDirectoryMismatch) return errors;
  return errors.filter(
    (error) =>
      !error.startsWith("Directory name '") ||
      !error.includes("must match skill name"),
  );
}
//#endregion
//#region src/cli.ts
const workspaceRoot = process.cwd();
const repoSkillsDir = resolve(workspaceRoot, "packages/agents/src/skills");
const defaultInstallDir = ".agents/skills";
const skillTemplate = `---
name: {{SKILL_NAME}}
description: TODO describe when to use this skill and what it does.
---

# {{TITLE}}

Describe the workflow, key steps, and any guardrails here.
`;
const evalTemplate = `- description: '{{SKILL_NAME}} helps with its intended workflow'
  vars:
    skill_path: {{SKILL_PATH}}
    task: |
      TODO replace with a realistic user request that should trigger this skill.
    required_paths:
      summary: true
      recommended_actions: true
      guardrails: true
      references: true
    array_min_lengths:
      recommended_actions: 2
      guardrails: 1
      references: 1
`;
function assertValidSkillName(name) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name))
    throw new Error(
      `Invalid skill name: ${name}. Use lowercase letters, numbers, and dashes only.`,
    );
}
function titleCaseFromSkillName(name) {
  return name
    .split("-")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}
function resolveSourceDir(source) {
  return source ? resolve(source) : repoSkillsDir;
}
function findWorkspaceRoot(startDir) {
  let currentDir = resolve(startDir);
  while (true) {
    const packageJsonPath = join(currentDir, "package.json");
    if (existsSync(packageJsonPath))
      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
        if (Array.isArray(packageJson.workspaces)) return currentDir;
      } catch {}
    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) return startDir;
    currentDir = parentDir;
  }
}
function resolveTargetRepo(targetArg) {
  return targetArg ? resolve(targetArg) : findWorkspaceRoot(workspaceRoot);
}
function displayPath(pathValue) {
  const relativePath = relative(workspaceRoot, pathValue);
  if (!relativePath || relativePath === "") return ".";
  if (relativePath.startsWith("..")) return pathValue;
  return relativePath;
}
function isRelativeDest(destOption) {
  return !resolve(destOption).startsWith("/");
}
function resolveInstallDestination(targetRepo, destOption) {
  const destination = destOption ?? defaultInstallDir;
  if (destOption && !isRelativeDest(destOption)) return resolve(destOption);
  return resolve(targetRepo, destination);
}
function displayCreatedPath(pathValue) {
  return displayPath(pathValue);
}
function displaySourcePath(pathValue) {
  return displayPath(pathValue);
}
function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true });
}
function listSkillNames(sourceDir) {
  if (!existsSync(sourceDir)) return [];
  return readdirSync(sourceDir)
    .filter((entry) => {
      return findSkillMd(join(sourceDir, entry)) !== void 0;
    })
    .sort((left, right) => left.localeCompare(right));
}
function scaffoldSkill(sourceDir, skillName, force) {
  assertValidSkillName(skillName);
  ensureDir(sourceDir);
  const skillDir = join(sourceDir, skillName);
  const skillFile = join(skillDir, "SKILL.md");
  const evalFile = join(skillDir, "evals", `${skillName}.yaml`);
  if (existsSync(skillDir) && !force)
    throw new Error(
      `Skill directory already exists: ${displaySourcePath(skillDir)}`,
    );
  ensureDir(skillDir);
  ensureDir(join(skillDir, "references"));
  ensureDir(join(skillDir, "scripts"));
  ensureDir(join(skillDir, "assets"));
  ensureDir(join(skillDir, "evals"));
  const body = skillTemplate
    .replaceAll("{{SKILL_NAME}}", skillName)
    .replaceAll("{{TITLE}}", titleCaseFromSkillName(skillName));
  const evalBody = evalTemplate
    .replaceAll("{{SKILL_NAME}}", skillName)
    .replaceAll(
      "{{SKILL_PATH}}",
      JSON.stringify(
        `src/skills/${relative(sourceDir, skillDir).replaceAll("\\", "/")}/SKILL.md`,
      ),
    );
  if (existsSync(skillFile) && !force)
    throw new Error(
      `Refusing to overwrite existing file: ${displaySourcePath(skillFile)}`,
    );
  if (existsSync(evalFile) && !force)
    throw new Error(
      `Refusing to overwrite existing file: ${displaySourcePath(evalFile)}`,
    );
  writeFileSync(skillFile, body, "utf8");
  writeFileSync(evalFile, evalBody, "utf8");
  console.log(`Created skill scaffold at ${displayCreatedPath(skillDir)}`);
}
function copyDirectory(sourceDir, destinationDir, force) {
  if (existsSync(destinationDir)) {
    if (!force)
      throw new Error(`Destination already exists: ${destinationDir}`);
    rmSync(destinationDir, {
      recursive: true,
      force: true,
    });
  }
  ensureDir(dirname(destinationDir));
  cpSync(sourceDir, destinationDir, {
    recursive: true,
    dereference: false,
    errorOnExist: false,
    filter(sourcePath) {
      const relativePath = relative(sourceDir, sourcePath);
      if (!relativePath) return true;
      if (relativePath === ".git") return false;
      return !relativePath.split(/[\\/]/).includes(".git");
    },
  });
}
function createSkillLink(sourceSkillDir, destinationSkillDir, force) {
  if (existsSync(destinationSkillDir) || lstatSafe(destinationSkillDir)) {
    if (!force)
      throw new Error(`Destination already exists: ${destinationSkillDir}`);
    rmSync(destinationSkillDir, {
      recursive: true,
      force: true,
    });
  }
  ensureDir(dirname(destinationSkillDir));
  symlinkSync(sourceSkillDir, destinationSkillDir, "junction");
}
function lstatSafe(pathValue) {
  try {
    lstatSync(pathValue);
    return true;
  } catch {
    return false;
  }
}
function writeSkillNameOverride(skillDir, overrideName) {
  const { skillFile, content } = readSkillContent(skillDir);
  writeFileSync(skillFile, rewriteSkillNameInContent(content, overrideName));
}
function installSkill(
  sourceDir,
  skillName,
  targetArg,
  destOption,
  copy,
  force,
) {
  assertValidSkillName(skillName);
  const sourceSkillDir = join(sourceDir, skillName);
  const validationErrors = validateSkill(sourceSkillDir);
  if (validationErrors.length > 0)
    throw new Error(`Skill is invalid: ${validationErrors.join("; ")}`);
  const installBase = resolveInstallDestination(
    resolveTargetRepo(targetArg),
    destOption,
  );
  ensureDir(installBase);
  const destinationSkillDir = join(installBase, basename(sourceSkillDir));
  installSkillByMode(sourceSkillDir, destinationSkillDir, copy, force);
  console.log(installSuccessMessage(skillName, destinationSkillDir, copy));
}
function importSkill(
  sourceDir,
  importPathArg,
  destinationNameArg,
  overrideName,
  force,
) {
  const externalSkillDir = resolve(importPathArg);
  const validationErrors = validateImportedSkill(
    externalSkillDir,
    destinationNameArg !== void 0,
  );
  if (validationErrors.length > 0)
    throw new Error(
      `Skill not valid at import path: ${validationErrors.join("; ")}`,
    );
  const destinationName = destinationNameArg ?? basename(externalSkillDir);
  assertValidSkillName(destinationName);
  if (overrideName) assertValidSkillName(overrideName);
  ensureDir(sourceDir);
  const destinationSkillDir = join(sourceDir, destinationName);
  copyDirectory(externalSkillDir, destinationSkillDir, force);
  const effectiveName = overrideName ?? destinationNameArg;
  if (effectiveName) writeSkillNameOverride(destinationSkillDir, effectiveName);
  const destinationValidationErrors = validateSkill(destinationSkillDir);
  if (destinationValidationErrors.length > 0)
    throw new Error(
      `Imported skill is invalid: ${destinationValidationErrors.join("; ")}`,
    );
  console.log(`Imported ${destinationName} to ${destinationSkillDir}`);
}
function resolveSkillTarget(input, sourceDir) {
  if (input.includes("/") || input.includes("\\") || existsSync(input))
    return resolve(input);
  return join(sourceDir, input);
}
function validateSkillCommand(input, sourceDir) {
  const skillPath = resolveSkillTarget(input, sourceDir);
  const errors = validateSkill(skillPath);
  if (errors.length > 0) {
    console.error(`Validation failed for ${skillPath}:`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Valid skill: ${skillPath}`);
}
function listSkills(sourceDir, json) {
  const names = listSkillNames(sourceDir);
  if (json) {
    const payload = names.map((name) => {
      const skill = parseSkill(join(sourceDir, name));
      return {
        name,
        path: join(sourceDir, name),
        description: skill.description,
      };
    });
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  if (names.length === 0) {
    console.log(`No skills found in ${sourceDir}`);
    return;
  }
  for (const [index, name] of names.entries()) {
    const skill = parseSkill(join(sourceDir, name));
    console.log(name);
    console.log(`  ${skill.description}`);
    if (index < names.length - 1) console.log("");
  }
}
function installSkillByMode(sourceSkillDir, destinationSkillDir, copy, force) {
  if (copy) {
    copyDirectory(sourceSkillDir, destinationSkillDir, force);
    return;
  }
  createSkillLink(sourceSkillDir, destinationSkillDir, force);
}
function installSuccessVerb(copy) {
  return copy ? "Copied" : "Installed";
}
function installDescription() {
  return "Install a skill into a local .agents/skills directory by symlink (default) or by copying.";
}
function installSuccessMessage(skillName, destinationSkillDir, copy) {
  return `${installSuccessVerb(copy)} ${skillName} to ${displayCreatedPath(destinationSkillDir)}`;
}
function installModeOptionDescription() {
  return "Copy the skill directory instead of creating a symlink.";
}
function installSkillCommand(sourceDir, skillName, targetArg, options) {
  installSkill(
    sourceDir,
    skillName,
    targetArg,
    options.dest,
    options.copy === true,
    options.force === true,
  );
}
function buildProgram() {
  const program = new Command();
  program
    .name("manage-skills")
    .description("Manage local skill definitions.")
    .showHelpAfterError()
    .helpCommand(false);
  program
    .command("list")
    .description("Show available skills in this repo.")
    .option("--source <dir>", "Override the repo skills source directory.")
    .option("--json", "Emit machine-readable JSON for list.")
    .action((options) => {
      listSkills(resolveSourceDir(options.source), options.json === true);
    });
  program
    .command("validate")
    .description("Validate a skill by name or path.")
    .argument("<skill>")
    .option("--source <dir>", "Override the repo skills source directory.")
    .action((skill, options) => {
      validateSkillCommand(skill, resolveSourceDir(options.source));
    });
  program
    .command("new")
    .description(
      "Scaffold a new skill with SKILL.md and common subdirectories.",
    )
    .argument("<name>")
    .option("--source <dir>", "Override the repo skills source directory.")
    .option("--force", "Overwrite existing files/directories when applicable.")
    .action((name, options) => {
      scaffoldSkill(
        resolveSourceDir(options.source),
        name,
        options.force === true,
      );
    });
  program
    .command("install")
    .description(installDescription())
    .argument("<name>")
    .argument("[target]")
    .option("--source <dir>", "Override the repo skills source directory.")
    .option(
      "--dest <path>",
      "Override install destination relative to the target repo.",
    )
    .option("--copy", installModeOptionDescription())
    .option("--force", "Overwrite existing files/directories when applicable.")
    .action((name, target, options) => {
      installSkillCommand(
        resolveSourceDir(options.source),
        name,
        target,
        options,
      );
    });
  program
    .command("import")
    .description(
      "Copy an external skill directory into this repo's source directory.",
    )
    .argument("<path>")
    .argument("[name]")
    .option("--source <dir>", "Override the repo skills source directory.")
    .option(
      "--override-name <name>",
      "Override the imported skill frontmatter name.",
    )
    .option("--force", "Overwrite existing files/directories when applicable.")
    .action((importPath, name, options) => {
      importSkill(
        resolveSourceDir(options.source),
        importPath,
        name,
        options.overrideName,
        options.force === true,
      );
    });
  return program;
}
async function main(argv) {
  await buildProgram().parseAsync(argv);
}
if (import.meta.url === `file://${process.argv[1]}`)
  main(process.argv).catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  });
//#endregion
export { buildProgram, main };

//# sourceMappingURL=cli.mjs.map
