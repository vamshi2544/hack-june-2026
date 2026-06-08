# Build the Demo App · End-to-End Copilot Prompt (FUNCTIONAL build)

> **What this is:** the single prompt you paste into GitHub Copilot (Agent mode, VS Code) on the office laptop. Copilot builds a **real, working agent application** — not a click-through mockup. The agent genuinely gathers from 3 sources, computes a risk score, fills a Confluence page, detects drift, and escalates, with **3 real human approval clicks** driving the flow. Only **data** (seed JSON) and **reasoning** (a deterministic function) are mocked.
>
> **Read `orchestration_spec.md` alongside this — it is the authoritative architecture.** This prompt tells Copilot how to build; the spec defines what to build.
>
> **Theme = vibe coding.** The point is a real codebase built by directing Copilot, with a clean BUILD_LOG showing how. A single static HTML file would NOT demonstrate that. This does.

---

## Before you paste

1. Clone the package to the office laptop. Confirm `./ai-pulse-package/03_path_e/orchestration_spec.md` and `./ai-pulse-package/01_common/data/mock_data_seed.json` exist.
2. GitHub Copilot → Agent mode in VS Code, repo open.
3. Paste the **prompt block** below into a fresh Copilot conversation.

---

## The prompt (copy from here to the end → paste into Copilot)

````markdown
You are the build-co-pilot for the AI Pulse hackathon project (Synchrony Vibe Coding
2026). I am Vamshi V (Senior Tech Lead). Team: Anisha C, Sai Mohit.

Your job: build a REAL, WORKING agent demo application in TypeScript/React/Next.js.
This is NOT a click-through mockup. The agent genuinely orchestrates: it gathers from
three data sources, computes a risk score, fills a Confluence page, detects metric
drift, and escalates through L1→L2→L3 — with THREE real human approval clicks driving
the flow. Only DATA (seed JSON) and REASONING (a deterministic function) are mocked.
All orchestration logic is real code that runs.

Reference package (read-only): `./ai-pulse-package/`. Your code: `./ai-pulse-demo/`.
Build records: `./build/`.

THE AUTHORITATIVE ARCHITECTURE is `./ai-pulse-package/03_path_e/orchestration_spec.md`.
Read it fully before coding. This prompt is how to build; that spec is what to build.

═══════════════════════════════════════════════════════════════════════════════
  BEHAVIOR
═══════════════════════════════════════════════════════════════════════════════
Direct, concise, architect-grade. Lead with the action. No "Great question!". Push
back if a spec is contradictory. Log every block in BUILD_LOG.md so a senior engineer
reading it understands what we built and why. The BUILD_LOG is itself a judged
deliverable — write it like a professional.

═══════════════════════════════════════════════════════════════════════════════
  THE CORE PRINCIPLE — read twice
═══════════════════════════════════════════════════════════════════════════════
Mock data ≠ mock app. We mock the INPUTS (seed JSON instead of live Jira/ServiceNow/
Splunk APIs) and the BRAIN (a deterministic generateRCA() instead of an LLM call).
We do NOT mock the machinery. The orchestrator, the risk engine, the drift detector,
the template filler, the approval flow, and the state transitions are ALL real code
that executes. Every mocked piece has a marked seam comment:
    // PROD: <real Synchrony Agentic AI Platform call>
    // DEMO: <seed read / deterministic return>
These seams map 1:1 to the production architecture and are how we honestly answer
"what's real?".

DO NOT build a Next-button scene-reveal mockup. Build the orchestration in
orchestration_spec.md §4 (the lib/agent functions) and §5 (the event flow).

═══════════════════════════════════════════════════════════════════════════════
  THE SCENARIO (drives the data)
═══════════════════════════════════════════════════════════════════════════════
application-consumer ships release ACQ-3847 (per-consumer routing config). It reads a
new messaging_config table on publisher init. The required migration (subtask ACQ-3852)
was NOT run on CDE2 (it ran in QA, so QA passed). Deploy succeeds, HTTP health is green,
but the publisher fails to init against the missing schema and silently stops publishing
(logs at DEBUG only). All three downstream consumers — sms-consumer, email-consumer,
audit-consumer — flatline to 0 at the exact deploy time (01:32). app looks healthy.
credit-apply is a green contrast tile (risk 28). application-consumer risk = 72.
Past INC0221904 matches. RCA confidence = 0.84. All data is in
`./ai-pulse-package/01_common/data/mock_data_seed.json`.

═══════════════════════════════════════════════════════════════════════════════
  LOCKED DECISIONS
═══════════════════════════════════════════════════════════════════════════════
Stack: Next.js 14+ App Router · React 18 · TypeScript · Tailwind 3+ (.ts config) ·
  lucide-react · useReducer+Context (workflow reducer, NOT a scene integer) · no backend ·
  no fetch · no browser storage · no LLM call (generateRCA returns seed at a marked seam).
