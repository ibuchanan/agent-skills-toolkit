import { describe } from "vitest";

import { defineSkippedFrontmatterContract } from "./shared/frontmatter-contract";

describe("validate-okf script", () => {
  describe("valid OKF frontmatter", () => {
    describe("valid frontmatter", () => {
      defineSkippedFrontmatterContract();
    });
  });
});
