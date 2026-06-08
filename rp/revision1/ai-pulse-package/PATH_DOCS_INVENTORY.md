# Path B vs Path E · Document Inventory

> What to create for each path. Read `HANDOFF.md` first for project context.

The good news: **most documents are universal.** Only a small set is path-specific. The deck and pitch are the same. The mocks differ visually but the data underneath is the same. Only the wiring documents (how the agent reaches its surfaces) differ.

---

## 1 · Universal documents (build once, used by both paths)

These power both paths regardless of which one you ship. Build these first — they're the foundation.

| File | Format | Status | Purpose |
|---|---|---|---|
| `README.md` | md | pending | Repo entry point · 1-page summary + pointers |
| `HANDOFF.md` | md | **BUILT** | Master context document for new sessions |
| `DECISION_LOG.md` | md | pending | Append-only log of architectural decisions and why |
| `strategy_v2.html` | html | **BUILT** | 5-path strategy + Monday checklist + decision matrix |
| `deck1_combined.html` | html | needs rebuild | 16-slide end-to-end pitch deck (Pilot + Watch) |
| `pitch_script.md` | md | pending | Spoken narrative for the demo · timing notes · presenter rotations |
| `master_agent_prompt.md` | md | pending | System prompt covering both ReleasePilot and ReleaseWatch personas |
| `risk_packet_prompt.md` | md | pending | Prompt to synthesize the risk packet from raw inputs |
| `l2_drift_prompt.md` | md | pending | Prompt for drift classification (explained-by-intent or not) |
| **`l3_rca_prompt.md`** | md | pending | **THE prompt — L3 RCA synthesis · highest priority** |
| `mock_data_seed.json` | json | pending | Pre-seeded data · becomes React state (E) or SharePoint rows (B) |
| `monday_morning_checks.md` | md | pending | Runnable 6-check verification with branch logic |
| `monday_playbook.md` | md | pending | Hour-by-hour Monday plan · team allocation · dependencies |
| `team_allocation.md` | md | pending | Vamshi/Anisha/Sai Mohit responsibilities per workstream |
| `demo_dry_run_script.md` | md | pending | End-to-end rehearsal script · timing checkpoints |
| `fallback_plans.md` | md | pending | If X fails do Y · per-component contingencies |
| `deck2_releasewatch.html` | html | deferred | Focused ReleaseWatch-only deck (~13 slides) |
| `mock2_releasewatch.html` | html | deferred | Focused ReleaseWatch-only mock |

**Subtotal: 17 universal documents. ~5 highest priority (deck rebuild, L3 prompt, monday playbook, mock data seed, monday checks).**

---

## 2 · Path E specific (local vibe-coded app)

Only build these if you commit to Path E (or as the floor build over the weekend).

| File | Format | Status | Purpose |
|---|---|---|---|
| `mock1_combined.html` | html | **BUILT** | The Path E interactive mock at jury fidelity |
| `react_app_spec.md` | md | pending | Next.js file tree · routing · state management approach |
| `state_machine_spec.md` | md | pending | 17-step state machine · transitions · timing |
| `choreography_spec.md` | md | pending | Metric drift animation timing · work-note appearance order |
| `component_inventory.md` | md | pending | Per-tab component breakdown · props · styling notes |
| `data_loader.ts.template` | template | pending | TypeScript module template for loading mock data into state |

**Path E subtotal: 6 documents. mock1_combined.html is already done — the others are the build spec for Monday.**

---

## 3 · Path B specific (real M365 surfaces)

Only build these if Monday checks confirm Path B is viable.

| File | Format | Status | Purpose |
|---|---|---|---|
| `mock1_pathB.html` | html | **BUILT** | The Path B interactive mock at jury fidelity |
| `jira_setup.md` | md | pending | Atlassian Cloud Free setup · users · permissions for AI Pulse project |
| `jira_automation_rule.md` | md | pending | Template for the rule that fires on comment · Send Web Request action config |
| `teams_webhook_setup.md` | md | pending | How to create Teams Incoming Webhook URL · sample payload |
| `sharepoint_site_setup.md` | md | pending | Site creation · permissions · navigation |
| `sharepoint_list_schemas.md` | md | pending | Column definitions for: CHG Tickets, INC Records, Past INCs, Metrics, Bitbucket Diffs |
| `sharepoint_page_template.md` | md | pending | Release page layout · placeholder syntax · sections to populate |
| `studio_agent_setup.md` | md | pending | Agent creation in Studio · published-to-Teams config |
| `studio_agent_topics.md` | md | pending | Topic-by-topic spec (wake-on-trigger, risk packet, L2 drift, L3 RCA, etc) |
| `power_automate_flows.md` | md | pending | Bridging flows (Teams message → Studio agent · approval callbacks · etc) |
| `m365_connector_inventory.md` | md | pending | What was found in tenant · standard vs premium status |
| `path_b_demo_assets.md` | md | pending | URLs · channel names · webhook URLs · all the live demo coordinates |

**Path B subtotal: 12 documents. mock1_pathB.html is already done — the rest are setup and configuration specs for Monday.**

---

## 4 · Recommended build order

Given the weekend prep + Monday execution discipline, here's the sequence:

### Saturday – Sunday (preparation, throwaway)

Priority 1 — these unlock everything else:

1. **`l3_rca_prompt.md`** — write it, test against Claude/ChatGPT, iterate until it produces a coherent RCA from the demo scenario inputs. This is the single most important artifact.
2. **`mock_data_seed.json`** — define the schema and pre-populate. Universal, used by both paths.
3. **Rebuild `deck1_combined.html`** — with the corrections listed in HANDOFF.md section 8.

Priority 2 — Monday-execution-readiness:

4. **`monday_morning_checks.md`** — printable checklist for the first 90 minutes Monday
5. **`monday_playbook.md`** — hour-by-hour
6. **`team_allocation.md`** — clear ownership per workstream
7. **`pitch_script.md`** — the spoken narrative · two variants (B/E) but 90% identical

Priority 3 — path-specific (build for the path you'll commit to):

8. Path B-specific docs IF you're leaning Path B and want to walk in Monday with templates ready
9. Path E-specific docs IF you're leaning Path E

### Monday after checks pass

Based on the framework decision, generate the remaining path-specific docs from the universal foundation + the path templates you prepared this weekend.

---

## 5 · What you do NOT need to create

To prevent scope creep:

- **No separate Deck B and Deck E.** One deck works for both. Only narration changes per path.
- **No "mock data for Path B" vs "mock data for Path E."** Same JSON, used in two ways.
- **No separate L3 RCA prompt per path.** The prompt is the same. The execution surface differs.
- **No separate state machine for Path B vs E.** The state transitions are identical · only the implementation differs.
- **No "production architecture" doc.** That's a slide in `deck1_combined.html` (slide 14). Don't redocument.

---

## 6 · Recommended next-build prompt

Paste this into a new chat after sharing `HANDOFF.md` and this file:

> Based on PATH_DOCS_INVENTORY.md, the highest-priority pending document is `l3_rca_prompt.md`. Build it as a complete master prompt for Copilot Studio that takes risk packet + past INCs + live metrics + bitbucket diff and produces a structured RCA with confidence score. Format the file with: (1) the system prompt section · (2) the user-message template with placeholders · (3) a test harness section with the demo scenario inputs (RabbitMQ memory cascade · persistent flag commit) · (4) expected output format · (5) iteration notes for refinement. Use markdown. Make it ready to test in Claude or ChatGPT this weekend before pasting into Studio Monday.

---

*This inventory reflects the project state as of end of Saturday session. Update statuses as documents move from pending to built.*
