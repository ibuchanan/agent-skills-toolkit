/**
 * Simple YAML parser for frontmatter.
 * Handles basic YAML structures without external dependencies.
 */

/**
 * Parses a YAML string into a JavaScript object.
 * Supports: mappings (objects), sequences (arrays), strings, numbers, booleans, null
 *
 * @param yaml YAML source code
 * @returns Parsed JavaScript value
 * @throws Error if YAML is invalid
 */
export function parseYaml(yaml: string): unknown {
  const lines = yaml.split("\n").map((line) => line.trimEnd());
  const parser = new YamlParser(lines);
  return parser.parseValue(0, 0).value;
}

interface ParseResult {
  value: unknown;
  nextLineIdx: number;
}

class YamlParser {
  private lines: string[];

  constructor(lines: string[]) {
    this.lines = lines;
  }

  private getIndent(line: string): number {
    let i = 0;
    while (i < line.length && line[i] === " ") i++;
    return i;
  }

  private skipEmpty(lineIdx: number): number {
    while (
      lineIdx < this.lines.length &&
      (this.lines[lineIdx]?.trim() ?? "") === ""
    ) {
      lineIdx++;
    }
    return lineIdx;
  }

  parseValue(lineIdx: number, baseIndent: number): ParseResult {
    lineIdx = this.skipEmpty(lineIdx);

    if (lineIdx >= this.lines.length) {
      return { value: null, nextLineIdx: lineIdx };
    }

    const line = this.lines[lineIdx];
    if (!line) {
      return { value: null, nextLineIdx: lineIdx + 1 };
    }

    const indent = this.getIndent(line);
    const content = line.trim();

    // Mapping (object)
    if (content.includes(":")) {
      return this.parseMapping(lineIdx, baseIndent);
    }

    // Sequence (array)
    if (content.startsWith("-")) {
      return this.parseSequence(lineIdx, baseIndent);
    }

    // Scalar (string, number, boolean, null)
    return { value: this.parseScalar(content), nextLineIdx: lineIdx + 1 };
  }

  private parseMapping(lineIdx: number, baseIndent: number): ParseResult {
    const result: Record<string, unknown> = {};
    const firstLine = this.lines[lineIdx];
    if (!firstLine) {
      return { value: result, nextLineIdx: lineIdx };
    }
    const firstIndent = this.getIndent(firstLine);

    while (lineIdx < this.lines.length) {
      const line = this.lines[lineIdx];
      if (!line) {
        lineIdx++;
        continue;
      }

      const indent = this.getIndent(line);
      const content = line.trim();

      if (content === "") {
        lineIdx++;
        continue;
      }

      // Stop if we've dedented below the mapping level
      if (indent < firstIndent && baseIndent < firstIndent) {
        break;
      }

      // Parse key: value
      const colonIdx = content.indexOf(":");
      if (colonIdx === -1) {
        throw new Error(`Invalid YAML mapping at line ${lineIdx + 1}: ${line}`);
      }

      const key = content.slice(0, colonIdx).trim();
      const valueStr = content.slice(colonIdx + 1).trim();

      if (valueStr === "") {
        // Multi-line value (nested object or array)
        const nestedResult = this.parseValue(lineIdx + 1, indent + 2);
        result[key] = nestedResult.value;
        lineIdx = nestedResult.nextLineIdx;
      } else {
        // Inline value
        result[key] = this.parseScalar(valueStr);
        lineIdx++;
      }
    }

    return { value: result, nextLineIdx: lineIdx };
  }

  private parseSequence(lineIdx: number, baseIndent: number): ParseResult {
    const result: unknown[] = [];
    const firstLine = this.lines[lineIdx];
    if (!firstLine) {
      return { value: result, nextLineIdx: lineIdx };
    }
    const firstIndent = this.getIndent(firstLine);

    while (lineIdx < this.lines.length) {
      const line = this.lines[lineIdx];
      if (!line) {
        lineIdx++;
        continue;
      }

      const indent = this.getIndent(line);
      const content = line.trim();

      if (content === "") {
        lineIdx++;
        continue;
      }

      // Stop if we've dedented below the sequence level
      if (indent < firstIndent && baseIndent < firstIndent) {
        break;
      }

      if (!content.startsWith("-")) {
        // Not an array item
        break;
      }

      const itemStr = content.slice(1).trim();

      if (itemStr === "") {
        // Multi-line item (nested structure)
        const nestedResult = this.parseValue(lineIdx + 1, indent + 2);
        result.push(nestedResult.value);
        lineIdx = nestedResult.nextLineIdx;
      } else {
        // Inline item
        result.push(this.parseScalar(itemStr));
        lineIdx++;
      }
    }

    return { value: result, nextLineIdx: lineIdx };
  }

  private parseScalar(value: string): unknown {
    // Null
    if (value === "null" || value === "~") {
      return null;
    }

    // Boolean
    if (value === "true" || value === "yes") {
      return true;
    }
    if (value === "false" || value === "no") {
      return false;
    }

    // Number
    if (/^-?\d+$/.test(value)) {
      return parseInt(value, 10);
    }
    if (/^-?\d*\.\d+$/.test(value)) {
      return parseFloat(value);
    }

    // String (unquoted, single, or double quoted)
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value.slice(1, -1);
    }

    return value;
  }
}
