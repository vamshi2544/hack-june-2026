# L3 RCA Generation Prompt

> **Purpose:** Generate a coherent, evidence-backed root cause analysis with a confidence score when ReleaseWatch escalates from L2 to L3.
>
> **Usage:** Paste the System Prompt section into the Copilot Studio agent's instructions. Pass the User Message Template (with placeholders filled in from collected evidence) when L3 is triggered. Test against Claude or ChatGPT before pasting into Studio Monday.

---

## Why this prompt matters most

The L3 RCA is the moment in the demo that makes the room go quiet. The agent goes from "something is wrong" to "here is the root cause, the evidence, the immediate fix, and how confident I am" — in seconds. If this prompt produces a confused, generic, or off-target response, the demo fails. If it produces a sharp, specific, plausible RCA with a calibrated confidence score, the demo wins.

**Test this prompt repeatedly this weekend.** Tweak it until the output for the demo scenario (forgotten DB migration → silent publisher init failure → downstream starvation) hits exactly the beats described below with confidence around 0.84.

---

## System prompt (paste into Studio agent instructions)

```
You are ReleaseWatch, a post-deployment monitoring agent for Synchrony's
acquisition API platform. Your job is to detect when a release has caused a
problem and produce a focused root cause analysis (RCA) for the on-call engineer.

Your reasoning principles:

1. CROSS-SYSTEM PATTERNS MATTER. A producer that "looks healthy" and a consumer
   that "looks degraded" are not two facts — they are one fact about a
   relationship. Reason about the relationship, not the components alone.

2. RELEASE INTENT IS CONTEXT. The release notes describe expected drift. If a
   metric change is explained by release intent (for example, "+15ms latency on
   the downstream drop is explained because the release changed routing"), say so
   and lower your concern proportionally. If a change is NOT explained, that's
   the signal.

3. PATTERN SIMILARITY IS EVIDENCE. Past INCs with similar symptom patterns are
   strong evidence even if keywords don't match exactly. A past INC about
   "forgotten migration → publisher failed to init → downstream starved" is highly
   relevant to a current symptom of "downstream consumers flatlined right after a
   migration-dependent deploy" even though those sentences don't share words.

4. CODE DIFF IS EVIDENCE. A recent commit that plausibly causes the observed
   symptom is strong evidence. Persistent messages consume more memory than
   transient ones; a flag flip that enables persistence is therefore a plausible
   cause of a memory exhaustion symptom. Reason explicitly about plausibility.

5. CONFIDENCE IS A NUMBER. Express your diagnostic confidence as a decimal
   between 0 and 1. Weight: live evidence confirming a hypothesis (+0.3),
   past INCs with similar pattern (+0.2 each, up to +0.4), plausible code diff
   match (+0.2), uncontradicted reasoning chain (+0.1). Cap at 0.95 — never claim
   certainty.

6. WRITE FOR THE ON-CALL ENGINEER. They have 30 seconds to read your output and
   decide what to do. Lead with the root cause in one sentence. Then the evidence.
   Then the fix options, fastest first. Then the long-term recommendation.

7. NEVER FABRICATE EVIDENCE. If a data source returned empty, say so. Do not
   invent past INCs, metrics, or commits. Confidence drops proportionally with
   evidence absence.

Output format is strictly the OUTPUT TEMPLATE below. Do not deviate.
```

---

## User message template (filled in at runtime)

Replace each `{{ placeholder }}` with the actual collected evidence before sending.

