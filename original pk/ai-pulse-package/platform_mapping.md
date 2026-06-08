# Platform Mapping · ReleasePilot + ReleaseWatch on the Synchrony Agentic AI Platform

> **Purpose:** This is the artifact that answers "how does this fit our stack?" Every component of our project maps onto a named box in the Synchrony Agentic AI Platform. Nothing is invented. Nothing is forced. Read this before Tuesday so any team member can field a platform-fit question.

---

## One-sentence positioning

> "ReleasePilot and ReleaseWatch are two cooperating agents built natively for the Synchrony Agentic AI Platform — they run on AgentCore Runtime, reason through Claude on the LLM Gateway, pull from Jira/ServiceNow/Confluence through the MCP Gateway, persist state in AgentCore Memory, and keep humans in control through the platform's HITL primitive."

---

## Layer-by-layer mapping

### Orchestration Layer

| Platform element | Our project |
|---|---|
| Application/Agent | **ReleasePilot** (pre-deploy) and **ReleaseWatch** (post-deploy) — two agents |
| Prompt | Our 4 prompts: master persona, risk packet synthesis, L2 drift classification, L3 RCA generation |
| Task | The discrete release tasks: read story, synthesize risk packet, advance CHG, watch metrics, escalate, generate RCA |
| State | The CHG lifecycle state + the watch state machine (L1/L2/L3/recovered) |
| HITL | **Our 3 approval gates** — review curated info · approve CHG advance · acknowledge L3 escalation. This is a named platform primitive, not something we bolt on. |
| Workflow Management | The 17-step lifecycle orchestration |

### AI/Agent Gateway

| Platform element | Our project |
|---|---|
| Content Moderation | Inherited from platform — we don't build it |
| Data Encryption | Inherited from platform |
| Guardrails | Inherited from platform — bounds the agent's outputs |
| Logs / Trace / Metrics | Our agents' observability, provided free by the gateway |

We consume this layer. We don't build anything here. That's the point of a platform.

### Bedrock AgentCore Platform

| Platform element | Our project |
|---|---|
| AgentCore Runtime → **AI Agent** | Where ReleasePilot and ReleaseWatch execute |
| AgentCore Runtime → **A2A** | **The Pilot → Watch handoff.** Risk packet is the A2A payload. |
| AgentCore Runtime → **MCP** | How the agents call tools / reach data sources |
| **AgentCore Memory** | Persists the risk packet + watch state across the agent's lifecycle |
| **Knowledge Base** | Past INCs, runbooks, release history — what the agent searches for pattern matching |
| AgentCore Gateway | Authenticated, governed access from the agents to resources |
| AgentCore Identity | The agents' identity for authorization (least-privilege) |
| AgentCore Browser / Code Interpreter | Not needed for our use case (no browsing or code execution required) |
| AgentCore Policy | Governs what the agents are allowed to do |
| **AgentCore Evaluations** | RCA quality scoring + confidence calibration validation |
| CloudWatch GenAI Observability | Monitoring the agents themselves in production |

### LLM Gateway

| Platform element | Our project |
|---|---|
| Router | Routes our LLM calls to the right approved model |
| Bedrock Models / Azure Models | The hosting layer |
| Synchrony Approved LLMs → **Claude** | **L3 RCA reasoning runs on Claude** — deep cross-system reasoning, the demo's headline |
| Synchrony Approved LLMs → Nova | Could serve cheaper L1/L2 classification to control cost |
| Synchrony Approved LLMs → GPT | Available if needed |
| Logs / Trace | Per-call observability for every LLM invocation |

**This is the answer to the "how do you access Claude without a personal API key?" question.** We don't use a personal key. We route through the sanctioned LLM Gateway, which lists Claude as an approved model.

### MCP Gateway

| Platform element | Our project |
|---|---|
| MCP | Model-context-protocol access to tools/resources |
| OpenAPI / REST | How the agents pull from Jira, ServiceNow, Confluence, Bitbucket, Splunk, New Relic |
| Router | Routes resource calls |
| Synchrony Approved Resources → MCPs / APIs / Tools | The governed catalog of what the agents may call |

**This is the answer to the "Jira pull" problem we agonized over earlier.** In production there's no webhook-push hack — the agents pull from Jira and ServiceNow through the MCP Gateway, which is the platform's sanctioned integration path. The push-only pattern was a Copilot-Studio-era workaround that no longer applies.

### Data & Knowledge Source

