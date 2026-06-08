# Jury Q&A + Bedrock AgentCore Primer

> **Purpose:** Two things. First, a fast primer on the Bedrock AgentCore concepts we're now building on (we're not deeply familiar — this closes the gap). Second, the expected jury questions with crisp, confident answers. Read both before Tuesday. Any team member should be able to field these.

---

# Part 1 · Bedrock AgentCore primer (what you need to know)

You don't need to be an AWS expert. You need enough vocabulary to speak confidently about the platform your agents run on. Here's the minimum.

## What is Amazon Bedrock?

AWS's managed service for foundation models (LLMs). You call models like Claude, Nova, and others through one API without managing infrastructure. Think of it as a governed gateway to multiple LLMs with enterprise controls (IAM, logging, guardrails).

## What is Bedrock AgentCore?

The agent layer on top of Bedrock. It's the set of primitives for building, running, and governing **agents** (not just single LLM calls). Announced/expanded through 2025 as AWS's answer to "how do enterprises run production agents safely." The pieces that matter for us:

| AgentCore primitive | Plain English | Our use |
|---|---|---|
| **Runtime** | Where an agent's code executes (serverless) | ReleasePilot + ReleaseWatch run here |
| **Memory** | Durable state an agent can read/write across invocations | The risk packet + watch state |
| **Gateway** | Governed access from agents to tools/APIs | Reaching Jira, ServiceNow, etc. |
| **Identity** | The agent's authenticated identity for least-privilege access | Authorization for resource calls |
| **Knowledge Base** | Retrieval over documents/data (RAG) | Past incident history |
| **Evaluations** | Scoring agent output quality | RCA quality + confidence calibration |
| **Observability** | Tracing agent reasoning (via CloudWatch GenAI) | Monitoring the agents in prod |
| **Browser / Code Interpreter** | Agent can browse web / run code | Not needed for us |
| **Policy** | Guardrails on what the agent may do | Bounds our agents' actions |

## What is A2A?

**Agent-to-Agent** communication — a protocol/pattern for one agent to hand work to another. In our design, ReleasePilot finishes pre-deploy work and hands the **risk packet** to ReleaseWatch via A2A. The payload is the risk packet; it's persisted in AgentCore Memory so ReleaseWatch can read it even if invoked later. (A2A is an emerging open protocol; on this platform it's a named runtime capability.)

## What is MCP?

**Model Context Protocol** — an open standard (originated by Anthropic) for connecting LLMs/agents to tools and data sources through a uniform interface. Instead of writing a custom integration per system, you expose each system as an MCP server and the agent calls them uniformly. On the Synchrony platform, the **MCP Gateway** is how agents reach Jira, ServiceNow, Confluence, Bitbucket, Splunk, New Relic.

## What is the LLM Gateway (in this platform)?

A routing layer that sends LLM calls to approved models (Claude, Nova, GPT) with governance — logging, cost control, model selection. The key fact for us: **Claude is an approved model**, so we don't need a personal API key; we route through the gateway.

## How our agents would actually run (production, conceptually)

1. An event (Jira webhook, deploy completion) lands on the platform.
2. AgentCore Runtime invokes ReleasePilot (Python, using the AgentCore SDK / a framework like Strands Agents).
3. ReleasePilot calls tools through the MCP Gateway (pull Jira story, past INCs) and reasons via Claude through the LLM Gateway (synthesize risk packet).
4. It writes the risk packet to AgentCore Memory and hands off to ReleaseWatch via A2A.
5. After deploy, ReleaseWatch reads the risk packet from Memory, pulls live metrics via MCP Gateway, reasons via Claude, and escalates.
6. Human approvals happen through the platform's HITL primitive.
7. Everything is traced via CloudWatch GenAI Observability.

You don't need to know the SDK syntax. You need to know this flow and which primitive does what.

## The honest "we're still learning Bedrock" line

If pressed on a deep AWS detail you don't know:

