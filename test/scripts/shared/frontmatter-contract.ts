import { it } from "bun:test";

export function defineSkippedFrontmatterContract() {
  it.skip("parses YAML frontmatter block delimited by ---", () => {});
  it.skip("rejects concept document with missing frontmatter", () => {});
  it.skip("rejects frontmatter with unclosing --- delimiter", () => {});
  it.skip("rejects frontmatter that is not parseable YAML", () => {});
  it.skip("rejects frontmatter whose parsed value is not YAML mapping", () => {});
  it.skip("rejects frontmatter mapping without required type field", () => {});
  it.skip("rejects frontmatter mapping with empty type field", () => {});
  it.skip("accepts frontmatter mapping with any non-empty type value", () => {});
  it.skip("accepts unknown frontmatter keys without rejecting them", () => {});
}
