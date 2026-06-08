# Monday Playbook · June 8 2026

> Team-level hour-by-hour plan. Path-specific build orders live in `02_path_b/path_b_build_order.md` and `03_path_e/path_e_build_order.md` — this doc is the umbrella schedule everyone follows.

## Pre-Monday checklist (Sunday evening)

- [ ] All package files reviewed
- [ ] L3 RCA prompt tested against Claude / ChatGPT · output close to expected
- [ ] SharePoint site pre-built (optional but recommended — saves 90 min Monday)
- [ ] SharePoint lists pre-populated with seed data (optional · saves 30 min)
- [ ] Personal Atlassian project pre-created (optional · saves 20 min)
- [ ] Office laptop confirmed accessible Monday morning
- [ ] Studio credentials confirmed from organizers (if pre-distributed)
- [ ] Team chat alive · everyone reading messages

## Monday timeline

### 10:00 – 11:30 · Checks + commit

| Time | Vamshi | Anisha | Sai Mohit |
|---|---|---|---|
| 10:00 | Run Check 01 (Studio access) | Pre-warm SharePoint site if not done Sunday | Pre-warm Jira project if not done Sunday |
| 10:15 | Run Check 02 (connectors) | Continue SharePoint setup | Continue Jira setup |
| 10:30 | Run Check 03 (Teams publish) | Idle until commit | Idle until commit |
| 10:45 | Run Check 04 (Adaptive Cards) | Standby | Standby |
| 11:00 | Run Check 05 (webhook) | Standby | Standby |
| 11:15 | Run Check 06 (quota) · evaluate | Standby | Standby |
| 11:30 | **POST PATH COMMITMENT** | Read commitment · prep workstream | Read commitment · prep workstream |

### 11:30 – 13:30 · Parallel build (workstreams diverge by path)

**If Path B committed:** see `02_path_b/path_b_build_order.md` (11:30 – 13:00 section).
**If Path E committed:** see `03_path_e/path_e_build_order.md` (11:30 – 13:30 section).
**If Path C or D committed:** hybrid · use Path B docs for the parts that work, Path E for the rest.

By 13:30: each workstream's first deliverable is done. Time for integration test.

### 13:30 – 14:30 · Lunch + midpoint sync

- 13:30 — Lunch (real food · 30 min)
- 14:00 — Team sync · each person reports progress + blockers
- 14:15 — Decide if any workstream is at risk · re-allocate if needed
- 14:30 — Back to building

### 14:30 – 16:30 · Build core demo

By 16:30: end-to-end demo flow works at low fidelity. The story can be told even if some bits are rough.

### 16:30 – 17:30 · First dry run

See `demo_dry_run_script.md`.

- Vamshi presents the full pitch + demo
- Anisha + Sai Mohit observe and note glitches
- Time the demo (target: 6-8 min for Idea 1)
- Capture the top 3 issues

### 17:30 – 18:30 · Fixes

Fix the top 3 issues from dry run #1. Don't over-engineer · just make them work.

### 18:30 – 19:00 · Second dry run

Cleaner version. If still glitchy, third dry run after another fix pass.

### 19:00 – 20:00 · Record fallback video

OBS or QuickTime screen recording of the full demo. 6-8 minutes. This plays Tuesday if anything breaks. See `fallback_plans.md` for the layered video strategy.

### 20:00 – 21:00 · Final polish + dinner

- Pitch script practice (`pitch_script.md`)
- Browser tabs prepared in order
- Each team member rehearses their role
- Dinner · early to bed

### 21:00 – 22:00 · Buffer

If anything ran long, this is the buffer. Use it for polish, not new features.

## Tuesday June 9

### 07:30 – 08:30 · Sanity check

- Vamshi opens laptop · verifies everything still works
- Run the fallback video once · confirm it plays
- Open every browser tab needed for live demo
- Re-test Adaptive Card click (Path B) or scene controls (Path E)

### 08:30 – 09:15 · Final prep + submit

- 08:30 — Team assembled
- 08:45 — Final dry run #3 (under 10 min — speed not perfection)
- 09:00 — Move to demo location / Teams meeting
- 09:10 — Set up screen sharing
- 09:15 — Submit / present

## Rules of engagement Monday

1. **No new ideas after 13:30.** Lock scope at the midpoint sync. Anything new gets a "great for the next version" parking-lot note.
2. **No silent debugging.** If you're stuck more than 15 min, post in team chat. Someone else can probably help fast.
3. **30-min rule.** No single task eats more than 30 min before fallback. If it's 30 min on a SharePoint column · fall back to JSON. If it's 30 min on a Studio topic · simplify the topic.
4. **Lunch is non-negotiable.** Tired team makes bad decisions.
5. **Recording the fallback video is non-negotiable.** Worst-case insurance · 30 min Monday evening · could save Tuesday.

## What can derail Monday and how to detect it

| Signal | Likely problem | Response |
|---|---|---|
| Vamshi still on Check 01 at 11:00 | Studio access blocked | Pivot to Path E now · don't wait for 11:30 |
| Workstream A stalled at 13:00 | SharePoint blocked or complex | Fall back to JSON-in-Studio approach |
| Workstream B (Sai Mohit) idle by 12:30 | Jira/Teams flow done early | Reassign to help Anisha or Vamshi |
| First dry run takes 12+ min | Demo is too long | Cut scenes 6-7 (the optional scenes) |
| L3 RCA generation produces garbage | Prompt needs more iteration | Switch to pre-rendered RCA fallback |
| Adaptive Card click doesn't return | Studio limitation | Switch to plain Teams messages for handoff |
| Team energy dropping at 17:00 | Long day · need break | 15 min break · stretch · then push to first dry run |

## Communication discipline

- **Team chat is the source of truth.** All status updates go there.
- **Use status emojis:** 🟢 on track · 🟡 risk · 🔴 blocked.
- **Decisions get recorded** in DECISION_LOG.md immediately, even rough ones.
- **Don't argue paths after commitment.** If Path B fails late, switch to Path E gracefully. Don't relitigate.

---

*The playbook is opinionated. Adjust per actual Monday pace. Keep the integration-test checkpoints and the dry-run discipline.*
