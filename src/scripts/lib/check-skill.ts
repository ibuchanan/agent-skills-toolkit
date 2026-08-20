import { accessSync } from "node:fs";
import { access, realpath, readdir, stat } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { findSkillFiles } from "./paths.js";
import { validateCff } from "./validate-cff.js";
import { validateOkf } from "./validate-okf.js";
import { validateSkill } from "./validate-skill.js";

export interface ToolResult {
  success: boolean;
  skipped?: boolean;
  skipReason?: string;
  error?: string;
}

export interface ToolContext {
  repoRoot: string;
}

export interface ToolRunner {
  name: string;
  applicable: (skillDir: string) => boolean | Promise<boolean>;
  run: (skillDir: string, context: ToolContext) => Promise<ToolResult>;
}

export interface SkillResult {
  skillDir: string;
  skillName: string;
  success: boolean;
  toolResults: Array<{ name: string } & ToolResult>;
}

export interface CheckSkillResult {
  success: boolean;
  skillResults: SkillResult[];
}

export type CheckSkillMode =
  | { type: "skill"; skillDir: string }
  | { type: "all" }
  | { type: "files"; files: string[] };

export interface CheckSkillOptions {
  repoRoot: string;
  mode: CheckSkillMode;
  tools?: ToolRunner[];
}

const defaultValidators: ToolRunner[] = [
  {
    name: "validate-skill",
    applicable: () => true,
    async run(skillDir, _context) {
      try {
        await validateSkill(skillDir);
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false, error: message };
      }
    },
  },
  {
    name: "validate-okf",
    applicable: async (skillDir) => isDirectory(join(skillDir, "references")),
    async run(skillDir, _context) {
      try {
        const result = await validateOkf(join(skillDir, "references"));
        if (result.valid) {
          return { success: true };
        }
        return {
          success: false,
          error: result.violations
            .map((v) => `${v.file}: ${v.field}: ${v.reason}`)
            .join("\n"),
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false, error: message };
      }
    },
  },
  {
    name: "validate-cff",
    applicable: async (skillDir) => pathExists(join(skillDir, "CITATION.cff")),
    async run(skillDir, _context) {
      try {
        const result = await validateCff(skillDir);
        if (result.valid) {
          return { success: true };
        }
        return {
          success: false,
          error: result.violations
            .map((v) => `${v.field}: ${v.reason}`)
            .join("\n"),
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false, error: message };
      }
    },
  },
];

/**
 * Runs skill checks for the requested mode.
 *
 * @throws Error for usage errors (missing skill directory, invalid path, etc.)
 * @returns Result object; success is false if any applicable check failed
 */
export async function checkSkill(
  options: CheckSkillOptions,
): Promise<CheckSkillResult> {
  const { repoRoot, mode, tools = defaultValidators } = options;
  const skillDirs = await resolveSkillDirs(repoRoot, mode);

  const skillResults: SkillResult[] = [];
  for (const skillDir of skillDirs) {
    const skillName = skillDirName(skillDir, repoRoot);
    const toolResults: Array<{ name: string } & ToolResult> = [];
    let skillSuccess = true;

    for (const tool of tools) {
      const isApplicable = await tool.applicable(skillDir);
      if (!isApplicable) {
        toolResults.push({
          name: tool.name,
          success: true,
          skipped: true,
          skipReason: "Not applicable",
        });
        continue;
      }

      const result = await tool.run(skillDir, { repoRoot });
      toolResults.push({ name: tool.name, ...result });
      if (!result.success && !result.skipped) {
        skillSuccess = false;
      }
    }

    skillResults.push({
      skillDir,
      skillName,
      success: skillSuccess,
      toolResults,
    });
  }

  return {
    success: skillResults.every((r) => r.success),
    skillResults,
  };
}

async function resolveSkillDirs(
  repoRoot: string,
  mode: CheckSkillMode,
): Promise<string[]> {
  if (mode.type === "all") {
    const skillFiles = await findSkillFiles(repoRoot);
    const dirs = skillFiles.map((file) => dirname(file));
    return Array.from(new Set(dirs)).sort();
  }

  if (mode.type === "skill") {
    const skillDir = resolve(mode.skillDir);
    await assertSkillDir(skillDir);
    return [skillDir];
  }

  // mode.type === "files"
  const skillDirs = new Set<string>();
  for (const file of mode.files) {
    const resolved = resolve(repoRoot, file);
    const skillDir = await findContainingSkillDir(resolved, repoRoot);
    if (skillDir) {
      skillDirs.add(skillDir);
    }
  }
  return Array.from(skillDirs).sort();
}

async function assertSkillDir(skillDir: string): Promise<void> {
  try {
    const s = await stat(skillDir);
    if (!s.isDirectory()) {
      throw new Error(`Not a directory: ${skillDir}`);
    }
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      throw new Error(`Skill directory not found: ${skillDir}`);
    }
    throw error;
  }

  const upperPath = join(skillDir, "SKILL.md");
  const lowerPath = join(skillDir, "skill.md");

  try {
    if ((await stat(upperPath)).isFile()) {
      return;
    }
  } catch {
    // upper not found, try lower
  }

  try {
    if ((await stat(lowerPath)).isFile()) {
      return;
    }
  } catch {
    // lower not found
  }

  throw new Error(`Skill directory must contain SKILL.md: ${skillDir}`);
}

