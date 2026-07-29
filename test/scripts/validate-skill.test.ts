import { describe, it } from "vitest";

import { defineSkippedFrontmatterContract } from "./shared/frontmatter-contract";

describe("validate-skill script", () => {
  describe("valid SKILL.md", () => {
    it.skip("reports a missing SKILL.md", () => {});
    it.skip("prefers uppercase SKILL.md over lowercase skill.md", () => {});
    it.skip("accepts lowercase skill.md when uppercase is missing", () => {});
  });

  describe("valid SKILL.md frontmatter", () => {
    describe("valid frontmatter", () => {
      defineSkippedFrontmatterContract();
    });

    describe("valid SKILL.md fields: name", () => {
      it.skip("accepts i18n lowercase names", () => {});
      it.skip("accepts NFKC-normalized matching names", () => {});
      it.skip("rejects uppercase in names", () => {});
      it.skip("rejects i18n uppercase names", () => {});
      it.skip("rejects names that are too long", () => {});
      it.skip("rejects names with leading hyphens", () => {});
      it.skip("rejects names with consecutive hyphens", () => {});
      it.skip("rejects names with invalid characters", () => {});
      it.skip("rejects directory name mismatch", () => {});
    });

    describe("valid SKILL.md fields: description", () => {
      it.skip("rejects descriptions that are too long", () => {});
    });

    describe("valid SKILL.md fields: other", () => {
      it.skip("accepts allowed-tools", () => {});
      it.skip("accepts compatibility", () => {});
      it.skip("rejects compatibility that is too long", () => {});
      it.skip("rejects unexpected fields", () => {});
      it.skip("reads valid skill properties including metadata and allowed-tools", () => {});
    });
  });
});
