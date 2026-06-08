# AI Pulse · HANDOFF (Office-Laptop Master)

> **This is the single document to read first** — whether you're Vamshi on the office laptop Monday, a teammate, GitHub Copilot, or a fresh Claude session. It captures the full understanding and every decision after the platform pivot.
>
> **Last updated:** Saturday June 7 2026, after the Synchrony Agentic AI Platform pivot.
> **State:** Architecture locked to the platform. Demo = TypeScript/React. Production = Python on AgentCore. Ready to build on office laptop.

---

## 0 · The 60-second version

We're building **ReleasePilot + ReleaseWatch** — two cooperating AI agents for the release lifecycle — for the **Synchrony Agentic AI Platform** (AWS Bedrock AgentCore + LLM Gateway + MCP Gateway). ReleasePilot does pre-deploy homework and writes a **risk packet**; it hands off to ReleaseWatch via **A2A**; ReleaseWatch watches the deploy, escalates L1→L2→L3, and generates an evidence-backed **RCA at 0.84 confidence** when a real cross-system failure happens. Humans stay in control through **3 approval gates** (the platform's HITL primitive).

**Production:** Python agents on AgentCore Runtime, reasoning via **Claude on the LLM Gateway**, pulling Jira/ServiceNow/Confluence/Splunk/New Relic through the **MCP Gateway**.

**Demo (4 min):** a TypeScript/React app (vibe-coded with GitHub Copilot) that simulates both agents' behavior with pre-seeded data and a pre-rendered streaming RCA. The architecture maps 1:1; the demo shows the experience.

**Tagline:** "From comment to confidence."

---

## 1 · The platform pivot (why this changed)

We started building around Copilot Studio. That was wrong, and Vamshi caught it. Studio is a chatbot channel, not an agent brain — and it forced an ugly Jira webhook-push workaround because it can't pull data without Premium connectors.

Then a screenshot surfaced: the **Synchrony Agentic AI Platform** (Bedrock AgentCore + LLM Gateway with approved Claude + MCP Gateway + Atlassian/ServiceNow connectors + HITL). Our entire idea maps onto it natively. Every architectural problem we had dissolved:

- **"How does the agent pull from Jira?"** → MCP Gateway. No webhook hack.
- **"How do we use Claude without a personal key?"** → LLM Gateway lists Claude as approved.
- **"Java or Python?"** → Python, because it's the AgentCore agent SDK language.
- **"One agent or two?"** → Two, connected by A2A (a named platform primitive).
- **"Is Studio the right tool?"** → No. It's not in the platform diagram at all. GitHub Copilot satisfies the hackathon's vibe-coding requirement.

Full mapping: see `platform_mapping.md`.

---

## 2 · Locked decisions (do NOT reopen)

| # | Decision | Rationale |
|---|---|---|
| 1 | Project: **ReleasePilot + ReleaseWatch**, two agents | Native A2A fit |
| 2 | Target platform: **Synchrony Agentic AI Platform** (Bedrock AgentCore) | It's what Synchrony is standing up |
| 3 | **Two agents + A2A handoff** (risk packet as payload, persisted in AgentCore Memory) | A2A is a platform primitive; clean ownership; the handoff is the insight |
| 4 | Production language: **Python** on AgentCore Runtime | AgentCore agent SDK is Python-first |
| 5 | LLM: **Claude via the LLM Gateway** | Approved model, no personal key, governed |
| 6 | Data access: **MCP Gateway** to Jira/ServiceNow/Confluence/Bitbucket/Splunk/New Relic | Platform's sanctioned integration path |
| 7 | **3 approval gates** via platform HITL: review · CHG advance · L3 ack | Humans in control |
| 8 | Escalation cadence: L1 hourly · L2 amber 15-min + email · L3 red per-min + INC + card | Operational behavior model |
| 9 | **Demo built in TypeScript/React**, vibe-coded with GitHub Copilot | Python not reachable in 24h; UI demo needs a frontend |
| 10 | **Demo RCA is pre-rendered streaming text** | Real LLM round-trip not possible in demo; show the behavior |
| 11 | Demo scenario: **forgotten DB migration** on `application-consumer` (subtask ACQ-3852 not run on CDE2 → publisher init fails against missing schema → silently stops publishing → `sms-consumer`/`email-consumer`/`audit-consumer` starve), immediately post-deploy, RCA confidence **0.84**. `credit-apply` is a green contrast tile (risk 28). | Immediate post-deploy = release-window-consistent; pure relationship failure; app looks healthy |
| 12 | All Synchrony data is **mock/invented** (INCs, CHGs, apps, DLs) | Hackathon rule |
| 13 | Brand: SYF yellow #FFCE32 + navy #002856 + dark panels. NEVER purple/cyan AI gradients. Inter + JetBrains Mono. | Locked visual identity |
| 14 | Pitch length: **4 minutes** (post-deploy headline focus; pre-deploy compressed) | Judging time slot |
| 15 | **Demo is a FUNCTIONAL app, not a mockup** — real orchestration, real risk engine, real drift detection, real 3-click approval flow; only data + RCA reasoning are mocked at marked seams | Theme is vibe coding; a static HTML file doesn't demonstrate it |
| 16 | **Approval gates = 3 REAL clicks** (review · CHG advance · L3 ack), with a hidden `?present=true` stage-safety override | Real clicks read as real software; override prevents a misclick dead-end |