```
INCIDENT CONTEXT
================
CHG ticket: {{ chg_id }}
Application: {{ app_name }}
Deployed: {{ deploy_time }} on {{ foundation }}, build {{ build_id }}
Time since deploy: {{ time_since_deploy }}
Current escalation state: L3 (escalated from L2 after {{ l2_duration }})

OBSERVED SYMPTOMS
=================
{{ symptoms_block }}
Example format:
- application-consumer HTTP: 409 2xx/min, 0 5xx, CPU 19% — healthy in isolation
- application-consumer publish rate: 0/min (baseline ~255/min) — publish path dead since deploy
- sms-consumer inbound: 0/min (baseline ~85/min) — flatlined at deploy time
- email-consumer inbound: 0/min, audit-consumer inbound: 0/min — same flatline
- application-consumer error logs: 0 ERROR entries in last 30 min

RISK PACKET (from Confluence release page)
==========================================
Expected drift per release notes:
{{ expected_drift_text }}
Example: "Routing config changes keys, not volume. Publish rate and downstream
inbound rates should hold at baseline; a drop to 0 is the silent-publisher-init failure mode."

Known failure modes from risk packet:
{{ failure_modes_list }}
Example: missing_migration, silent_publisher_init_failure, downstream_starvation

Downstream apps being watched:
{{ downstream_apps }}
Example: sms-consumer (primary), email-consumer (secondary), audit-consumer (secondary)

PAST INC SEARCH (from ServiceNow / SharePoint INCs list)
========================================================
{{ past_inc_matches }}
Example format per match:
- INC0221904 (2026-03-18): "application-consumer · forgotten DB migration →
  publisher init failure → downstream consumers starved. App healthy, downstream
  to zero, no ERROR logs." Pattern similarity: HIGH (same app, same failure mode)
- INC0218763 (2026-04-12): "sms-consumer backlog after upstream routing change."
  Pattern similarity: MEDIUM

LIVE INFRASTRUCTURE METRICS (from New Relic / SharePoint Metrics list)
======================================================================
{{ live_infra_metrics }}
Example:
- Deploy build 20260608.1.42 succeeded; HTTP health checks green
- Migration subtask ACQ-3852 (create messaging_config): NOT RUN on CDE2 (ran in QA)
- Publisher init outcome logged at DEBUG only — no ERROR surfaced
- Downstream inbound (sms/email/audit-consumer): all 0/min since deploy time

BITBUCKET DIFF (commits since last green deploy)
================================================
{{ bitbucket_diff }}
Example:
5 commits total. Notable changes:
- Commit a7f3c19 in RoutingConfigLoader.java: loads routing config from
  messaging_config table on publisher init (behavioral)
- Commit 8e2b491: migration V20260604__create_messaging_config.sql — required
  before publisher init; migration_run_on_cde2 = false
- Commit b203fa5: publisher init outcome logged at DEBUG only (explains silence)
- Commits 4f1c0a8, 91e7d23: tests and README (no behavioral change)

TASK
====
Generate the L3 RCA following the OUTPUT TEMPLATE below. Reason explicitly about
relationships, release intent, pattern similarity to past INCs, and code-diff
plausibility. Produce a calibrated confidence score.
```

---

## Output template (the agent must produce exactly this shape)

```
ROOT CAUSE (one sentence)
=========================
{{ one_sentence_diagnosis }}

EVIDENCE (in order of weight)
=============================
1. {{ strongest_evidence_with_source }}
2. {{ next_evidence_with_source }}
3. {{ next_evidence_with_source }}
...

REASONING CHAIN (how the evidence connects)
===========================================
{{ 2-4 sentences explaining why these symptoms are caused by this root cause,
including any cross-system pattern reasoning, release-intent consideration, and
why the diff is a plausible cause }}

IMMEDIATE FIX (fastest first)
=============================
Option A — {{ fastest fix, with rough time estimate }}
Option B — {{ alternative fix }}

LONG-TERM RECOMMENDATION
========================
{{ one or two sentences on what should change in the release process or capacity
planning to prevent this class of issue }}

DIAGNOSTIC CONFIDENCE: {{ 0.00 to 0.95 }}
=========================================
{{ one-sentence calibration justification — what supports this confidence level
and what could falsify it }}
```

---

## Demo scenario test harness

When you test this prompt against Claude or ChatGPT, use these EXACT inputs to verify the output. The expected output is below.

### Test input (paste this after the System Prompt and User Message Template)

```
INCIDENT CONTEXT
CHG ticket: CHG0049182
Application: application-consumer
Deployed: 01:32 AM ET June 8 2026 on CDE2, build 20260608.1.42
Time since deploy: 8m
Current escalation state: L3 (escalated from L2 after the publish path went fully dead)

OBSERVED SYMPTOMS
- application-consumer HTTP: 409 2xx/min, 0 5xx, CPU 19% — HEALTHY in isolation
- application-consumer publish rate: 0/min (baseline ~255/min) — publish path DEAD since 01:32:14
- application-consumer error logs: 0 ERROR entries in last 30 min
- sms-consumer inbound: 0/min (baseline ~85/min) — flatlined at 01:32
- email-consumer inbound: 0/min (baseline ~85/min) — flatlined at 01:32
- audit-consumer inbound: 0/min (baseline ~85/min) — flatlined at 01:32

RISK PACKET (from Confluence release page, filled from the standard template)
Risk score: 72 (Elevated) — touches the messaging publish path AND requires a DB migration.
Expected drift per release notes: "Routing config changes keys, not volume. Publish rate and all downstream inbound rates should hold at baseline. A drop to 0 on publish or any downstream is the documented silent-publisher-init failure mode."
Known failure modes: missing_migration, silent_publisher_init_failure, downstream_starvation
Downstream apps: sms-consumer (primary), email-consumer (secondary), audit-consumer (secondary)

PAST INC SEARCH
- INC0221904 (2026-03-18): "application-consumer · forgotten DB migration → publisher init failure → downstream consumers starved. App healthy (HTTP 200), downstream to zero, no ERROR logs (DEBUG only)." Pattern similarity: HIGH.
- INC0218763 (2026-04-12): "sms-consumer message backlog after upstream routing change." Pattern similarity: MEDIUM.

LIVE DEPLOY / MIGRATION STATE
- Deploy build 20260608.1.42 succeeded; HTTP health checks green.
- Migration subtask ACQ-3852 (create messaging_config table): job shows NOT RUN on CDE2.
- Note: ACQ-3852 DID run in QA — which is why QA integration tests passed.

BITBUCKET DIFF
5 commits total. Notable changes:
- Commit a7f3c19 in RoutingConfigLoader.java: + loads routing config from messaging_config table on publisher init (behavioral).
- Commit 8e2b491: migration db/migrations/V20260604__create_messaging_config.sql — REQUIRED before publisher init; migration_run_on_cde2 = false.
- Commit b203fa5: publisher init outcome now logged at DEBUG only (explains the silence).
Other commits are tests and README.

TASK: Generate the L3 RCA following the OUTPUT TEMPLATE.
```

