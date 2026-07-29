import { describe, it } from "vitest";

describe("init-skill script", () => {
  describe("input and overwrite safety", () => {
    it.skip("rejects an invalid skill name", () => {});
    it.skip("refuses to create a skill that already exists", () => {});
    it.skip("leaves existing skill contents unchanged when initialization fails", () => {});
  });

  describe("skill", () => {
    it.skip("creates the skill directory", () => {});
    it.skip("writes YAML frontmatter followed by Markdown instructions", () => {});
    it.skip("sets the frontmatter name to the created directory name", () => {});
    it.skip("writes a non-empty description", () => {});
    it.skip("creates a SKILL.md that passes Agent Skills validation", () => {});
  });

  describe("extension directories", () => {
    it.skip("creates the scripts directory", () => {});
    it.skip("creates the assets directory", () => {});
    it.skip("creates the references directory", () => {});
    it.skip("creates the evals directory", () => {});
  });
});
