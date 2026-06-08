<!-- SUPERSEDED-BANNER -->
> ⚠️ **REFERENCE ONLY — Copilot Studio path, abandoned in the platform pivot. Old scenario. Do not build from this.**

# 08 · Studio Agent Topics

> Build the 4 main topics inside the AI Pulse Release Agent. Prerequisite: step 07 done.

## The topics we're building

| # | Topic Name | Trigger | What it does | Prompt source |
|---|---|---|---|---|
| 1 | Wake on Trigger | "@release-pilot go" or release trigger message | Recognize the trigger, dispatch to next topic | n/a (routing) |
| 2 | Generate Risk Packet | Internal call from Topic 1 | Read Jira context, search past INCs, synthesize risk packet, create SharePoint page, post approval card | `risk_packet_prompt.md` |
| 3 | Classify Drift | Internal call (scheduled or event-driven) | Compare current metrics vs risk packet, classify, escalate L2 if needed | `l2_drift_prompt.md` |
| 4 | Generate L3 RCA | Internal call when L2 persists | Pull live metrics + past INCs + bitbucket diff, generate RCA, create INC, post Adaptive Card | `l3_rca_prompt.md` |

Plus a 5th utility topic:

| 5 | Post Approval Card and Wait | Sub-topic called by 2 and 4 | Send Teams Adaptive Card, pause, resume on user click | n/a |

## Topic 1 · Wake on Trigger

### Trigger phrases

Set 5+ trigger phrases for fuzzy matching:
- `@release-pilot go`
- `New release trigger from Jira`
- `release pilot start`
- `new release pilot`
- `process release`

### Topic flow

```
[Trigger]
   ↓
[Message: "Acknowledged. Reading release context · ETA ~90s"]
   ↓
[Variable: extract issue_key from trigger message]
   ↓
[Action: SharePoint Get Item from CHG Tickets where Linked Story = issue_key]
   ↓
[Condition: did we find an existing CHG?]
   ├─ Yes → [Message: "Existing CHG found · loading"]
   └─ No  → [Action: SharePoint Create Item in CHG Tickets · State=New]
   ↓
[Redirect to topic: Generate Risk Packet]
```

### Build steps

1. Topics → **+ New topic** → **From blank**
2. Name: `Wake on Trigger`
3. Add the 5 trigger phrases listed above
4. Click **+** below trigger node, add **Message** node
   - Text: `Acknowledged. Reading release context — ETA ~90 seconds.`
5. Add **Variable** node
   - Name: `issue_key`
   - Value expression: extract from `Activity.Text` using regex `[A-Z]+-\d+` or similar
   - For demo: hardcode `ACQ-3847` if regex extraction is unreliable
6. Add **Action** → **SharePoint** → **Get items**
   - Site: AIPulseReleases
   - List: `CHG Tickets`
   - Filter: `LinkedStory eq '@{Topic.issue_key}'`
7. Add **Condition** node — check if items returned > 0
8. **Yes branch:** Message — "Existing CHG found"
9. **No branch:** Action → SharePoint → **Create item**
   - List: CHG Tickets
   - Fields: Title (from issue key), State=`New`, LinkedStory=`@{Topic.issue_key}`, Application=`acquisition-decision-orchestrator`, CHG_ID=`CHG0049182`
10. After condition merge: **Redirect** to topic `Generate Risk Packet`, pass `issue_key` and `chg_id`

### Variables this topic exposes

- `issue_key` (string) — for downstream topics
- `chg_id` (string) — for downstream topics

## Topic 2 · Generate Risk Packet

### Trigger

Internal call only — invoked by Topic 1. Set trigger to **Manually triggered** or **Topic redirect only**.

### Topic flow

```
[Triggered with: issue_key, chg_id]
   ↓
[Action: SharePoint Get Item — Past INCs filtered by app family + last 180 days]
   ↓
[Action: SharePoint Get Item — service catalog dependencies (for downstream apps)]
   ↓
[Variable: assemble risk_packet_input from issue context + past INCs + downstream apps]
   ↓
[Action: Generative answers · risk_packet_prompt]
   ↓
[Action: SharePoint Create page]
   ↓
[Action: SharePoint Update item — CHG, attach page link, State=Assess]
   ↓
[Redirect to: Post Approval Card and Wait]
   ↓
[After approval: Message — "Approval received · advancing CHG to Implement"]
   ↓
[Action: SharePoint Update item — CHG, State=Implement]
   ↓
[Action: Send email via Outlook]
   ↓
[Action: Teams Post message — status report-back to Jira-routed channel]
   ↓
[End]
```

### Key node configuration

**Generative answers node:**
- Prompt: paste the system prompt from `risk_packet_prompt.md`
- Input variables: pass collected data (issue_key, past_incs, downstream_apps, release_notes_text)
- Output variable: `risk_packet_text`