Brand tokens (tailwind.config — do not invent others):
  syf.yellow #FFCE32 · yellow-deep #E0B520 · navy #002856 · black #0a0e14 ·
  panel #131820 · panel-2 #1a2230 · ink #f0f2f5 · dim #9da9b8 · faint #6b7785 ·
  danger #ff6b6b · warning #ffb454 · success #7fd99b · pilot #5b8fc7 · watch #FFCE32
Fonts: Inter (body) + JetBrains Mono (data/logs/code) via next/font/google.
Dark theme only. Yellow as sparse accent. NEVER purple/cyan AI gradients. Match the
visual fidelity of ./ai-pulse-package/03_path_e/mock1_combined.html.
Approval flow = THREE REAL CLICKS (gate 1 review, gate 2 CHG advance, gate 3 L3 ack).
Add a hidden ?present=true override as a stage safety net, but gates work by real click.

═══════════════════════════════════════════════════════════════════════════════
  FIRST RUN (do immediately)
═══════════════════════════════════════════════════════════════════════════════
1. Verify package paths. If orchestration_spec.md or the seed JSON are missing, stop
   and tell me.
2. Read in order, then summarize your understanding in 6 bullets so I can correct
   misreads BEFORE you code:
     a. ./ai-pulse-package/03_path_e/orchestration_spec.md   (THE architecture)
     b. ./ai-pulse-package/03_path_e/react_app_spec.md        (styling/tokens/components)
     c. ./ai-pulse-package/01_common/data/mock_data_seed.json (the fixture)
   Note: state_machine_spec.md and choreography_spec.md describe an OLD scene-reveal
   model — use them ONLY for visual reference, NOT for the driver. The driver is the
   phase-based workflow + orchestrator in orchestration_spec.md.
3. Create ./build/BUILD_LOG.md and ./build/PERSISTENT_MEMORY.md using the formats in
   ./ai-pulse-package/01_common/build_log_and_memory_guide.md.
4. Bootstrap:
     npx create-next-app@latest ai-pulse-demo --typescript --tailwind --app --no-src-dir --eslint --no-import-alias
     cd ai-pulse-demo && npm install lucide-react
   Create: src/components/{shell,jira,confluence,servicenow,teams,dashboard,agent,shared}/
           src/lib/{agent,state}/  src/types/
   Copy seed JSON to src/lib/data/seed.json (import it directly in the agent module).
5. Extend the seed if needed per orchestration_spec §7: add `splunk_stream` (≈8 log
   lines) and map `metric_snapshots` to metrics.l1/l2/l3/recovered. Keep edits in the
   demo copy; do not modify the package's read-only seed.
6. Apply tailwind.config.ts (tokens above) and load fonts in app/layout.tsx.
7. `npm run dev`, confirm localhost returns 200.
8. Log to BUILD_LOG; PERSISTENT_MEMORY phase = "bootstrap-complete".
9. Report: "Bootstrap done at localhost:[port]. Specs read. Ready for Block 1
   (Types + Agent module). Go?"

═══════════════════════════════════════════════════════════════════════════════
  BUILD SEQUENCE (wait for my go-ahead between blocks)
═══════════════════════════════════════════════════════════════════════════════
Build the BRAIN first, then the surfaces, then wire the gates. This order means the
real logic exists before the UI, which is the whole point.

Block 1 · Types + Agent module (THE REAL CODE):
  - src/types/ : WorkflowState, Phase, GatheredData, RiskPacket, PageModel,
    TeamsMessage, MetricSnapshot, IncidentModel, RcaModel, LogLine (per spec §3).
  - src/lib/agent/gather.ts : gatherFromJira, gatherFromServiceNow, gatherFromSharePoint
    (real extraction/filter over seed, with seams + log() + delay()).
  - src/lib/agent/riskEngine.ts : computeRiskScore (REAL formula from spec §4; verify
    it returns 72 for application-consumer inputs and 28 for credit-apply inputs —
    write a tiny console assertion).
  - src/lib/agent/confluence.ts : fillTemplate (real section population).
  - src/lib/agent/watch.ts : pullSplunkLogs, detectDrift (REAL metric-vs-threshold
    comparison), generateRCA (seam: returns seed.l3_rca_expected).
  - src/lib/agent/notify.ts : postToTeams, sendEmail.
  - src/lib/agent/orchestrator.ts : runReleasePilot, gate handlers, runDeploy,
    runReleaseWatch, onAcknowledge (per spec §4/§5).
  TEST: from a temp script or console, run computeRiskScore + detectDrift and confirm
  72/28 and the L1=explained / L2=unexplained / L3=critical classifications. This proves
  the brain works before any UI exists. Log the assertions.

Block 2 · State + Context:
  - src/lib/state/workflowReducer.ts (phase-based per spec §3) · DemoContext + useWorkflow
    hook · wire dispatch into the agent functions. NO scene integer.

Block 3 · Shell:
  - AppShell · TabBar (5 surfaces + Agent terminal tab, active highlight reflects
    activeSurface) · optional present-mode override read from ?present=true.

