# Beacon on the Synchrony Agentic AI Platform · Agent + MCP, layered

> Same platform AI Pulse targets — AgentCore Runtime + Memory, LLM Gateway (approved Claude), MCP Gateway, A2A, HITL. Beacon's defining feature is the **two-layer** design: a governed **A2A agent** in front of a typed **MCP tool** surface over the acquisition/credit APIs.

---

## 1 · Production architecture

```
   EXTERNAL AI SHOPPING AGENT  (ChatGPT / Google / retailer assistant)
                 │  A2A: acquisition-context packet (cart, merchant, consent scope)
                 ▼
   ┌───────────────────────────────────────────────────────────────┐
   │  SYNCHRONY ACQUISITION AGENT  (AgentCore Runtime, Python)        │
   │  — the GOVERNED BRAIN; owns the regulated decision —            │
   │                                                                 │
   │  reasoning ── LLM Gateway → approved Claude                     │
   │     suitability · soft-before-hard-pull · KYC sequencing ·      │
   │     fair-lending framing · when NOT to offer                    │
   │  session  ── AgentCore Memory (cart, consent, prequal, decision)│
   │  HITL     ── consumer consent gate before any application       │
   │                                                                 │
   │  calls, in order, via  MCP GATEWAY (the typed CONTRACT):        │
   │     discover_offers → soft_prequal → verify_identity →          │
   │     submit_application → authorize_financing                    │
   └───────────────────────────────────────────────────────────────┘
                 │  each MCP tool → governed call →
                 ▼
   SYF ACQUISITION / CREDIT APIS  (Apigee · origination · identity (Prove) · tokenization)
```

**The layering, stated plainly:**
- **MCP Gateway = the contract.** Typed, governed tools (`discover_offers`, `soft_prequal`, `verify_identity`, `submit_application`, `authorize_financing`) over the acquisition APIs. This is the surface the AI ecosystem (and eventually Visa/MC/Google standards) reaches.
- **AgentCore Agent = the brain.** It decides *whether*, *which*, and *in what order* to call those tools, and owns the compliance narrative. The external agent never touches the MCP tools directly — only the Synchrony agent does.
- **Why not MCP-only?** Exposing the tools without the agent hands credit decisioning to an external model. The agent keeps the decision on Synchrony's side. **That's the governance line that wins the room.**

---

## 2 · PROD → DEMO seam map

Real orchestration, **mock data + mock reasoning**. Every mock is a one-line seam.

| Production | Demo function | Seam |
|---|---|---|
| AgentCore Runtime (the agent) | orchestrator in the browser | real logic |
| AgentCore Memory | session object (cart, consent, prequal, decision) | real (in-memory) |
| A2A in/out | `receiveA2ARequest()` / `returnToAgent()` read seed packet | `// PROD: A2A. DEMO: seed a2a_request` |
| MCP Gateway → `discover_offers` | `discoverOffers(merchant, cart)` — **REAL match** over seed | `// PROD: MCP discover_offers. DEMO: seed` |
| MCP Gateway → `soft_prequal` | `softPrequal()` returns seed, hard_pull:false | `// PROD: MCP soft_prequal. DEMO: seed` |
| MCP Gateway → `verify_identity` | `verifyIdentity()` returns seed KYC pass | `// PROD: MCP verify_identity (Prove). DEMO: seed` |
| MCP Gateway → `submit_application` | `submitApplication()` returns seed decision+line | `// PROD: MCP submit_application. DEMO: seed` |
| MCP Gateway → `authorize_financing` | `authorizeFinancing()` returns seed token | `// PROD: MCP authorize_financing. DEMO: seed` |
| LLM Gateway → Claude (reasoning) | `reasonFunnel()` returns seed reasoning | `// PROD: LLM Gateway→Claude. DEMO: deterministic` |
| HITL consent gate | a **real consent click** | real (UI button) |
| Production language: Python | demo language: TypeScript/React | stated on slide |

**"What's real?"** The A2A orchestration, the offer-matching, the funnel sequencing (soft→consent→KYC→decision→authorize), the consent gate, and the audit trail are real code. Only the *tool return data* (seed) and the *reasoning narrative* (deterministic) are mocked — each a one-line swap to the MCP Gateway / LLM Gateway in production. **The demo renders each MCP tool call on screen**, so the agent-over-MCP architecture is literally visible.

---

## 3 · The one genuinely-real computation (credibility piece)

```ts
// REAL — picks the applicable program or returns decline. (the discover_offers brain)
function discoverOffers(merchantId: string, cartTotal: number) {
  const offers = seed.discover_offers_result.applicable.filter(o =>
    o.applies && o.merchant_ok(merchantId) && (o.min_purchase_usd ? cartTotal >= o.min_purchase_usd : true)
  );
  if (offers.length === 0) return { decision: 'decline', reason: 'No Synchrony program applies at this merchant.' };
  return { decision: 'offer', program: offers.sort((a,b)=>(b.term_months??0)-(a.term_months??0))[0] };
}
// HomeWorks $1,399 → Home Card 0%/18mo ;  BargainBox $720 (non-partner) → decline  ← the contrast, computed
```

Flip the merchant and the agent genuinely declines — the funnel never starts. That's the judgment moment, computed not scripted.

---

## 4 · Honest production caveats
- **Standards in flight** (Visa/MC/Google agent-payment + the soon-to-exist agent-acquisition standards) — the demo mocks token + decision exchange.
- **Credit decisioning is regulated** — demo enforces soft-pull-before-consent, KYC-before-decision, a decline path, and never claims a real decision.
- **Close to SYF's real work** — frame as a focused prototype of the *acquisition* slice + a clean A2A/MCP contract.
