# AI Pulse · ReleasePilot + ReleaseWatch · Implementation Package

> **Team AI Pulse** · Vamshi V · Anisha C · Sai Mohit
> **Hackathon:** Synchrony Vibe Coding 2026 · June 8–9
> **Project:** Two-agent release lifecycle automation · "from comment to confidence"

This package contains everything needed to build the project from scratch on Monday morning, regardless of which implementation path you commit to. Read this file first to understand what's where.

---

## How this package is organized

```
ai-pulse-package/
├── README.md                          ← you are here
├── HANDOFF.md                         ← master context for new chat sessions
├── PATH_DOCS_INVENTORY.md             ← per-path document checklist
├── strategy_v2.html                   ← 5-path strategy + Monday checklist
├── deck1_combined.html                ← 16-slide pitch deck (pending rebuild)
│
├── 01_common/                         ← used by both Path B and Path E
│   ├── README.md
│   ├── DECISION_LOG.md
│   ├── pitch_script.md
│   ├── monday_morning_checks.md
│   ├── monday_playbook.md
│   ├── team_allocation.md
│   ├── demo_dry_run_script.md
│   ├── fallback_plans.md
│   ├── prompts/                       ← LLM prompts (same for both paths)
│   │   ├── README.md
│   │   ├── master_agent_prompt.md
│   │   ├── risk_packet_prompt.md
│   │   ├── l2_drift_prompt.md
│   │   └── l3_rca_prompt.md           ← THE most important file
│   └── data/
│       └── mock_data_seed.json        ← pre-seeded data for both paths
│
├── 02_path_b/                         ← Path B: real M365 surfaces
│   ├── README.md
│   ├── copilot_studio_primer.md       ← zero-knowledge intro to Studio
│   ├── mock1_pathB.html               ← interactive Path B mock
│   ├── m365_connector_inventory.md
│   ├── path_b_demo_assets.md
│   ├── path_b_build_order.md
│   └── setup/                         ← step-by-step setup guides
│       ├── 01_jira_setup.md
│       ├── 02_jira_automation_rule.md
│       ├── 03_teams_webhook_setup.md
│       ├── 04_sharepoint_site_setup.md
│       ├── 05_sharepoint_list_schemas.md
│       ├── 06_sharepoint_page_template.md
│       ├── 07_studio_agent_setup.md
│       ├── 08_studio_agent_topics.md
│       └── 09_power_automate_flows.md
│
├── 03_path_e/                         ← Path E: local vibe-coded React app
│   ├── README.md
│   ├── mock1_combined.html            ← interactive Path E mock
│   ├── react_app_spec.md
│   ├── state_machine_spec.md
│   ├── choreography_spec.md
│   ├── component_inventory.md
│   ├── data_loader_template.ts
│   └── path_e_build_order.md
│
└── 04_idea2_watch_only/               ← optional · ReleaseWatch as standalone idea
    ├── README.md
    └── idea2_releasewatch_spec.md
```

---

## What's the difference between the two ideas?

**Idea 1: ReleasePilot + ReleaseWatch (the primary pitch).** End-to-end release lifecycle automation. Two agents, one narrative. Pre-deploy work (Pilot) hands off to post-deploy work (Watch) through a risk packet.

**Idea 2: ReleaseWatch only (a focused alternative).** Just the post-deploy agent. Sharper story for SRE-focused audiences. Less ambitious scope, less to build, still uses the same prompts and mock data.

Both ideas use the **same package**. Idea 2 just skips steps 1–10 (the Pilot phase) and starts at step 11 (deploy complete).

---

## What's the difference between Path B and Path E?

Same demo, same story, different surfaces. The narrative arc is identical for both — 8 scenes the jury watches. What differs is *where* those scenes render.

| Aspect | Path B | Path E |
|---|---|---|
| Trigger | Real Atlassian Jira comment | Vibe-coded Jira UI in React |
| LLM reasoning | Real Copilot Studio | Scripted streaming text |
| Release page | Real SharePoint page | Vibe-coded Confluence UI |
| CHG tracking | Real SharePoint list | Vibe-coded ServiceNow UI |
| Human approval | Real Teams Adaptive Card | Mock Teams panel in React |
| Email notifications | Real Outlook | Mock notifications |
| Network needs | Real Jira webhook → Teams Incoming Webhook → Studio | None |
| Reliability for demo | Medium (many real components) | High (zero external deps) |
| Architectural credibility | Highest possible without prod tooling | Lower — looks like a demo |

**You decide which path Monday morning** based on the 6 verification checks (see `01_common/monday_morning_checks.md`). Until then, prep for both.

---

## How to use this package

### Tomorrow (Sunday)

Throwaway-build sequence:

1. Read `HANDOFF.md` end to end to refresh full context.
2. Open `01_common/prompts/l3_rca_prompt.md` and test the prompt against Claude/ChatGPT to verify it produces a coherent RCA for the demo scenario. Iterate if needed.
3. Read `02_path_b/copilot_studio_primer.md` to remove the unknown-unknowns about Studio.
4. Read `03_path_e/react_app_spec.md` to know what the Path E build looks like.
5. Read `01_common/monday_playbook.md` so the team is aligned on Monday's hour-by-hour plan.

### Monday June 8 · 10:00 AM ET

1. Vamshi runs `01_common/monday_morning_checks.md` end to end · 60–90 minutes max.
2. Based on the checks, commit to Path B, Path E, or a hybrid. See `strategy_v2.html` section 04 for the decision matrix.
3. Team allocation per `01_common/team_allocation.md`. Each person opens their workstream's doc and starts building.
4. End of day: dry run with the full team. Record fallback video. See `01_common/demo_dry_run_script.md`.

### Tuesday June 9 · 09:15 AM ET

Submit. Live demo or fallback video, depending on confidence.

---

## What's been built so far (status snapshot)

| File | Status | Notes |
|---|---|---|
| `HANDOFF.md` | ✅ Built | Master context · paste into new chat sessions |
| `PATH_DOCS_INVENTORY.md` | ✅ Built | Per-path doc list |
| `strategy_v2.html` | ✅ Built | 5-path strategy doc |
| `deck1_combined.html` | ⚠️ Needs rebuild | Title slide, slide 2 reframe, SNOW UI corrections pending |
| `02_path_b/mock1_pathB.html` | ✅ Built | Path B interactive mock |
| `03_path_e/mock1_combined.html` | ✅ Built | Path E interactive mock |
| All other docs in this package | ✅ Built | This release |

---

## Critical reminders

- **All Synchrony references in artifacts must be mock/test data only.** No real customer info, no real CHGs, no real INCs. The 3 past INCs (INC0221904, INC0218763, INC0214098) are invented.
- **The agent's identity is fixed:** ReleasePilot pre-deploy, ReleaseWatch post-deploy. Don't mix the two names.
- **Approved tools only:** Copilot Studio, Rovo, GitHub Copilot. NOT Power Automate Premium.
- **Hackathon discipline:** all code, Studio configuration, and Power Automate flows are created Monday after the official start. This weekend is preparation only.
- **Path commitment is Monday's decision, not earlier.** Don't burn cycles arguing path choice before the checks are run.

---

## If something goes wrong

See `01_common/fallback_plans.md` for the layered contingency model. Short version: Path E is always achievable. Recorded video is always playable. Architecture story is always credible. You cannot end up with nothing.

---

*This package is git-ready. Push it to a private repo Sunday night so the office laptop can clone it Monday morning. Reference HANDOFF.md if you need to continue any task in a fresh Claude session.*
