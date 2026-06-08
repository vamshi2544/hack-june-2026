<!-- ROUTING-BANNER -->
> ⚠️ **READ THIS FIRST — SUPERSEDED driver. The 'scene' state machine here is replaced by the phase-based WorkflowState in orchestration_spec.md §3.**
> The authoritative architecture is **orchestration_spec.md** (phase-based workflow + real agent functions + 3 real-click gates). The build order is in **build_demo_app_prompt.md**. Do NOT build the scene-integer / Next-button model described below.

# State Machine Spec · Path E

> The 17-step state machine that drives the demo flow. Single source of truth for "what's happening now."

## Why a state machine

The demo has discrete scenes. The user (Vamshi) advances scenes manually during the demo. The state machine ensures that each component renders the right thing for the current scene without per-component logic.

## State shape

```ts
// src/lib/state/demoReducer.ts

export type Scene =
  | 'IDLE'                          // before demo starts
  | 'JIRA_TRIGGER'                  // step 1 — comment posted
  | 'AGENT_WAKING'                  // step 2 — agent reads context
  | 'RISK_PACKET_DONE'              // step 3 — packet assembled
  | 'CONFLUENCE_PUBLISHED'          // step 4 — page created
  | 'APPROVAL_GATE_1_PENDING'       // step 5 — review approval card visible
  | 'APPROVAL_GATE_1_APPROVED'      // step 6 — human approved review
  | 'CHG_CREATED'                   // step 7 — CHG in Assess state
  | 'APPROVAL_GATE_2_PENDING'       // step 8 — CHG advancement card visible
  | 'APPROVAL_GATE_2_APPROVED'      // step 9 — human approved advancement
  | 'CHG_IMPLEMENT'                 // step 10 — CHG advanced, notifications sent
  | 'DEPLOY_RUNNING'                // step 11 — deploy in progress
  | 'WATCH_L1_CLEAR'                // step 12 — first hour clear
  | 'WATCH_L2_AMBER'                // step 13 — drift detected
  | 'WATCH_L3_RED'                  // step 14 — L3 escalation, INC created
  | 'HUMAN_HANDOFF'                 // step 15 — Adaptive Card with action buttons
  | 'HUMAN_ACK'                     // step 16 — Anisha clicks Acknowledge
  | 'RECOVERY_DETECTED'             // step 17 — metrics recovering, all-clear posted

export type DemoState = {
  scene: Scene
  sceneIndex: number                // 0-17
  isAnimating: boolean              // for choreography
  data: typeof seedData             // imported from mock_data_seed.json
  // dynamic data that changes during demo:
  chgState: 'New' | 'Assess' | 'Implement' | 'Watching' | 'Closed-Pending-Review'
  watchState: 'PRE_DEPLOY' | 'L1_CLEAR' | 'L2_DRIFT' | 'L3_INC_OPEN' | 'RECOVERED'
  currentMetrics: MetricSnapshot    // updated as scenes progress
  workNotes: WorkNote[]             // append-only log
  teamsMessages: TeamsMessage[]     // append-only log
  l3RcaText: string | null          // generated RCA · null until step 14
}

export type DemoAction =
  | { type: 'RESET' }
  | { type: 'ADVANCE_SCENE' }
  | { type: 'GO_TO_SCENE'; payload: Scene }
  | { type: 'APPROVE_GATE_1' }
  | { type: 'APPROVE_GATE_2' }
  | { type: 'ACKNOWLEDGE_L3' }
  | { type: 'TICK_METRICS' }
```

## The 17 transitions

