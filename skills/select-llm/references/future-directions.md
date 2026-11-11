# Future Directions Outside Current Skill Scope

These prior-art ideas are useful for future evolution, but they are intentionally out of scope for the current `select-llm` skill.

The current skill is a pragmatic selector:

- classify the task with a stable taxonomy
- gather live model metadata
- apply hard constraints
- rank candidates
- return a primary, fallback, and rationale

It does not attempt to implement the more ambitious systems below.

## 1. Critic-Based Task Profiling Is Out Of Scope

**Prior Art:** Derived from **BELLA (Budget-Efficient LLM Selection via Automated skill-profiling)**.

- **Reference:** *"[2602.02386] Trust by Design: Skill Profiles for Transparent, Cost-Aware LLM Routing"* (arXiv, Feb 2026)
- **Future direction:** decompose tasks into granular skill profiles using a critic or profiling stage before model selection
- **Why out of scope now:** the current skill uses a lightweight taxonomy-driven task profile, not an additional learned or critic-based profiling pipeline

## 2. Formal SLA Optimization Is Out Of Scope

**Prior Art:** Foundational to **Multi-Objective Optimization in LLM Routing** and **SAGE (Self-improving Agent with Skill Library)**.

- **Reference:** *"[2512.17102] Reinforcement learning for self-improving agent with skill library"* (arXiv, Dec 2025)
- **Future direction:** optimize routing with explicit SLA objectives such as token efficiency, TTFT, and benchmark-derived utility scores
- **Why out of scope now:** the current skill uses simple weighted judgment over cost, quality, and performance rather than a formal optimization or reinforcement-learning system

## 3. Speculative Evaluation Pipelines Are Out Of Scope

**Prior Art:** Derived from **Speculative Actions** and **Cascade Routing**.

- **Reference:** *"Speculative Actions: A Lossless Framework for Faster AI Agents"* (2025) and Anthropic's **"Agent Skills"** paradigm (Oct 2025)
- **Future direction:** let a smaller model attempt a task or pre-evaluate a draft, then escalate only when confidence is low
- **Why out of scope now:** the current skill can recommend escalation paths, but it does not orchestrate speculative execution or confidence-based cascade workflows

## 4. Ontology-Driven Constraint Governance Is Out Of Scope

**Prior Art:** Rooted in **HalluGuard** and **Constitutional AI (CAI)** frameworks.

- **Reference:** *"HalluGuard: Demystifying Data-Driven and Reasoning-Driven Hallucinations in LLMs"* (2026) and the **Skill Trust and Lifecycle Governance Framework** (Liu et al., 2026)
- **Future direction:** enforce semantic policy constraints such as air-gapped deployment, hallucination thresholds, or domain compliance through a richer governance layer
- **Why out of scope now:** the current skill supports practical hard constraints, but not ontology-driven policy reasoning or compliance governance frameworks
