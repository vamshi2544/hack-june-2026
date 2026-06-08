# Idea 2 · ReleaseWatch Standalone · Implementation Spec

> The focused 7-step post-deploy agent. Use this spec when pivoting from Idea 1 to Idea 2, or as an alternative pitch for SRE-focused audiences.

## Problem statement

Every release has the same risk window: the first 24 hours after deploy. Today's monitoring catches what each system reports individually. It doesn't catch:

- A producer that "looks healthy" while its consumer is starving (the relationship failure)
- Metric drift that matches a known release-time failure pattern from past INCs
- Cascade failures that take 90+ minutes for humans to piece together

Engineers on-call at 2 AM miss these. The agent doesn't.

## Value proposition

ReleaseWatch is a post-deploy AI monitoring agent that:

1. Reads the release intent (what's expected to change)
2. Continuously compares observed behavior against expected
3. Detects cross-system patterns that current monitoring misses
4. Generates evidence-backed RCAs with calibrated confidence
5. Hands off to humans with structured Adaptive Cards (not noisy pages)

**Pitch tagline (Idea 2 variant):** "Production is watching itself"

## The 7-step workflow

| Step | Phase | What happens |
|---|---|---|
| 11 | Deploy completes | Agent wakes · reads existing risk packet from Confluence/SharePoint |
| 12 | L1 monitoring | Hourly baseline comparison · all-clear or alert |
| 13 | L2 drift detection | Compare drift vs release-intent expectations · classify EXPLAINED / UNEXPLAINED |
| 14 | L3 RCA generation | Pull past INCs + bitbucket diff + live metrics · synthesize RCA with confidence |
| 15 | Human handoff | Adaptive Card to Teams with action buttons |
| 16 | Human acknowledgment | Click reduces cadence · INC stays open for audit |
| 17 | Recovery detection | Metric recovery posted to channel · watch closes |

This is the **same workflow as steps 11-17 of Idea 1.** Same code, same UI, same prompts.

## What's removed vs Idea 1

- Steps 1-10 (the ReleasePilot pre-deploy work)
- The Jira trigger flow
- The Confluence release page generation
- The CHG creation/advancement automation
- The pre-deploy approval gates (gates 1 and 2)

Approval gate 3 (the L3 acknowledgment) **stays** — it's part of post-deploy.

## What's added vs Idea 1

- A simple "pre-existing setup" narration: "before the demo starts, we already have a Confluence release page and a CHG in Watching state — both populated by either humans or upstream automation"
- A slightly different deck framing: the value prop is monitoring intelligence, not lifecycle automation

## Demo flow (4 minutes target)

### Setup before demo

- Confluence/SharePoint release page exists with the risk packet section filled in (manually pre-populated from `mock_data_seed.json`)
- CHG0049182 exists in Watching state
- ReleaseWatch agent (or mock UI) is on standby
- Dashboard shows 9 tiles all green

### Demo scenes

**Scene A (~30s) · "It's 1 AM and a deploy completed"**

- Show dashboard with 9 tiles
- Narrate: "Every line is a release being watched right now. Some have just deployed, some have been watched for hours. All green."
- Hover over CHG0049182 tile · expand to show pre-deploy context (link to release page, what risk packet predicted)

**Scene B (~30s) · "ReleaseWatch's job: hourly comparison"**

- Show L1 hourly check · all-clear after 1 hour
- Narrate: "First hour clear. Producer latency +12ms, within the +25ms tolerance from the release notes. Consumer behavior unchanged. That's the explicit contract from the risk packet."

**Scene C (~45s) · "Hour 2 · something drifts"**

- Metric drift animates (consumer latency climbs 540ms → 2400ms)
- Tile transitions green → amber
- L2 amber alert posted to Teams · email sent
- Narrate: "Consumer latency went up 340%. Release notes explicitly said no expected change. This isn't explained drift. Amber alert. 15-minute cadence starts."

**Scene D (~60s) · "30 minutes later · escalation to L3"**

- L3 RCA generation begins (streaming text)
- Show the agent pulling past INCs (2 matches with HIGH similarity)
- Show the agent reading the bitbucket diff (5 commits, 1 with behavioral change)
- Show the cross-system pattern recognition (producer healthy + consumer degraded = relationship failure)
- Show the RCA text streaming in with the 81% confidence score
- INC0228994 created and linked to CHG
- Narrate: "Three lines of reasoning converged. Past INCs show this exact failure mode twice in the last 60 days. The diff shows a persistent-flag commit. Live metrics show RabbitMQ at 92% memory with backpressure active. Confidence: 81%."

**Scene E (~30s) · "Handoff to a human"**

- Adaptive Card appears in Teams with action buttons (Acknowledge / Downgrade / Open INC)
- Anisha clicks Acknowledge
- Cadence relaxes to 5 minutes · INC stays open
- Narrate: "On-call has 30 seconds to read this and decide. The agent isn't replacing them — it's giving them a head start. Acknowledge keeps the INC open for the post-mortem; the audit trail is fully preserved."

**Scene F (~30s) · "Recovery"**

- Anisha's reply appears: "Rolling back commit"
- 5 minutes later · metrics recover
- Tile turns green RECOVERED
- Narrate: "Five minutes from acknowledgment to fix. The agent watched, reasoned, escalated, handed off, and closed the loop. From 1:47 AM to 2:44 AM. In production without this, that 57-minute resolution would have been 3+ hours of on-call chasing the wrong system."

**Total: ~3:45 minutes**

## Implementation in Path B

Same as Idea 1's Path B but skip these steps:

- Skip `01_jira_setup.md` (no Jira needed)
- Skip `02_jira_automation_rule.md` (no trigger needed)
- Skip Topic 1 (Wake on Trigger) in Studio · use a Topic 0 (Wake on Deploy) instead
- Skip Topic 2 (Generate Risk Packet) · pre-populate the page manually
- **Keep** Topic 3 (Classify Drift), Topic 4 (L3 RCA), Topic 5 (Adaptive Card)

The SharePoint setup is the same. The Studio agent build is smaller (3 topics instead of 5).

**Time savings vs Idea 1 Path B:** roughly 90-120 minutes.

## Implementation in Path E

Same as Idea 1's Path E but the React app is smaller:

- Skip Jira route (or keep as static reference)
- Skip Confluence route as an "advance during demo" surface · render it pre-populated when the demo starts
- Trim state machine to 7 scenes (DEPLOY_COMPLETED → ... → RECOVERY_DETECTED)
- Same dashboard route (the killer view)
- Same Teams route (now smaller — only L2/L3 messages)
- Same SNOW route (just shows the INC at scene D onwards)

**Time savings vs Idea 1 Path E:** roughly 90 minutes (fewer components to build, simpler state machine).

## Pitch deck adjustments

The existing `deck1_combined.html` covers both ideas. To pivot to Idea 2 for a specific audience:

- Skip slides covering pre-deploy steps (slides 5-7 in the current draft)
- Adjust slide 2 framing: "Deployment monitoring today gives you per-system health. AI Pulse ReleaseWatch gives you cross-system understanding."
- Adjust slide 14 (architecture): show only the ReleaseWatch half of the architecture
- Keep slides 8-13 (the demo flow slides)
- Keep slide 14 (production architecture)
- Keep "Defending the pitch" + "What we need" slides for interactive HTML

**For Tuesday: don't rebuild the deck. Just adjust narration on the live pitch.**

## Prompts used in Idea 2

| Prompt | Idea 1 use | Idea 2 use |
|---|---|---|
| `master_agent_prompt.md` | Always | Always (ReleaseWatch persona only) |
| `risk_packet_prompt.md` | Pre-deploy (Topic 2) | **Not used live** but cited in deck as "this is what ReleasePilot would generate in production" |
| `l2_drift_prompt.md` | L2 classification | L2 classification (same) |
| `l3_rca_prompt.md` | L3 RCA generation | L3 RCA generation (same) |

The risk packet prompt's role in Idea 2 is to **explain where the risk packet came from** — pre-existing, not generated live. This is a credibility move: show that you've thought about the upstream story even if you're not demoing it.

## Risk-weighted recommendation

Idea 2 is **strictly less ambitious** than Idea 1. The pitch lands harder when you show the full lifecycle.

**Use Idea 2 only when:**

- You've burned 4+ hours on Idea 1 Path B and the pre-deploy parts are broken
- You can re-frame the lost work as "we'll show the part that works most reliably"
- You can produce a tighter 4-minute demo that the jury will appreciate the focus of

**Don't pivot to Idea 2 just to "play it safe."** Idea 1 with a recorded fallback video is safer than Idea 2 live.

## Deck 2 + Mock 2 (deferred)

A dedicated ReleaseWatch-only deck and mock are mentioned in HANDOFF.md as deferred deliverables. If the team has spare cycles Sunday night, build them. Otherwise, Idea 2 reuses Deck 1 and Mock 1 with adjusted narration.

The Deck 2 outline:
- Slide 1: Title (AI Pulse · ReleaseWatch)
- Slide 2: Problem (cross-system blind spot at 2 AM)
- Slide 3: How today fails (each system's monitor in isolation)
- Slide 4: ReleaseWatch's three superpowers (cross-system, pattern memory, code-diff reasoning)
- Slides 5-10: The 7-scene demo flow
- Slide 11: Architecture (Studio + SharePoint + Teams)
- Slide 12: Why this scales
- Slide 13: Closing slide

13 slides. ~5 min pitch with this deck.

The Mock 2 would mirror this — a focused 7-scene HTML mock matching the Path E React app but trimmed.

---

*Idea 2 is the same agent, narrower frame. If you build Idea 1 well, you can pivot to Idea 2 in under an hour by trimming.*