**Create page node:**
- Page title: `Release {{fix_version}} · {{application}}`
- Page content: paste the template from `06_sharepoint_page_template.md` with `{{ risk_packet_text }}` placeholder filled by the generative answer output

**Send email node:**
- To: `dl-acquisition-oncall@aipulse.onmicrosoft.com`
- Subject: `Release {{fix_version}} CHG advanced to Implement · {{chg_id}}`
- Body: link to release page + summary of what was approved

### For the demo, simplification

Building the full topic logic in 2 hours is tight. For the demo, you can simplify:

- **Pre-populate `past_incs` and `downstream_apps`** as topic variables (don't actually call SharePoint Get items — hardcode them based on the seed data)
- **Pre-populate `release_notes_text`** as a topic variable
- **The Generative answers call is the only real LLM moment** — that's what matters for the demo
- **Skip the actual SharePoint Create page action** — instead, just show the generated risk packet text in a message in Teams

This simplification trades architectural completeness for build speed. Note the simplification in `path_b_demo_assets.md` so you remember to mention "in production this writes to SharePoint" during the demo.

## Topic 3 · Classify Drift

### Trigger

Internal · called by a scheduled action (or manually triggered for demo) when L1 check flags drift.

### Topic flow

```
[Triggered with: chg_id, current_metrics, expected_shifts]
   ↓
[Action: Generative answers · l2_drift_prompt]
   ↓
[Variable: extract classification (EXPLAINED / UNEXPLAINED / PARTIALLY EXPLAINED)]
   ↓
[Condition: classification]
   ├─ EXPLAINED → [Message: "Drift explained by release intent · staying L1"] → [End]
   ├─ PARTIALLY → [Message: "Partially explained · monitoring"] → [End]
   └─ UNEXPLAINED →
        [Action: SharePoint Update item — Active Watches row, State=L2_DRIFT]
        ↓
        [Action: Send email · L2 amber alert to on-call DL]
        ↓
        [Action: Teams Post message · #release-watch-acquisition · amber status card]
        ↓
        [Schedule: re-invoke topic in 15 minutes for cadence update]
        ↓
        [End]
```

### For the demo, simplification

For the demo, skip the schedule action. Manually trigger Topic 3 → ensure UNEXPLAINED is the output → demo shows amber Teams message → manually trigger Topic 4 (L3 RCA) after a beat.

## Topic 4 · Generate L3 RCA (the money topic)

### Trigger

Internal · called from Topic 3 (or manually for demo) when L2 pattern persists.

### Topic flow

```
[Triggered with: chg_id, current_metrics, expected_shifts]
   ↓
[Action: SharePoint Get items — Past INCs filtered by app family + similar pattern tags]
   ↓
[Action: SharePoint Get items — Bitbucket Diffs for the current build]
   ↓
[Action: Generative answers · l3_rca_prompt]
   ↓
[Variable: rca_text, confidence_score (parse from output)]
   ↓
[Action: SharePoint Create item · INC Records · severity=2, state=New, root_cause=rca_text, confidence=confidence_score]
   ↓
[Action: SharePoint Update item · Active Watches row, State=L3_INC_OPEN, LinkedINC=new INC ID]
   ↓
[Redirect to: Post Adaptive Card with RCA actions]
   ↓
[After human acknowledgment: Update CHG and Watches · cadence relaxed]
   ↓
[End]
```

### Key node configuration

**Generative answers node (THE most important node in the whole agent):**
- Prompt: paste the system prompt from `l3_rca_prompt.md`
- Input variables: pass current_metrics, expected_shifts, past_incs (from previous Get items action), bitbucket_diff (from previous Get items action), chg_id, time_since_deploy
- Output variable: `rca_full_text`

**Parsing confidence score:**
- Use a regex or split expression: extract the number after `DIAGNOSTIC CONFIDENCE:` in `rca_full_text`
- Store in variable `confidence_score` as Number

**Create INC item:**
- Title: `RabbitMQ memory exhaustion suspected · {{chg_id}}` (or extract from rca_text)
- INC_ID: auto-generate (`INC0228994` for demo · use Power Automate Compose or simply pre-set)
- Linked CHG: `@{Topic.chg_id}`
- Severity: `2 (High)`
- State: `New`
- Root Cause: `@{Topic.rca_full_text}`
- Diagnostic Confidence: `@{Topic.confidence_score}`

### For the demo

This is the make-or-break moment. The output of this topic is what the jury sees on screen.

Tips:
- **Test the prompt extensively this weekend** — see `l3_rca_prompt.md` test harness
- **Have a backup pre-rendered RCA** — if the Generative answers call fails or returns junk, fall back to a Static Response node containing the pre-written RCA from the test harness expected output
- **Keep the conversation visible in the Teams channel** so the jury sees real-time generation

## Topic 5 · Post Adaptive Card and Wait (utility sub-topic)

### Trigger

Internal · called by Topics 2 and 4.

### Topic flow

```
[Triggered with: card_payload (JSON), channel_id]
   ↓
[Action: Teams "Post adaptive card and wait for a response"]
   ├─ User selects "Approve" → Variable: response = "approved"
   ├─ User selects "Reject"  → Variable: response = "rejected"
   ├─ User selects "Acknowledge" → Variable: response = "acknowledged"
   └─ Timeout (30 min)         → Variable: response = "timeout"
   ↓
[Return response variable to calling topic]
   ↓
[End]
```

### Adaptive Card JSON payloads

**Pre-deploy approval card (used by Topic 2):**

```json
{
  "type": "AdaptiveCard",
  "version": "1.4",
  "body": [
    { "type": "TextBlock", "text": "Release page ready for review", "weight": "Bolder", "size": "Medium" },
    { "type": "FactSet", "facts": [
      { "title": "CHG:", "value": "${chg_id}" },
      { "title": "Release page:", "value": "${page_url}" },
      { "title": "Risk level:", "value": "${risk_level}" }
    ]},
    { "type": "TextBlock", "text": "Review the curated release page and approve CHG advancement to Implement.", "wrap": true }
  ],
  "actions": [
    { "type": "Action.Submit", "title": "Approve", "data": { "response": "approved" } },
    { "type": "Action.Submit", "title": "Reject", "data": { "response": "rejected" } },
    { "type": "Action.OpenUrl", "title": "Open release page", "url": "${page_url}" }
  ]
}
```

**L3 escalation card (used by Topic 4):**

```json
{
  "type": "AdaptiveCard",
  "version": "1.4",
  "body": [
    { "type": "TextBlock", "text": "🔴 L3 escalation · ${chg_id}", "weight": "Bolder", "size": "Large", "color": "Attention" },
    { "type": "TextBlock", "text": "Root cause:", "weight": "Bolder" },
    { "type": "TextBlock", "text": "${root_cause_one_liner}", "wrap": true },
    { "type": "FactSet", "facts": [
      { "title": "INC:", "value": "${inc_id}" },
      { "title": "Confidence:", "value": "${confidence_score}" },
      { "title": "Recommended fix:", "value": "${fix_summary}" }
    ]},
    { "type": "TextBlock", "text": "Take action via the buttons below.", "wrap": true }
  ],
  "actions": [
    { "type": "Action.Submit", "title": "Acknowledge · I'll handle", "data": { "response": "acknowledged" } },
    { "type": "Action.Submit", "title": "Downgrade · Not L3", "data": { "response": "downgraded" } },
    { "type": "Action.OpenUrl", "title": "Open INC", "url": "${inc_url}" }
  ]
}
```

## Testing order (Monday)

Build and test in this order — earlier topics gate later ones:

1. **Topic 1** alone — verify trigger phrase matching, CHG creation
2. **Topic 5** alone (with a hardcoded card) — verify Teams posts and click responses come back
3. **Topic 2** end-to-end — verify generative answers produces risk packet text · verify SharePoint page creation
4. **Topic 4** end-to-end — verify generative answers produces RCA · verify Adaptive Card posts · verify INC creation
5. **Topic 3** — simpler than 4 once 4 works

Don't try to chain Topics 1→2→...→4 until each works in isolation. Debug topology bugs (variables not passing, conditions not branching) one topic at a time.

## Common issues

| Symptom | Fix |
|---|---|
| Generative answers returns truncated text | Increase max response tokens in topic settings |
| Variables not passing between topics | Use "Topic Output" properties explicitly; don't rely on global state |
| Adaptive Card click doesn't return to topic | The "Post and wait" action requires specific Teams permissions · verify in step 06 of agent setup |
| Trigger phrase matching too eager (fires on unrelated messages) | Tighten phrases · add more specific phrases like the full template Jira sends |
| SharePoint Get items returns empty | Filter syntax issue · use SharePoint REST filter format (e.g. `LinkedStory eq 'ACQ-3847'`) |
| Generative answers prompt is too long | Studio may truncate · break into multiple smaller generative answer calls |

## Time estimate

- Topic 1: 30 min
- Topic 5: 30 min
- Topic 2: 60 min
- Topic 4: 60 min
- Topic 3: 30 min
- End-to-end testing + debugging: 60 min

Total: **~4.5 hours**. This is the biggest single workstream Monday. Start it as soon as agent setup (step 07) is done.

---

*Next: `09_power_automate_flows.md` for any bridging flows beyond what Studio natively supports.*