### New demo mechanics (added with the scenario swap)

- **Risk score (0-100)** per release, from past-INC density + change type. `application-consumer` = 72 (Elevated, migration dependency); `credit-apply` = 28 (Low). Shown on dashboard tiles and atop the risk packet.
- **Confluence template fill**: ReleasePilot READS a pre-defined "Synchrony Standard Release Page v3" template and POPULATES its sections — it does not invent a page from scratch.
- **MVP 2 = "Production Watch"**: the RabbitMQ-memory-a-week-after-deploy pattern is explicitly OUT of ReleaseWatch's release-window scope; it's the motivating example for a future continuous-monitoring product. Good pitch line for scope awareness.

### Decisions now OBSOLETE (were true under Studio, no longer)

- ~~Combine the two agents into one~~ → now two + A2A
- ~~Jira webhook-push because Studio can't pull~~ → now MCP Gateway pull
- ~~Studio Generative Answers as the LLM~~ → now Claude via LLM Gateway
- ~~Path B (real M365 + Studio) as the ceiling~~ → Studio dropped; demo is the React app
- ~~Demo scenario = RabbitMQ memory cascade a week after deploy~~ → now a forgotten-migration silent publish failure, immediately post-deploy (the memory-cascade pattern is now MVP-2 "Production Watch")

---

## 3 · Architecture (production)

```
Event sources (Jira webhook · CHG change · UDeploy · Splunk)
  → EventBridge / Kafka (release.lifecycle.*)
    → AgentCore Runtime (Python)
        ReleasePilot ──A2A(risk packet)──▶ ReleaseWatch
              │                                  │
        AgentCore Memory (risk packet + watch state)
              │                                  │
        LLM Gateway → Claude (risk packet · L2 drift · L3 RCA)
              │                                  │
        MCP Gateway → Jira · ServiceNow · Confluence · Bitbucket · Splunk · New Relic
              │                                  │
        HITL approval gates (×3)
```

Full diagrams (11 of them, tiered): `architecture_diagrams.html`.

---

## 4 · Architecture (demo · what we build this week)

A **real, working** Next.js + React + TypeScript app — NOT a click-through mockup. The agent genuinely orchestrates: gathers from 3 sources, **computes** the risk score, **fills** the Confluence page, **detects** drift, escalates L1→L2→L3 — driven by **3 real human approval clicks**. Only DATA (seed JSON) and REASONING (a deterministic `generateRCA()`) are mocked; every mock has a marked `// PROD vs // DEMO` seam that maps to the platform. This is the vibe-coding deliverable.

**Authoritative build spec: `03_path_e/orchestration_spec.md`** (the real agent functions, workflow state, event flow, 3 gates, seams). The older `state_machine_spec.md` / `choreography_spec.md` describe a superseded scene-reveal model — visual reference only.
Build prompt for Copilot: `03_path_e/build_demo_app_prompt.md` (functional build).

