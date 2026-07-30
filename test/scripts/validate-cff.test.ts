import { describe, it } from "bun:test";

// https://github.com/continuous-foundation/cffjs

describe("validate-cff script", () => {
  describe("file and YAML validity", () => {
    it.skip("reports a missing CITATION.cff", () => {});
    it.skip("rejects invalid YAML", () => {});
    it.skip("rejects non-mapping content (a list or scalar)", () => {});
  });

  describe("required fields", () => {
    it.skip("accepts a minimal valid CITATION.cff", () => {});
    it.skip("reports each missing required field: authors, cff-version, message, title", () => {});
    it.skip("rejects a cff-version other than 1.2.0", () => {});
  });

  describe("authors", () => {
    it.skip("accepts a person author (family-names and given-names)", () => {});
    it.skip("accepts an entity author (name)", () => {});
    it.skip("rejects an empty authors array", () => {});
    it.skip("rejects an author missing both person and entity fields", () => {});
  });

  describe("optional fields", () => {
    it.skip("accepts a valid license", () => {});
    it.skip("accepts a version string", () => {});
  });

  describe("validation output", () => {
    it.skip("succeeds silently when CITATION.cff is valid", () => {});
    it.skip("reports all discovered validation failures", () => {});
    it.skip("exits unsuccessfully when CITATION.cff is invalid", () => {});
  });
});
