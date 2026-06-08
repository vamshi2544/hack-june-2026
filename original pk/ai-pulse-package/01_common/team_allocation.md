# Team Allocation · Monday June 8

> Who owns what. Hand-off discipline. Communication norms.

## Roles in plain English

| Role | Person | Responsibilities |
|---|---|---|
| **Tech lead / decision owner** | Vamshi V | Monday checks · path commitment · Studio agent (Path B) or state machine (Path E) · pitch driver Tuesday |
| **UI / surface owner** | Anisha C | SharePoint site + lists (Path B) or React components (Path E) · "human on-call" role in dry runs |
| **Integration / wire-up owner** | Sai Mohit | Jira automation + Teams webhook (Path B) or state machine + data flow (Path E) · "second human" role in dry runs |

Roles flex per path. If Path B, Anisha is heavy on SharePoint and Sai Mohit is heavy on Jira/Teams wiring. If Path E, both are equally on React components with Sai Mohit owning the state machine.

## Path B allocation (workstream level)

| Time | Vamshi | Anisha | Sai Mohit |
|---|---|---|---|
| 10:00 – 11:30 | Monday checks | Pre-warm SharePoint if not done Sunday | Pre-warm Jira if not done Sunday |
| 11:30 – 13:00 | Studio agent setup + Topic 1 + Topic 5 | SharePoint site + 6 lists + column schemas | Jira automation rule + Teams webhook |
| 13:00 – 14:30 | Studio Topics 2 (risk packet) and 4 (L3 RCA) | Pre-populate read-only SharePoint lists with seed data | Test Jira → Teams end-to-end · debug if needed |
| 14:30 – 15:00 | **Midpoint sync** | **Midpoint sync** | **Midpoint sync** |
| 15:00 – 16:30 | Studio Topic 3 (drift) + integration | Custom views + column formatting JSON | Help with whichever workstream is slow |
| 16:30 – 17:30 | First dry run · drives demo | Observes · plays "Anisha approver" | Observes · plays "second human" |
| 17:30 – 19:00 | Fixes from dry run · second dry run · record fallback video | Same | Same |
| 19:00 – 21:00 | Polish + pitch practice | Polish | Polish |

## Path E allocation (workstream level)

| Time | Vamshi | Anisha | Sai Mohit |
|---|---|---|---|
| 10:00 – 11:30 | Monday checks | Idle until commit | Idle until commit |
| 11:30 – 12:00 | Bootstrap Next.js · install deps | Pair on bootstrap | Pair on bootstrap |
| 12:00 – 13:30 | SNOW route + Dashboard route + integration | Jira route + Confluence route + Teams route | DemoProvider + reducer + SceneControls |
| 13:30 – 14:30 | **Lunch + midpoint sync** | **Lunch + midpoint sync** | **Lunch + midpoint sync** |
| 14:30 – 15:00 | Walk through scenes 1-10 manually | Walk through scenes 11-17 manually | Fix integration bugs across both halves |
| 15:00 – 16:30 | Choreography (metric drift, streaming text) | UI polish | State machine polish |
| 16:30 – 17:30 | First dry run | Observes + plays "Anisha" | Observes + plays "second human" |
| 17:30 – 19:00 | Fixes · second dry run · record fallback video | Same | Same |
| 19:00 – 21:00 | Polish + pitch practice | Polish | Polish |

## Communication norms

### Team chat updates

Every 30 minutes, each person posts in team chat:

```
🟢 [name] · 14:00 · Working on [task] · ETA [time]
```

If status changes:

```
🟡 [name] · 14:30 · [task] · blocker: [what] · need help with [what specifically]
```

Or:

```
🔴 [name] · 14:30 · [task] BLOCKED · need decision: [option A vs B]
```

### Calls for help

If you've been stuck >15 min, post 🟡. Someone might help fast — don't suffer silently.

### Decisions

Any architectural decision posted to chat AND added to DECISION_LOG.md. No undocumented decisions.

### Time-bounding

Use the 30-min rule. If a task eats >30 min, declare it 🔴 and ask the team about falling back.

## What each person needs Monday morning

### Vamshi

- Office laptop · charged
- Studio access credentials
- This package downloaded / git-cloned
- All browser tabs ready: Studio, SharePoint, Teams, Jira
- The L3 RCA prompt tested against Claude/ChatGPT (Sunday homework)

### Anisha

- Office laptop · charged
- SharePoint admin access
- This package available
- The seed JSON open for copy-paste reference
- mock1_pathB.html (Path B) or mock1_combined.html (Path E) open for visual reference

### Sai Mohit

- Office laptop · charged
- Atlassian Cloud login (test the day before)
- Microsoft Teams admin permissions on the AI Pulse team
- This package available
- terminal / curl ready for webhook testing

## Hand-offs between workstreams

### Path B hand-offs

| From | To | Hand-off artifact | Time |
|---|---|---|---|
| Sai Mohit (webhook ready) | Vamshi (agent topic) | Webhook URL in `path_b_demo_assets.md` | ~12:30 |
| Anisha (lists ready) | Vamshi (agent topic) | List URLs in `path_b_demo_assets.md` | ~13:00 |
| Vamshi (Topic 2 ready) | Anisha (test approver) | Demo Adaptive Card test | ~14:30 |

### Path E hand-offs

| From | To | Hand-off artifact | Time |
|---|---|---|---|
| Sai Mohit (reducer ready) | Anisha + Vamshi (components) | DemoContext + actions documented | ~12:30 |
| Anisha (components ready) | Sai Mohit (integration) | Components committed to git | ~13:30 |
| Vamshi (Dashboard ready) | Anisha (visual review) | Dashboard URL + screenshot in chat | ~13:30 |

## Backup roles

If someone is sick or absent Tuesday:

- **If Vamshi absent:** Anisha drives the pitch using the script. Vamshi joins remotely if possible. The deck and the dry runs prepared so anyone can present.
- **If Anisha absent:** Vamshi adds Anisha's approver role to his own actions. The dry run accommodates.
- **If Sai Mohit absent:** Vamshi covers second-human role. Build slowdowns Monday — but pitch isn't affected.

## Team meals

- **Lunch 13:30:** real food · no laptops · 30 min minimum
- **Dinner 20:00:** light · keep momentum
- **No drinking Monday.** Tuesday morning matters more than Monday night.

## Energy management

- **Stretch every 90 minutes.** Someone calls it · everyone stretches.
- **No phones during dry runs.** Full attention.
- **Disagreements are time-bounded.** 5 min of debate, then a decision. If we can't decide in 5, default to lower-risk option and move.

---

*The allocation is a starting point. Adjust per actual Monday pace. Keep communication discipline regardless.*