**Fallback:** `03_path_e/mock1_combined.html` — the single-file scene demo. Ships as-is if the functional build runs out of time. No one can tell the difference on screen.

---

## 5 · Demo flow (4 minutes)

| Time | Scene | Beat |
|---|---|---|
| 0:00-0:30 | Architecture slide | "Two agents on the Synchrony Agentic AI Platform. Here's the experience." |
| 0:30-1:00 | Dashboard · 9 tiles | "Every line is a watched release. Ours just deployed. Hour 1 clear — producer +12ms, within tolerance." |
| 1:00-1:30 | Drift → amber | "Hour 2. Consumer latency +340%. Unexplained. L2 amber. Email + 15-min cadence." |
| 1:30-3:00 | L3 RCA streams | "30 min unresolved → L3. Cross-system pattern + 2 past INCs + diff → RCA at 81%. INC created." |
| 3:00-3:30 | Adaptive Card → ack | "On-call has 30 sec. Acknowledge keeps INC open. Rolls back." |
| 3:30-4:00 | Recovery + close | "57 min drift-to-recovery vs 3+ hours without. From comment to confidence." |

Full narration: `01_common/pitch_script.md` (note: written for 6-8 min; trim to the table above for 4 min).

---

## 6 · What to build this week (priority order)

1. **The demo React app** — primary deliverable. Use `03_path_e/build_demo_app_prompt.md` with GitHub Copilot, or Claude builds the mock HTMLs (`mock1_combined.html` already exists as the visual target).
2. **The deck** — needs rebuild around the platform story. Architecture slide = redraw of diagram 1 or 2 from `architecture_diagrams.html`. (Pending — ask Claude to build `deck_v2.html`.)
3. **The pitch + Q&A prep** — `01_common/pitch_script.md` + `01_common/jury_qa_bedrock_primer.md`.
4. **Fallback video** — record the demo Monday evening per `01_common/demo_dry_run_script.md`.

---

## 7 · How to drive the office-laptop build with Copilot

1. Clone the package to the office laptop (git).
2. Open it in VS Code with GitHub Copilot Agent mode.
3. Paste `03_path_e/build_demo_app_prompt.md` (the prompt block inside it) into Copilot. It tells Copilot to read `orchestration_spec.md` (the authoritative architecture) and build the BRAIN first, then surfaces, then wire the 3 gates.
4. Copilot scaffolds `./build/BUILD_LOG.md` + `./build/PERSISTENT_MEMORY.md`, bootstraps Next.js, and builds the 23 components in 9 blocks.
5. You review each block, confirm or correct, Copilot logs and proceeds.
6. Resume any session with: *"Read ./build/PERSISTENT_MEMORY.md, then the last 5 BUILD_LOG entries, then propose the next action."*

Build-log + memory conventions: `01_common/build_log_and_memory_guide.md`.

---

## 8 · User preferences (honor in every response)

- Direct, concise, architect-grade. No fluff. No "great question!". No "happy to help!".
- Push back when wrong. Don't yes-man. Acknowledge mistakes plainly.
- Trade-offs, alternatives, failure modes, cost. Think like an architect + strategist.
- One step at a time during live tool checks.
- Tables, lists, headers over prose walls.
- SYF brand colors locked (see decision 13). NEVER purple/cyan AI gradient.
- Strict dev separation: office laptop = GitHub Copilot only (Synchrony work). Personal Mac = Claude Code (Mindloom). Never cross-reference.
- Mock everything. No real Synchrony data.
- Raise architecture concerns early — Vamshi catches weak reasoning (Studio, Spring Boot both got corrected). Don't default; justify.

---

## 9 · Package contents

