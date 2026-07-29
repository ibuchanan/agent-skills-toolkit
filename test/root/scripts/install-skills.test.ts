import { describe, it } from "vitest";

describe("install-skills script", () => {
  describe("skill discovery", () => {
    it.skip("discovers SKILL.md files recursively under skills", () => {});
    it.skip("includes SKILL.md files under deprecated directories", () => {});
    it.skip("excludes SKILL.md files under node_modules", () => {});
    it.skip("excludes SKILL.md files under vendor", () => {});
    it.skip("uses each skill directory name as the destination link name", () => {});
    it.skip("fails when the skills directory is missing", () => {});
    it.skip("fails when the skills directory is empty", () => {});
  });

  describe("agent skills destination", () => {
    it.skip("creates $HOME/.agents/skills when it is missing", () => {});
    it.skip("does not create a Claude-specific skills destination", () => {});
    it.skip("links every discovered skill into $HOME/.agents/skills", () => {});
  });

  describe("existing destination entries", () => {
    it.skip("replaces an existing regular file with a skill symlink", () => {});
    it.skip("replaces an existing directory with a skill symlink", () => {});
    it.skip("updates an existing skill symlink to point at the discovered source", () => {});
    it.skip("succeeds when rerun with skill symlinks already pointing at their sources", () => {});
    it.skip("does not remove destination entries for skills that are no longer discovered", () => {});
  });

  describe("repository safety", () => {
    it.skip("rejects an agent skills destination symlink that resolves inside the repository", () => {});
    it.skip("rejects an agent skills destination whose ancestor symlink resolves inside the repository", () => {});
    it.skip("writes a remediation message to standard error for an unsafe destination", () => {});
    it.skip("exits unsuccessfully for an unsafe destination", () => {});
  });

  describe("output and invocation", () => {
    it.skip("reports each created skill link", () => {});
    it.skip("finds the repository from the script location when invoked elsewhere", () => {});
  });
});