| # | Scene | What's visible | User action to advance |
|---|---|---|---|
| 1 | `JIRA_TRIGGER` | Jira route shows new comment "@release-pilot go" | Click Next (or auto-advance after 2s) |
| 2 | `AGENT_WAKING` | Teams route shows "Acknowledged · ETA 90s" + typing indicator | Auto-advance after 2s |
| 3 | `RISK_PACKET_DONE` | Teams shows "Risk packet assembled" with details | Click Next |
| 4 | `CONFLUENCE_PUBLISHED` | Confluence route shows release page | Click Next |
| 5 | `APPROVAL_GATE_1_PENDING` | Teams shows Adaptive Card with Approve/Reject buttons | Click Approve button in card |
| 6 | `APPROVAL_GATE_1_APPROVED` | Teams shows approval received | Auto-advance after 1s |
| 7 | `CHG_CREATED` | SNOW route shows CHG in Assess state | Click Next |
| 8 | `APPROVAL_GATE_2_PENDING` | Teams shows second Adaptive Card | Click Approve button in card |
| 9 | `APPROVAL_GATE_2_APPROVED` | Teams shows approval received | Auto-advance after 1s |
| 10 | `CHG_IMPLEMENT` | SNOW shows CHG=Implement · notification emails listed | Click Next |
| 11 | `DEPLOY_RUNNING` | Dashboard shows new tile · deploy progress bar | Auto-advance after 3s |
| 12 | `WATCH_L1_CLEAR` | Dashboard shows tile in green L1_CLEAR with hourly check | Click Next |
| 13 | `WATCH_L2_AMBER` | Dashboard tile turns amber · metric drift visible · email arrives | Click Next |
| 14 | `WATCH_L3_RED` | Dashboard tile turns red · INC0228994 created · L3 RCA renders | Click Next |
| 15 | `HUMAN_HANDOFF` | Teams shows L3 Adaptive Card with Acknowledge button | Click Acknowledge |
| 16 | `HUMAN_ACK` | Teams shows Anisha's reply "Confirmed. Rolling back." | Click Next |
| 17 | `RECOVERY_DETECTED` | Dashboard tile turns green RECOVERED · all-clear posted | End of demo |

Demo is ~6-8 minutes if paced normally.

## Reducer skeleton

```ts
// src/lib/state/demoReducer.ts

import seedData from '@/public/mock_data_seed.json'

const SCENE_ORDER: Scene[] = [
  'IDLE',
  'JIRA_TRIGGER',
  'AGENT_WAKING',
  'RISK_PACKET_DONE',
  'CONFLUENCE_PUBLISHED',
  'APPROVAL_GATE_1_PENDING',
  'APPROVAL_GATE_1_APPROVED',
  'CHG_CREATED',
  'APPROVAL_GATE_2_PENDING',
  'APPROVAL_GATE_2_APPROVED',
  'CHG_IMPLEMENT',
  'DEPLOY_RUNNING',
  'WATCH_L1_CLEAR',
  'WATCH_L2_AMBER',
  'WATCH_L3_RED',
  'HUMAN_HANDOFF',
  'HUMAN_ACK',
  'RECOVERY_DETECTED',
]

export const initialState: DemoState = {
  scene: 'IDLE',
  sceneIndex: 0,
  isAnimating: false,
  data: seedData,
  chgState: 'New',
  watchState: 'PRE_DEPLOY',
  currentMetrics: seedData.metric_snapshots.pre_deploy_baseline,
  workNotes: [],
  teamsMessages: [],
  l3RcaText: null,
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'RESET':
      return initialState

    case 'ADVANCE_SCENE': {
      const nextIndex = Math.min(state.sceneIndex + 1, SCENE_ORDER.length - 1)
      const nextScene = SCENE_ORDER[nextIndex]
      return applySceneEffects(state, nextScene, nextIndex)
    }

    case 'GO_TO_SCENE': {
      const idx = SCENE_ORDER.indexOf(action.payload)
      return applySceneEffects(state, action.payload, idx)
    }

    case 'APPROVE_GATE_1':
      if (state.scene !== 'APPROVAL_GATE_1_PENDING') return state
      return applySceneEffects(state, 'APPROVAL_GATE_1_APPROVED', state.sceneIndex + 1)

    case 'APPROVE_GATE_2':
      if (state.scene !== 'APPROVAL_GATE_2_PENDING') return state
      return applySceneEffects(state, 'APPROVAL_GATE_2_APPROVED', state.sceneIndex + 1)

    case 'ACKNOWLEDGE_L3':
      if (state.scene !== 'HUMAN_HANDOFF') return state
      return applySceneEffects(state, 'HUMAN_ACK', state.sceneIndex + 1)

    case 'TICK_METRICS':
      // called repeatedly during L2_AMBER → L3_RED transition to animate drift
      return { ...state, currentMetrics: nextDriftStep(state.currentMetrics, state.data) }

    default:
      return state
  }
}

// applySceneEffects applies the side effects of entering a new scene
// (adding work notes, adding teams messages, changing CHG/Watch state)
function applySceneEffects(
  state: DemoState,
  scene: Scene,
  sceneIndex: number
): DemoState {
  let nextState = { ...state, scene, sceneIndex }

  switch (scene) {
    case 'JIRA_TRIGGER':
      // No effect — just the visual change
      break
    case 'AGENT_WAKING':
      nextState.teamsMessages = [
        ...nextState.teamsMessages,
        { id: 't1', from: 'PowerAutomate', isBot: true, ts: '01:14', content: 'New release trigger from Jira · ACQ-3847' },
        { id: 't2', from: 'ReleasePilot', isBot: true, ts: '01:14', content: 'Acknowledged. Reading context · ETA 90s' },
      ]
      break
    case 'RISK_PACKET_DONE':
      nextState.workNotes = [
        ...nextState.workNotes,
        { ts: '01:15', author: 'ReleasePilot', content: 'Risk packet assembled · 3 past INCs · 2 downstream apps' },
      ]
      break
    case 'CHG_CREATED':
      nextState.chgState = 'Assess'
      break
    case 'CHG_IMPLEMENT':
      nextState.chgState = 'Implement'
      break
    case 'DEPLOY_RUNNING':
      nextState.chgState = 'Watching'
      nextState.watchState = 'PRE_DEPLOY'
      break
    case 'WATCH_L1_CLEAR':
      nextState.watchState = 'L1_CLEAR'
      nextState.currentMetrics = state.data.metric_snapshots.pre_deploy_baseline
      break
    case 'WATCH_L2_AMBER':
      nextState.watchState = 'L2_DRIFT'
      nextState.currentMetrics = state.data.metric_snapshots.current_l2_amber_moment
      break
    case 'WATCH_L3_RED':
      nextState.watchState = 'L3_INC_OPEN'
      nextState.currentMetrics = state.data.metric_snapshots.current_l3_red_moment
      nextState.l3RcaText = buildRcaText(state.data)
      break
    case 'RECOVERY_DETECTED':
      nextState.watchState = 'RECOVERED'
      break
  }

  return nextState
}

function buildRcaText(data: typeof seedData): string {
  // Returns the pre-rendered RCA matching the demo scenario
  // OR optionally calls Claude/ChatGPT API in a separate code path
  return `Root cause: migration subtask ACQ-3852 (create messaging_config) never ran on CDE2; the publisher failed to initialize against the missing schema and silently stopped publishing, starving sms-consumer, email-consumer, and audit-consumer...
