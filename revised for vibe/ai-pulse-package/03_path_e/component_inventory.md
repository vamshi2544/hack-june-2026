<!-- ROUTING-BANNER -->
> ⚠️ **READ THIS FIRST — PARTIAL REFERENCE. Component visuals are valid, but components read the phase-based WorkflowState (not a scene flag). 'SceneControls' becomes the optional ?present=true override.**
> The authoritative architecture is **orchestration_spec.md** (phase-based workflow + real agent functions + 3 real-click gates). The build order is in **build_demo_app_prompt.md**. Do NOT build the scene-integer / Next-button model described below.

# Component Inventory · Path E

> Per-tab/route React components. Each described with props, children, and visual reference.

For each, see `mock1_combined.html` for the exact visual target. Copilot can generate ~80% of each from this spec + the mock visual.

## Shell components

### `<AppShell>`
**Path:** `src/components/shell/AppShell.tsx`
**Wraps:** entire app
**Renders:** TabBar + SceneControls + outlet for the active route
**Reads:** `state.scene`
**Notes:** Lives in root layout · contains DemoProvider

### `<TabBar>`
**Path:** `src/components/shell/TabBar.tsx`
**Renders:** 5 navigation links (Jira / Confluence / SNOW / Teams / Dashboard)
**Highlight:** the currently active route
**Style:** dark bar with brand-yellow active indicator

### `<SceneControls>`
**Path:** `src/components/shell/SceneControls.tsx`
**Renders:** Prev / Next / Reset buttons + scene name display
**Keyboard:** ←/→ to advance · R for reset
**Hidden in:** production · use `?demo=true` to show

---

## Jira route components

### `<JiraIssue>`
**Path:** `src/components/jira/JiraIssue.tsx`
**Props:** none (reads from `state.data.release_story`)
**Renders:** issue header (key, summary), description, fields panel (right), comment thread (bottom)
**Visible from scene:** always (issue is closed before demo starts)

### `<Subtasks>`
**Path:** `src/components/jira/Subtasks.tsx`
**Props:** none (reads from `state.data.subtasks`)
**Renders:** 4 subtask rows · each with key, summary, status, assignee
**Visible from scene:** always

### `<CommentThread>`
**Path:** `src/components/jira/CommentThread.tsx`
**Props:** none (reads from `state.scene` to decide which comments to show)
**Renders:** pre-demo comments + "@release-pilot go" comment that appears at scene 1
**Notes:** The comment input box is faked · pressing Enter just advances the scene

---

## Confluence route components

### `<ReleasePage>`
**Path:** `src/components/confluence/ReleasePage.tsx`
**Props:** none (reads from `state.data` + `state.scene`)
**Renders:** the release page template (see `02_path_b/setup/06_sharepoint_page_template.md` for content)
**Visible from scene:** `CONFLUENCE_PUBLISHED` (4) onwards
**Placeholder before:** "ReleasePilot is preparing the release page..."

### `<RiskPacketSection>`
**Path:** `src/components/confluence/RiskPacketSection.tsx`
**Props:** `streaming?: boolean` (if true, text streams in over ~800ms)
**Renders:** 4-subsection risk packet
**Notes:** This is the most important read-only block for the demo · it's what ReleaseWatch reads

---

## ServiceNow route components

### `<ChgTicket>`
**Path:** `src/components/servicenow/ChgTicket.tsx`
**Props:** none (reads from `state.chgState` + `state.data.chg_ticket`)
**Renders:** CHG header (id, title, app), state badge (animates on change), fields grid (foundation, build, deploy window), approvals list, attached page link
**Visible from scene:** `CHG_CREATED` (7) onwards
**State badge transitions:** New (gray) → Assess (blue) → Implement (yellow) → Watching (cyan) → Closed-Pending-Review (light gray)

### `<WorkNotes>`
**Path:** `src/components/servicenow/WorkNotes.tsx`
**Props:** none (reads from `state.workNotes`)
**Renders:** append-only timeline of work notes
**Notes:** New entries fade in as scenes advance

### `<IncTicket>`
**Path:** `src/components/servicenow/IncTicket.tsx`
**Props:** none (visible only after `WATCH_L3_RED`)
**Renders:** INC0228994 header, severity badge, linked CHG, root cause section (= L3 RCA text), evidence summary, diagnostic confidence percentage

---

## Teams route components

### `<TeamsChannel>`
**Path:** `src/components/teams/TeamsChannel.tsx`
**Props:** `channelName: string`
**Renders:** channel header, message list (scrolling), input bar at bottom (fake — no actual input)
**Notes:** Channel switches between `#release-pilot-channel` and `#release-watch-acquisition` based on scene context