> "We're early on the AgentCore specifics — our depth is in the release-domain problem and the agent design. The platform primitives map cleanly to our architecture: Runtime for the agents, A2A for the handoff, Memory for the risk packet, LLM Gateway for Claude, MCP Gateway for data. We'd lean on the platform team for the AgentCore SDK specifics in implementation."

That's honest, confident, and shows you know the shape without overclaiming. Judges respect "here's what we know and here's where we'd partner" over bluffing.

---

# Part 2 · Expected jury questions + answers

Grouped by theme. Each answer is crisp — say it in 2-4 sentences, then stop.

## On the platform fit

**Q: How does this fit our agentic AI platform?**
A: Native fit. Two agents on AgentCore Runtime, handing off via A2A with the risk packet as payload in AgentCore Memory. Reasoning on Claude through the LLM Gateway. Data through the MCP Gateway — Jira, ServiceNow, Confluence, Splunk, New Relic, all already in your connector catalog. Human approvals via the HITL primitive. We designed for the platform, not around it.

**Q: Why two agents instead of one?**
A: A2A is a first-class platform capability, and the two phases have clean ownership boundaries — ReleasePilot owns pre-deploy, ReleaseWatch owns post-deploy. The handoff via risk packet is the architectural insight: it's what makes post-deploy monitoring contextual instead of generic. And ReleaseWatch can run independently for manual deploys, reading a human-authored risk packet.

**Q: Why Claude specifically?**
A: The L3 RCA is deep cross-system reasoning — correlating live metrics, past incidents, and code diffs against release intent. That's where Claude's reasoning quality matters most. For cheaper high-frequency work like hourly L1 checks, we'd route to Nova through the same gateway. Right model for the right task.

## On the demo's honesty

**Q: Is this real or a mockup?**
A: The demo is a TypeScript prototype of the agent experience — we vibe-coded it with GitHub Copilot so we could show the full flow in four minutes. Production runs in Python on AgentCore with Claude through the LLM Gateway. The architecture maps one-to-one; the demo shows the behavior and reasoning. We have a slide showing exactly what's real vs simulated.

**Q: Why didn't you build it on the actual platform?**
A: We don't have platform access in the 24-hour window, and a live agent round-trip isn't demoable in four minutes anyway. So we focused on proving the agent's behavior and the architecture fit. The prompts you'd run on the platform are real — we can show the actual L3 RCA prompt.

**Q: The RCA — is the LLM generating that live?**
A: In the demo it's pre-rendered streaming text, because we can't reach the LLM Gateway from here. But the prompt that produces it is real and tested — we ran it against Claude this weekend and it produces this RCA at this confidence. In production it streams live from Claude through the gateway.

## On the AI value

**Q: How is this different from existing AIOps / monitoring?**
A: Existing monitoring catches anomalies per system — each dashboard, each threshold, in isolation. We catch the relationship across systems by reading the release intent. The producer looks healthy, the consumer looks degraded; current tools show two separate signals, we show one failure. The risk packet — knowing what the deploy intended to change — is what no AIOps tool has.

**Q: How accurate is the RCA? What if it's wrong?**
A: The confidence score is calibrated across three weighted factors: live evidence, past-incident pattern match, and code-diff plausibility, capped at 0.95 — we never claim certainty. And the agent never takes the major action: humans approve at every gate, and the L3 card always offers Downgrade. If it's wrong, the human downgrades, the audit trail captures the agent's reasoning, and AgentCore Evaluations flags it for tuning.

**Q: What stops alert fatigue?**
A: Drift is classified against the risk packet's explicit expectations — a +12ms producer latency the release predicted doesn't fire; a +340% consumer latency it didn't predict does. And before paging, the agent checks for an active incident on the same app and window — if one exists, it appends rather than double-paging.

**Q: What's the measurable value?**
A: In our scenario, 57 minutes from drift detection to recovery. Without cross-system correlation, that same incident is 3+ hours of on-call chasing the wrong system — we've all done it. Multiply by every release and every after-hours deploy. The agent gives on-call a 60-minute head start on the releases that go wrong.

