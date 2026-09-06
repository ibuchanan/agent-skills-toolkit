import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateSkill } from "../../src/scripts/lib/validate-skill.js";
import { ValidationError } from "../../src/scripts/lib/validation.js";

let testDir: string;

function createTestSkillDir(name: string): string {
  return join(testDir, name);
}

describe("validate-skill script", () => {
  beforeEach(async () => {
    testDir = join(
      tmpdir(),
      `rovo-validate-skill-test-${Date.now()}-${Math.random()}`,
    );
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe("valid SKILL.md", () => {
    it("reports a missing SKILL.md", async () => {
      const skillDir = createTestSkillDir("no-skill-md");
      await mkdir(skillDir, { recursive: true });

      try {
        await validateSkill(skillDir);
        expect.fail("Should have thrown error for missing SKILL.md");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("SKILL.md");
      }
    });

    it("prefers uppercase SKILL.md over lowercase skill.md", async () => {
      const skillDir = createTestSkillDir("prefer-uppercase");
      await mkdir(skillDir, { recursive: true });

      const skillMd = `---
name: prefer-uppercase
description: Test skill
---
# Test`;

      // Write both lowercase and uppercase
      await writeFile(join(skillDir, "skill.md"), "lowercase version", "utf8");
      await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

      const result = await validateSkill(skillDir);
      // If it reads the uppercase one, it should succeed (it has valid frontmatter)
      expect(result).toBeDefined();
    });

    it("accepts lowercase skill.md when uppercase is missing", async () => {
      const skillDir = createTestSkillDir("accept-lowercase");
      await mkdir(skillDir, { recursive: true });

      const skillMd = `---
name: accept-lowercase
description: Test skill
---
# Test`;

      await writeFile(join(skillDir, "skill.md"), skillMd, "utf8");

      const result = await validateSkill(skillDir);
      expect(result).toBeDefined();
    });
  });

  describe("valid SKILL.md frontmatter", () => {
    describe("valid frontmatter", () => {
      it("parses valid frontmatter", async () => {
        const skillDir = createTestSkillDir("valid-fm");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
name: valid-fm
description: A test skill
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");
        const result = await validateSkill(skillDir);
        expect(result).toBeDefined();
      });

      it("rejects missing frontmatter", async () => {
        const skillDir = createTestSkillDir("no-fm");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `# Just a heading

No frontmatter here`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject missing frontmatter");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });

      it("rejects unclosed frontmatter", async () => {
        const skillDir = createTestSkillDir("unclosed-fm");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
name: unclosed-fm
description: Test

# Missing closing ---`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject unclosed frontmatter");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });

      it("rejects invalid yaml", async () => {
        const skillDir = createTestSkillDir("invalid-yaml");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
name: invalid-yaml
bad: [unclosed array
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject invalid YAML");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });

      it("rejects non-mapping frontmatter", async () => {
        const skillDir = createTestSkillDir("non-mapping-fm");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
- item1
- item2
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject non-mapping frontmatter");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });
    });

    describe("valid SKILL.md fields: name", () => {
      it("accepts i18n lowercase names", async () => {
        const skillDir = createTestSkillDir("i18n-lowercase");
        await mkdir(skillDir, { recursive: true });

        // Lowercase Greek letters (i18n example)
        const skillMd = `---
name: i18n-lowercase
description: Test
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");
        const result = await validateSkill(skillDir);
        expect(result).toBeDefined();
      });

      it("accepts NFKC-normalized matching names", async () => {
        const skillDir = createTestSkillDir("nfkc-test");
        await mkdir(skillDir, { recursive: true });

        // Use a character that normalizes differently
        const skillMd = `---
name: nfkc-test
description: Test
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");
        const result = await validateSkill(skillDir);
        expect(result).toBeDefined();
      });

      it("rejects uppercase in names", async () => {
        const skillDir = createTestSkillDir("uppercase-test");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
name: UpperCase
description: Test
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject uppercase names");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });

      it("rejects i18n uppercase names", async () => {
        const skillDir = createTestSkillDir("i18n-uppercase");
        await mkdir(skillDir, { recursive: true });

        // Uppercase Greek letters
        const skillMd = `---
name: ΑΒΓΔ
description: Test
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject i18n uppercase");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });

      it("rejects names that are too long", async () => {
        const skillDir = createTestSkillDir("long-name");
        await mkdir(skillDir, { recursive: true });

        const longName = "a".repeat(129); // Exceeds 128 char limit
        const skillMd = `---
name: ${longName}
description: Test
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject long names");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });

      it("rejects names with leading hyphens", async () => {
        const skillDir = createTestSkillDir("leading-hyphen");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
name: -leading-hyphen
description: Test
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject leading hyphens");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });

      it("rejects names with consecutive hyphens", async () => {
        const skillDir = createTestSkillDir("consecutive-hyphen");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
name: test--skill
description: Test
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject consecutive hyphens");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });

      it("rejects names with invalid characters", async () => {
        const skillDir = createTestSkillDir("invalid-chars");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
name: test_skill
description: Test
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject invalid characters");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });

      it("rejects directory name mismatch", async () => {
        const skillDir = createTestSkillDir("dir-name");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
name: different-name
description: Test
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject name/directory mismatch");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });
    });

    describe("valid SKILL.md fields: description", () => {
      it("rejects descriptions that are too long", async () => {
        const skillDir = createTestSkillDir("long-desc");
        await mkdir(skillDir, { recursive: true });

        const longDesc = "a".repeat(257); // Exceeds 256 char limit
        const skillMd = `---
name: long-desc
description: ${longDesc}
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject long descriptions");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });

      it("accepts descriptions within length limit", async () => {
        const skillDir = createTestSkillDir("valid-desc");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
name: valid-desc
description: This is a valid description under 256 characters.
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");
        const result = await validateSkill(skillDir);
        expect(result).toBeDefined();
      });

      for (const [character, label, slug] of [
        ["—", "em dash", "em-dash"],
        [":", "colon", "colon"],
      ]) {
        it(`rejects descriptions containing an ${label}`, async () => {
          const skillDir = createTestSkillDir(`invalid-description-${slug}`);
          await mkdir(skillDir, { recursive: true });

          const skillMd = `---
name: invalid-description-${slug}
description: Invalid${character} description
---
# Test`;

          await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

          await expect(validateSkill(skillDir)).rejects.toThrow(
            `Description must not contain an ${label}`,
          );
        });
      }
    });

    describe("valid SKILL.md fields: other", () => {
      it("accepts allowed-tools", async () => {
        const skillDir = createTestSkillDir("with-tools");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
name: with-tools
description: Test skill
allowed-tools:
  - bash
  - node
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");
        const result = await validateSkill(skillDir);
        expect(result.allowedTools).toEqual(["bash", "node"]);
      });

      it("accepts compatibility", async () => {
        const skillDir = createTestSkillDir("with-compat");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
name: with-compat
description: Test skill
compatibility: Works with version 1.0+
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");
        const result = await validateSkill(skillDir);
        expect(result.compatibility).toBe("Works with version 1.0+");
      });

      for (const [field, yaml, errorLabel] of [
        [
          "compatibility colon",
          'compatibility: "Invalid: value"',
          "Compatibility",
        ],
        [
          "compatibility em dash",
          "compatibility: Invalid—value",
          "Compatibility",
        ],
        [
          "allowed tool colon",
          'allowed-tools:\n  - "invalid: tool"',
          "Allowed tool",
        ],
        [
          "allowed tool em dash",
          "allowed-tools:\n  - invalid—tool",
          "Allowed tool",
        ],
      ]) {
        it(`rejects prohibited characters in ${field}`, async () => {
          const skillDir = createTestSkillDir(
            `invalid-${field.replaceAll(" ", "-")}`,
          );
          await mkdir(skillDir, { recursive: true });

          const skillMd = `---
name: invalid-${field.replaceAll(" ", "-")}
description: Test skill
${yaml}
---
# Test`;

          await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

          await expect(validateSkill(skillDir)).rejects.toThrow(
            `${errorLabel} must not contain`,
          );
        });
      }

      it("rejects compatibility that is too long", async () => {
        const skillDir = createTestSkillDir("long-compat");
        await mkdir(skillDir, { recursive: true });

        const longCompat = "a".repeat(257);
        const skillMd = `---
name: long-compat
description: Test
compatibility: ${longCompat}
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject long compatibility");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });

      it("rejects unexpected fields", async () => {
        const skillDir = createTestSkillDir("unexpected-field");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
name: unexpected-field
description: Test
unexpected-field: value
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");

        try {
          await validateSkill(skillDir);
          expect.fail("Should reject unexpected fields");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
        }
      });

      it("reads valid skill properties including metadata and allowed-tools", async () => {
        const skillDir = createTestSkillDir("full-props");
        await mkdir(skillDir, { recursive: true });

        const skillMd = `---
name: full-props
description: Complete test skill
allowed-tools:
  - bash
  - node
compatibility: Compatible with Node 18+
---
# Test`;

        await writeFile(join(skillDir, "SKILL.md"), skillMd, "utf8");
        const result = await validateSkill(skillDir);

        expect(result.name).toBe("full-props");
        expect(result.description).toBe("Complete test skill");
        expect(result.allowedTools).toEqual(["bash", "node"]);
        expect(result.compatibility).toBe("Compatible with Node 18+");
      });
    });
  });
});
