# Build Beacon · End-to-End Build Prompt (for an independent builder)

> **What this is:** a self-contained prompt another person pastes into GitHub Copilot (Agent mode) or Claude Code to build the **functional Beacon demo** with no further context. It builds a real, working **agentic credit-acquisition** demo: an external AI shopping agent hands off (A2A) to the **Synchrony Acquisition Agent**, which runs the acquisition funnel by calling **MCP tools** in order (`discover_offers → soft_prequal → [consent] → verify_identity → submit_application → authorize_financing`), takes ONE real consent click, and completes a financed purchase on a brand-new account. **Mock data + mock reasoning; real orchestration; visible MCP tool calls.**
>
> **Read alongside:** `IDEA.md` (concept + the agent-vs-MCP answer), `platform_mapping.md` (agent+MCP architecture + seams), `mock_data_seed.json` (data). `beacon_mock.html` is the visual target and shippable fallback.

---

## The principle (read twice)
**Mock data ≠ mock app.** Mock the INPUTS (seed JSON instead of live MCP/acquisition APIs) and the REASONING (deterministic instead of a live LLM). Do NOT mock the machinery: the A2A handoff, the offer matching, the funnel sequencing (soft-pull → consent → KYC → decision → authorize), the consent gate, and the audit trail are real code. Mark every mock: `// PROD: <platform call>  // DEMO: <seed read>`. **Render each MCP tool call on screen** so the agent-over-MCP architecture is visible.

---

## The prompt (copy from here to the end → paste into your AI builder)

````markdown
You are the build co-pilot for "Beacon" — a hackathon/leadership demo of AGENTIC CREDIT
ACQUISITION for Synchrony. Build a REAL, WORKING two-pane demo in
TypeScript/React/Next.js. NOT a click-through mockup.

THE STORY: an external AI shopping agent hands off (A2A) to the Synchrony Acquisition
Agent. The shopper has NO Synchrony account yet and wants to finance a purchase. The
Acquisition Agent runs the acquisition funnel by calling MCP tools IN ORDER:
discover_offers → soft_prequal → [HUMAN CONSENT] → verify_identity → submit_application
→ authorize_financing. It opens a NEW account, finances the purchase, and completes
checkout in-conversation. Only DATA (seed JSON) and the REASONING (deterministic) are
mocked. The agent owns the regulated decision; MCP is the typed tool layer it calls.

Reference (read-only): ./commerce-package/. Your code: ./beacon-demo/.
Authoritative architecture: ./commerce-package/platform_mapping.md.
Data: ./commerce-package/mock_data_seed.json. Concept: ./commerce-package/IDEA.md.
Visual target + fallback: ./commerce-package/beacon_mock.html.

BEHAVIOR: direct, concise, architect-grade. Push back on contradictions. Log every
block in ./build/BUILD_LOG.md (a judged deliverable).

THE PRINCIPLE: Mock data ≠ mock app. Mock the tool RETURNS (seed) and the reasoning
NARRATIVE (deterministic). Do NOT mock the orchestration, the offer matching, the funnel
sequencing, the consent gate, or the audit trail. Mark every mock
`// PROD: <MCP/LLM Gateway call>  // DEMO: <seed read>`. RENDER each MCP tool call in the
agent pane (a labeled "MCP" row with the function + return).

