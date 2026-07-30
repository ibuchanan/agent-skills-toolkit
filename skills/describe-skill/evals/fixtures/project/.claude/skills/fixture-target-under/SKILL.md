---
name: fixture-target-under
description: Format JSON files with consistent indentation. Use when a JSON file needs reformatting.
---

# Fixture Target Under

Format JSON files with consistent 2-space indentation, sorted keys, and a
trailing newline.

## Scope

Trigger for: reformatting an existing JSON file's whitespace and key order.

Also handle: converting a JSON file to YAML or vice versa, preserving key
order and comments where the target format supports them. This is a
core, documented capability of this skill's body, but the description
above never mentions it — a request like "convert this JSON to YAML"
should trigger this skill and currently would not, since nothing in the
description signals YAML conversion or format conversion at all.

## Workflow

1. Read the target file and detect its format (JSON or YAML).
2. If reformatting in place, apply 2-space indentation, sort object keys,
   and ensure a trailing newline.
3. If converting between JSON and YAML, parse the source format and
   serialize to the target format, preserving key order.
4. Write the result back only after showing a diff and getting approval.

## Boundaries & safety

Never overwrite a file without showing the diff first.
