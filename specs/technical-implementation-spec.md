# Technical Implementation Spec: Agent Skills Toolkit Scripts

Unified specification for all toolkit scripts.
Organized by concern to enable consistent implementation across current and future scripts.

## 1. Overview

### Runtime & Environment

- **Runtime**: Bun (from `package.json` engines field)
- **Language**: TypeScript, executed directly by Bun (no separate compile step for development)
- **Execution Model**: Standalone Bun scripts, no shell scripts
- **Shell Integration**: Use the built-in [Bun Shell](https://bun.sh/docs/runtime/shell) (`Bun.$`) for subprocess composition when needed — a cross-platform, bash-like template-tag API with no external dependency, no separate `zx` install, and safe quoting/escaping by default
- **Distribution**: Each CLI entry point is compiled with `Bun.build({ compile: true })` into a standalone, dependency-free native executable (see `src/scripts/build.ts`) — end users run the binary directly without installing Bun, Node, or any package manager

### Design Principle: One Script, One Job

Each script has a single, clear responsibility. Minimize decision-making required from the invoker:

- **Positional Awareness**: Scripts discover context from the environment (repository root, skill directories, etc.) rather than requiring flags
- **No Configuration Flags**: Scripts accept only essential positional arguments; no `--config`, `--format`, `--output-dir` options
- **Fail-Safe Defaults**: If a script can infer intent from position/context, it should; require explicit arguments only when truly unavoidable

Scripts with unavoidable parameters:

- `init-skill <skill-name>` — required positional argument (cannot infer skill name)
- `validate-skill [path]` — optional path (can default to `./SKILL.md`, but allow override for testing)

Scripts with no parameters:

- `find-skills` — discover from repo root
- `install-skills` — discover from `skills/` directory
- `validate-okf` — validate from current directory
- `validate-references` — validate from current directory

## 2. Standard Libraries & Dependencies

### Core Libraries (Always Use First)

- `fs/promises` — File I/O (prefer over `fs` callbacks or `fs.readFileSync`)
- `path` — Path manipulation (safe cross-platform paths)
- `url` — URL parsing (if needed for validation)
- `crypto` — Hashing (only if checksums/comparison needed; avoid if possible)

**Rule**: If Node.js standard library solves the problem, use it.

### Allowed Third-Party Dependencies

- **`yaml`** (^2.4.0) — YAML frontmatter parsing and generation
  - Provides: structured error objects with line numbers
  - Why not `js-yaml`: Better Unicode/i18n support (normalization form KC)
  - Why not `yq` subprocess: Sub-1ms parsing, no shell escaping complexity, no subprocess mocking in tests

- **Bun Shell** (`Bun.$`, built into the Bun runtime — no dependency to add)
  - Use for: Running `git rev-parse` commands (get repository root), complex shell one-liners
  - Rationale: Readable subprocess API with template-tag quoting/escaping, cross-platform (works the same on Linux/macOS/Windows), zero install and zero transitive dependencies since it ships with Bun

### Dependency Constraints

- **Version Policy**: Caret ranges (`^X.Y.Z`) allow minor and patch updates automatically
- **No Runtime Dependencies**: All external packages in `devDependencies` only
- **Leaf Packages Only**: Avoid packages with deep transitive dependency trees
  - `yaml`: Zero transitive dependencies ✓

## 3. Input Rules & Validation

### Script Invocation Patterns

#### Discovery Scripts (No Arguments)

```bash
find-skills        # Discover all SKILL.md recursively from repo root
install-skills     # Discover skills in skills/ and link to $HOME/.agents/skills
validate-okf       # Validate OKF frontmatter in current directory
validate-references # Validate reference documents in current directory
```

**Behavior**: Scripts locate repository root via upward `.git/` search. Work from there, regardless of invocation directory.

#### Initialization Script (Required Positional Argument)

```bash
init-skill <skill-name>    # Create new skill with given name
```

**Argument Validation**:

- `<skill-name>`: Required, string matching skill naming rules (see below)
- No flags, no options, no `--help` (use error messages + exit 2 for clarification)

#### Validation Scripts (Optional Path Argument)

```bash
validate-skill                  # Validate ./SKILL.md (or ./skill.md)
validate-skill /path/to/SKILL.md # Validate specific file
```

**Behavior**: If path omitted, default to current directory. If provided, use as-is (absolute or relative).

### Argument & Parameter Validation Rules

#### Skill Names (for `init-skill`)

Validate in this order, stop at first failure:

1. **Normalize**: Apply Unicode normalization (NFC/NFKC forms)
2. **Length**: Check ≤ 128 characters
3. **Leading Character**: Must not start with hyphen
4. **Consecutive Hyphens**: Must not contain `--`
5. **Character Set**: Only `a-z`, `0-9`, `-` allowed
   - Regex: `^[a-z0-9]([a-z0-9-]*[a-z0-9])?$` (handles single-char names)
6. **Uppercase Check**: Must be lowercase _after_ normalization (catches i18n uppercase variants like ß)
7. **Directory Match**: Name must exactly match the containing directory name

**Example validations**:

- `my-skill` ✓
- `s` ✓ (single character allowed)
- `MySkill` ✗ (uppercase)
- `my_skill` ✗ (underscore not allowed)
- `my--skill` ✗ (consecutive hyphens)
- `-my-skill` ✗ (leading hyphen)
- `my-skill-with-a-very-long-name-that-exceeds-maximum-allowed-length` ✗ (too long)

#### File Paths

- **Must Exist**: Before processing, verify all required input files/directories exist
- **Case Sensitivity** (for SKILL.md):
  - Prefer uppercase `SKILL.md`
  - Accept lowercase `skill.md` only if uppercase not present
  - Error if neither exists

#### Repository Boundaries

- **Discover Root**: Traverse upward from invocation directory until `.git/` directory found
- **Error if Not Found**: Exit 2 with message:

  ```text
  Error: Repository root not found. Ensure you are inside a git repository.
  ```

- **Cache Result**: Cache the discovered root for the script's lifetime (don't re-discover)