```
ai-pulse-package/
├── HANDOFF.md (this file) · README.md · platform_mapping.md ★
├── architecture_diagrams.html ★ (11 diagrams, tiered)
├── deck_v2.html ★ (16-slide 4-min pitch deck, platform-aware)
├── strategy_v2.html · deck1_combined.html (pre-pivot · superseded by deck_v2)
│
├── 01_common/
│   ├── prompts/ (master, risk_packet, l2_drift, l3_rca) — language-agnostic, still valid
│   ├── data/mock_data_seed.json — still valid, drives the demo
│   ├── jury_qa_bedrock_primer.md ★ (Bedrock primer + expected questions)
│   ├── build_log_and_memory_guide.md ★ (logging + memory conventions)
│   ├── pitch_script_4min.md ★ (USE THIS Tuesday · 4-min, platform-aligned)
│   ├── pitch_script.md (6-8 min reference version)
│   ├── monday_morning_checks.md (now lighter — no Studio checks)
│   ├── monday_playbook.md · team_allocation.md · demo_dry_run_script.md · fallback_plans.md
│   └── DECISION_LOG.md
│
├── 02_path_b/ — STUDIO PATH · now REFERENCE-ONLY (kept for history; don't build)
│
├── 03_path_e/ — THE DEMO BUILD (primary)
│   ├── build_demo_app_prompt.md ★ (the end-to-end Copilot build prompt)
│   ├── path_e_copilot_prompt.md (earlier version · superseded by build_demo_app_prompt.md)
│   ├── react_app_spec · state_machine_spec · choreography_spec · component_inventory
│   ├── data_loader_template.ts
│   └── mock1_combined.html ★ (refreshed · platform badge + LLM Gateway attribution · visual target)
│
└── 04_idea2_watch_only/ — alternative ReleaseWatch-only pitch (still valid)
```

★ = new or updated in the platform pivot.

---

## 10 · Critical don'ts

- DO NOT reintroduce Copilot Studio as the agent brain (it's a channel at most, and we've dropped it)
- DO NOT reintroduce the Jira webhook-push hack (MCP Gateway pulls in production)
- DO NOT suggest a personal AWS/Claude API key (use the LLM Gateway story)
- DO NOT default Java/Python/tool choices without an architectural reason (Vamshi will catch it)
- DO NOT reproduce the Synchrony platform slide directly (redraw in brand)
- DO NOT use purple/cyan AI gradients
- DO NOT cross-reference office vs personal laptop work
- DO NOT reproduce real Synchrony data

---

## 11 · Pending work

- ~~Deck v2~~ → **DONE** · `deck_v2.html` (16 slides, 4-min structure, platform-aware)
- ~~Demo mock refresh~~ → **DONE** · `03_path_e/mock1_combined.html` (platform badge + LLM Gateway attribution)
- ~~Pitch trim to 4 min~~ → **DONE** · `01_common/pitch_script_4min.md`
- **Demo app build** — optional · use `03_path_e/build_demo_app_prompt.md` with Copilot if you want a real React app beyond the HTML mock
- **PPT export** — deck is HTML-first; export `deck_v2.html` to .pptx only if a native file is required
- **Clean-up** — `02_path_b/` (Studio path) is reference-only; delete if you want a leaner package
- **Deck 2 / Mock 2** — only if pivoting to Idea 2 (ReleaseWatch-only)

---

## 12 · Continuation prompt (new Claude session)

```
Continuing the AI Pulse hackathon project (ReleasePilot + ReleaseWatch, Synchrony
Vibe Coding 2026). Read ./ai-pulse-package/HANDOFF.md and platform_mapping.md first.
Key context: we pivoted from Copilot Studio to the Synchrony Agentic AI Platform
(Bedrock AgentCore + LLM Gateway w/ approved Claude + MCP Gateway). Two agents + A2A.
Production = Python on AgentCore. Demo = TypeScript/React vibe-coded with Copilot,
pre-rendered RCA. 4-min pitch. Honor user prefs in HANDOFF §8 (direct, architect-grade,
no fluff, SYF brand colors, justify architecture choices). Ask what I'm working on
before assuming.
```

---

*State: platform-aligned · demo path clear · diagrams built · mapping documented · Copilot build prompt ready. Pending: deck v2, demo app build, pitch trim. Confidence: high. The pivot made the pitch stronger, not weaker.*