### Expected output shape (verify against this)

```
ROOT CAUSE
==========
application-consumer's release added per-consumer routing config that reads a
new messaging_config table on publisher init. The required migration
(subtask ACQ-3852) was not applied on CDE2. The publisher failed to initialize
against the missing schema and silently stopped publishing, starving
sms-consumer, email-consumer, and audit-consumer.

EVIDENCE
========
1. All three downstream consumers' inbound rate dropped to 0/min at 01:32,
   exactly at deploy completion (baseline ~85/min each). (Source: live metrics)
2. application-consumer is UP — HTTP 2xx steady ~409/min, 0 5xx, CPU 19%,
   0 ERROR logs. The failure is invisible to the app's own health.
   (Source: live metrics)
3. Migration subtask ACQ-3852 (create messaging_config table) shows NOT RUN on
   CDE2, while the publisher init now depends on that table (commit a7f3c19).
   It ran in QA, which is why QA passed. (Source: bitbucket diff + migration state)
4. Past INC0221904 (March 2026) on this same app had an identical pattern:
   forgotten migration, silent publisher init failure, downstream starvation.
   (Source: ServiceNow past INC search)
5. Producer healthy in isolation + three consumers dead in isolation is one
   relationship failure, not five symptoms — the pattern the risk packet
   flagged for this 72/Elevated release. (Source: cross-system reasoning)

REASONING CHAIN
===============
The deploy pipeline validates the HTTP layer and health checks, not the async
publisher. application-consumer started, passed health checks, and reports
healthy — but the publisher could not initialize because messaging_config does
not exist on CDE2 (the migration never ran). The init failure logs at DEBUG
only (commit b203fa5), so nothing surfaces as an error. With the publisher dead,
all three downstream consumers receive nothing. No single dashboard owns the
"application-consumer → sms-consumer should be flowing" relationship, so the
break is invisible to per-system monitoring. The exact deploy-time correlation
across three consumers plus the identifiable unrun migration make the cause
unambiguous.

IMMEDIATE FIX
=============
Option A — Run the pending messaging_config migration on CDE2, then restart the
publisher. ~10 minutes. Resolves without a rollback and preserves the release.

Option B — Roll back application-consumer to build 20260601.1.18 via UDeploy.
~5 minutes. Faster, but loses the release.

LONG-TERM RECOMMENDATION
========================
Add a publisher-health probe (not just HTTP health) to release readiness, and
gate migration-dependent releases on a migration-applied check before the
pipeline marks the deploy complete.

DIAGNOSTIC CONFIDENCE: 0.84
===========================
Confidence is high: three downstream consumers flatlined at the exact deploy
time, an identifiable migration subtask is confirmed not-run on CDE2, and a
past INC matches the pattern exactly. It is not higher because the publisher
init failure is inferred from the schema dependency rather than a captured
init-error log — the relevant log line is DEBUG-level and not in the evidence.
```


---

## Iteration notes for tuning

When you test this and the output drifts from the expected shape:

| If the output... | Tune by... |
|---|---|
| Lists evidence in wrong order (weakest first) | Strengthen System Prompt rule 5 to emphasize evidence ordering |
| Omits the reasoning chain step | Add "DO NOT SKIP THE REASONING CHAIN" to the output template |
| Gives confidence > 0.9 | Tighten the cap and require more justification for high confidence |
| Invents a past INC not in the input | Strengthen System Prompt rule 7 with an explicit example: "If past_inc_matches is empty, say so" |
| Uses generic phrasing ("a possible issue could be...") | Add "Be specific. Avoid hedging words like 'possibly' or 'could be'" |
| Misses the cross-system reasoning | Strengthen rule 1 with a worked example |
| Repeats input verbatim instead of synthesizing | Add "Synthesize, don't repeat. The reader has the input already." |
| Output is too long | Add a max-words guidance (e.g., "Whole RCA under 350 words") |

---

## When NOT to use this prompt

This prompt is sized for **L3 escalation** where evidence has been gathered. Do not use it for:

- L1 hourly all-clear reports (use a simpler prompt or templated message)
- L2 amber drift detection (use the L2 drift prompt instead — see `l2_drift_prompt.md`)
- Risk packet synthesis at pre-deploy (use the risk packet prompt — see `risk_packet_prompt.md`)
- Generic Q&A with the agent (use the master agent prompt — see `master_agent_prompt.md`)

---

*Test this prompt this weekend. The demo's strongest moment depends on it.*
