# Build Log + Persistent Memory Guide

> The conventions Copilot (and you) use to keep `BUILD_LOG.md` and `PERSISTENT_MEMORY.md` clean, professional, and resumable. Both Copilot build prompts reference this file. The goal: a log a senior engineer or judge could read without us looking like jokers.

---

## Why two files

| File | Purpose | Shape | Audience |
|---|---|---|---|
| `BUILD_LOG.md` | Permanent record of what was done and why | Append-only, most-recent-first | Reviewers, post-mortem, judges |
| `PERSISTENT_MEMORY.md` | Resumable snapshot of current state | Updated in place, short | The next Copilot/Claude session |

BUILD_LOG grows forever. PERSISTENT_MEMORY stays small and current. Don't confuse them: never append history to PERSISTENT_MEMORY, never overwrite entries in BUILD_LOG.

---

## BUILD_LOG.md

### Header (write once)

```markdown
# AI Pulse · Demo Build Log

> Append-only record. Most recent at top.
> Team: Vamshi V (lead), Anisha C, Sai Mohit
> Project: ReleasePilot + ReleaseWatch · Synchrony Vibe Coding 2026
> Target platform: Synchrony Agentic AI Platform (Bedrock AgentCore)
> Demo stack: Next.js + React + TypeScript + Tailwind
> Reference package: ./ai-pulse-package/
```

### Entry format

```markdown
---

## [ISO timestamp] · [Phase/Block] · [Action summary]

**Context:** [one sentence — why this matters in the build]

**What was done:**
- [concrete action, with file paths]
- [concrete action]

**Files touched:**
- `path/to/file.tsx` — [created | modified | deleted]

**Verification:**
- [how we know it works — what was observed, e.g. "Visited /dashboard; 9 tiles
  render; Next advances to L1_CLEAR; tile transitions green over 800ms"]

**Decisions (if any):**
- [Decision]: [statement] — [one-line rationale]

**Open issues:**
- [issue + follow-up] (or "none")

**Next step:**
- [the immediately following action]
```

### Rules

- One entry per meaningful action (block complete, file set created, bug fixed, decision made). Not one per keystroke.
- Most recent entry at the TOP, right under the header.
- Pretty-print all code/JSON in fenced blocks with the correct language tag.
- Never paste a full multi-thousand-token prompt into the log — reference the file in the package instead.
- Complete sentences in Context and Verification. Crisp imperative bullets in What was done.
- No "Great progress!" / "Awesome!" / "We crushed it." Write what happened.
- Precise vocabulary: reducer, dispatch, context provider, hydration, prerender, rAF — not "the state thing."
- Tables for comparisons (markdown tables, not ASCII art).

### Good entry example

```markdown
---

## 2026-06-08T13:42:00-04:00 · Block 3 · Dashboard grid + tiles

**Context:** The dashboard is the demo's primary view; building it first anchors the
visual language for the rest of the app.

**What was done:**
- Implemented DashboardGrid as a 3-column CSS grid over the 9 seed watch items
- Implemented WatchTile with state-driven border/background (L1 green, L2 amber, L3 red)
- Implemented StatusBadge as a reusable pill consumed by tiles and the demo card
- Wired tiles to read from useDemo().state via getWatchItems()

**Files touched:**
- `src/components/dashboard/DashboardGrid.tsx` — created
- `src/components/dashboard/WatchTile.tsx` — created
- `src/components/shared/StatusBadge.tsx` — created
- `app/dashboard/page.tsx` — created

**Verification:**
- Visited /dashboard; all 9 tiles render with correct state colors. The demo-target
  tile (CHG0049182) shows the yellow highlight border. Matches mock1_combined.html.

**Decisions:**
- Tile color transitions: CSS `transition` over JS animation — rationale: GPU-accelerated,
  simpler, sufficient for the green→amber→red changes.

**Open issues:**
- DemoCard not yet built (Block 3.3). Tiles are clickable but detail view is a stub.

**Next step:**
- Build DemoCard (3.3) and MetricChart (3.5), then test the full Dashboard.
```

### Bad entry example (don't do this)

```markdown
## did dashboard stuff
made the tiles work finally lol. looks pretty good. moving on to teams next
```

Reasons it's bad: no timestamp, no file paths, no verification, casual tone, no decisions captured, not resumable.

