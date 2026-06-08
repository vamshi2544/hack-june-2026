# 01 · Common · README

> Universal documents used by both Path B and Path E. Build these once. Use both ways.

## What's in here

| Subfolder / File | Purpose |
|---|---|
| `prompts/` | The 4 LLM prompts (paste into Studio for Path B · show in deck for Path E) |
| `data/mock_data_seed.json` | Pre-seeded demo data (becomes SharePoint rows for B · React state for E) |
| `DECISION_LOG.md` | Append-only log of architectural decisions and why |
| `pitch_script.md` | The spoken narrative for the demo · two variants (B and E) |
| `monday_morning_checks.md` | 6 verification checks to run Monday 10 AM |
| `monday_playbook.md` | Hour-by-hour Monday plan for the team |
| `team_allocation.md` | Who owns what workstream |
| `demo_dry_run_script.md` | End-to-end rehearsal script |
| `fallback_plans.md` | If X fails, do Y · layered contingency model |

## How to use

- **Sunday:** read `prompts/`, test L3 RCA against Claude. Review `monday_playbook.md` with team.
- **Monday 10 AM:** run `monday_morning_checks.md`. Decide path. Allocate per `team_allocation.md`.
- **Monday afternoon:** build per the path-specific build orders. Reference these common files as needed.
- **Monday evening:** dry run per `demo_dry_run_script.md`. Practice per `pitch_script.md`.
- **Tuesday:** present. Use `fallback_plans.md` if anything breaks.

## What's universal vs path-specific

| Universal (here) | Path-specific (02_path_b/ or 03_path_e/) |
|---|---|
| The prompts | How the prompts are wired into the surface |
| The seed data | Where the seed data lives (SharePoint vs React state) |
| The pitch story | The narration variant for each path |
| The Monday plan | The build order per path |
| The team allocation | Implementation steps |

If you're trying to figure out where a piece of documentation belongs, ask: "does this apply identically to Path B and Path E?" If yes, here. If no, in the path subfolder.
