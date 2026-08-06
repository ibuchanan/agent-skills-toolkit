/**
 * validate-okf: Validate an Open Knowledge Format (OKF) bundle.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { parse as parseYaml } from "yaml";

export interface OkfValidationResult {
  valid: boolean;
  violations: Array<{ file: string; field: string; reason: string }>;
}

export async function validateOkf(
  bundleDir: string,
): Promise<OkfValidationResult> {
  const violations: Array<{ file: string; field: string; reason: string }> = [];

  const dirStat = await stat(bundleDir);
  if (!dirStat.isDirectory()) {
    return {
      valid: false,
      violations: [
        { file: bundleDir, field: "bundle", reason: "Not a directory" },
      ],
    };
  }

  const files = await findMarkdownFiles(bundleDir);

  for (const file of files) {
    const relativePath = relative(bundleDir, file);
    const basename = file.split("/").pop() ?? "";
    const isReserved = basename === "index.md" || basename === "log.md";
    const content = await readFile(file, "utf8");
    const parseResult = parseFrontmatter(content);

    if (isReserved) {
      // Reserved files do not require frontmatter or a type field.
      // A root index.md may optionally carry okf_version frontmatter.
      if (parseResult.frontmatter !== null) {
        let parsed: unknown;
        try {
          parsed = parseYaml(parseResult.frontmatter);
        } catch (e) {
          violations.push({
            file: relativePath,
            field: "frontmatter",
            reason: `Invalid YAML: ${e instanceof Error ? e.message : String(e)}`,
          });
          continue;
        }

        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const fm = parsed as Record<string, unknown>;
          if (fm["type"] !== undefined) {
            violations.push({
              file: relativePath,
              field: "filename",
              reason: `Reserved filename ${basename} must not be used for a concept document`,
            });
          }
        }
      }
      continue;
    }

    if (parseResult.frontmatter === null) {
      violations.push({
        file: relativePath,
        field: "frontmatter",
        reason: "Missing frontmatter",
      });
      continue;
    }

    let parsed: unknown;
    try {
      parsed = parseYaml(parseResult.frontmatter);
    } catch (e) {
      violations.push({
        file: relativePath,
        field: "frontmatter",
        reason: `Invalid YAML: ${e instanceof Error ? e.message : String(e)}`,
      });
      continue;
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      violations.push({
        file: relativePath,
        field: "frontmatter",
        reason: "Frontmatter must be a YAML mapping",
      });
      continue;
    }

    const fm = parsed as Record<string, unknown>;
    const typeValue = fm["type"];
    if (typeValue === undefined || typeValue === null || typeValue === "") {
      violations.push({
        file: relativePath,
        field: "type",
        reason: "Missing or empty required type field",
      });
    }

    const generated = fm["generated"];
    if (generated !== undefined) {
      if (
        !generated ||
        typeof generated !== "object" ||
        Array.isArray(generated) ||
        (generated as Record<string, unknown>)["by"] === undefined ||
        (generated as Record<string, unknown>)["by"] === ""
      ) {
        violations.push({
          file: relativePath,
          field: "generated.by",
          reason: "generated.by is required when generated is present",
        });
      }
    }
  }

  return { valid: violations.length === 0, violations };
}

async function findMarkdownFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await findMarkdownFiles(fullPath);
      files.push(...nested);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseFrontmatter(content: string): {
  frontmatter: string | null;
  body: string;
} {
  if (!content.startsWith("---\n")) {
    return { frontmatter: null, body: content };
  }

  const remaining = content.slice(4);
  const endIndex = remaining.indexOf("\n---\n");

  if (endIndex === -1) {
    return { frontmatter: null, body: content };
  }

  const frontmatter = remaining.slice(0, endIndex);
  const body = remaining.slice(endIndex + 5);

  return { frontmatter, body };
}
