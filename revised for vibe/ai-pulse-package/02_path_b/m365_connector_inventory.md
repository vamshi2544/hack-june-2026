# M365 Connector Inventory · Monday Fill-In

> Verify these on Monday morning during the agent setup. Capture results here. Drives path commitment decision.

## Standard connectors expected to be available

For each, mark ✓ available / ✗ blocked / ? unknown:

| Connector | Action needed | Status | Notes |
|---|---|---|---|
| SharePoint | Get items, Create item, Update item, Create page | ? | Critical for Path B |
| Microsoft Teams | Post message, Post adaptive card and wait | ? | Critical for Path B |
| Office 365 Outlook | Send email (V2) | ? | Used for L2 amber alerts |
| Microsoft Forms | Get form response | ? | Optional · alternative approval mechanism |
| Approvals | Start an approval | ? | Alternative to Adaptive Card approval |
| Recurrence (built-in) | Trigger every X minutes | ? | For L1 scheduled checks |
| Manual / Button | User-triggered | ? | For demo manual triggers |

## Premium connectors expected to be blocked

If any of these are unexpectedly available, note it — but **do not use them**:

| Connector | Status |
|---|---|
| Jira | Premium · expect blocked |
| HTTP (generic) | Premium · expect blocked |
| Custom Connector | Premium · expect blocked |
| ServiceNow | Premium · expect blocked |
| Bitbucket | Premium · expect blocked |

## Studio-specific verifications

| Capability | Status | Notes |
|---|---|---|
| Can create new agent | ? | Check 01 in monday_morning_checks.md |
| Generative answers enabled | ? | |
| Knowledge sources can be added (SharePoint) | ? | |
| Topics can be created | ? | |
| Agent can be published to Teams channel | ? | Check 03 |
| Adaptive Card actions work | ? | Check 05 |
| Generative answers cost / quota | ? | Check 06 |

## Decision rules based on results

- **All Standard ✓ + Studio ✓ + Adaptive Card ✓** → Path B is fully viable. Commit.
- **Standard ✓ + Studio ✓ + Adaptive Card ✗** → Path C (Studio + SharePoint without Adaptive Card features). Drop the click-to-approve dance.
- **Studio ✗ but other M365 ✓** → Path E. Document Studio in the architecture slide as "what we'd use in production."
- **M365 ✗ entirely (some tenant restriction)** → Path E for sure. Don't waste time on M365.

## Notes / surprises

(Fill in Monday)

---

*This file is a Monday fill-in template. Update it as you run the checks.*
