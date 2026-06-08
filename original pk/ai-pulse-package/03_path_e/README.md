<!-- ROUTING-BANNER -->
> ⚠️ **Build the FUNCTIONAL app.** Authoritative: **orchestration_spec.md** + **build_demo_app_prompt.md**. Other specs here are scene-era visual reference.  is the single-file fallback.

# Path E · README

> **Implementation:** Local Next.js + React app on Vamshi's office laptop. All Jira, Teams, SharePoint, ServiceNow surfaces are vibe-coded with React + Tailwind matching the real product UIs at jury-grade fidelity. Zero external dependencies during the demo. Architecture diagram (slide 14 of the deck) shows the production path.

This subdirectory contains everything you need to build Path E from scratch on Monday morning. Path E is the **floor** — it always works because it doesn't depend on Studio, M365, or anything external. If Path B fails its Monday checks, this is what you ship.

---

## Read in this order

1. **`react_app_spec.md`** — file tree, routing, state management, dependencies
2. **`state_machine_spec.md`** — the 17-step state machine that drives the demo flow
3. **`choreography_spec.md`** — animation/timing for the metric drift moment
4. **`component_inventory.md`** — per-tab React component breakdown
5. **`data_loader_template.ts`** — TypeScript module to load `mock_data_seed.json`
6. **`path_e_build_order.md`** — Monday build sequence for Path E
7. **`mock1_combined.html`** — the visual reference (the final demo should look like this)

---

## What Path E looks like (architecture)

```
                            Office laptop · localhost:3000
                                     ↓
                       ┌──────────────────────────────┐
                       │ Next.js + React + Tailwind   │
                       │                              │
                       │  /jira      - Jira UI mock   │
                       │  /confluence - Confluence mock│
                       │  /servicenow - SNOW UI mock  │
                       │  /teams     - Teams UI mock  │
                       │  /dashboard - Watch dashboard│
                       │                              │
                       │  State: useReducer + JSON   │
                       │  No backend · no APIs        │
                       └──────────────────────────────┘
                                     │
                                     ▼
                       ┌──────────────────────────────┐
                       │ optional: Claude.ai / ChatGPT│
                       │ for the L3 moment            │
                       │ (separate browser tab,       │
                       │  prompt copy-pasted live)   │
                       └──────────────────────────────┘
```

The optional "AI moment" via Claude/ChatGPT is the only external dependency — and it's literally a browser tab on cellular Wi-Fi if needed.

---

## Why Path E exists

- **It always works.** Zero dependencies during demo.
- **Visual fidelity is highest possible** — you control every pixel.
- **You vibe-code with Copilot.** Vamshi has the GitHub Copilot license; this is exactly the use case it was built for.
- **The pitch story still works.** The architecture slide (slide 14) shows what Path B looks like in production. The mock demonstrates the user experience. Both together tell the full story.

The trade-off vs Path B: lower architectural credibility ("you built a UI, not the agent"). The pitch script handles this — see `01_common/pitch_script.md` Path E variant.

---

## What's in this subdirectory

| File | Purpose |
|---|---|
| `README.md` | This file |
| `mock1_combined.html` | Pre-built interactive mock at full fidelity · the visual target |
| `react_app_spec.md` | Next.js app structure · what to build |
| `state_machine_spec.md` | 17-step state transitions for the demo flow |
| `choreography_spec.md` | When metrics drift, when work-notes appear, etc. |
| `component_inventory.md` | Per-tab React components to build |
| `data_loader_template.ts` | TS module template for loading seed data |
| `path_e_build_order.md` | Monday build sequence for Path E |

---

## What's NOT in this subdirectory (lives in 01_common)

Same as Path B — the universal stuff:
- The prompts (`01_common/prompts/`) — show the L3 prompt in the deck or use it live in Claude/ChatGPT
- The mock data (`01_common/data/mock_data_seed.json`) — drives all React state
- Pitch script, Monday checks, Monday playbook, dry-run script, fallback plans

---

## How Path E uses Copilot Studio

It mostly doesn't. The Studio agent isn't running in this path. But:

1. **Architecture slide (slide 14)** shows Studio as the LLM brain in production.
2. **The L3 moment in the demo** can optionally switch to Claude/ChatGPT in a browser tab, paste the `l3_rca_prompt.md` filled-in template, and show real LLM generation. This proves "real AI is doing the thinking, not pre-recorded text."
3. **The prompts file (`l3_rca_prompt.md`)** is shown as evidence in the deck — "this is the actual prompt that powers the L3 RCA in production. Same prompt would run in Studio."

---

## Why we don't run a local LLM during Path E

Tempting to run an actual local Ollama/llama.cpp for the L3 moment. Don't:
- Performance varies — risk of waiting 30 seconds during the demo
- Quality of small local models is unpredictable for this specific reasoning task
- One more thing to debug on demo day

If you want a live LLM moment, use Claude.ai or ChatGPT (paste prompt, get response, screen-record it as the demo).

---

## Time budget for Path E build

If you commit to Path E Monday morning:

| Block | Activity | Owner |
|---|---|---|
| 10:00 – 11:30 | Run Monday checks · decide framework | Vamshi |
| 11:30 – 12:00 | Bootstrap Next.js app · Tailwind setup · install deps | Vamshi |
| 11:30 – 13:30 | Build Jira, Confluence, SNOW, Teams, Dashboard components | Anisha |
| 11:30 – 13:30 | State machine + reducer + JSON loader | Sai Mohit |
| 13:30 – 15:00 | Integrate components + state machine | Vamshi + Anisha |
| 15:00 – 16:30 | Choreography · metric drift animation · pacing | Vamshi |
| 16:30 – 17:30 | First dry run · iterate | All |
| 17:30 – 19:00 | Polish · second dry run · record fallback video | All |

Path E is more code than Path B but the code is straightforward React with Tailwind. With GitHub Copilot doing the heavy lift, this is achievable in one day.

---

## How Path E and Path B compare in the deck

**The deck (`deck1_combined.html`) does not change between Path B and Path E.** Only the live walkthrough during the demo changes:

- Path B: you alt-tab between real Jira, real Teams, real SharePoint
- Path E: you click between routes in the local React app

The pitch script (`01_common/pitch_script.md`) has two variants of the narration to handle this — same story, different surfaces.

---

## Path E's failure modes (and what to do)

| If this fails | Workaround |
|---|---|
| Next.js bootstrap fails on the office laptop | Use create-react-app or Vite instead · simpler bootstrap |
| Tailwind classes don't render | Use plain CSS · slower but reliable |
| Component count grows too large | Reduce to 3 routes (Jira, Teams, Dashboard) · skip Confluence and SNOW · narrate them instead |
| Choreography animation lags | Reduce to static state changes (clicks advance scenes) instead of timed animation |
| GitHub Copilot is slow / quota issue | Hand-write components · slower but always works |

---

*Path E is the always-works path. Build it well and you've shipped the hackathon regardless of what else happens.*
