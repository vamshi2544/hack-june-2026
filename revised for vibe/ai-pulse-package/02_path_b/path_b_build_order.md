# Path B Build Order · Monday Hour by Hour

> The recommended sequence for Monday June 8 if Path B is committed after morning checks. See `01_common/monday_playbook.md` for the team-level plan; this is Path-B-specific detail.

## 10:00 – 11:30 ET · Vamshi runs Monday checks

See `01_common/monday_morning_checks.md`. If checks pass (or pass enough), commit to Path B at ~11:30. If not, branch to Path E and skip the rest of this doc.

## 11:30 – 13:00 ET · Two parallel workstreams

### Workstream A (Anisha): SharePoint site + lists

1. 11:30 — Create AI Pulse Releases site (`04_sharepoint_site_setup.md` step 1–2)
2. 11:45 — Create 6 lists (just lists, no columns yet)
3. 12:00 — Add columns per `05_sharepoint_list_schemas.md` for the 3 read-only lists first (Past INCs, Metrics Snapshots, Bitbucket Diffs)
4. 12:30 — Pre-populate the 3 read-only lists from `mock_data_seed.json`
5. 12:45 — Add columns for the 3 dynamic lists (CHG, INC, Active Watches)
6. 13:00 — Custom views + column formatting JSON for Active Watches

If Anisha gets stuck on SharePoint permissions, fall back to Forms + Lists in OneDrive.

### Workstream B (Sai Mohit): Jira + Teams wiring

1. 11:30 — Verify Atlassian Cloud Free access + project exists (Vamshi may have done this Sunday)
2. 11:45 — Verify Teams team + channels exist
3. 12:00 — Create Teams Incoming Webhook (`03_teams_webhook_setup.md`)
4. 12:30 — Create Jira Automation rule (`02_jira_automation_rule.md`)
5. 12:50 — Test end-to-end: comment in Jira → Adaptive Card in Teams
6. 13:00 — Document the webhook URL in `path_b_demo_assets.md`

If Sai Mohit gets stuck on Workflows app, fall back to plain text Teams message.

## 11:30 – 14:30 ET · Vamshi: Studio agent

1. 11:30 — Run final Studio checks (already done in morning checks · 5 min)
2. 11:35 — Create agent (`07_studio_agent_setup.md`)
3. 12:00 — Paste master prompt, configure generative AI, add knowledge source
4. 12:30 — Smoke test in Test bot pane
5. 12:45 — Publish to Teams · install in both channels
6. 13:00 — Topic 1: Wake on Trigger (the easy one)
7. 13:30 — Topic 5: Post Adaptive Card and Wait (utility · build before Topics 2 and 4)
8. 14:00 — Topic 2: Generate Risk Packet
9. 14:30 — Pause Studio work · do midpoint integration test

## 14:30 – 15:30 ET · Midpoint integration test

All three workstreams pause. Test:
1. Anisha confirms SharePoint lists fully populated
2. Sai Mohit comments `@release-pilot go` in Jira
3. Verify: Adaptive Card appears in `#release-pilot-channel`
4. Verify: agent wakes (Topic 1 fires)
5. Verify: Topic 2 runs · risk packet generated · page created in SharePoint (or text-message fallback)
6. Verify: approval card appears
7. Anisha clicks Approve · verify Topic 2 completes

If all green: continue. If not: debug for 15 min · then continue with known issues.

## 15:30 – 17:00 ET · Vamshi finishes Studio

1. 15:30 — Topic 4: Generate L3 RCA (the money topic)
2. 16:15 — Topic 3: Classify Drift
3. 16:45 — End-to-end test of all 4 topics in sequence (with manual triggers between)

## 17:00 – 18:00 ET · Full team dry run

See `01_common/demo_dry_run_script.md`.

1. 17:00 — First dry run · note timing · note any glitches
2. 17:20 — Fix glitches
3. 17:40 — Second dry run · should be cleaner
4. 17:55 — Decide: are we ready to record fallback video?

## 18:00 – 19:00 ET · Record fallback video

If anything in the live build feels fragile, record a video of the demo working. This video plays if live demo breaks Tuesday.

See `01_common/fallback_plans.md` for the layered video strategy.

## 19:00 – 20:00 ET · Polish

- Pitch script practice (`01_common/pitch_script.md`)
- Open all browser tabs in the order needed Tuesday
- Each team member knows their role
- Lights / mics / screen sharing tested

## Tuesday June 9 · 07:30 – 09:15 ET

1. 07:30 — Vamshi opens laptop · sanity-check everything still works
2. 08:00 — Team assembled · final dry run #3
3. 08:30 — Move to demo room / Teams meeting
4. 08:45 — Set up screen sharing · open browser tabs
5. 09:00 — Stand by for submission
6. 09:15 — Submit / present

## What can go wrong (and the time-bounded responses)

| Problem | Time budget | Fallback |
|---|---|---|
| SharePoint won't let us create site | 30 min | Use a different SharePoint site you already own; or fall back to OneDrive |
| Studio agent doesn't deploy to Teams | 30 min | Use Studio Test panel (built-in) for the demo |
| Generative answers produces junk | 30 min iteration; then 15 min for fallback | Hardcode pre-rendered RCA in a static message node |
| Jira automation doesn't fire | 20 min | Manually post the trigger message in Teams during demo |
| Teams Adaptive Card doesn't work | 20 min | Use plain Teams messages instead of cards |
| Power Automate quota hit | n/a | Don't use Power Automate · do manual triggers |

**Hard rule:** if any single component eats >30 min Monday, fall back to that component's mock equivalent. Don't sink hours.

---

*The build order is opinionated. Adjust per the team's actual Monday morning pace, but keep the integration-test checkpoints.*
