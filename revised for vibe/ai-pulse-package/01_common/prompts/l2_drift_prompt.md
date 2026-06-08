# L2 Drift Classification Prompt

> **Purpose:** When metric drift is detected, decide if the drift is explained by release intent or unexplained. Drives the L2 amber escalation decision.
>
> **Usage:** Triggered during ReleaseWatch's hourly L1 check when any monitored metric crosses a threshold. The output drives whether to escalate or stay quiet.

---

## Why this prompt is important

L2 is the level where the agent demonstrates judgment, not just thresholds. A rules engine fires on `metric > threshold`. The agent reasons about *whether the threshold breach makes sense given what the release intended*. That's the difference between alert fatigue and useful signal.

If the agent classifies too aggressively, the on-call team learns to ignore L2 alerts. If too leniently, real problems linger. Tune this prompt to be calibrated, not paranoid.

---

## System prompt (use as a sub-prompt inside the "Classify Drift" topic)

```
You are reasoning about whether observed metric drift on a deployed application
is explained by the release's stated intent — or unexplained and therefore
worth escalating.

The risk packet for this release lists expected metric shifts. Compare observed
drift against those expectations.

A drift is EXPLAINED if:
- The metric, the direction of change, and the magnitude are all within or
  near what the release notes anticipated.
- Example: release notes say "publish rate unchanged"; observed publish rate
  steady at baseline. EXPLAINED.

A drift is UNEXPLAINED if:
- The metric is not mentioned in expected shifts but is degraded significantly.
- Example: release notes mention nothing about consumer latency; observed
  downstream inbound dropped to near zero. UNEXPLAINED.
- The metric is mentioned but the magnitude far exceeds expectation.
- Example: release notes say "downstream rates unchanged"; observed sms-consumer
  inbound dropped 89%. UNEXPLAINED (magnitude far exceeds any margin).
- The metric is mentioned but the direction is wrong.
- Example: release notes say "producer throughput unaffected"; observed
  -40%. UNEXPLAINED.

A drift is PARTIALLY EXPLAINED if:
- Part of the observed change matches release intent, but additional
  unexpected behavior is also present.
- Example: publish rate matches expectation (steady) but downstream inbound
  throughput also dropped 25%. The producer change is explained; the
  consumer change is not.

CROSS-SYSTEM PATTERNS matter. If producer is "healthy" in isolation but
consumer is "degraded" in isolation, that's not two independent observations.
It's one fact about a relationship between the two. Treat it as one finding,
not two.

ACTIVE INCIDENT CHECK matters. If there is already an active INC on this
application or its downstream apps in the last 4 hours, this current drift
is likely a continuation of that incident, not a new one. Note it but do
not double-page.

Output strictly in the OUTPUT FORMAT below.
```

---

## User message template

```
CONTEXT
=======
CHG: {{ chg_id }}
Application: {{ app_name }}
Time since deploy: {{ time_since_deploy }}
Current monitoring state: L1 (hourly all-clear)

OBSERVED METRICS (compared to baselines)
========================================
{{ metric_comparisons }}

Example format:
- application-consumer publish rate: 22/min current
  (yesterday: 139/min, last week: 138/min). Delta: within 3%. CLEAN.
- Producer latency: 152ms current (yesterday: 140ms, last week: 141ms).
  Delta: steady at baseline. NO CHANGE.
- Consumer (sms-consumer) throughput: 31/min current
  (baseline ~255/min). Delta: -233/min / -91%. SEVERELY DROPPED.
- sms-consumer inbound: 9/min current (baseline ~85/min, down 89%).
  Delta: 85/min → 9/min / −89%. SEVERELY DROPPED.

RISK PACKET — EXPECTED SHIFTS
=============================
{{ expected_shifts_from_risk_packet }}

Example:
- application-consumer publish rate: no change expected (routing config
  changes keys, not volume). Steady at baseline is acceptable.
- Producer throughput: no change expected.
- Consumer latency: no change expected. Any increase beyond +50ms is unexplained.
- Consumer throughput: no change expected.
- RabbitMQ cluster memory: incremental increase to a slightly higher
  baseline. A flatline to 0 is the silent-publisher-init failure mode.

ACTIVE INCIDENT CHECK
=====================
{{ active_inc_result }}

Example:
No active INC on application-consumer or sms-consumer
in the last 4 hours.

TASK
====
Classify each drifting metric and provide an overall escalation
recommendation following the OUTPUT FORMAT.
```

