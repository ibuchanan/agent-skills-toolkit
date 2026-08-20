import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";

export interface CffValidationResult {
  valid: boolean;
  violations: Array<{ field: string; reason: string }>;
}

export async function validateCff(dir: string): Promise<CffValidationResult> {
  const filePath = join(dir, "CITATION.cff");
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch {
    return {
      valid: false,
      violations: [{ field: "CITATION.cff", reason: "CITATION.cff not found" }],
    };
  }

  let parsed: unknown;
  try {
    parsed = parseYaml(content);
  } catch (e) {
    return {
      valid: false,
      violations: [
        {
          field: "yaml",
          reason: `Invalid YAML: ${e instanceof Error ? e.message : String(e)}`,
        },
      ],
    };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      valid: false,
      violations: [
        { field: "root", reason: "CITATION.cff must be a YAML mapping" },
      ],
    };
  }

  const cff = parsed as Record<string, unknown>;
  const violations: Array<{ field: string; reason: string }> = [];
  const requiredFields = ["cff-version", "message", "title", "authors"];

  for (const field of requiredFields) {
    if (cff[field] === undefined || cff[field] === null || cff[field] === "") {
      violations.push({ field, reason: "Missing required field" });
    }
  }

  if (cff["cff-version"] !== undefined && cff["cff-version"] !== "1.2.0") {
    violations.push({
      field: "cff-version",
      reason: "cff-version must be 1.2.0",
    });
  }

  validateAuthors(cff["authors"], violations);

  return { valid: violations.length === 0, violations };
}

function validateAuthors(
  authors: unknown,
  violations: Array<{ field: string; reason: string }>,
): void {
  if (authors === undefined || authors === null) {
    return;
  }

  if (!Array.isArray(authors)) {
    violations.push({
      field: "authors",
      reason: "authors must be an array",
    });
    return;
  }

  if (authors.length === 0) {
    violations.push({
      field: "authors",
      reason: "authors must not be empty",
    });
    return;
  }

  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];
    if (!author || typeof author !== "object" || Array.isArray(author)) {
      violations.push({
        field: `authors[${i}]`,
        reason: "Author must be a mapping",
      });
      continue;
    }

    const a = author as Record<string, unknown>;
    const hasName = a["name"] !== undefined && a["name"] !== "";
    const hasFamilyNames =
      a["family-names"] !== undefined && a["family-names"] !== "";
    const hasGivenNames =
      a["given-names"] !== undefined && a["given-names"] !== "";

    if (hasName) {
      continue;
    }

    if (hasFamilyNames && hasGivenNames) {
      continue;
    }

    violations.push({
      field: `authors[${i}]`,
      reason:
        "Author must have either a 'name' or both 'family-names' and 'given-names'",
    });
  }
}
