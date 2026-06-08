<!-- SUPERSEDED-BANNER: REFERENCE ONLY (6-8 min). Use pitch_script_4min.md for Tuesday. Old scenario references inside. -->
> ⚠️ **REFERENCE ONLY (6-8 min). Use pitch_script_4min.md for Tuesday. Old scenario references inside.**

# Pitch Script · Live Demo Narration

> The spoken words during the Tuesday demo. Same story, two variants of the scene-by-scene narration depending on path commitment.

## Structure of the 8-min pitch

```
0:00 – 1:30   Problem framing + value prop          (slides 1-4)
1:30 – 7:00   Live demo walkthrough                  (slides 5-13 OR live UI)
7:00 – 8:00   Architecture + close                   (slides 14-16)
```

If you need to cut for a 4-min pitch (Idea 2 framing), drop scenes 4-5 (Confluence + first approval gate).

---

## Opening (0:00 – 1:30) · Same for both paths

> "Releases at Synchrony — and at every company building backend platforms — fail in predictable ways. Not because engineers are careless. Because the failure signal is spread across six systems. The producer says 'I'm fine.' The consumer says 'I'm slow.' RabbitMQ says 'memory at 87%.' Each system has its own monitoring. Nothing reads them together. At 2 AM on a Sunday, this gap kills response time.
>
> AI Pulse built a two-agent system that closes the gap. **ReleasePilot** does the pre-deploy homework — what's risky about this release, what failure modes are likely, what to watch for. **ReleaseWatch** does the post-deploy monitoring — but with the context ReleasePilot just gathered. The hand-off is a structured risk packet that becomes part of the release page. The agents share an audit trail. The humans approve the major decisions. The team stays in control.
>
> What you're about to see is the full release lifecycle in 6 minutes. Tomorrow morning at 2 AM, with this running in production, the on-call engineer gets 60 minutes of head start they used to spend chasing the wrong system."

---

## Demo walkthrough (1:30 – 7:00)

### Variant for Path B (real surfaces)