## On the architecture

**Q: Why Python?**
A: It's the AgentCore agent SDK language, and the orchestration is LLM-heavy — composing context, parsing structured output, function-calling — where Python's ecosystem is most mature. The service is small; runtime choice doesn't affect platform standards.

**Q: How does the agent get data without tight coupling to each system?**
A: Through the MCP Gateway. Each source — Jira, ServiceNow, Splunk — is exposed as an MCP server, and the agent calls them through a uniform interface. We're not writing bespoke integrations per system; we're using the platform's connector catalog.

**Q: Where does state live?**
A: AgentCore Memory holds the risk packet and watch state. The source of truth for artifacts is the system of record — ServiceNow for the CHG/INC, Confluence for the release page. The agent doesn't introduce a new database; it writes to the systems teams already use.

**Q: How do you handle the handoff if ReleaseWatch is invoked much later?**
A: The risk packet persists in AgentCore Memory and on the Confluence release page. ReleaseWatch reads it on wake, regardless of how long after the pre-deploy phase. The handoff is durable, not a live message.

## On scope and safety

**Q: What's in scope vs out?**
A: In scope: the acquisition API release family, the full pre-deploy-to-recovery lifecycle, cross-system reasoning on producer/consumer and migration-dependency patterns. Out of scope for the demo: the agent taking remediation actions itself (humans do that), and systems outside the release path. The agent does the homework; humans decide.

**Q: How do you keep humans in control?**
A: Three approval gates via the platform HITL primitive: review the curated release info before publish, approve the CHG advance, acknowledge or downgrade the L3 escalation. The agent never advances a major decision without a human. Everything between gates is automated; the gates are where judgment stays human.

**Q: What about security / data governance?**
A: Inherited from the platform — Okta and SailPoint for identity, guardrails and content moderation in the AI/Agent Gateway, CloudTrail and VPC for audit and isolation, AgentCore Identity for least-privilege resource access. We don't build security; we run inside the platform's governance.

## On feasibility

**Q: How long to build this for real?**
A: The agent logic is modest — the two agents are a few hundred lines of Python each plus the four prompts, which are written and tested. The integration is the work: MCP connectors to the real systems and the event wiring. With platform access and the connectors already in the catalog, this is weeks, not months.

**Q: What's the hardest part?**
A: Calibrating the risk packet and the drift thresholds per application family. The cross-system reasoning is only as good as the expected-drift contract. That's where AgentCore Evaluations earns its place — tuning confidence calibration against real incident outcomes over time.

**Q: Could this catch failures that happen days after a release, not just in the window?**
A: Not in this version — ReleaseWatch is deliberately scoped to the release window, so it stays accountable to a specific deploy. The same reasoning engine running continuously is our MVP 2, "Production Watch." A RabbitMQ cluster slowly exhausting memory a week after a deploy is exactly that continuous-monitoring case — real, but out of scope for a release agent. Knowing that boundary is part of the design.

**Q: What would you do next if you won?**
A: Pilot on one application family with a human-in-the-loop on every escalation, measure RCA accuracy and time-to-recovery against the baseline, tune the risk packet templates, then expand. The HITL gates make a cautious rollout safe.

---

## The three things to never do in Q&A

1. **Don't bluff AWS depth you don't have.** Use the honest "we're early on AgentCore specifics, deep on the problem" line.
2. **Don't undersell the demo.** It's a deliberate prototype of the experience, not a thing you "didn't finish." Frame it as a choice.
3. **Don't relitigate Studio.** If anyone references an earlier Microsoft-flavored version, just say "we aligned the architecture to the Agentic AI Platform — it's a cleaner fit." Move on.

---

*Read Part 1 once to close the Bedrock gap. Skim Part 2 the morning of. Each team member should be able to field any question here in their own words.*
