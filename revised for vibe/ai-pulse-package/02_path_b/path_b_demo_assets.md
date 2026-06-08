# Path B Demo Assets · Monday Fill-In

> The URLs, channel names, IDs, and credentials needed for the live demo. Fill in as you go Monday.

## Atlassian Jira

- Workspace URL: `https://<fill-in>.atlassian.net`
- Project key: `ACQ`
- Demo release story key: ? (likely `ACQ-1` first issue; may rename or just use whatever it creates)
- Demo release story URL: ?
- API token (for backup verification): `<paste here>`

## Microsoft Teams

- Team name: `AI Pulse`
- `#release-pilot-channel` URL: ?
- `#release-watch-acquisition` URL: ?
- Jira-to-Teams Incoming Webhook URL: ?
  (Paste full URL; keep this file private)

## SharePoint

- Site URL: `https://<your-tenant>.sharepoint.com/sites/AIPulseReleases`
- Demo release page URL: ?
- Active Watches list URL: ?
- CHG Tickets list URL: ?
- INC Records list URL: ?
- Past INCs list URL: ?
- Metrics Snapshots list URL: ?
- Bitbucket Diffs list URL: ?

## Copilot Studio

- Studio environment URL: ?
- Agent name: `AI Pulse Release Agent`
- Agent ID (after creation): ?
- Test bot URL: ?

## Outlook / DL

- Distribution list address: `dl-acquisition-oncall@aipulse.onmicrosoft.com`
  (or a test alias if you can't create a real DL — note here)

## Demo accounts

- Primary demo driver: Vamshi V (vamshi@aipulse.onmicrosoft.com or similar)
- Secondary (will play "human on-call"): Anisha C
- Tertiary (will play "second human"): Sai Mohit

## Notification flow during demo

The live demo will trigger these real notifications. Make sure each delivers:

| Event | Real notification | Expected delivery |
|---|---|---|
| Jira comment "@release-pilot go" | Adaptive Card posts to #release-pilot-channel | < 5 seconds |
| Pre-deploy approval card | Adaptive Card in #release-pilot-channel | < 3 seconds |
| L2 amber email | Email to DL | < 30 seconds |
| L2 amber Teams message | Message in #release-watch-acquisition | < 3 seconds |
| L3 INC + Adaptive Card | Adaptive Card in #release-watch-acquisition | < 5 seconds |

## Pre-demo checklist (Monday 8 PM)

- [ ] All URLs above filled in
- [ ] Jira automation rule shows successful test in audit log
- [ ] SharePoint site reachable from Studio (test "Get items" action)
- [ ] Teams channels show no leftover test messages from build
- [ ] Studio agent responds to `@Release Pilot hello` in both channels
- [ ] Adaptive Card test message · click returns expected response
- [ ] Demo seed data in SharePoint matches `mock_data_seed.json`
- [ ] Distribution list receives test email
- [ ] Browser tabs prepared: Jira story / Teams channels / SharePoint site / Studio canvas
- [ ] Fallback video recorded (see `demo_dry_run_script.md`)

## Tuesday morning re-check (08:30 ET)

- [ ] Re-run all URLs · everything still loads
- [ ] Re-test Jira → Teams webhook (one fresh test)
- [ ] Re-test Studio agent in Teams
- [ ] Confirm no rate limiting / quota exhaustion overnight

---

*Keep this file in git but DO NOT push to a public repo — it contains URLs and tokens.*
