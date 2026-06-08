# 09 · Power Automate Flows

> Bridging flows for Path B. **Use only Standard connectors. No Premium.**

## When you need Power Automate at all

For Path B, Studio handles most things natively. You only need Power Automate when:

1. You need to **schedule** something (Studio topics are event-driven; for "check every 15 minutes" you need a Power Automate scheduled flow)
2. You need to **bridge** between non-Studio-aware systems (e.g., listening to a SharePoint list change to wake the agent)
3. You need to **invoke** the Studio agent programmatically from another flow

For the hackathon demo, you can probably skip Power Automate entirely by manually triggering the topics during the demo. This doc is for completeness — read if you want the real "watch every 15 min" loop.

## Flow 1 · L1 Hourly Check (scheduled)

### Purpose

Every hour, for each Active Watch in `L1_CLEAR` state, compare current metrics vs baselines. Wake the agent if drift detected.

### Trigger

**Recurrence** (Standard connector)
- Frequency: 1 hour
- For demo: change to "1 minute" so it fires visibly during the demo window

### Steps

```
[Trigger: Recurrence every 1 hour]
   ↓
[Action: SharePoint Get Items · Active Watches · filter: WatchState eq 'L1_CLEAR']
   ↓
[Apply to each row]
   ↓
   [Action: SharePoint Get Items · Metrics Snapshots · most recent for this app]
   ↓
   [Condition: any metric outside expected range?]
   ├─ No  → [Action: SharePoint Update Item · Active Watches · Notes = "All clear · {{ duration }}"]
   └─ Yes → [Action: Teams Post message in #release-watch-acquisition · "@Release Pilot drift detected on ${chg_id}"]
            (this wakes Topic 3 via the trigger phrase)
   ↓
[End]
```

### Connectors used (all Standard)

- Recurrence (built-in)
- SharePoint
- Microsoft Teams

### Critical constraint

**Do NOT use Power Automate's "HTTP" action.** That's Premium. To wake the Studio agent, post a Teams message with a trigger phrase the agent will recognize.

## Flow 2 · Demo-Time Manual Trigger

### Purpose

A button or trigger you can fire during the live demo to advance the scenario without waiting for real time.

### Trigger

**Button** (manually triggered flow)

### Steps

```
[Trigger: Manual button]
   ↓
[Action: SharePoint Update Item · Active Watches row for CHG0049182]
   - WatchState: change as needed (L1_CLEAR → L2_DRIFT → L3_INC_OPEN)
   - Notes: update text
   ↓
[Action: Teams Post message in #release-watch-acquisition with trigger phrase for Topic 3 or 4]
   ↓
[End]
```

Create multiple buttons (one per state transition) so the demo flows linearly.

## Flow 3 · Deploy Completion Trigger

### Purpose

When a deploy completes (in real life, UDeploy posts a notification), wake ReleaseWatch. For the demo, this is also manually triggered.

### Trigger

**When an item is created** (SharePoint) · list = `CHG Tickets`, condition = State changed to `Implement` (or use a separate "Deploys" list)

OR

**Button** for demo

### Steps

```
[Trigger]
   ↓
[Action: SharePoint Create Item · Active Watches · WatchState=L1_CLEAR, started=now()]
   ↓
[Action: Teams Post message · "@Release Pilot deploy completed for ${chg_id} · ReleaseWatch on duty"]
   ↓
[End]
```

The Teams message wakes the Studio agent which moves into ReleaseWatch mode.

## What flows you absolutely do NOT need

- **HTTP-based webhooks calling Studio directly** — Premium, blocked
- **Calling Jira REST API from Power Automate** — Premium connector, blocked
- **Calling ServiceNow API** — Premium connector, blocked
- **Custom Connectors** — Premium, blocked

All external API interactions are either pushed-into-M365 (free) or pre-seeded in SharePoint (free).

## Demo simplification

For the actual hackathon demo, you can skip Power Automate flows entirely:

| Real-world | Demo simplification |
|---|---|
| L1 hourly check (Flow 1) | Manually post "@Release Pilot drift detected" in Teams to wake Topic 3 |
| Deploy completion (Flow 3) | Manually post "@Release Pilot deploy completed" in Teams to wake ReleaseWatch |
| Demo-time triggers (Flow 2) | Manually update SharePoint rows or post Teams messages |

This is honest — explain during the demo: "in production this is event-driven by UDeploy and scheduled by Power Automate; here we trigger it manually for the demo pacing."

## Time estimate

- Without Power Automate flows: **0 minutes** (skip this step)
- With Flow 1 + Flow 3: **45 minutes**
- With all 3 flows: **75 minutes**

**Recommendation:** Skip for demo unless you have time after the agent topics are working. The demo works without these.

## Common issues

| Symptom | Fix |
|---|---|
| "Premium connector required" warning | You're using a non-Standard connector · find a Standard alternative |
| Flow doesn't fire on SharePoint change | Polling can take up to 15 min for the trigger to register a change · use a different trigger for demo |
| Recurrence doesn't fire during demo window | Set up a manual "Run flow" button as backup |
| Apply-to-each is slow | Reduce parallelism or filter the input list more aggressively |

---

*Next: back to `../README.md` overview, or jump to `m365_connector_inventory.md` to fill in tenant verification results.*