### `<MessageBubble>`
**Path:** `src/components/teams/MessageBubble.tsx`
**Props:** `from, ts, isBot, content, mentioned?`
**Renders:** single message with avatar, name, timestamp, content
**Notes:** Bot messages have a "Power Automate" or "Release Pilot" pill

### `<AdaptiveCard>`
**Path:** `src/components/teams/AdaptiveCard.tsx`
**Props:** `title, facts, body, actions` (similar to Adaptive Card schema)
**Renders:** card with header, FactSet, body text, action buttons
**Notes:** Buttons are real and dispatch reducer actions

### `<ApprovalActions>`
**Path:** `src/components/teams/ApprovalActions.tsx`
**Props:** `gateNumber: 1 | 2 | 3` (3 = L3 acknowledge)
**Renders:** Approve / Reject buttons (or Acknowledge / Downgrade for gate 3)
**Notes:** Visible only when corresponding scene is active

---

## Dashboard route components (the killer view)

### `<DashboardGrid>`
**Path:** `src/components/dashboard/DashboardGrid.tsx`
**Props:** none (reads from `state.data.active_watches_dashboard.items` + `state.scene`)
**Renders:** 3x3 grid of 9 watch tiles + a detailed panel for the demo target (CHG0049182)
**Layout:** CSS Grid · 3 columns on desktop · stacks on mobile

### `<WatchTile>`
**Path:** `src/components/dashboard/WatchTile.tsx`
**Props:** `chg, app, watchState, started, notes, isDemoTarget?`
**Renders:** CHG id, app name, state badge (color-coded: green L1 / amber L2 / red L3), watch duration, notes
**Notes:** The demo target tile is slightly highlighted (yellow border)
**Animations:** color/border transition on state change

### `<DemoCard>`
**Path:** `src/components/dashboard/DemoCard.tsx`
**Props:** none (reads from state)
**Renders:** detailed view for CHG0049182 — current metrics, comparison to baselines, mini chart, link to release page
**Visible from scene:** `WATCH_L1_CLEAR` (12) onwards
**Expansion:** as scenes advance, this card grows in importance · L3 adds the RCA section

### `<MetricChart>`
**Path:** `src/components/shared/MetricChart.tsx`
**Props:** `metric: 'consumer_latency' | 'consumer_throughput' | 'rabbitmq_memory'`
**Renders:** simple SVG line chart showing baseline vs current
**Notes:** Use inline SVG · no recharts dependency

---

## Shared / utility components

### `<StatusBadge>`
**Path:** `src/components/shared/StatusBadge.tsx`
**Props:** `state: 'L1_CLEAR' | 'L2_DRIFT' | 'L3_INC_OPEN' | 'RECOVERED'`
**Renders:** colored pill badge with state label

### `<ScrollSection>`
**Path:** `src/components/shared/ScrollSection.tsx`
**Props:** `title?, children`
**Renders:** styled panel container with optional title
**Notes:** Used throughout for consistent styling

### `<StreamingText>`
**Path:** `src/components/shared/StreamingText.tsx`
**Props:** `fullText, durationMs?, onComplete?`
**Renders:** text that appears character-by-character with a cursor
**Used for:** RCA generation in scene 14

### `<TypingIndicator>`
**Path:** `src/components/shared/TypingIndicator.tsx`
**Props:** `agent: 'release-pilot' | 'release-watch'`
**Renders:** "Release Pilot is typing..." with animated dots

---

## Total count

- Shell: 3
- Jira: 3
- Confluence: 2
- SNOW: 3
- Teams: 4
- Dashboard: 4
- Shared: 4

**Total: 23 components.** Each <100 lines on average. Total React/TSX code: ~2000 lines.

## Recommended Copilot prompts per component

When asking Copilot to generate each, use this template:

> Generate a React/TypeScript component for [ComponentName] in `src/components/[path]`. It [renders / receives props of / reads state via useDemo()]. Visual reference is the [section name] in mock1_combined.html. Use Tailwind classes only. Brand colors are `panel`, `panel-2`, `ink`, `dim`, `syf-yellow`, `pilot`, `watch`, `danger`, `warning`, `success` (already in tailwind.config). Match the dark theme aesthetic — `bg-panel border border-panel-2 text-ink` for cards. Use lucide-react for icons.

This gets you 80% of the way. Polish the remaining 20%.

## Build order recommendation (within Path E build)

1. AppShell + TabBar (so navigation works)
2. DemoContext + reducer (so state works)
3. Dashboard route (the killer view · build it first to motivate the rest)
4. Teams route (most important secondary view)
5. SNOW route
6. Confluence route
7. Jira route (least visually demanding)
8. SceneControls (now you can click through)
9. Choreography polish (metric drift animation)
10. Streaming RCA text (scene 14)

---

*The component count looks daunting but most are <50 lines. Vibe-code them with Copilot and you'll hit the count in an afternoon.*