async function findContainingSkillDir(
  filePath: string,
  repoRoot: string,
): Promise<string | null> {
  let current = filePath;
  try {
    const s = await stat(current);
    if (s.isFile()) {
      current = dirname(current);
    }
  } catch {
    // path doesn't exist; treat as a file path and start from its parent
    current = dirname(current);
  }

  const root = resolve(repoRoot);
  while (current !== root && current.length > root.length) {
    const upperPath = join(current, "SKILL.md");
    const lowerPath = join(current, "skill.md");
    try {
      if (
        (await stat(upperPath)).isFile() ||
        (await stat(lowerPath)).isFile()
      ) {
        return current;
      }
    } catch {
      // continue upward
    }
    current = dirname(current);
  }

  return null;
}

function skillDirName(skillDir: string, repoRoot: string): string {
  const rel = relative(repoRoot, skillDir);
  if (rel && rel !== skillDir) {
    const parts = rel.split("/");
    return parts.at(-1) ?? skillDir;
  }
  return skillDir;
}

function pathExistsSync(path: string): boolean {
  try {
    accessSync(path);
    return true;
  } catch {
    return false;
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

async function hasMarkdownFiles(dir: string): Promise<boolean> {
  const files = await findSkillFilesForTool(dir, ".md");
  return files.length > 0;
}

async function findSkillFilesForTool(
  dir: string,
  extension: string,
  excludeDirs = ["node_modules", ".git", "evals"],
): Promise<string[]> {
  const files: string[] = [];
  async function walk(current: string) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) {
        if (excludeDirs.includes(entry.name)) {
          continue;
        }
        await walk(path);
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(path);
      }
    }
  }
  await walk(dir);
  return files;
}

async function runExternalCommand(
  command: string,
  args: string[],
  cwd: string,
): Promise<ToolResult> {
  try {
    const result = await Bun.$`${command} ${args}`.cwd(cwd).quiet().nothrow();
    if (result.exitCode === 0) {
      return { success: true };
    }
    return {
      success: false,
      error: result.stderr.toString().trim() || result.stdout.toString().trim(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}

async function commandExists(command: string): Promise<boolean> {
  try {
    await Bun.$`command -v ${command}`.quiet().nothrow();
    return true;
  } catch {
    return false;
  }
}

export function findToolkitRoot(scriptDir: string): string {
  const candidates = [resolve(scriptDir, ".."), resolve(scriptDir, "../..")];
  for (const candidate of candidates) {
    if (pathExistsSync(resolve(candidate, "node_modules/.bin", "cspell"))) {
      return candidate;
    }
  }
  return candidates[0]!;
}

export function createDefaultToolRunners(toolkitRoot: string): ToolRunner[] {
  const resolveBinary = (name: string) =>
    pathExistsSync(resolve(toolkitRoot, "node_modules/.bin", name))
      ? resolve(toolkitRoot, "node_modules/.bin", name)
      : name;

  return [
    ...defaultValidators,
    {
      name: "cspell",
      applicable: () => true,
      async run(skillDir, context) {
        const files = await findSkillFilesForTool(skillDir, "");
        if (files.length === 0) {
          return {
            success: true,
            skipped: true,
            skipReason: "No files to check",
          };
        }
        const repoRoot = await realpath(context.repoRoot);
        const relativeFiles = await Promise.all(
          files.map(async (f) => relative(repoRoot, await realpath(f))),
        );
        return runExternalCommand(
          resolveBinary("cspell"),
          [
            "lint",
            "--gitignore",
            "--no-progress",
            "--no-summary",
            ...relativeFiles,
          ],
          repoRoot,
        );
      },
    },
    {
      name: "markdownlint",
      applicable: async (skillDir) => hasMarkdownFiles(skillDir),
      async run(skillDir, context) {
        const files = await findSkillFilesForTool(skillDir, ".md");
        if (files.length === 0) {
          return {
            success: true,
            skipped: true,
            skipReason: "No markdown files",
          };
        }
        const repoRoot = await realpath(context.repoRoot);
        const relativeFiles = await Promise.all(
          files.map(async (f) => relative(repoRoot, await realpath(f))),
        );
        return runExternalCommand(
          resolveBinary("markdownlint-cli2"),
          relativeFiles,
          repoRoot,
        );
      },
    },
    {
      name: "promptlint",
      applicable: async (skillDir) => pathExists(join(skillDir, "SKILL.md")),
      async run(skillDir, context) {
        return runExternalCommand(
          resolveBinary("promptlint"),
          [join(skillDir, "SKILL.md")],
          context.repoRoot,
        );
      },
    },
    {
      name: "promptfoo",
      applicable: async (skillDir) =>
        pathExists(join(skillDir, "evals", "promptfooconfig.yaml")),
      async run(skillDir, context) {
        const binary = resolveBinary("promptfoo");
        if (!pathExistsSync(binary) && !(await commandExists("promptfoo"))) {
          return {
            success: true,
            skipped: true,
            skipReason: "promptfoo is not installed",
          };
        }
        const envFile = join(context.repoRoot, ".env");
        const bashCommand = [
          `set -a`,
          `[ -f "${envFile}" ] && source "${envFile}" || true`,
          `set +a`,
          `exec "${binary}" eval -c promptfooconfig.yaml`,
        ].join(" && ");
        return runExternalCommand(
          "bash",
          ["-c", bashCommand],
          join(skillDir, "evals"),
        );
      },
    },
  ];
}
