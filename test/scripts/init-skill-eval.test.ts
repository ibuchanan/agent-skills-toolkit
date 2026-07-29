import { describe, it } from "vitest";

describe("init-skill-eval script", () => {
  describe("input and overwrite safety", () => {
    it.skip("rejects a missing skill directory", () => {});
    it.skip("rejects a skill directory without SKILL.md", () => {});
    it.skip("refuses to overwrite an existing evaluation suite", () => {});
    it.skip("leaves an existing evaluation suite unchanged when initialization fails", () => {});
  });

  describe("evaluation suite", () => {
    it.skip("creates the canonical evaluation suite directory under evals", () => {});
    it.skip("writes a promptfooconfig.yaml with the Promptfoo schema directive", () => {});
    it.skip("creates a file-based prompt directory", () => {});
    it.skip("creates a file-based test directory", () => {});
    it.skip("configures Promptfoo to load prompts and tests from those directories", () => {});
  });

  describe("initial contents", () => {
    it.skip("creates a minimal prompt template without inventing skill-specific behavior", () => {});
    it.skip("does not choose a provider or create semantic evaluation cases", () => {});
  });
});
