<!-- ROUTING-BANNER -->
> ⚠️ **READ THIS FIRST — SUPERSEDED build order. Use the 10-block sequence in build_demo_app_prompt.md instead.**
> The authoritative architecture is **orchestration_spec.md** (phase-based workflow + real agent functions + 3 real-click gates). The build order is in **build_demo_app_prompt.md**. Do NOT build the scene-integer / Next-button model described below.

# Path E Build Order · Monday Hour by Hour

> Monday June 8 sequence if Path E is committed. See `01_common/monday_playbook.md` for team-level plan; this is Path-E-specific detail.

## 10:00 – 11:30 ET · Vamshi runs Monday checks

Same as Path B. If Path B checks fail (or look risky), commit to Path E. If you commit to Path E early (10:30), skip ahead to Step "11:30" below.

## 11:30 – 12:00 ET · Bootstrap Next.js app (Vamshi)

```bash
cd ~/dev
npx create-next-app@latest ai-pulse-demo --typescript --tailwind --app --no-src-dir
cd ai-pulse-demo
npm install lucide-react
mkdir -p public src/components src/lib/{state,data,choreography}
cp ../ai-pulse-package/01_common/data/mock_data_seed.json public/
cp ../ai-pulse-package/03_path_e/data_loader_template.ts src/lib/data/dataLoader.ts
npm run dev
```

Open `http://localhost:3000`. Verify default Next.js page loads.

Configure Tailwind brand colors per `react_app_spec.md`.

## 11:30 – 13:30 ET · Three parallel workstreams (split after bootstrap)

After 12:00, three workstreams run in parallel:

### Workstream A · Anisha · UI components (Jira, Confluence, SNOW, Teams routes)

Order:
1. 12:00 — AppShell + TabBar (no logic yet, just chrome)
2. 12:15 — Jira route (issue, subtasks, comment thread)
3. 12:45 — Confluence route (release page, risk packet section)
4. 13:15 — Teams route (channel, messages, adaptive card)

Use Copilot heavily. Reference `mock1_combined.html` for visual targets.

### Workstream B · Sai Mohit · State machine + data flow

1. 12:00 — DemoProvider + DemoContext (wire into root layout)
2. 12:30 — demoReducer with initial state and SCENE_ORDER
3. 13:00 — All action handlers (ADVANCE_SCENE, APPROVE_GATE_*, ACKNOWLEDGE_L3)
4. 13:30 — SceneControls component (Next/Prev/Reset buttons)

### Workstream C · Vamshi · Dashboard route + ServiceNow + integration

1. 12:00 — SNOW route (CHG ticket, work notes)
2. 12:30 — Dashboard route (the killer view) — 9 tiles
3. 13:00 — Integrate state with components · click Next, see SNOW state change
4. 13:30 — Verify cross-route state persistence

## 13:30 – 15:00 ET · Integration

All three converge:

1. 13:30 — Walk through scenes 1-10 (pre-deploy half) clicking Next manually
2. 14:00 — Fix integration bugs · verify each scene shows correct UI
3. 14:30 — Walk through scenes 11-17 (post-deploy half)
4. 15:00 — All 17 scenes work end-to-end (even if some are rough)

## 15:00 – 16:30 ET · Choreography + polish

1. 15:00 — Metric drift animation (the big scene 13→14 moment)
2. 15:30 — Streaming RCA text for scene 14
3. 16:00 — Typing indicators where needed
4. 16:15 — Tile color transitions
5. 16:30 — Final polish pass on all routes

## 16:30 – 17:30 ET · First dry run

See `01_common/demo_dry_run_script.md`.

- Vamshi presents
- Anisha and Sai Mohit watch and note glitches
- Capture all timing issues
- Identify the 2-3 things to fix

## 17:30 – 18:30 ET · Fixes

Fix the 2-3 issues from dry run #1.

## 18:30 – 19:00 ET · Second dry run

Should be cleaner. If yes, proceed to record fallback video. If still glitchy, third dry run after another round of fixes.

## 19:00 – 20:00 ET · Record fallback video

OBS or QuickTime screen recording of the entire demo from launch to completion. 6-8 minutes. This plays Tuesday if anything breaks.

## 20:00 – 21:00 ET · Polish + pitch practice

- Pitch script practice (`01_common/pitch_script.md`)
- Open browser tabs in order
- Reset state · ready for Tuesday

## Tuesday June 9 · 07:30 – 09:15 ET

Same as Path B: sanity check, final dry run, present.

## What can go wrong (and the time-bounded responses)

| Problem | Time budget | Fallback |
|---|---|---|
| Next.js won't install on office laptop (corporate proxy) | 30 min | Use create-react-app or Vite (simpler bootstrap) |
| Tailwind classes don't apply | 20 min | Switch to plain CSS for that component |
| Copilot is slow or returning bad code | per component | Hand-write the component (slower but works) |
| Components count too high | 30 min into Workstream A | Drop Confluence route · narrate it instead |
| Dashboard performance bad with 9 tiles | 15 min | Reduce to 5 tiles |
| State doesn't persist between routes | 20 min | Move DemoProvider to root layout (root cause) |
| Choreography animations choppy | 30 min | Reduce to static transitions on Next click |
| L3 RCA streaming text glitchy | 20 min | Show as static block · skip streaming |

**Hard rule:** if anything blocks for >30 min, downgrade that piece. Don't sink hours.

## Vibe coding tips with GitHub Copilot

1. **Open `mock1_combined.html` in a side tab.** Copilot does better when it can reference the target.
2. **Write the prop signature first.** Copilot generates the body from a typed signature.
3. **Build small, paste often.** Don't ask Copilot to generate a 200-line component · break it down.
4. **Use Copilot Chat for "explain this" when stuck.** Faster than Stack Overflow.
5. **Don't trust Copilot's first answer.** Read the code · adjust before pasting.

## What "done" looks like at end of Monday

A working `npm run dev` Next.js app that:

- Has 5 routes (Jira/Confluence/SNOW/Teams/Dashboard)
- Has scene controls visible
- Walks through all 17 scenes
- Renders correctly in Chrome on the office laptop
- Has at least one polished animation (metric drift)
- Has a fallback video recorded

Don't aim for perfect. Aim for "credible demo + always-works fallback."

---

*Path E is the path you never regret building. Even if you commit to Path B, having a working Path E in the back pocket is insurance.*
