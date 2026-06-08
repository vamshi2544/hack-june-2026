# Path B · README

> **Implementation:** Real Atlassian Jira → Microsoft Teams (via free webhook) → Copilot Studio (LLM reasoning) → SharePoint (artifacts) → real Adaptive Cards (human handoff). All on free Microsoft 365 tier + free Atlassian tier.

This subdirectory contains everything you need to build Path B from scratch on Monday morning, assuming you've never used Copilot Studio.

---

## Read in this order

1. **`copilot_studio_primer.md`** — concepts, terminology, what to expect. Read this first if you've never used Studio.
2. **`../01_common/monday_morning_checks.md`** — the 6 checks that decide whether Path B is viable. Don't start the build until these pass.
3. **`path_b_build_order.md`** — Monday's build sequence with time estimates.
4. The setup guides in `setup/` — work through them in numbered order during the build.
5. **`mock1_pathB.html`** — visual reference for what the finished demo should look like. Keep open while building.

---

## What Path B looks like (architecture)

```
                         ┌─ FREE PUSH (Jira Automation)
                         │
  ┌────────────┐  comment │   ┌──────────────────┐
  │ Real Jira  │ ─────────┴──▶│ Teams Incoming   │
  │ (Atlassian │              │ Webhook URL      │
  │ Cloud Free)│              │ (in #release-    │
  └────────────┘              │  pilot-channel)  │
                              └────────┬─────────┘
                                       │ message in channel
                                       ▼
                              ┌──────────────────┐
                              │ Copilot Studio   │
                              │ agent published  │
                              │ to Teams channel │
                              │                  │
                              │ Topics:          │
                              │ • Wake on trigger│
                              │ • Risk packet    │
                              │ • Drift classify │
                              │ • L3 RCA         │
                              └────┬───┬───┬─────┘
                                   │   │   │
            ┌──────────────────────┘   │   └────────────────────┐
            ▼ creates pages            ▼ posts cards            ▼ sends emails
  ┌──────────────────┐       ┌──────────────────┐    ┌──────────────────┐
  │ SharePoint Pages │       │  Adaptive Cards  │    │  Outlook · DL    │
  │ • Release pages  │       │  in Teams        │    │  notifications   │
  │                  │       │  (real, with     │    │                  │
  │ SharePoint Lists │       │   action buttons)│    │  (real emails to │
  │ • CHG tickets    │       │                  │    │   test DL)       │
  │ • Past INCs      │       └──────────────────┘    └──────────────────┘
  │ • Metrics        │
  │ • Active watches │
  │ • Bitbucket diffs│
  └──────────────────┘
```

Everything inside the box is real M365. Nothing requires Premium licensing. The only "push" is Jira → Teams via free webhook.

---

## What's in this subdirectory

| File | Purpose |
|---|---|
| `README.md` | This file |
| `copilot_studio_primer.md` | Zero-knowledge intro to Copilot Studio |
| `mock1_pathB.html` | Interactive Path B demo at jury fidelity |
| `m365_connector_inventory.md` | Template — fill in Monday after Check 04 |
| `path_b_demo_assets.md` | Template — URLs, channel names, webhook URLs (fill in Monday) |
| `path_b_build_order.md` | Hour-by-hour Monday build sequence for Path B |
| `setup/01_jira_setup.md` | Create the Jira Cloud Free project + users |
| `setup/02_jira_automation_rule.md` | The rule that fires on comment and posts to Teams |
| `setup/03_teams_webhook_setup.md` | Create the Incoming Webhook URL in the Teams channel |
| `setup/04_sharepoint_site_setup.md` | Create the SharePoint site for AI Pulse |
| `setup/05_sharepoint_list_schemas.md` | Schemas for all 5 SharePoint lists we need |
| `setup/06_sharepoint_page_template.md` | The Confluence-styled release page template |
| `setup/07_studio_agent_setup.md` | Step-by-step agent creation in Studio |
| `setup/08_studio_agent_topics.md` | Per-topic build instructions (4 topics) |
| `setup/09_power_automate_flows.md` | Bridging flow: Teams message → Studio invocation |

---

## What's NOT in this subdirectory (lives in 01_common)

These are universal — same content for Path B and Path E:

- The prompts (`01_common/prompts/`) — paste into Studio's topics
- The mock data (`01_common/data/mock_data_seed.json`) — populate SharePoint lists from this
- The Monday morning checks
- The Monday playbook
- The pitch script
- The demo dry-run script
- The fallback plans

---

## Path B's 3 critical Monday verifications

These are the make-or-break checks for Path B viability. If any of these fail, fall back to Path E for the build (still use Studio for the L3 moment via screen-share if possible).

| Check | Question | What it unlocks |
|---|---|---|
| Studio loads + agent creatable | Can you create a Copilot Studio agent that returns LLM responses? | Basic Path B feasibility |
| Studio publishes to Teams | Can the agent be installed in a Teams channel and respond to messages? | The Teams-as-primary-surface story |
| Adaptive Card actions work | Can the agent post an Adaptive Card with buttons and receive the click as a follow-up event? | The killer human-handoff moment |

Each takes ~15 minutes to verify. See `../01_common/monday_morning_checks.md` for the runnable version.

---

## Path B's failure modes (and what to do)

| If this fails | Workaround |
|---|---|
| Jira Automation can't reach the Teams webhook URL | Use Jira email-out → Power Automate "When new email" → Studio invocation |
| Studio can't post to a Teams channel | Use Studio's Teams channel publishing instead — install agent IN the channel; users @-mention to invoke |
| Studio can't read SharePoint lists | Replace SharePoint list reads with hardcoded JSON inside the topic (less elegant but works) |
| Adaptive Card response callbacks don't work | Use simple follow-up messages — human replies "approved" in plain text; agent reads the text |
| Studio credits run out mid-demo | Pre-record the demo · play the recording |

---

## What Path B looks like in the deck

The deck (`deck1_combined.html`) describes Path B implicitly when it shows "production architecture" on slide 14. The demo flow shown on slides 9-12 is the Path B demo verbatim. **The slides don't need to change between Path B and Path E** — only the narration changes during the live walkthrough. See `../01_common/pitch_script.md` for the two narration variants.

---

## Time budget for Path B build

If all Monday checks pass and you commit to Path B:

| Block | Activity | Owner |
|---|---|---|
| 10:00 – 11:30 | Run Monday checks · decide framework | Vamshi |
| 11:30 – 13:00 | SharePoint site + 5 lists + page template | Anisha |
| 11:30 – 13:00 | Jira automation + Teams webhook setup | Sai Mohit |
| 11:30 – 14:30 | Studio agent + 4 topics + paste prompts | Vamshi |
| 14:30 – 15:30 | Wire Power Automate flow (Teams msg → Studio) | Vamshi + Sai Mohit |
| 15:30 – 17:00 | End-to-end test · iterate · pre-seed SharePoint lists | All |
| 17:00 – 18:00 | Final dry run · video record fallback | All |
| 18:00 – 19:00 | Polish · presentation prep | All |
| Tuesday AM | Final dry run · submit · pitch | All |

If anything blocks for >30 minutes, fall back to Path E for that component.

---

*Path B is the highest-credibility outcome but also the highest-risk build. The checks and the fallback plans exist so you never end up stuck.*