| Platform element | Our project |
|---|---|
| **Atlassian** (Jira + Confluence) | Release stories, subtasks, release pages |
| **ServiceNow** | CHG tickets, INC records, past incident history |
| SharePoint | Optional supplementary docs |
| Postgres / RDS / DynamoDB | Could store watch state / metric history if needed |
| Redshift / S3 | Historical analytics, longer-term incident archive |

**Every data source we need is already a first-class connector on this platform.** Atlassian and ServiceNow — the two systems our whole story depends on — are right there in the diagram.

### Security & Governance (cross-cutting)

| Platform element | Our project |
|---|---|
| Okta / SailPoint | Identity + access governance for the agents |
| **Splunk** | We read Splunk for log-based signals; platform also monitors the agents |
| **New Relic** | We read New Relic for metric signals (producer/consumer latency, throughput) |
| CloudWatch / CloudTrail / VPC | Platform-level audit + network isolation |

Splunk and New Relic appear twice in our story: as *data sources the agent reads* (metric/log signals) and as *governance tooling that monitors the agent*. Both are native to the platform.

---

## The "nothing is invented" proof

Walk a skeptical architect through this checklist:

- Two cooperating agents → AgentCore Runtime + A2A ✓ (named primitive)
- Agent handoff payload → AgentCore Memory ✓ (named primitive)
- Tool/data access → MCP Gateway + AgentCore Gateway ✓ (named primitive)
- LLM reasoning on Claude → LLM Gateway → Synchrony Approved LLMs → Claude ✓ (named, approved)
- Human approval → HITL in Orchestration Layer ✓ (named primitive)
- Jira/Confluence access → Atlassian connector ✓ (named source)
- ServiceNow access → ServiceNow connector ✓ (named source)
- Metric/log signals → Splunk + New Relic ✓ (named, in Security & Governance)
- Quality + confidence validation → AgentCore Evaluations ✓ (named primitive)
- Audit trail → CloudWatch GenAI Observability + CloudTrail ✓ (named primitive)

**Every arrow in our architecture lands on a box Synchrony already drew.** That's the strongest possible position in that room.

---

## What this means for the build vs the pitch

| | Production (what we describe) | Demo (what we show in 4 min) |
|---|---|---|
| Agents | Python on AgentCore Runtime, 2 agents + A2A | React state machine simulating both agents' behavior |
| LLM | Claude via LLM Gateway | Pre-rendered streaming RCA (Python/gateway not reachable in 24h hackathon) |
| Data access | MCP Gateway → Jira / ServiceNow / Confluence / Splunk / New Relic | Pre-seeded JSON matching the real API response shapes |
| HITL | Platform HITL primitive | React mock of the approval interaction (Adaptive Card / Teams styling) |
| Memory | AgentCore Memory | React state |
| Observability | CloudWatch GenAI Observability | n/a (out of demo scope) |

**The honest pitch line:** "Everything you see is built for this platform. We vibe-coded the experience in TypeScript so we could show you the full flow in four minutes — production runs in Python on AgentCore with Claude through the LLM Gateway. The architecture maps one-to-one; the demo shows the behavior."

---

## Why two agents (A2A) instead of one

We considered a single combined agent. Two cooperating agents is better here because:

1. **A2A is a platform primitive.** Using it demonstrates fluency with the platform, not a workaround around it.
2. **Clean ownership boundary.** ReleasePilot owns pre-deploy; ReleaseWatch owns post-deploy. Separate evaluation, separate scaling, separate failure domains.
3. **The handoff becomes the story.** The risk packet passed via A2A and persisted in AgentCore Memory is the architectural insight — it's what makes ReleaseWatch *contextual* monitoring instead of generic alerting.
4. **Independent lifecycle.** ReleaseWatch can be invoked for releases that didn't go through ReleasePilot (manual deploys), reading a human-authored risk packet. Decoupling enables that.

The earlier "combine them" recommendation was a Copilot Studio cost optimization and no longer applies.

---

## Talking points for the platform-fit question

If a judge asks "how does this fit what we're building?", say:

> "It's a native fit. Our two agents run on AgentCore Runtime and hand off via A2A — the risk packet is the payload, persisted in AgentCore Memory. Reasoning runs on Claude through the LLM Gateway. Data access — Jira, ServiceNow, Confluence, Splunk, New Relic — all goes through the MCP Gateway and the connectors already in the Data and Knowledge Source layer. Human approvals use the platform's HITL primitive. We didn't design around the platform; we designed for it. The question we asked was: what's the first high-value agent you'd run on this platform once it's live? This is our answer."

---

*This document is the single source of truth for platform-fit questions. Keep it open during Q&A.*
