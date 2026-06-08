# Decision Log

> Append-only log of architectural and strategic decisions. Most recent at top.


## DEC-SCEN · Demo scenario swap (2026-06-07)

**Decision:** Replace the RabbitMQ memory-exhaustion-a-week-after-deploy scenario with a forgotten-DB-migration silent-publish failure, immediately post-deploy.

**Why:** The old scenario happened ~a week after deploy — inconsistent with ReleaseWatch's release-window scope; a sharp judge would catch it. The new scenario is immediate (minutes post-deploy), a pure relationship failure (app green in isolation), and more relatable ("deploy succeeded but the app is silently broken").

**The new scenario:** `application-consumer` (fans out to sms/email/audit-consumer) ships ACQ-3847 adding per-consumer routing config that reads a new `messaging_config` table on publisher init. Migration subtask ACQ-3852 was not run on CDE2 (ran in QA). Deploy succeeds, HTTP health green, but the publisher fails to init against the missing schema and silently stops publishing — all three downstream consumers flatline to 0 at exact deploy time. RCA confidence 0.84. `credit-apply` is a green contrast tile (risk 28). Past INC0221904 matches.

**Also added:** risk score (0-100 per release), Confluence template-fill mechanic (agent reads "Synchrony Standard Release Page v3" and populates it), and the MVP-2 "Production Watch" framing (the RabbitMQ-memory pattern becomes the example for continuous monitoring beyond the release window).

**Propagated to:** mock_data_seed.json, l3_rca_prompt, risk_packet_prompt, l2_drift_prompt, deck_v2.html, pitch_script_4min, architecture_diagrams.html, HANDOFF, jury_qa_bedrock_primer, build_demo_app_prompt, state_machine_spec, choreography_spec, mock1_combined.html.

---

## DEC-013 · 2026-06-06 · Idea 2 (ReleaseWatch only) added as alternative

ReleaseWatch-only standalone pitch added as a strategic backup. Same code, same prompts, narrower scope. Trades end-to-end credibility for sharper SRE-focused demo. Default remains Idea 1 (combined).

## DEC-012 · 2026-06-06 · Adopted 5-path strategy (A/B/C/D/E)

Replaced ad-hoc path discussion with a formal 5-path strategy. Path E is the floor (always achievable). Path B is the ceiling (real M365 surfaces). Other paths are decision points if Path B partially works. Monday morning checks decide commitment.

## DEC-011 · 2026-06-06 · 3 human approval gates locked

Pre-deploy gates: (1) review curated info before publish · (2) approve CHG advance to Implement. Post-deploy gate: (3) acknowledge or downgrade L3 escalation. Gates are non-optional — they're the "humans stay in control" story for the deck.

## DEC-010 · 2026-06-05 · L1/L2/L3 escalation cadence locked

L1 hourly all-clear. L2 amber: immediate email + 15-min cadence. L3 red: INC + Adaptive Card + per-minute updates. Human override via Adaptive Card. Re-flag logic checks for active INC before double-paging. This is the operational behavior model — deck and demo must reflect it.

## DEC-009 · 2026-06-05 · RabbitMQ memory cascade selected as demo scenario

Real failure mode from Vamshi's team experience. Producer "looks healthy" + consumer "looks degraded" is the textbook cross-system pattern. The commit (`+messageProps.setPersistent(true)`, sha a7f3c19) tripled memory pressure, crossed RabbitMQ high watermark, triggered backpressure, starved consumer. Expected L3 RCA confidence: 0.81. This scenario is the strongest demo because it's specific, plausible, and the failure pattern is real.

## DEC-008 · 2026-06-04 · Risk packet as the handoff artifact

Decided not to introduce a DB or queue between ReleasePilot and ReleaseWatch. The handoff is via the Confluence/SharePoint release page — specifically the "Risk Packet" section. ReleasePilot writes it; ReleaseWatch reads it. This is architecturally clean (state lives in artifacts, not infrastructure) and demo-friendly (visible on screen).

## DEC-007 · 2026-06-04 · Combined two agents into one Studio agent

Originally planned ReleasePilot and ReleaseWatch as separate Studio agents. Decided to merge into one agent with two personas determined by message context. Reasons: (1) one agent costs less in Studio credits; (2) the handoff is artifact-based, not message-based, so no architectural benefit to splitting; (3) simpler to demo.

## DEC-006 · 2026-06-03 · Studio + free M365 connectors only

Confirmed Power Automate Premium is not approved. All external API access must be via free push-into-M365 patterns (Atlassian → Teams webhook · email-out → "When new email"). No premium Jira/SNOW/HTTP connectors. This shapes the entire Path B architecture.

## DEC-005 · 2026-06-03 · ReleasePilot + ReleaseWatch as the project (not earlier candidates)

Considered: IntakePilot (application anomaly pre-triage), Resubmission Rescue, generic engineering-productivity agents. Rejected. Reasons: (1) release lifecycle is a real team pain point with measurable savings; (2) most teams have the same problem; (3) the AI value is clearer (cross-system reasoning vs simple alerting).

## DEC-004 · 2026-06-02 · SYF brand colors locked

Yellow #FFCE32 primary accent, navy #002856 deep, dark theme panels (#131820, #1a2230). Inter + JetBrains Mono fonts. Never default AI purple/cyan gradients. Pilot color #5b8fc7 (blue), Watch color #FFCE32 (yellow) for two-agent visual distinction.

## DEC-003 · 2026-06-02 · Mock everything with invented data

No real Synchrony data in artifacts. INC numbers (INC0214098, INC0218763, INC0223440), CHG (CHG0049182), application names (acquisition-decision-orchestrator) are all invented. This is per hackathon rules.

## DEC-002 · 2026-06-01 · Three approval gates baseline

Decided early that "humans stay in control" requires explicit approval gates, not implicit ones. Three gates emerge naturally from the workflow. Adaptive Cards in Teams are the surface; the agent waits for response.

## DEC-001 · 2026-05-30 · Team AI Pulse formed

Team: Vamshi V (lead), Anisha C, Sai Mohit. Hackathon: Synchrony Vibe Coding 2026, June 8-9.

---

*Append new decisions at the top. Don't rewrite history. Use decision IDs (DEC-NNN) to reference in other docs.*
