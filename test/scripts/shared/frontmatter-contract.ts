import { it } from "vitest";

export function defineSkippedFrontmatterContract() {
  it.skip("parses valid frontmatter", () => {});
  it.skip("rejects missing frontmatter", () => {});
  it.skip("rejects unclosed frontmatter", () => {});
  it.skip("rejects invalid yaml", () => {});
  it.skip("rejects non-mapping frontmatter", () => {});
}