#### Symlink Safety (for `install-skills`)

When creating symlinks to `$HOME/.agents/skills/<name>`:

1. Resolve the full symlink chain using the `fs.promises.realpath()` method
2. Verify resolved path does NOT start with repository root path
3. If unsafe, exit 1 and report to stderr:

   ```text
   Error: Agent skills destination would resolve inside the repository.
          Destination: $HOME/.agents/skills
          Resolves to: <full path>
          Repository root: <repo root>

          To fix: Move $HOME/.agents/skills outside the repository.
   ```

## 4. Error Handling & Edge Cases

### Exit Codes

- **`0`** — Success
  - Validation: All items passed
  - Discovery: All items found (or zero items found, with summary)
  - Operation: All items processed successfully

- **`1`** — General Failure
  - Validation: Any item failed
  - Operation: Any item failed (but others may have succeeded; see "Continue on Error" below)
  - Unexpected runtime error (unhandled exception)

- **`2`** — Usage Error
  - Invalid arguments or positional parameters
  - Missing required input files
  - Invalid skill name format

### Failure Strategy: Continue on Error, Collect All Failures

Scripts **do not fail fast**. Instead:

1. Process all items to completion
2. Collect all errors/failures
3. Report all failures (in order encountered)
4. Exit with code 1 only after processing all items

**Rationale**: Agents and humans benefit from knowing _all_ problems at once, not stopping at the first one.

**Example** (`install-skills` with 3 skills):

```text
linked: skill-1 -> /path/to/skill-1
Error: skill-2 — destination would resolve inside repository
linked: skill-3 -> /path/to/skill-3

[Exit 1]
```

**Exception**: Validation scripts may report errors as they're discovered, but must still process all items before exiting.

### Error Classes Hierarchy

Define in `scripts/lib/errors.ts`:

```typescript
class ToolkitError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class FrontmatterError extends ToolkitError {
  constructor(
    message: string,
    public line?: number,
  ) {
    super(message);
  }
}

class ValidationError extends ToolkitError {
  violations: Array<{ field: string; reason: string }> = [];

  addViolation(field: string, reason: string) {
    this.violations.push({ field, reason });
  }
}

class FileSystemError extends ToolkitError {
  constructor(
    message: string,
    public path: string,
    public code: string,
  ) {
    super(message);
  }
}

class RepositoryError extends ToolkitError {
  // Repository not found, unsafe destination, etc.
}
```

### Logging & Output Streams

- **stdout**: Operational output only
  - Discovery results (paths, created items, etc.)
  - Success summaries
  - **Never mix progress logs or errors into stdout**

- **stderr**: Errors, warnings, remediation guidance
  - `Error: <message>` for failures
  - `Warning: <message>` for skippable issues
  - Multi-line context for complex errors

**Rule**: If stdout is piped, agents downstream must see only structured results, no status/log noise.

### Error Message Format

Include context to help debugging:

```text
Error: Skill name "MySkill" contains uppercase letters.
       Skill names must be lowercase after i18n normalization.
```

For file operations:

```text
Error: Failed to create directory /path/to/skills/my-skill
       Reason: Permission denied (error code)
```

For validation failures (collect all):

```text
Error: SKILL.md validation failed
  - Field 'name': contains uppercase letters
  - Field 'name': does not match directory name 'my-skill'
  - Field 'description': exceeds 256 character limit
```

## 5. Output Formatting & Side Effects

### Discovery Output (find-skills, install-skills)

**Format**: One result per line, plain text

**Path Formatting**:

- Relative to repository root
- No leading `./`
- Unix-style `/` separators (Bun Shell handles cross-platform)
- Lexicographically sorted (use `.localeCompare()` with `{ numeric: true }`)

**Example** (`find-skills`):

```text
skills/auth-flow/SKILL.md
skills/database-query/SKILL.md
skills/error-handling/SKILL.md
vendor/agentskills/skills-ref/SKILL.md
```

**Empty Results**: Emit summary to stderr

```text
No SKILL.md files found in repository.
```

### Operation Output (init-skill, install-skills)

**Format**: Itemized report, one item per line

**Example** (`init-skill`):

```text
Created directory: skills/my-skill
Created file: skills/my-skill/SKILL.md
Created directory: skills/my-skill/scripts
Created directory: skills/my-skill/assets
Created directory: skills/my-skill/references
Created directory: skills/my-skill/evals
```

**Example** (`install-skills`):

```text
linked: auth-flow -> /home/user/agent-skills-toolkit/skills/auth-flow
linked: database-query -> /home/user/agent-skills-toolkit/skills/database-query
linked: error-handling -> /home/user/agent-skills-toolkit/skills/error-handling
```

### Validation Output (validate-skill, validate-okf, validate-references)

**Success**: Silent (exit 0, no output)

**Failure**: Report all violations to stderr, then exit 1

**Format**:

```text
Error: SKILL.md validation failed
  - Field 'name': contains uppercase letters
  - Field 'description': exceeds 256 character limit

Error: Reference document "skills/auth-flow/references/oauth2.md" invalid
  - Missing source provenance (no 'sources' field)
```

### Side Effects

#### File Creation (init-skill)

- Create skill directory: `skills/<skill-name>/`
- Write `skills/<skill-name>/SKILL.md` with YAML frontmatter + Markdown template
- Create subdirectories:
  - `skills/<skill-name>/scripts/`
  - `skills/<skill-name>/assets/`
  - `skills/<skill-name>/references/`
  - `skills/<skill-name>/evals/`

**Atomicity**: If any step fails, leave the skill directory in its pre-initialization state (or remove it entirely).

#### Symlink Creation (install-skills)

- Create/update symlinks in `$HOME/.agents/skills/<skill-name>` → `<repo>/skills/<skill-name>`
- Replace existing regular files or directories with symlinks if they represent old skill links
- Do **not** remove symlinks for skills that are no longer discovered (idempotent: can re-run safely)

#### File Modifications (validate-\*)

- None. These scripts are read-only and emit no side effects.