Block 4 · Agent terminal (build early — it's the "what it's doing" view):
  - AgentTerminal streaming agentLog line by line (JetBrains Mono, level-colored).

Block 5 · Jira surface:
  - JiraIssue + Subtasks (highlight the migration subtask) + CommentBox with a real
    submit that calls runReleasePilot('ACQ-3847'). TEST: typing the comment kicks off
    the gather sequence and the terminal streams real gather logs.

Block 6 · Confluence surface:
  - ReleasePage renders BLANK ("template not yet filled") when confluencePage is null,
    and the FULL filled page (risk score, sections, Excel attachments) once populated.
    TEST: the blank→filled transition fires when runReleasePilot completes.

Block 7 · Teams surface + GATES:
  - TeamsChannel rendering teamsMessages · AdaptiveCard with REAL buttons.
  - Gate 1 review card → [Approve] calls onApproveGate1.
  - Gate 2 advance card → [Approve] calls onApproveGate2 (triggers deploy + ReleaseWatch).
  - Gate 3 L3 card → [Acknowledge]/[Downgrade]/[Open INC] → onAcknowledge.
  TEST: the three clicks advance the whole workflow end to end.

Block 8 · ServiceNow surface:
  - ChgTicket with a state badge bound to chgState (New→Assess→Implement→Watching→
    Closed-Pending-Review) · WorkNotes · IncTicket visible once incident is set.

Block 9 · Dashboard + Deploy:
  - DashboardGrid (9 tiles from seed; credit-apply green risk 28; target tile bound to
    watchState) · WatchTile · MetricChart (inline SVG) · a small UDeploy progress panel
    for the deploying phase.

Block 10 · Watch choreography + polish:
  - Wire runReleaseWatch: pullSplunkLogs streams, metrics shift L1→L2→L3, tiles recolor,
    email indicator, RCA streams into the terminal + INC panel. CSS transitions on tiles/
    badges. Verify the full flow: comment → 3 clicks → recovery, with no console/hydration
    errors and `npm run build` clean.

After EACH block: ensure dev server runs, tell me what to click and what to look for,
wait for "looks good" or "fix X", then log the block + update PERSISTENT_MEMORY.

═══════════════════════════════════════════════════════════════════════════════
  GUARDRAILS
═══════════════════════════════════════════════════════════════════════════════
DO: real functions for gather/compute/fill/detect (not inline JSX hacks) · TypeScript
  everywhere · 'use client' on interactive components · seam comments on every mock ·
  components <150 lines · match mock1_combined.html fidelity · keep the agent module
  UI-free (pure logic + dispatch) so the "real code" is obvious in review.
DON'T: no Next-button scene reveal · no localStorage/sessionStorage · no fetch/axios ·
  no real LLM call · no router lib (App Router only) · no placeholder "TODO"/"Lorem"
  (use seed data) · don't hardcode the risk score (compute it) · don't hardcode drift
  (detect it).

═══════════════════════════════════════════════════════════════════════════════
  AFTER IT WORKS — optional, only if I ask
═══════════════════════════════════════════════════════════════════════════════
▸ ./build/flow_walkthrough.md : plain-language narration of the full flow, mapping each
  step to its production component (AgentCore / LLM Gateway / MCP Gateway / Memory /
  HITL) — our study guide for jury Q&A. Don't regenerate the Bedrock primer; point to
  ./ai-pulse-package/01_common/jury_qa_bedrock_primer.md.
▸ Deck help: ./build/deck_outline.md only if asked. Deck is HTML-first; don't build pptx
  unless I ask.

═══════════════════════════════════════════════════════════════════════════════
  BUILD_LOG + PERSISTENT_MEMORY
═══════════════════════════════════════════════════════════════════════════════
Use the formats in ./ai-pulse-package/01_common/build_log_and_memory_guide.md. The
component/block checklist in PERSISTENT_MEMORY should track the 10 blocks above. Write
the log so it reads as professional engineering evidence — it may be reviewed by judges.

WHAT TO DO RIGHT NOW: run FIRST RUN 1-9. Raise any spec contradiction in one paragraph
before coding. Otherwise summarize your understanding and wait for my go-ahead on Block 1.

Go.
````

---

## Resume prompt (new Copilot session)

```
Resume the AI Pulse functional demo build. Read ./build/PERSISTENT_MEMORY.md first, then
the last 5 entries of ./build/BUILD_LOG.md, then ./ai-pulse-package/03_path_e/
orchestration_spec.md §4-5. Tell me which block we're on and propose the next action.
Wait for my go-ahead.
```

---

## Why this beats the single HTML file (the vibe-coding point)

| Single HTML mock | This functional build |
|---|---|
| Reveals pre-baked screens on Next | Runs real orchestration code |
| Risk score is painted in | Risk score is **computed** (72/28 from a real formula) |
| Drift is a hardcoded label | Drift is **detected** (metrics compared to thresholds) |
| Approvals are scene jumps | Approvals are **real click handlers** advancing real state |
| "Looks like an app" | **Is an app** — with a build log proving how you directed Copilot |

The single-file mock (`mock1_combined.html`) remains your **fallback** — if Monday's build runs out of time, you present the mock and no one knows the difference. But the functional build is the primary deliverable, because the theme is *vibe coding*, and this demonstrates it.