---

## Output format

```
PER-METRIC CLASSIFICATION
=========================

Producer throughput
  Status: CLEAN
  Reasoning: Within 3% of baseline. Matches "no change expected."

Producer latency
  Status: EXPLAINED
  Reasoning: publish rate steady at baseline; release intent expected no
  change; this is the contract holding.

Consumer throughput
  Status: UNEXPLAINED
  Reasoning: -78% observed; release intent expected no change. Magnitude
  and direction both outside expectation.

Consumer latency
  Status: UNEXPLAINED
  Reasoning: downstream inbound collapsed to near zero; release intent expected no change with anything
  beyond +50ms marked as unexplained drift. Observation is 7x the
  unexplained-drift threshold.

CROSS-SYSTEM PATTERN
====================
Producer is healthy in isolation. Consumer is severely degraded in isolation.
Both apps are in the risk packet's downstream relationship. The pattern
matches the failure mode `downstream_consumer_starvation` listed in the
risk packet. This is one fact, not two.

ACTIVE INCIDENT
===============
None in window. This is a new event.

OVERALL ESCALATION RECOMMENDATION
=================================

Recommendation: ESCALATE L1 → L2 AMBER

Reasoning: Two unexplained metric changes on the consumer side. The pattern
matches a known failure mode flagged in the risk packet. No competing
incident is open. Escalating L2 starts the 15-minute update cadence and
emails the on-call DL while continuing to gather evidence in case L3
becomes warranted.

ACTIONS TO TAKE
===============
- Set CHG state in SharePoint Active Watches list to AMBER.
- Send email to dl-acquisition-oncall@aipulse.onmicrosoft.com with this
  classification and the metric snapshot.
- Post amber alert to #release-watch-acquisition Teams channel.
- Schedule next status update in 15 minutes.
- Continue collecting metric snapshots for potential L3 escalation.
```

---

## Iteration notes for tuning

| Problem | Fix |
|---|---|
| Classifies too many drifts as UNEXPLAINED (false positives) | Loosen acceptable-margin language; require at least 2 unexplained metrics before escalation |
| Misses cross-system patterns (treats producer and consumer separately) | Add a worked example in the system prompt for "isolated healthy + isolated degraded = relationship pattern" |
| Doesn't read the risk packet thresholds correctly | Add: "Quote the exact threshold from the risk packet in your reasoning" |
| Escalates on a single one-off blip | Add a "PERSISTENCE CHECK" step: the drift must be observed for at least 2 consecutive minutes |
| Suggests L3 instead of L2 | Tighten: "Recommend L2 unless metrics are catastrophically off OR a similar incident has happened before in the last 30 days" |

---

## Difference from L3 RCA prompt

| | L2 drift prompt | L3 RCA prompt |
|---|---|---|
| Question being answered | "Should we escalate?" | "What caused this?" |
| Evidence sources | Live metrics + risk packet | Live metrics + past INCs + bitbucket diff + risk packet |
| Output | Classification + actions | Diagnosis + evidence + fix options + confidence |
| Cost | Cheap (single-shot reasoning) | Expensive (multi-source synthesis) |
| Cadence | Every 15 min during L2 | Once at L3 escalation |

L2 keeps the loop tight. L3 is the deep dive. Don't conflate them.

---

*This prompt is where the agent stops being a rules engine and starts being a judgment engine. Tune it carefully — too aggressive and it loses on-call trust; too lenient and real problems hide.*
