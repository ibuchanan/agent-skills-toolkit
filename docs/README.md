# Documentation

<!-- cspell:words Diátaxis -->

The documents below address separate reader needs using the Diátaxis framework.

| Need                             | Document                                                                                   | Status                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| Understand the design            | [Agent Skills as engineered, maintained knowledge](explanation/agent-skill-development.md) | Explanation draft                                       |
| Learn by building                | [Build a change-note skill: a tour of the toolkit](tutorials/build-an-agent-skill.md)      | Tutorial draft; live agent walkthrough not yet verified |
| Stop incorrect activation        | [Repair an over-triggering skill description](how-to/repair-over-triggering.md)            | How-to guide                                            |
| Update supporting evidence       | [Refresh a stale reference without losing provenance](how-to/refresh-stale-reference.md)   | How-to guide                                            |
| Make a skill available elsewhere | [Install a local skill into another project](how-to/install-local-skill.md)                | How-to guide                                            |
| Look up command contracts        | [CLI tools](reference/cli-tools.md)                                                        | Reference grounded in current source                    |

For contributor setup, the edit/check/evaluate/review loop, and repository
structure, see [Development](../DEVELOPMENT.md). For installation and a first
use, start at the [project README](../README.md).

## Remaining how-to candidates

| Candidate                                           | Starting point                    | Completion condition                                                                                            |
| --------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Add regression evaluations to an existing skill** | Approved spec and evaluation plan | Promptfoo cases trace to the plan; execution prerequisites and results are recorded separately                  |
| **Diagnose a failing skill check**                  | A `check-skill` failure report    | Failure is isolated to structure, lint, environment, or behavior; targeted checks are rerun with skips reported |