---

## PERSISTENT_MEMORY.md

### Full template

```markdown
# AI Pulse · Demo Build · Persistent Memory

> Last updated: [ISO timestamp]
> Updated by: [Copilot session / "manual"]
> Read this FIRST in any new session before doing anything.

## Project state

- Project: ReleasePilot + ReleaseWatch (two agents, A2A handoff)
- Target platform: Synchrony Agentic AI Platform (Bedrock AgentCore)
- Demo stack: Next.js + React + TypeScript + Tailwind
- Current phase: [bootstrap | block-1-foundation | block-2-shell | block-3-dashboard |
  block-4-teams | block-5-snow | block-6-confluence | block-7-jira |
  block-8-choreography | block-9-polish | dry-run | done]
- Demo scenario: forgotten DB migration → silent publish failure → downstream starvation · RCA confidence 0.84
- Headline moment: L3 RCA streaming into Dashboard DemoCard (scene 14)

## Completed blocks

- [ ] Bootstrap
- [ ] Block 1 · Foundation
- [ ] Block 2 · Shell
- [ ] Block 3 · Dashboard
- [ ] Block 4 · Teams
- [ ] Block 5 · ServiceNow
- [ ] Block 6 · Confluence
- [ ] Block 7 · Jira
- [ ] Block 8 · Choreography
- [ ] Block 9 · Polish

## Component status (23)

Shell: [ ] AppShell  [ ] TabBar  [ ] SceneControls
Dashboard: [ ] DashboardGrid  [ ] WatchTile  [ ] DemoCard
Teams: [ ] TeamsChannel  [ ] MessageBubble  [ ] AdaptiveCard  [ ] ApprovalActions
ServiceNow: [ ] ChgTicket  [ ] WorkNotes  [ ] IncTicket
Confluence: [ ] ReleasePage  [ ] RiskPacketSection
Jira: [ ] JiraIssue  [ ] Subtasks  [ ] CommentThread
Shared: [ ] StatusBadge  [ ] MetricChart  [ ] ScrollSection  [ ] StreamingText  [ ] TypingIndicator

## Active blockers

- [blocker · status · owner] (or "none")

## Decisions (latest first)

- DEC-[N]: [statement] — [rationale] — [timestamp]

## Key paths

- Dev URL: http://localhost:[port]
- Seed data: ai-pulse-demo/public/mock_data_seed.json
- Reducer: ai-pulse-demo/src/lib/state/demoReducer.ts
- Data loader: ai-pulse-demo/src/lib/data/dataLoader.ts

## Next action

[one sentence: exactly what to do next]
```

### Rules

- Keep it under 200 lines. It's a snapshot, not a history.
- Update sections IN PLACE. Replace the old value; don't append.
- Update after every block completes or every decision.
- Use checkboxes ([ ] / [x]) so progress is scannable.
- The "Next action" line is the most important — it's what a resuming session reads to know what to do.

---

## Secrets handling

Never put secrets (API tokens, webhook URLs, credentials) in BUILD_LOG or PERSISTENT_MEMORY — these may be reviewed or committed. If the build ever needs a secret, put it in `./build/secrets.local.md` with a header reminding you to gitignore it:

```markdown
# LOCAL SECRETS — DO NOT COMMIT
# Add `build/secrets.local.md` to .gitignore

(secrets here)
```

For the demo build (pure frontend, no backend), there are likely no secrets at all.

---

## The resume ritual (any new session)

Paste this:

```
Read ./build/PERSISTENT_MEMORY.md first, then the last 5 entries of ./build/BUILD_LOG.md.
Tell me which block we're on and propose the next action. Wait for my go-ahead.
```

The session reads both files, summarizes state, proposes the next step. You confirm. Build continues. No context lost.

---

## Why this matters for the hackathon

Two reasons beyond resumability:

1. **A clean build log is itself a deliverable.** If judges look at how you worked, a professional log signals engineering maturity. A messy one undercuts an otherwise good pitch.
2. **The team stays synced.** Anisha and Sai Mohit can read PERSISTENT_MEMORY and know exactly where the build is without interrupting whoever's driving.

---

*Both Copilot build prompts (`03_path_e/build_demo_app_prompt.md` and the older `path_e_copilot_prompt.md`) reference this file for the formats. Keep them consistent.*
