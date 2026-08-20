/**
 * init-skill-eval: Initialize evaluation suite for a skill
 *
 * Creates a Promptfoo evaluation suite under skills/<skill-name>/evals/
 * with minimal configuration and templates.
 */

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Initializes an evaluation suite for a skill.
 *
 * Validates:
 * - Skill directory exists
 * - SKILL.md exists in the directory
 * - evals/promptfooconfig.yaml does not already exist (evals/ itself may
 *   already exist as an empty directory from skill scaffolding)
 *
 * Creates:
 * - evals/ directory
 * - evals/prompts/ directory
 * - evals/tests/ directory
 * - evals/promptfooconfig.yaml
 * - evals/prompts/main.txt
 *
 * @param skillDir - Absolute path to skill directory
 * @throws Error if validation fails or creation encounters issues
 */
export async function initSkillEval(skillDir: string): Promise<void> {
  // Validate skill directory exists
  try {
    const dirStat = await stat(skillDir);
    if (!dirStat.isDirectory()) {
      throw new Error(`Skill path is not a directory: ${skillDir}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("not a directory")) {
      throw error;
    }
    throw new Error(`Skill directory not found: ${skillDir}`);
  }

  // Validate SKILL.md exists
  const skillMdPath = join(skillDir, "SKILL.md");
  try {
    await readFile(skillMdPath, "utf8");
  } catch {
    throw new Error(`SKILL.md not found in ${skillDir}`);
  }

  // Check if evaluation suite already exists. evals/ itself may already
  // exist as an empty directory created by skill scaffolding, so the real
  // signal is whether it has been initialized with a config.
  const evalDir = join(skillDir, "evals");
  const configPath = join(evalDir, "promptfooconfig.yaml");
  try {
    await stat(configPath);
    // If we reach here, the config exists
    throw new Error(`Evaluation suite already exists: ${evalDir}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      throw error;
    }
    // ENOENT is expected (config doesn't exist yet)
  }

  // Create directory structure
  await mkdir(join(evalDir, "prompts"), { recursive: true });
  await mkdir(join(evalDir, "tests"), { recursive: true });

  // Create promptfooconfig.yaml
  const config = generatePromptfooConfig();
  await writeFile(join(evalDir, "promptfooconfig.yaml"), config, "utf8");

  // Create minimal prompt template
  const promptTemplate = generatePromptTemplate();
  await writeFile(join(evalDir, "prompts", "main.txt"), promptTemplate, "utf8");
}

/**
 * Generates minimal Promptfoo configuration.
 * Does not specify a provider or evaluation logic.
 */
function generatePromptfooConfig(): string {
  return `$schema: https://promptfoo.dev/config-schema.json

prompts:
  - prompts/*.txt

tests:
  - tests/*.yaml
`;
}

/**
 * Generates a minimal prompt template.
 * Generic and skill-agnostic.
 */
function generatePromptTemplate(): string {
  return `You are a helpful assistant. Answer the user's question.

User: {{input}}
`;
}