KEY ARCHITECTURE POINT (don't lose this): the external agent talks A2A to the Synchrony
agent; the Synchrony agent calls the MCP tools. The external agent NEVER calls the MCP
tools directly. The agent owns suitability, soft-before-hard-pull, KYC sequencing,
fair-lending framing, and when-not-to-offer.

LOCKED DECISIONS:
- Stack: Next.js 14+ App Router · React 18 · TypeScript · Tailwind (.ts config) ·
  lucide-react · useReducer+Context · no backend · no fetch · no browser storage ·
  no LLM call (reasonFunnel() returns the seed reasoning at a marked seam).
- Two-pane: LEFT = consumer AI shopping chat; RIGHT = Synchrony Acquisition Agent showing
  A2A inbound, reasoning, and the MCP TOOL CALLS it makes, plus a Confidence panel of the
  5 regulated guardrails.
- ONE real consent click drives the application (HITL): no hard pull / no application
  until the shopper consents. Hidden ?present=true adds a stage-safety advance; consent
  gate still works by real click.
- Brand tokens (match beacon_mock.html; don't invent others):
  syf.yellow #FFCE32 · yellow-deep #E0B520 · navy #002856 · black #0a0e14 ·
  panel #131820 · panel-2 #1a2230 · ink #f0f2f5 · dim #9da9b8 · faint #6b7785 ·
  danger #ff6b6b · warning #ffb454 · success #7fd99b · beacon #FFCE32 · shop #5b8fc7 ·
  mcp #7fb0d9. Fonts: Inter + JetBrains Mono. Dark only. Yellow sparse. NEVER purple/cyan.

FIRST RUN:
1. Verify ./commerce-package/platform_mapping.md and mock_data_seed.json exist; if not,
   stop and say so.
2. Read platform_mapping.md (architecture + seams), IDEA.md (the agent-vs-MCP answer),
   and the seed. Summarize understanding in 6 bullets before coding.
3. Bootstrap:
     npx create-next-app@latest beacon-demo --typescript --tailwind --app --no-src-dir --eslint --no-import-alias
     cd beacon-demo && npm install lucide-react
   Copy seed to src/lib/data/seed.json. Create src/lib/{agent,state}/, src/types/,
   src/components/{shell,shop,beacon,shared}/.
4. Apply brand tokens to tailwind.config.ts; load fonts in app/layout.tsx.
5. npm run dev → confirm 200. Create ./build/BUILD_LOG.md.
6. Report readiness for Block 1 and wait for go-ahead.

BUILD SEQUENCE (wait between blocks; build the BRAIN before the UI):

Block 1 · Types + Agent module (THE REAL CODE):
  - src/types/: SessionState, Phase, A2ARequest, Offer, Prequal, KycResult, Decision,
    TokenizedAuth, ToolCall, AuditEntry, ChatMessage.
  - src/lib/agent/a2a.ts: receiveA2ARequest() / returnToAgent() (seed; seams).
  - src/lib/agent/mcp.ts: the MCP tool wrappers, each logging a ToolCall into state and
    each marked as a seam:
      discoverOffers(merchantId, cartTotal)  → REAL: filter seed applicable offers by
        merchant + applies + min-purchase floor; rank by longest 0% term; else
        {decision:'decline'}. (Verify HomeWorks→Home Card, BargainBox→decline via console
        assertion BEFORE any UI.)
      softPrequal()        → seed prequal, hard_pull:false
      verifyIdentity()     → seed KYC pass (comment: Prove InstantLink in prod)
      submitApplication()  → seed decision (approved, $2,000 line, new account)
      authorizeFinancing() → seed tokenized auth
  - src/lib/agent/orchestrator.ts: runAcquisition() = receiveA2ARequest → discoverOffers →
    (if decline, stop and post decline) → softPrequal → present offer → WAIT for consent →
    onConsent(): verifyIdentity → submitApplication → authorizeFinancing → complete. Each
    step logs a ToolCall + streams into the agent pane with small delays. reasonFunnel()
    returns seed reasoning (seam: LLM Gateway→Claude).
  TEST: assert discoverOffers returns Home Card for HomeWorks and decline for BargainBox
  BEFORE any UI. Log it.

Block 2 · State + Context: phase reducer (idle → a2a → discover → prequal →
  offer_presented → [CONSENT] → kyc → decision → authorize → completed; + declined
  branch). DemoContext + useBeacon hook. toolCalls[] and auditLog[] live in state.

Block 3 · Shell + two-pane layout: left ShopPane, right AgentPane, thin A2A connector
  that animates on handoff. Optional ?present=true override.

Block 4 · Shop pane: ChatThread (seed chat_script, progressive); ConsentCard with a REAL
  "Yes, apply & finance" button (calls onConsent). Make clear no application happens
  before consent.

Block 5 · Agent pane (the differentiator): A2AInbound badge, ReasoningLine(s), and a
  ToolCallRow component that renders each MCP call as a labeled "MCP" row (function +
  return), color-coded (gate = consent-related, approve = decision, decline = contrast).
  ConfidencePanel with the 5 regulated guardrails lighting up as satisfied.

Block 6 · Wire + contrast + polish: shopper request kicks off runAcquisition; consent
  click resumes it; add a "Try non-partner merchant" control that re-runs with BargainBox
  so discoverOffers returns decline and the agent refuses to start an application.
  Transitions on connector + rows. Verify npm run build clean, no console/hydration errors.

GUARDRAILS:
DO: real functions for a2a/mcp/orchestrator (not inline JSX) · TypeScript everywhere ·
  'use client' on interactive components · seam comments on every mock · render every MCP
  tool call · components <150 lines · match beacon_mock.html fidelity · keep the agent
  module UI-free.
DON'T: no scene-reveal mock (build orchestration) · no localStorage/sessionStorage ·
  no fetch/axios · no real LLM call · don't hardcode the offer or the decision (compute
  via discoverOffers / sequence via orchestrator) · don't let the external agent call MCP
  tools directly (only the Synchrony agent does) · no real PII/decisioning/card numbers ·
  no purple/cyan gradients.

WHAT TO DO NOW: run FIRST RUN 1–6, raise any contradiction in one paragraph, else
summarize understanding and wait for go-ahead on Block 1. Go.
````

---

## Resume prompt (new session)
```
Resume the Beacon functional demo. Read ./build/BUILD_LOG.md (last 5 entries) and
./commerce-package/platform_mapping.md §1–3. Tell me which block we're on and propose
the next action. Wait for go-ahead.
```

---

## Why this beats a static mock (the vibe-coding point)
| Static mock | This functional build |
|---|---|
| Reveals pre-baked screens | Runs real A2A + MCP-tool orchestration |
| Offer/decision painted in | Offer **computed** (discoverOffers); funnel **sequenced** by the orchestrator |
| Decline is a scripted screen | Decline **returned** by discoverOffers for non-partner merchants |
| Consent is a scene jump | Consent is a **real click** gating the application/hard-pull |
| "It has tools" | **Shows the agent calling MCP tools in order** — the governance story, visible |

`beacon_mock.html` stays the **fallback** — identical on screen if the build runs short.
