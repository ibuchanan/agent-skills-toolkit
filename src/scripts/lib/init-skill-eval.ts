/**
 * init-skill-eval: Initialize evaluation suite for a skill
 *
 * Creates a Promptfoo evaluation suite under skills/<skill-name>/evals/default/
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
 * - evals/default/ does not already exist
 *
 * Creates:
 * - evals/default/ directory
 * - evals/default/prompts/ directory
 * - evals/default/tests/ directory
 * - evals/default/promptfooconfig.yaml
 * - evals/default/prompts/main.txt
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

  // Check if evaluation suite already exists
  const evalDefaultDir = join(skillDir, "evals", "default");
  try {
    await stat(evalDefaultDir);
    // If we reach here, directory exists
    throw new Error(`Evaluation suite already exists: ${evalDefaultDir}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      throw error;
    }
    // ENOENT is expected (directory doesn't exist yet)
  }

  // Create directory structure
  await mkdir(join(evalDefaultDir, "prompts"), { recursive: true });
  await mkdir(join(evalDefaultDir, "tests"), { recursive: true });

  // Create promptfooconfig.yaml
  const config = generatePromptfooConfig();
  await writeFile(join(evalDefaultDir, "promptfooconfig.yaml"), config, "utf8");

  // Create minimal prompt template
  const promptTemplate = generatePromptTemplate();
  await writeFile(
    join(evalDefaultDir, "prompts", "main.txt"),
    promptTemplate,
    "utf8",
  );
}

/**
 * Generates minimal Promptfoo configuration.
 * Does not specify a provider or evaluation logic.
 */
function generatePromptfooConfig(): string {
  return `$schema: https://promptfoo.dev/config-schema.json

prompts:
  - file:///prompts/*.txt

tests:
  - file:///tests/*.yaml
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
