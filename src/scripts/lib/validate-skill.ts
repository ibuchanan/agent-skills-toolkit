/**
 * validate-skill: Validate a skill's SKILL.md file.
 *
 * Validates:
 * - SKILL.md file exists (prefer uppercase over lowercase)
 * - Frontmatter is present, valid YAML, and is a mapping
 * - Required fields: name, description
 * - name: lowercase, no uppercase, valid characters, matches directory name
 * - description: length ≤ 256 characters
 * - Optional fields: allowed-tools (array), compatibility (string ≤ 256 chars)
 * - No unexpected fields
 *
 * Returns: Validated skill properties
 */

import { readFile, stat } from "node:fs/promises";
import { basename, join } from "node:path";
import { parseYaml } from "./yaml-parser.js";
import {
  validateSkillName,
  validateSkillNameMatches,
  validateDescriptionLength,
  ValidationError,
} from "./validation.js";

export interface SkillValidationResult {
  name: string;
  description: string;
  allowedTools?: string[];
  compatibility?: string;
}

const ALLOWED_FRONTMATTER_FIELDS = new Set([
  "name",
  "description",
  "allowed-tools",
  "compatibility",
]);

/**
 * Validates a skill directory and its SKILL.md file.
 *
 * @param skillDir - Absolute or relative path to skill directory
 * @returns Validated skill properties
 * @throws ValidationError if any validation fails
 */
export async function validateSkill(
  skillDir: string,
): Promise<SkillValidationResult> {
  // Ensure skillDir is a directory
  try {
    const dirStat = await stat(skillDir);
    if (!dirStat.isDirectory()) {
      throw new ValidationError(`Not a directory: ${skillDir}`);
    }
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new ValidationError(`Skill directory not found: ${skillDir}`);
  }

  // Find and read SKILL.md (prefer uppercase)
  let skillContent: string;
  try {
    skillContent = await readFile(join(skillDir, "SKILL.md"), "utf8");
  } catch {
    // Try lowercase fallback
    try {
      skillContent = await readFile(join(skillDir, "skill.md"), "utf8");
    } catch {
      throw new ValidationError(`SKILL.md not found in ${skillDir}`);
    }
  }

  // Parse frontmatter and body
  const { frontmatter, body } = parseFrontmatter(skillContent);

  if (!frontmatter) {
    throw new ValidationError("SKILL.md must include frontmatter");
  }

  // Parse YAML
  let parsedFm: unknown;
  try {
    parsedFm = parseYaml(frontmatter);
  } catch (error) {
    throw new ValidationError(
      `Invalid YAML in frontmatter: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  // Validate it's a mapping (object)
  if (!parsedFm || typeof parsedFm !== "object" || Array.isArray(parsedFm)) {
    throw new ValidationError(
      "Frontmatter must be a YAML mapping (object), not a list or scalar",
    );
  }

  const fm = parsedFm as Record<string, unknown>;

  // Check for unexpected fields
  for (const key of Object.keys(fm)) {
    if (!ALLOWED_FRONTMATTER_FIELDS.has(key)) {
      throw new ValidationError(`Unexpected field in frontmatter: ${key}`);
    }
  }

  // Validate required fields
  const name = fm["name"];
  const description = fm["description"];

  if (!name || typeof name !== "string") {
    throw new ValidationError("Frontmatter must include 'name' field (string)");
  }

  if (!description || typeof description !== "string") {
    throw new ValidationError(
      "Frontmatter must include 'description' field (string)",
    );
  }

  // Validate name
  const nameValidation = validateSkillName(name);
  if (!nameValidation.valid) {
    throw new ValidationError(nameValidation.error || "Invalid skill name");
  }

  // Validate name matches directory
  const dirName = basename(skillDir);
  if (!validateSkillNameMatches(name, dirName)) {
    throw new ValidationError(
      `Skill name '${name}' does not match directory name '${dirName}'`,
    );
  }

  // Validate description
  const descValidation = validateDescriptionLength(description);
  if (!descValidation.valid) {
    throw new ValidationError(descValidation.error || "Invalid description");
  }

  // Validate optional fields
  let allowedTools: string[] | undefined;
  const allowedToolsValue = fm["allowed-tools"];
  if (allowedToolsValue !== undefined) {
    if (!Array.isArray(allowedToolsValue)) {
      throw new ValidationError("'allowed-tools' must be an array");
    }
    allowedTools = allowedToolsValue.map(String);
  }

  let compatibility: string | undefined;
  const compatibilityValue = fm["compatibility"];
  if (compatibilityValue !== undefined) {
    if (typeof compatibilityValue !== "string") {
      throw new ValidationError("'compatibility' must be a string");
    }
    if (compatibilityValue.length > 256) {
      throw new ValidationError(
        `'compatibility' exceeds 256 character limit (${compatibilityValue.length} characters)`,
      );
    }
    compatibility = compatibilityValue;
  }

  return {
    name,
    description,
    ...(allowedTools && { allowedTools }),
    ...(compatibility && { compatibility }),
  };
}

/**
 * Parses frontmatter from markdown content.
 * Expects: ---\n<yaml>\n---\n<body>
 */
function parseFrontmatter(content: string): {
  frontmatter: string | null;
  body: string;
} {
  if (!content.startsWith("---\n")) {
    return { frontmatter: null, body: content };
  }

  const remaining = content.slice(4); // Remove "---\n"
  const endIndex = remaining.indexOf("\n---\n");

  if (endIndex === -1) {
    // Frontmatter not properly closed
    return { frontmatter: null, body: content };
  }

  const frontmatter = remaining.slice(0, endIndex);
  const body = remaining.slice(endIndex + 5); // Skip "\n---\n"

  return { frontmatter, body };
}
