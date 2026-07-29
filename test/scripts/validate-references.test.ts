import { describe, it } from "vitest";

describe("validate-references script", () => {
  describe("reference documents", () => {
    it.skip("accepts an OKF-wrapped reference with source provenance", () => {});
    it.skip("reports a reference document with missing OKF frontmatter", () => {});
    it.skip("reports a reference document with invalid or unclosed frontmatter", () => {});
    it.skip("reports a reference document without source provenance", () => {});
    it.skip("reports a source entry without an id, resource, or title", () => {});
  });

  describe("reference indexes and links", () => {
    it.skip("accepts a SUMMARY.md with valid local reference links", () => {});
    it.skip("reports a local reference link whose target is missing", () => {});
    it.skip("allows external source URLs without fetching them", () => {});
  });

  describe("validation output", () => {
    it.skip("reports all discovered validation failures", () => {});
    it.skip("succeeds without output when every reference is valid", () => {});
    it.skip("exits unsuccessfully when any reference is invalid", () => {});
  });
});