(full RCA text from l3_rca_prompt.md expected output)`
}

function nextDriftStep(metrics: MetricSnapshot, data: typeof seedData): MetricSnapshot {
  // Interpolates between baseline and L2 amber metrics over time
  // ...implementation
  return metrics
}
```

## How components read state

Every demo-aware component:

```tsx
import { useDemo } from '@/lib/state/DemoContext'

export function ChgTicket() {
  const { state } = useDemo()
  // render based on state.chgState
}
```

Components that need to advance scenes:

```tsx
const { state, dispatch } = useDemo()

<button onClick={() => dispatch({ type: 'APPROVE_GATE_1' })}>
  Approve
</button>
```

## Idempotency

The `applySceneEffects` function is **idempotent** — calling it twice with the same scene produces the same state. This matters because:

- The reducer can be called via `ADVANCE_SCENE` or `GO_TO_SCENE`
- The demo presenter might double-click Next by accident
- React Strict Mode in dev double-invokes reducers

Use spread-based state updates that always produce the same result given the same inputs.

## Persistence between page navigations

Since this is Next.js App Router, the `DemoProvider` lives in the root layout. State persists across route changes (e.g., navigating from /jira to /teams keeps state).

If you want state to persist across page reloads, add localStorage syncing:

```ts
useEffect(() => {
  localStorage.setItem('demoState', JSON.stringify(state))
}, [state])
```

Be cautious: localStorage state carrying old test runs into the demo would be embarrassing. Add a "RESET" button visible to the presenter.

## Visibility per route

Use the `scene` value to conditionally render route-specific content:

```tsx
// /confluence/page.tsx
const { state } = useDemo()
if (state.sceneIndex < 4) return <Placeholder>Page not yet created.</Placeholder>
return <ReleasePage />
```

This ensures the demo doesn't "spoil" scenes — Confluence page only appears after CONFLUENCE_PUBLISHED scene.

## Common issues

| Problem | Fix |
|---|---|
| Scene jumps don't update components | Verify `DemoProvider` wraps everything in root layout |
| State resets on route change | Move `DemoProvider` higher in the tree (root layout, not page) |
| Choreography tick interferes with manual advance | Use a boolean flag to suspend ticks during manual advance |
| Approval button advances wrong scene | Tightly check current scene in reducer guards |

---

*Next: `choreography_spec.md` for the timing of metric drift between L1, L2, and L3 scenes.*