---

## 6. YAML Frontmatter Processing

### Frontmatter Format

**Delimiters**: Exactly `---` on their own lines (no trailing whitespace)

**Valid Example**:

```yaml
---
name: my-skill
description: A brief skill description
allowed-tools:
  - twg
  - confluence
---
# Markdown body follows
```

### Parsing Pipeline

```text
Raw File Content
    ↓
Split by first and second '---' lines
    ↓
Extract YAML section (between delimiters)
    ↓
Parse with yaml.parse()
    ↓
Validate structure (must be YAML mapping, not list/scalar)
    ↓
Validate required/optional fields
    ↓
Return { meta: object, body: string } or throw FrontmatterError
```

### Edge Cases & Error Handling

| Scenario                                    | Behavior                                                        |
| ------------------------------------------- | --------------------------------------------------------------- |
| File starts with `---` but no closing `---` | Error: "Unclosed frontmatter"                                   |
| Empty frontmatter (`---\n---`)              | Error: "Frontmatter must not be empty"                          |
| Multiple `---` lines in YAML                | Use only first two as delimiters; remainder is body             |
| YAML parse error (invalid syntax)           | Error: "Invalid YAML: <parser error message>" with line number  |
| Frontmatter is a YAML list or scalar        | Error: "Frontmatter must be a YAML mapping, not <type>"         |
| Missing frontmatter entirely                | Error: "Frontmatter required but not found" (context-dependent) |

### Field-Level Validation

#### Required Fields

- **`name`** (string)
  - Validate against skill naming rules (Section 3)
  - Must match containing directory name
  - Example: `name: my-skill`

- **`description`** (string)
  - Must be non-empty
  - Must not exceed 256 characters
  - Example: `description: Brief one-line skill summary`

#### Optional Fields

- **`allowed-tools`** (list of strings)
  - List of tool identifiers (e.g., `["twg", "confluence"]`)
  - No length restrictions on individual tools
  - Example: `allowed-tools: [twg, confluence, forge-cli]`

- **`compatibility`** (string)
  - Compatibility notes or version requirements
  - Must not exceed 512 characters
  - Example: `compatibility: "Requires Node.js 20+"`

#### Unexpected Fields

Any field not in `{name, description, allowed-tools, compatibility}` must be rejected.

**Error Format**:

```text
Error: SKILL.md validation failed
  - Unexpected field 'deprecated' (remove or rename to valid field)
```

---

## 7. Module Architecture & Code Organization

### Shared Utility Modules (scripts/lib/)

Create four focused utility modules:

#### `scripts/lib/frontmatter.ts`

- `parseFrontmatter(content: string): { meta: Record<string, unknown>, body: string }`
- `validateFrontmatterStructure(raw: unknown): void` (throws FrontmatterError if not a mapping)
- `extractFrontmatterFromFile(filePath: string): Promise<{ meta, body }>`
- `writeFrontmatterToFile(filePath: string, meta: object, body: string): Promise<void>`

#### `scripts/lib/paths.ts`

- `findRepositoryRoot(startPath?: string): Promise<string>`
- `normalizePath(absolute: string, repoRoot: string): string` (relative, no leading `./`)
- `resolveSkillDir(skillName: string, repoRoot: string): Promise<string>` (full path to skill directory)
- `isPathInsideRepository(testPath: string, repoRoot: string): boolean`

#### `scripts/lib/validation.ts`

- `validateSkillName(name: string): { valid: boolean; error?: string }`
- `validateSkillNameMatches(name: string, dirName: string): boolean`
- `validateDescriptionLength(desc: string): { valid: boolean; error?: string }`
- `validateFrontmatterFields(meta: object): ValidationError | null` (collect all violations)

#### `scripts/lib/io.ts`

- `readFile(path: string): Promise<string>`
- `writeFile(path: string, content: string): Promise<void>`
- `createDirectory(path: string): Promise<void>` (no error if exists)
- `resolveSymlink(target: string): Promise<string>` (follow chain, detect cycles)
- `symlinkExists(path: string): Promise<boolean>`
- `replaceWithSymlink(target: string, source: string): Promise<void>`

