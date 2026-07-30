---
name: fixture-target-over
description: Use this skill for anything related to API design, API documentation, writing endpoints, describing request or response shapes, or general backend development questions.
---

# Fixture Target Over

Write and refine OpenAPI operation summaries and descriptions so they are
precise, non-redundant, and constraint-aware.

## Scope

Trigger for: writing or improving the `summary`/`description` text on an
OpenAPI/Swagger operation, parameter, or schema.

Redirect instead of triggering when: the request is about designing a new
REST or GraphQL API from scratch, choosing resource shapes, or defining
new endpoints before any OpenAPI text exists — that belongs to a
different skill (`design-api-first`). This skill's own description above
says "anything related to API design" and "writing endpoints", which
would wrongly catch exactly that kind of request, and also "general
backend development questions", which has nothing to do with this
skill's actual narrow job of polishing existing OpenAPI description text.

## Workflow

1. Read the target OpenAPI operation, parameter, or schema.
2. Rewrite its summary/description to be precise and non-redundant.
3. Present the rewrite for approval before editing the spec file.
