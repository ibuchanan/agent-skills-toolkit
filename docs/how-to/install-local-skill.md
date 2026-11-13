# Install a local skill into another project

To make one existing skill available in another project, install it into that
project's `.agents/skills/` directory with the local `manage-skills` script.
Use a link for ongoing work on the source, or a copy for an independent snapshot.

## Prerequisites

- An existing skill under this toolkit checkout's `skills/` directory.
- Node.js and installed checkout dependencies, including `commander` and `yaml`.
- An existing target project with an agent that discovers `.agents/skills/`.
- Permission to write the target's skill directory.

Run commands from the toolkit checkout root. Replace the values below with an
existing skill name and an absolute target-project path:

```sh
skill_name='your-skill-name'
target='/absolute/path/to/target-project'
source_dir="$(pwd)/skills"
source_skill="$source_dir/$skill_name"
destination="$target/.agents/skills/$skill_name"

test -f "$source_skill/SKILL.md"
test -d "$target"
```

Stop if either check fails. Review the source skill, bundled scripts, references,
and external dependencies before making it available to the target agent.
Do not install an untrusted skill solely because a validator accepts it.

## 1. Validate the source

Run both checks:

```sh
bun run src/scripts/validate-skill.ts "$source_skill"
node skills/manage-skills/scripts/skills.mjs validate "$skill_name" \
  --source "$source_dir"
```

Resolve failures before installing. The first command enforces this repository's
frontmatter rules; the second uses the installer's own validator. Neither
establishes behavioral correctness or installs tools required by the skill.

If the skill uses paths outside its directory, ensure those resources will
remain accessible in the target environment. Check that the intended agent
supports its tool and runtime requirements.

## 2. Check for an existing destination

Run:

```sh
if [ -e "$destination" ] || [ -L "$destination" ]; then
  printf 'Stop: destination already exists: %s\n' "$destination"
  ls -ld "$destination"
else
  printf 'Destination available: %s\n' "$destination"
fi
```

If anything exists, including a broken symlink, stop before installation.
Inspect it and determine whether it already points to the intended source.
If it is the desired installation, proceed to verification instead of replacing
it. Otherwise obtain approval and preserve the existing installation before
moving it aside. Do not add `--force` simply to bypass a collision.

## 3. Install once, using the required mode

For a link to the source skill, run:

```sh
node skills/manage-skills/scripts/skills.mjs install "$skill_name" "$target" \
  --source "$source_dir"
```

Use this mode when source edits should be visible to the target project. Keep
the source checkout at the same location; moving or deleting it breaks the link.

For an independent copy instead, run this command **instead of** the link command:

```sh
node skills/manage-skills/scripts/skills.mjs install "$skill_name" "$target" \
  --source "$source_dir" --copy
```

Use copy mode when the target should retain its current files independently of
later source edits. Review internal symlinks before relying on portability: the
copy operation preserves symlinks rather than copying their referents.

Always pass both the explicit target and `--source`. Do not substitute
`link-skills` here; that command links entire skill collections from installed
packages or local sources, not individual skills into specific projects. Use
`link-skills` only when you want to expose all skills from a source in your
agent's discovery directory. Use `manage-skills install` when you need one
specific skill in another project.

## 4. Verify files and installation mode

Run:

```sh
ls -ld "$destination"
test -f "$destination/SKILL.md"
node skills/manage-skills/scripts/skills.mjs validate "$destination" \
  --source "$source_dir"
```

For a link installation, confirm that the installed path resolves to the source:

```sh
node -e '
  const fs = require("node:fs");
  const [installed, source] = process.argv.slice(1);
  if (!fs.lstatSync(installed).isSymbolicLink()) process.exit(1);
  if (fs.realpathSync(installed) !== fs.realpathSync(source)) process.exit(1);
' "$destination" "$source_skill"
```

For a copy installation, confirm that the root is not a symlink and compare its
contents, excluding Git metadata omitted by the installer:

```sh
test ! -L "$destination"
diff -r -x .git "$source_skill" "$destination"
```

Investigate any failed check. Do not treat the install command's successful exit
as sufficient verification.

## 5. Confirm discovery in the target agent

Open the target project in the intended agent and reload its skill inventory.
Confirm the installed skill appears under the expected name. Submit an in-scope
request and inspect selection evidence if the agent exposes it.

If files validate but the skill does not appear, check the agent's discovery
location, cached inventory, duplicate skill names, and permissions. Installing
files does not make an unsupported discovery directory work or grant tools new
permissions. Report activation as unverified when the agent exposes no evidence.

## Completion check

Record the installed name, source path, target path, link-or-copy mode, and
verification results. For a copy, also record the source revision when available
so a later update can be compared deliberately. Leave unrelated target skills
unchanged.

The [CLI reference](../reference/cli-tools.md) contains the full contract for both
individual skill installation (`manage-skills`) and collection-level linking
(`link-skills`).