### Script Entry Points (scripts/)

Each script is a thin entry point:

```text
scripts/
├── find-skills.ts       # Discovery → format → output
├── init-skill.ts        # Validate name → create dirs → write templates
├── install-skills.ts    # Discover → validate → symlink → report
├── validate-skill.ts    # Load → parse → validate → report
├── validate-okf.ts      # Load → parse → validate → report
├── validate-references.ts # Index → load → validate all → report
├── lib/
│   ├── frontmatter.ts
│   ├── paths.ts
│   ├── validation.ts
│   ├── io.ts
│   └── errors.ts        # Error class definitions
└── types.ts             # Shared TypeScript interfaces
```

**Pattern**: Import from `lib/`, compose pipeline in entry point, handle errors at top level.

---

## 8. Testing & Mocking Strategy

### File System Mocking

Use **dependency injection** for `fs/promises`:

```typescript
export async function readFile(
  path: string,
  fs = require("fs/promises"),
): Promise<string> {
  return fs.readFile(path, "utf8");
}
```

**In tests**: Pass mock fs object

```typescript
const mockFs = { readFile: vi.fn().mockResolvedValue("content") };
await readFile("/path", mockFs);
```

### Symlink Testing

- **Real symlinks**: Use `fs.promises.symlink()` in test setup
- **Cleanup**: `afterEach` removes test symlinks
- **No isolation issues**: Tests run in isolated temp directories (`test/root/scripts/fixtures/`)

### Repository Root Discovery Testing

- Create temporary `.git/` directories in test fixtures
- Assert that script finds correct root

### Subprocess Testing (Bun Shell)

- Mock `Bun.$` calls where used (e.g., `git rev-parse` for root directory)
- Or: create real `.git/` in fixtures and verify actual subprocess works

---

## 9. Logging & Debugging

### Production (No Debug Output)

- Scripts are silent on success (except discovery/operation results)
- Error messages only on stderr
- No `console.log()` for debugging in committed code

### Development & Testing

Optional debug output via environment variable:

```typescript
if (process.env.DEBUG === "toolkit:*") {
  console.error("[DEBUG]", message);
}
```

**Usage**: `DEBUG=toolkit:* bun test` — set at top level of your environment

---

## 10. File Organization & Structure

```text
scripts/
├── find-skills.ts
├── init-skill.ts
├── install-skills.ts
├── validate-skill.ts
├── validate-okf.ts
├── validate-references.ts
├── lib/
│   ├── errors.ts
│   ├── frontmatter.ts
│   ├── io.ts
│   ├── paths.ts
│   ├── validation.ts
│   └── index.ts          # Optional: re-export all lib modules
└── types.ts              # Shared TypeScript interfaces

test/root/scripts/
├── find-skills.test.ts
├── init-skill.test.ts
├── install-skills.test.ts
├── validate-skill.test.ts
├── validate-okf.test.ts
├── validate-references.test.ts
├── shared/
│   └── frontmatter-contract.ts  # Reusable test helper
├── fixtures/             # Temporary test data (gitignored)
│   ├── skill-valid/
│   ├── skill-invalid/
│   └── ...
└── lib/                  # Unit tests for lib modules
    ├── frontmatter.test.ts
    ├── paths.test.ts
    ├── validation.test.ts
    └── io.test.ts
```

---

## References

- **yaml npm package**: [yaml npm package documentation](https://eemeli.org/yaml/)
- **Bun Shell**: [bun.sh/docs/runtime/shell](https://bun.sh/docs/runtime/shell)
- **Bun.build (compile to executable)**: [bun.sh/docs/bundler/executables](https://bun.sh/docs/bundler/executables)
- **Node.js fs/promises**: [nodejs.org/api/fs.html#promises-api](https://nodejs.org/api/fs.html#promises-api)
- **Unicode normalization**: [unicode.org/reports/tr15/](https://unicode.org/reports/tr15/)
- **POSIX path semantics**: POSIX.1-2017
