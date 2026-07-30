import { describe, it } from "bun:test";

describe("check-skill script", () => {
  describe("single-skill invocation", () => {
    it.skip("accepts a single skill directory path as its argument", () => {});
    it.skip("rejects a path that is not a skill directory (no SKILL.md)", () => {});
    it.skip("rejects a missing path", () => {});
    it.skip("resolves a relative path against the current working directory", () => {});
  });

  describe("repo-wide invocation", () => {
    it.skip("runs against every skill when invoked with no path argument", () => {});
    it.skip("discovers skills via the find-skills primitive rather than its own scan", () => {});
    it.skip("runs each discovered skill's checks independently, so one skill's failure does not stop the others", () => {});
    it.skip("reports a per-skill summary line for every discovered skill", () => {});
  });

  describe("tool composition: scoping each tool to the target skill", () => {
    it.skip("runs cspell scoped to the skill's own files only, not the whole repo", () => {});
    it.skip("runs markdownlint-cli2 scoped to the skill's own markdown files only", () => {});
    it.skip("runs promptlint scoped to the skill's SKILL.md and references", () => {});
    it.skip("runs validate-skill against the skill directory", () => {});
    it.skip("runs the OKF frontmatter validator against the skill's references/ directory", () => {});
    it.skip("runs the CITATION.cff validator against the skill's CITATION.cff", () => {});
    it.skip("runs promptfoo eval against the skill's evals/promptfooconfig.yaml", () => {});
    it.skip("does not invoke biome, typecheck, or other repo-wide-only tools", () => {});
  });

  describe("missing optional artifacts", () => {
    it.skip("skips the CITATION.cff check with a note, not a failure, when the skill has no CITATION.cff", () => {});
    it.skip("skips the OKF frontmatter check with a note, not a failure, when the skill has no references/ directory", () => {});
    it.skip("skips the promptfoo check with a note, not a failure, when the skill has no evals/ directory", () => {});
    it.skip("still runs validate-skill, cspell, markdownlint, and promptlint even when all optional artifacts are absent", () => {});
  });

  describe("aggregation and exit behavior", () => {
    it.skip("runs all applicable tools for a skill even after an earlier tool fails, rather than stopping at the first failure", () => {});
    it.skip("exits unsuccessfully when any applicable tool reports a failure for any checked skill", () => {});
    it.skip("exits successfully when every applicable tool passes for every checked skill", () => {});
    it.skip("prints which specific tool failed and for which skill, not just an aggregate pass/fail", () => {});
  });

  describe("relationship to lefthook and existing package.json scripts", () => {
    it.skip("does not duplicate lefthook's pre-push group; pre-push composes check-skill --all instead of re-listing tools", () => {});
    it.skip("produces the same pass/fail verdict per tool whether run standalone or invoked from lefthook", () => {});
  });

  describe("invocation via changed file paths (lefthook pre-commit integration)", () => {
    it.skip("accepts a list of file paths instead of a single skill directory or --all", () => {});
    it.skip("treats each given file path as relative to the repository root, matching lefthook's glob behavior", () => {});
    it.skip("resolves each file path to its containing skill directory", () => {});
    it.skip("ignores a given file path that does not fall under any skill directory", () => {});
    it.skip("groups multiple file paths under the same skill into a single check run for that skill", () => {});
    it.skip("runs checks for every distinct skill touched by the given file paths, not just the first one found", () => {});
    it.skip("exits successfully with no work performed when given an empty list of file paths", () => {});
    it.skip("lets a single root lefthook command pass {staged_files} to this mode, so no per-skill lefthook.yml fragment is needed", () => {});
  });
});
