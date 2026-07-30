---
okf_version: '0.2.0'
type: Git Submodule
title: "agent-skills-eval TypeScript schema (evals.json, config, providers)"
description: "Verbatim TypeScript interfaces defining the evals/evals.json eval-case shape (including deterministic tool_assertions), the YAML/JSON config shape, and the Provider interface. Authoritative field-by-field reference beyond what the README's prose and examples show — parallels the nested-type detail promptfoo/configuration-reference.md provides for Promptfoo."
sources:
  - id: agent-skills-eval-types
    resource: "https://github.com/darkrishabh/agent-skills-eval/blob/b60eebe3c6edaa917a284e13b9b0e9fa00f1c957/src/types.ts"
    title: "types.ts"
    author: "human:darkrishabh"
  - id: agent-skills-eval-provider
    resource: "https://github.com/darkrishabh/agent-skills-eval/blob/b60eebe3c6edaa917a284e13b9b0e9fa00f1c957/src/provider.ts"
    title: "provider.ts"
    author: "human:darkrishabh"
  - id: agent-skills-eval-config
    resource: "https://github.com/darkrishabh/agent-skills-eval/blob/b60eebe3c6edaa917a284e13b9b0e9fa00f1c957/src/config.ts"
    title: "config.ts"
    author: "human:darkrishabh"
generated:
  by: agent:claude
  at: '2026-07-30T13:14:29Z'
---

# agent-skills-eval TypeScript schema

## Eval case shape (`evals/evals.json`, from `src/types.ts`)

```typescript
export interface AgentSkillsEval {
  id?: number | string;
  name?: string;
  prompt: string;
  expected_output?: string;
  files?: string[];
  /** Free-form rubric assertions graded by the LLM judge. */
  assertions?: string[];
  /** Inference params (passthrough) for this case; merged over skill defaults. */
  params?: Record<string, unknown>;
  /** Tools available to the model for this case. Falls back to skill defaults. */
  tools?: ToolDef[];
  /** Tool selection control; defaults to `"auto"` when tools are present. */
  tool_choice?: ToolChoice;
  /** Deterministic checks against the structured tool_calls returned. */
  tool_assertions?: ToolAssertion[];
}

export interface SkillDefaults {
  target?: { params?: Record<string, unknown> };
  judge?: { params?: Record<string, unknown> };
  /** Tools provided to every case in this skill unless the case overrides. */
  tools?: ToolDef[];
}
```

## Deterministic tool-call assertions (`ToolAssertion`, from `src/types.ts`)

Graded locally against the structured `tool_calls` returned by the model —
no LLM judge involved, the same "objectively checkable" category as
Promptfoo's `trajectory:tool-used`/`tool-args-match`. `path` is dot-notation
into the parsed arguments object, e.g. `"command"`, `"input.command"`,
`"files[0]"`.

```typescript
export type ToolAssertion =
  | { type: "tool-called";       name: string;                                                description?: string }
  | { type: "tool-not-called";   name: string;                                                description?: string }
  | { type: "tool-arg-equals";   name: string; path: string; value: unknown;                  description?: string }
  | { type: "tool-arg-contains"; name: string; path: string; value: string;                   description?: string }
  | { type: "tool-arg-matches";  name: string; path: string; pattern: string; flags?: string; description?: string }
  | { type: "tool-call-count";   name?: string; min?: number; max?: number;                   description?: string };
```

## Result and benchmark shapes (from `src/types.ts`)

```typescript
export interface AssertionResult {
  text: string;
  passed: boolean;
  evidence: string;
}

export interface GradingJson {
  assertion_results: AssertionResult[];
  summary: { passed: number; failed: number; total: number; pass_rate: number };
}

export interface AggStats {
  pass_rate: { mean: number; stddev: number };
  time_seconds: { mean: number; stddev: number };
  tokens: { mean: number; stddev: number };
}

export interface BenchmarkJson {
  run_summary: {
    with_skill: AggStats;
    without_skill?: AggStats;
    delta?: { pass_rate: number; time_seconds: number; tokens: number };
  };
}
```

## Provider interface (`src/provider.ts`)

What `evaluateSkills` calls to get a model response — implement this to
bring a custom backend:

```typescript
export interface ToolFunctionDef {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

export interface ToolDef {
  type: "function";
  function: ToolFunctionDef;
}

export type ToolChoice =
  | "auto"
  | "none"
  | "required"
  | { type: "function"; function: { name: string } };

export interface ToolCall {
  id?: string;
  type: "function";
  function: { name: string; arguments: string };
  parsedArguments?: unknown;
}

export interface ProviderResult {
  provider: string;
  model: string;
  output: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  error?: string;
  toolCalls?: ToolCall[];
}

export interface ProviderCapabilities {
  attachments?: boolean;
  systemRole?: boolean;
  toolCalls?: boolean;
}

export interface CompleteChatArgs {
  system?: string;
  user: string;
  model?: string;
  attachments?: AttachedFile[]; // from src/types.ts
  tools?: ToolDef[];
  toolChoice?: ToolChoice;
  params?: Record<string, unknown>;
}

export interface Provider {
  readonly name: string;
  readonly model: string;
  readonly capabilities?: ProviderCapabilities;
  complete(prompt: string): Promise<ProviderResult>;
  completeChat?(args: CompleteChatArgs): Promise<ProviderResult>;
}
```

## Config shape (`src/config.ts`)

What `agent-skills-eval.yaml` (or `--config`) parses into — every field
optional, CLI flags always override:

```typescript
export type LogFormat = "pretty" | "jsonl" | "silent";
export type WorkspaceLayout = "flat" | "iteration";

export interface AgentSkillsEvalConfig {
  root?: string;
  workspace?: string;
  baseline?: boolean;
  target?: string;
  judge?: string;
  baseUrl?: string;
  apiKeyEnv?: string;
  include?: string[];
  exclude?: string[];
  concurrency?: number;
  strict?: boolean;
  layout?: WorkspaceLayout;
  report?: boolean | {
    enabled?: boolean;
    title?: string;
    output?: string;
  };
  logging?: {
    format?: LogFormat;
    verbose?: boolean;
    color?: boolean | "auto";
    snippetLength?: number;
    file?: string;
  };
  targetParams?: Record<string, unknown>;
  judgeParams?: Record<string, unknown>;
}
```
