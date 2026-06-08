<!-- SUPERSEDED-BANNER -->
> ⚠️ **REFERENCE ONLY — Copilot Studio path, abandoned in the platform pivot. Old scenario. Do not build from this.**

# 05 · SharePoint List Schemas

> Exact column definitions for the 6 SharePoint lists. Build these in step 04 after creating the lists.

## List 1 · CHG Tickets

Represents the ServiceNow CHG table. The agent creates/updates rows during pre-deploy.

| Column | Type | Required | Notes |
|---|---|---|---|
| Title | Single line text | Yes | The CHG title — e.g. "Acquisition decision orchestrator · durable messaging" |
| CHG ID | Single line text | Yes | Format: `CHG0049182` |
| Application | Single line text | Yes | App name from service catalog |
| State | Choice | Yes | Choices: `New`, `Assess`, `Implement`, `Watching`, `Closed-Pending-Review`, `Closed` |
| Foundation | Single line text | No | e.g. "CDE2 → CDE3" |
| Risk Classification | Choice | No | Choices: `Low`, `Medium`, `High` |
| Linked Story | Single line text | No | Jira issue key |
| Release Page Link | Hyperlink | No | URL to the SharePoint release page |
| Build ID | Single line text | No | e.g. `20260608.1.42` |
| Deploy Window Start | Date and time | No | |
| Deploy Window End | Date and time | No | |
| Work Notes | Multiple lines of text (Enhanced rich text) | No | Append-only log of agent actions |
| Tech Lead Approval | Choice | No | Choices: `Pending`, `Approved`, `Rejected` |
| Manager Approval | Choice | No | Choices: `Pending`, `Approved`, `Rejected` |
| CAB Approval | Choice | No | Choices: `Pending`, `Approved`, `Rejected` |

Pre-seeded items at demo start: **0** (the agent creates the demo CHG live).

---

## List 2 · INC Records

Represents the ServiceNow INC table. The agent creates rows at L3 escalation.

| Column | Type | Required | Notes |
|---|---|---|---|
| Title | Single line text | Yes | INC title — e.g. "RabbitMQ memory exhaustion suspected · CHG0049182" |
| INC ID | Single line text | Yes | Format: `INC0228994` |
| Linked CHG | Single line text | No | The CHG ID this INC relates to |
| Severity | Choice | Yes | Choices: `1 (Critical)`, `2 (High)`, `3 (Moderate)`, `4 (Low)` |
| State | Choice | Yes | Choices: `New`, `In Progress`, `Resolved`, `Closed` |
| Application | Single line text | Yes | |
| Assignment Group | Single line text | No | e.g. `acquisition-oncall` |
| Short Description | Single line text | No | One-line summary |
| Root Cause | Multiple lines of text | No | The agent's RCA goes here |
| Evidence Summary | Multiple lines of text | No | Bullet list of evidence |
| Diagnostic Confidence | Number | No | 0.00 to 1.00 |
| Created By | Single line text | No | "ReleaseWatch (Studio agent)" or human name |

Pre-seeded items at demo start: **0**.

---

## List 3 · Past INCs (Database)

Pre-seeded historical INCs the agent searches for pattern matching. **READ-ONLY for the agent — pre-populated by humans.**

| Column | Type | Required | Notes |
|---|---|---|---|
| Title | Single line text | Yes | Short description |
| INC ID | Single line text | Yes | |
| Date | Date | Yes | When the incident occurred |
| Application | Single line text | Yes | |
| Short Description | Single line text | No | |
| Root Cause | Multiple lines of text | No | Full RCA from the historical incident |
| Resolution | Multiple lines of text | No | How it was fixed |
| Duration Minutes | Number | No | Total outage duration |
| Severity | Choice | No | Same choices as INC Records |
| Pattern Tags | Multiple lines of text | No | Comma-separated tags: `rabbitmq_backpressure, memory_high_watermark` |

Pre-seeded items at demo start: **3** (from `mock_data_seed.json` → `past_incidents`).

---

## List 4 · Metrics Snapshots

Pre-seeded metric data the agent reads during L1/L2/L3 reasoning. **READ-ONLY for the agent — pre-populated by humans.**

| Column | Type | Required | Notes |
|---|---|---|---|
| Title | Single line text | Yes | Snapshot label — e.g. `pre_deploy_baseline`, `current_l3_red_moment` |
| Timestamp | Date and time | Yes | When this snapshot was taken |
| Application | Single line text | Yes | |
| Snapshot Comment | Single line text | No | e.g. "1h 38m post-deploy. L3 escalation triggered." |
| Producer Throughput Per Min | Number | No | |
| Producer Latency Ms | Number | No | |
| Producer CPU Percent | Number | No | |
| Producer Heap Percent | Number | No | |
| Producer Error Count 30min | Number | No | |
| Consumer Throughput Per Min | Number | No | |
| Consumer Latency Ms | Number | No | |
| RabbitMQ Node1 Memory Percent | Number | No | |
| RabbitMQ Node2 Memory Percent | Number | No | |
| RabbitMQ Backpressure Active | Yes/No | No | |
| Backpressure Started At | Date and time | No | Only set if backpressure is active |