> "I'm going to drive between real Jira, real Teams, and real SharePoint. The agent we built is a Copilot Studio agent published to our Teams channel. The artifacts you see — release page, CHG, INC — are real SharePoint and SNOW-mocked surfaces. Nothing is pre-recorded.
>
> **(Scene 1)** Here in Jira is a closed story — ACQ-3847. Developer comments `@release-pilot go`. **(switch to Teams · 5 second wait while Adaptive Card lands)** Adaptive Card just appeared in our release-pilot channel. PowerAutomate-routed from Jira. The agent acknowledges.
>
> **(Scene 2)** While the agent works, here's what it's doing: reading the Jira story and 4 subtasks. Querying past INCs for this application family — last 180 days. Resolving downstream applications via the service catalog. Drafting a structured risk packet.
>
> **(Scene 3)** Risk packet's done. **(switch to SharePoint release page)** Here's the Confluence-equivalent release page the agent just generated. Scope. Deployment plan. Change list. And most importantly — the risk packet section. Three past INCs reviewed. Two flagged HIGH relevance because they share the failure mode this release could trigger. Four known failure modes for this app family. Two downstream apps to watch. And expected metric shifts — `+15ms producer latency expected, anything beyond +25ms is unexplained`. This litmus test is what ReleaseWatch reads after deploy.
>
> **(Scene 4)** Approval gate 1. **(switch to Teams · click Approve)** The on-call engineer reviews the page, hits approve. The CHG advances from New to Assess.
>
> **(Scene 5)** Approval gate 2. **(switch to SharePoint CHG · click second Approve)** Approve to advance to Implement. The deploy pipeline takes over.
>
> **(Scene 6)** Deploy completes. **(switch to the Watch dashboard)** Now we're in ReleaseWatch's world. The dashboard shows every release being watched. Nine right now. Most are clear. Watch this one — CHG0049182 — that's our deploy. First hour: clear. L1 status posted in Teams. Producer latency up 12ms, within the +25ms tolerance from the risk packet.
>
> **(Scene 7)** Hour 2. **(metric drift animates)** Consumer latency just spiked 340%. Consumer throughput dropped 78%. The risk packet said consumer behavior shouldn't change. This is unexplained. ReleaseWatch escalates to L2 amber. Email to the on-call DL. Teams alert in release-watch-acquisition. 15-minute update cadence starts.
>
> **(Scene 8)** 30 minutes later, the pattern persists. L3 escalation. **(L3 RCA streams in)** Watch the RCA stream: cross-system reasoning. The producer 'looks healthy in isolation.' The consumer 'looks degraded in isolation.' Together: the textbook backpressure-starvation pattern. The risk packet listed this exact failure mode. Past INCs INC0218763 and INC0223440 had the same root cause. Bitbucket diff shows commit a7f3c19 added persistent messaging, which triples memory pressure. RabbitMQ is at 92% — high watermark exceeded. Confidence: 81%.
>
> **(Scene 9)** Adaptive Card in Teams. **(click Acknowledge)** On-call Anisha clicks Acknowledge. INC stays open for audit. Cadence relaxes. **(Anisha's reply appears)** She rolls back the commit. Five minutes later, metrics recover. **(tile turns green)** Watch closes. Audit trail preserved. Post-mortem next morning."

### Variant for Path E (local React app)

> "I'm going to drive a local Next.js app that mocks Jira, Confluence, ServiceNow, Teams, and our ReleaseWatch dashboard. The agent reasoning you'll see is identical to what runs in Copilot Studio in production — we'll show the actual prompt later. The data is pre-seeded; the workflow is real.
>
> *(same scene narration as Path B above · just adjust the surface references — 'here's the Jira mock' instead of 'real Jira', 'here's the Confluence mock' instead of 'real SharePoint')*
>
> *Optional add at scene 8:* **(switch to separate browser tab with Claude/ChatGPT)** Here's the actual L3 RCA prompt running live. **(paste prompt · LLM streams response)** This is the same prompt that would run in Copilot Studio. The response is generated by the LLM right now. The architecture slide will show how this fits production."

---

## Closing (7:00 – 8:00) · Same for both

> "What we just built is a working pattern, not a polished product. The architecture slide shows where it goes from here.
>
> **(slide 14 · production architecture)** In production: ReleasePilot wakes from Jira via Power Automate. The Studio agent uses real ServiceNow connectors. The risk packet flows into Confluence. ReleaseWatch consumes New Relic and Splunk metrics natively. Adaptive Cards in Teams.
>
> The pattern that matters isn't the wiring. It's the three principles:
>
> 1. **Two agents share an artifact.** ReleasePilot writes the risk packet. ReleaseWatch reads it. The handoff lives in the artifact, not in the infrastructure. State recovery is automatic.
>
> 2. **Humans approve major decisions, not minor ones.** Three approval gates: review curated info, advance CHG, acknowledge L3. Everything between is automated. The agent doesn't decide; it does the homework so humans can decide fast.
>
> 3. **Cross-system reasoning over per-system thresholds.** The agent reads metrics from multiple systems, compares against release-intent expectations, and detects relationship failures (producer healthy + consumer degraded). Today's monitoring catches the symptoms separately. This catches them as one pattern.
>
> AI Pulse · ReleasePilot + ReleaseWatch. From comment to confidence. We're done."

---

## Pitch timing target

| Section | Target | Hard limit |
|---|---|---|
| Opening | 1:30 | 2:00 |
| Demo | 5:00 | 6:00 |
| Closing | 1:00 | 1:30 |
| Total | 7:30 | 9:00 |

If running long, cut scenes 4-5 (the pre-deploy approval gates) and compress the narration. Don't cut the L3 RCA moment — that's the headline.

## Things NOT to say

- "We didn't have time to..." (everyone already knows · don't apologize)
- "This isn't real, but..." (you set the framing · don't undermine it)
- "Copilot Studio doesn't support..." (technical complaints in a pitch undermine credibility)
- "What if we had Power Automate Premium" (focus on what you built, not what you didn't)
- Anything Synchrony-confidential

## Things to say if asked

**Q: "How does this compare to existing AIOps tools?"**
A: "Today's AIOps catches anomalies per system. This catches relationships across systems by reading the release intent and detecting drift against it. The risk packet handoff is the differentiator — most AIOps tools don't know what the deploy was trying to change."

**Q: "What's the cost?"**
A: "In M365: Studio credits are the main variable. Standard connectors are free. Generative answers are metered per call — we estimate 4-6 calls per release. At Synchrony scale that's negligible vs. one 90-minute outage avoided."

**Q: "How accurate is the RCA?"**
A: "We calibrate the confidence score against three weighted factors: live evidence, past-INC pattern match, and code-diff plausibility. The score is bounded at 0.95 — never claim certainty. In our demo, 81% confidence reflects strong evidence with one inferred dimension (we didn't directly measure the persistent-message memory footprint in this specific cluster traffic profile)."

**Q: "What if the agent gets it wrong?"**
A: "Three answers. One: the agent never takes the major action — humans approve. Two: the Adaptive Card always offers Downgrade. Three: the agent's confidence score is calibrated, so 0.45 means 'I'm not sure' not 'this is right.' The audit trail is full · post-mortem reviews the agent's reasoning chain alongside the human's."

**Q: "How is the production architecture different from the demo?"**
A: "Three changes. One: real ServiceNow and Jira via approved connectors instead of mocked surfaces. Two: real metrics from New Relic / Splunk instead of pre-seeded snapshots. Three: scheduled L1 checks via Power Automate instead of manual triggers. The agent logic, the prompts, the risk packet structure — those are identical."

---

*Practice this script aloud. Time it twice Monday evening. Adjust pacing per actual scene timing.*
