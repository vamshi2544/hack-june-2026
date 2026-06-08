# Beacon · Synchrony's Credit Acquisition, Exposed to the AI Agent Ecosystem

> **What this is.** When shopping moves into AI agents, the *credit application* has to move with it. Beacon is the capability Synchrony exposes so that an external AI shopping agent can open a Synchrony account and finance a purchase **inside the conversation** — while Synchrony keeps full ownership of the regulated credit decision. Anchored in the acquisition / credit-application domain.
>
> **Tagline:** "From conversation to confidence — open the line, finance the buy, inside the agent."
>
> **Origin note.** This concept was researched in June 2026 and shelved when the team pivoted back to ReleasePilot. This version re-centers it on the acquisition-APIs domain and answers the agent-vs-MCP question.

---

## 1 · The strategic bet (why leadership cares)

Synchrony's #1 stated priority is agentic commerce (CEO Brian Doubles, Q1 2026: *"the more important of the two… first-mover advantage"*). The growth engine underneath it is **new account originations** (15% in the quarter). Put those together and the sharpest question is:

> **When a shopper is inside an AI agent and needs financing they don't yet have — can they open a Synchrony account and use it without leaving the conversation, and without Synchrony losing control of the credit decision?**

Today the answer is no: the AI hands off to a web application flow, the shopper drops, and the origination is lost (or captured by whoever's financing the AI surfaces by default). Beacon makes the answer yes. **This is agentic *acquisition*, not just agentic checkout** — and acquisition is the metric leadership tracks.

---

## 2 · The agent-vs-MCP answer (the core architecture question you raised)

You remembered the idea as "expose a SYF agent to provide credit/financing — not sure if agent or MCP or both." The answer, for a regulated lender, is **both, layered — with the agent as the hero:**

| Layer | What it is | Why it must exist |
|---|---|---|
| **MCP tools** (the contract) | Typed, governed tools SYF exposes: `discover_offers`, `soft_prequal`, `verify_identity`, `submit_application`, `authorize_financing` | This is how SYF becomes "easy for the AI to understand and act on," and how it eventually plugs into Visa/MC/Google agent-payment standards. |
| **A2A Acquisition Agent** (the brain) | A Synchrony agent the external agent delegates to, that calls the MCP tools *in the right order* | An external model **cannot** be trusted to make or frame a regulated credit decision — suitability, soft-before-hard-pull, KYC sequencing, fair-lending language, when-not-to-offer. That judgment must run on **Synchrony's** model. |

**The flow:**
```
external shopping agent ──A2A──▶ Synchrony Acquisition Agent ──MCP tools──▶ SYF acquisition / credit APIs
                                  (owns the regulated decision)        (Apigee / origination services)
```

MCP alone = you've handed credit decisioning to someone else's model. The agent in front of MCP = Synchrony keeps the decision and the compliance narrative. **That governance line is the whole pitch** for a credit-apps audience.

---

## 3 · What Beacon does (the acquisition funnel, inside an agent)

A shopper in an AI agent wants a $1,399 fridge at a Synchrony Home partner and wants to finance it — but has **no Synchrony account yet**. The shopping agent hands off (A2A); the Acquisition Agent runs the funnel via MCP tools:

1. **`discover_offers`** — which SYF program/card applies (Home Card, 0% for 18 months on $499+).
2. **`soft_prequal`** — soft pull only → pre-qualified up to $2,000. *No hard inquiry, no application yet.*
3. **Consent gate (HITL)** — the shopper must explicitly agree before any application or credit check. *(The "confidence" moment.)*
4. **`verify_identity`** — KYC via a mobile identity link. *(In production this is the Prove InstantLink pattern from the acquisition POC.)*
5. **`submit_application`** — full decision → **approved, $2,000 line, new Synchrony account opened**.
6. **`authorize_financing`** — tokenized authorization for the $1,399 purchase; checkout completes in-conversation.

Result: a **new origination** and a completed financed purchase, entirely inside the AI conversation, with Synchrony owning every regulated step.

**Contrast beat:** point it at a non-partner merchant and `discover_offers` returns nothing → the agent **declines** ("no Synchrony program applies; I won't start an application here"). Judgment, not always-yes — exactly what a fair-lending-minded judge wants to see.

---

## 4 · The demo (4 minutes; leadership- or judge-ready)

Two-pane screen, mock data + mock reasoning, **one real consumer consent click**:
- **Left** = the consumer's AI shopping chat.
- **Right** = the Synchrony Acquisition Agent: the A2A inbound, the reasoning, and — critically — **the MCP tool calls it makes** (`discover_offers` → `soft_prequal` → [consent] → `verify_identity` → `submit_application` → `authorize_financing`), each shown as a governed tool. A **Confidence panel** fills as the regulated guardrails are satisfied.

Showing the MCP tool calls explicitly is what makes the "agent + MCP, both layered" architecture *visible* — and proves Synchrony owns the decision.

---

## 5 · Why it wins / honest weaknesses

**Wins:** sits on the CEO's #1 priority *and* the origination growth metric; it's in your actual domain (acquisition APIs), so the pitch is lived, not theoretical; it demos the governance story (soft-before-hard, KYC, decision-on-SYF's-model) that a regulated audience respects; same platform as AI Pulse (AgentCore + MCP Gateway + LLM Gateway → Claude).

**Weaknesses (say them first):** close to SYF's real in-flight "Synchrony Agent" work — frame Beacon as a focused prototype of the *acquisition* slice + a clean A2A/MCP contract, not a claim to have built the roadmap. Agent-payment standards are unsettled — the demo mocks the token exchange. Credit decisioning is heavily regulated — the demo shows soft-pull-before-consent, KYC-before-decision, and a decline path, and never claims a real credit decision.

---

## 6 · Beacon vs AI Pulse (so you can choose after tomorrow)

| | **Beacon (agentic acquisition)** | **AI Pulse (ReleasePilot + ReleaseWatch)** |
|---|---|---|
| Altitude | Highest — CEO priority + originations metric | High — real engineering pain, crowded category |
| Your domain | **Yes — acquisition / credit-app APIs** | Yes — release lifecycle |
| Architecture story | Agent + MCP, both layered, governed decision | A2A + Memory + Gateways |
| Buildability in window | Medium (new build; hand off via the prompt) | High (you own it, specs done) |
| "We already do this" risk | Higher | Lower |
| Leadership demo fit | **Very strong** | Strong |

Both ride the same platform, so whichever you pick, the architecture story is consistent.

---

## 7 · Package contents
- **IDEA.md** — this document.
- **platform_mapping.md** — Beacon on the Synchrony Agentic AI Platform; the agent + MCP layering; PROD→DEMO seam map; the real `discoverOffers()` matcher.
- **beacon_mock.html** — playable two-pane visual (chat + agent showing its MCP tool calls + Confidence panel + decline contrast). Visual target and shippable fallback.
- **build_beacon_demo_prompt.md** — end-to-end build prompt for an independent builder (functional demo: mock data + mock reasoning, real orchestration, real consent click, visible MCP tool calls).
- **mock_data_seed.json** — fictional fixtures (shopper, cart, MCP tools, funnel, decision, audit). No real PII / decisioning / card numbers.