Pre-seeded items at demo start: **5** (pre_deploy, yesterday_same_hour, last_week_same_hour, current_l2_amber, current_l3_red — from `mock_data_seed.json` → `metric_snapshots`).

---

## List 5 · Bitbucket Diffs

Pre-seeded commit diff data the agent reads during L3 RCA. **READ-ONLY for the agent — pre-populated by humans.**

| Column | Type | Required | Notes |
|---|---|---|---|
| Title | Single line text | Yes | Short summary of the commit |
| Commit SHA | Single line text | Yes | 7-char SHA (e.g. `a7f3c19`) |
| Repo | Single line text | Yes | `aipulse/acquisition-decision-orchestrator` |
| Author | Single line text | Yes | |
| Commit Date | Date and time | Yes | |
| File Path | Single line text | No | e.g. `src/main/java/.../DecisionMessagePublisher.java` |
| Diff Snippet | Multiple lines of text | No | The actual `+`/`-` lines |
| Behavioral Change | Yes/No | Yes | Whether the change affects runtime behavior |
| Plausible Cause Of | Multiple lines of text | No | Comma-separated failure mode tags |
| Compared Against | Single line text | No | The previous deploy build ID |
| Current Build | Single line text | No | The current build ID |

Pre-seeded items at demo start: **5** (the 5 commits from `mock_data_seed.json` → `bitbucket_diff.commits`).

---

## List 6 · Active Watches

The ReleaseWatch dashboard. Shows every CHG currently being watched. The agent updates rows as watch state changes.

| Column | Type | Required | Notes |
|---|---|---|---|
| Title | Single line text | Yes | The application being watched |
| CHG ID | Single line text | Yes | |
| Application | Single line text | Yes | |
| Watch State | Choice | Yes | Choices: `L1_CLEAR`, `L2_DRIFT`, `L3_INC_OPEN`, `RECOVERED`, `CLOSED` |
| Watch Started | Date and time | Yes | When ReleaseWatch began watching |
| Last Check | Date and time | No | Most recent L1 check timestamp |
| Notes | Single line text | No | e.g. "All clear · 4h 22m" or "RCA attached · INC0228994" |
| Linked INC | Single line text | No | Only set if state is L3_INC_OPEN |
| Is Demo Target | Yes/No | No | Flag the row for the demo (used in dashboard UI) |

Pre-seeded items at demo start: **9** (from `mock_data_seed.json` → `active_watches_dashboard.items`).

---

## Custom views

For each list, create at least one **filtered view** that makes the demo cleaner:

### CHG Tickets · view "Demo CHG"
- Filter: `CHG ID = CHG0049182`
- Group by: State
- Use this view in the demo when showing CHG progression

### Active Watches · view "Active Only"
- Filter: `Watch State` is not `CLOSED`
- Sort: Watch State (ascending — so L3 appears first, then L2, then L1)
- Color by: Watch State (use SharePoint's column formatting JSON)
- This becomes the **dashboard view** the jury sees

### Past INCs · view "Last 180 days"
- Filter: `Date` is after `[Today] - 180 days`
- Sort: Date (descending)
- Used by the agent during L3 RCA past-INC search

### Metrics Snapshots · view "Demo metrics"
- Filter: `Application = acquisition-decision-orchestrator`
- Sort: Timestamp (ascending)
- Used by the agent for baseline comparison

## Optional column formatting

To make the Watch State column visually color-coded (matching the Path B mock):

1. Open Active Watches list
2. Click the Watch State column header → Column settings → Format this column
3. Paste this JSON:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "style": {
    "padding": "4px 8px",
    "border-radius": "3px",
    "font-family": "monospace",
    "font-size": "11px",
    "font-weight": "bold",
    "text-transform": "uppercase"
  },
  "attributes": {
    "class": {
      "operator": ":",
      "operands": [
        { "operator": "==", "operands": ["[$WatchState]", "L1_CLEAR"] },
        "sp-css-backgroundColor-BgLightGreen sp-css-color-DarkGreen",
        { "operator": ":",
          "operands": [
            { "operator": "==", "operands": ["[$WatchState]", "L2_DRIFT"] },
            "sp-css-backgroundColor-BgLightYellow sp-css-color-DarkYellow",
            { "operator": ":",
              "operands": [
                { "operator": "==", "operands": ["[$WatchState]", "L3_INC_OPEN"] },
                "sp-css-backgroundColor-BgLightRed sp-css-color-DarkRed",
                "sp-css-backgroundColor-BgLightGray sp-css-color-DarkGray"
              ]
            }
          ]
        }
      ]
    }
  },
  "txtContent": "[$WatchState]"
}
```

This gives green/amber/red badges matching the mock.

---

## Time estimate

- All 6 lists' columns: ~25 minutes
- Pre-populating data: ~30 minutes
- Custom views: ~15 minutes
- Column formatting JSON: ~10 minutes

Total: ~80 minutes. Do this Sunday.

---

*Next: `06_sharepoint_page_template.md` for the release page layout.*
