/**
 * Validates a skill name according to the technical spec.
 *
 * Validation order (stop at first failure):
 * 1. Normalize with NFKC Unicode normalization
 * 2. Check length (≤ 128 characters)
 * 3. Check for leading hyphen
 * 4. Check for trailing hyphen
 * 5. Check for consecutive hyphens
 * 6. Check for invalid characters (only a-z, 0-9, - allowed)
 * 7. Check for uppercase letters (after normalization)
 */
export function validateSkillName(name: string): {
  valid: boolean;
  error?: string;
} {
  // 0. Empty check (foundational)
  if (!name || name.length === 0) {
    return { valid: false, error: "Skill name must not be empty" };
  }

  // 1. Normalize with NFKC
  const normalized = name.normalize("NFKC");

  // 2. Check length (≤ 128 characters)
  if (normalized.length > 128) {
    return {
      valid: false,
      error: `Skill name exceeds 128 character limit (${normalized.length} characters)`,
    };
  }

  // 3. Check for leading hyphen
  if (normalized.startsWith("-")) {
    return {
      valid: false,
      error: "Skill name must not start with a hyphen",
    };
  }

  // 4. Check for trailing hyphen
  if (normalized.endsWith("-")) {
    return {
      valid: false,
      error: "Skill name must not end with a hyphen",
    };
  }

  // 5. Check for consecutive hyphens
  if (normalized.includes("--")) {
    return {
      valid: false,
      error: "Skill name must not contain consecutive hyphens (--)",
    };
  }

  // 6. Check for invalid characters (only a-z, 0-9, - allowed)
  // Regex: ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$
  // This allows: single char, or start/end with alnum, middle can have hyphens
  const validCharPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  if (!validCharPattern.test(normalized)) {
    // Determine which invalid character to report
    if (normalized.includes("_")) {
      return {
        valid: false,
        error:
          "Skill name contains invalid character: underscore (_). Only lowercase letters, numbers, and hyphens are allowed.",
      };
    }
    return {
      valid: false,
      error: `Skill name contains invalid character. Only lowercase letters, numbers, and hyphens are allowed.`,
    };
  }

  // 7. Check for uppercase letters (after normalization)
  if (/[A-Z]/.test(normalized)) {
    return {
      valid: false,
      error:
        "Skill name contains uppercase letters. Skill names must be lowercase.",
    };
  }

  return { valid: true };
}

/**
 * Validates that a skill name matches a directory name.
 */
export function validateSkillNameMatches(
  name: string,
  dirName: string,
): boolean {
  return name === dirName;
}

/**
 * Validates the description field length.
 */
export function validateDescriptionLength(desc: string): {
  valid: boolean;
  error?: string;
} {
  if (desc.length > 256) {
    return {
      valid: false,
      error: `Description exceeds 256 character limit (${desc.length} characters)`,
    };
  }

  return { valid: true };
}

/**
 * Validates characters that are prohibited in frontmatter values.
 */
export function validateFrontmatterValueCharacters(
  value: string,
  field: string,
): {
  valid: boolean;
  error?: string;
} {
  for (const [character, label] of [
    ["—", "em dash"],
    [":", "colon"],
  ] as const) {
    if (value.includes(character)) {
      return {
        valid: false,
        error: `${field} must not contain an ${label}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Error class for validation failures.
 */
export class ValidationError extends Error {
  violations: Array<{ field: string; reason: string }> = [];

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }

  addViolation(field: string, reason: string): this {
    this.violations.push({ field, reason });
    return this;
  }
}
