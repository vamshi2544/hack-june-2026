<!-- ROUTING-BANNER -->
> ⚠️ **READ THIS FIRST — STYLING/TOKEN REFERENCE (valid). Use it for brand tokens, fonts, and component look. For app STRUCTURE (agent module, workflow reducer), follow orchestration_spec.md, not the scene-era file tree below.**
> The authoritative architecture is **orchestration_spec.md** (phase-based workflow + real agent functions + 3 real-click gates). The build order is in **build_demo_app_prompt.md**. Do NOT build the scene-integer / Next-button model described below.

# React App Spec · Path E

> Next.js + React + Tailwind app structure for the Path E demo. Vibe-coded with GitHub Copilot.

## Stack

- **Next.js 14+** (App Router · server components OK for static parts)
- **React 18**
- **Tailwind CSS 3+**
- **Lucide React** (icons)
- **TypeScript** (Copilot is much better with types)
- **No backend** · all data in JSON · all state via `useReducer` + Context

No state management library needed. No fetch calls. No auth. Just React + state.

## File tree

```
ai-pulse-demo/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── public/
│   └── (any logos / assets)
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← global layout · tab bar at top
│   │   ├── page.tsx                ← landing · routes to /dashboard
│   │   ├── jira/page.tsx           ← Jira surface (issue + comments)
│   │   ├── confluence/page.tsx     ← Confluence release page view
│   │   ├── servicenow/page.tsx     ← SNOW CHG view (and INC view)
│   │   ├── teams/page.tsx          ← Teams channel + DM mock
│   │   └── dashboard/page.tsx      ← ReleaseWatch dashboard (the killer view)
│   ├── components/
│   │   ├── shell/
│   │   │   ├── AppShell.tsx        ← outer chrome · tab bar · scene controls
│   │   │   ├── TabBar.tsx          ← top nav (Jira / Confluence / SNOW / Teams / Dashboard)
│   │   │   └── SceneControls.tsx   ← Next/Prev scene buttons for demo control
│   │   ├── jira/
│   │   │   ├── JiraIssue.tsx       ← the ACQ-3847 story view
│   │   │   ├── CommentThread.tsx   ← comments + new comment input
│   │   │   └── Subtasks.tsx        ← subtask list
│   │   ├── confluence/
│   │   │   ├── ReleasePage.tsx     ← the release page
│   │   │   └── RiskPacketSection.tsx ← the risk packet block
│   │   ├── servicenow/
│   │   │   ├── ChgTicket.tsx       ← CHG view
│   │   │   ├── WorkNotes.tsx       ← work notes timeline
│   │   │   └── IncTicket.tsx       ← INC view
│   │   ├── teams/
│   │   │   ├── TeamsChannel.tsx    ← channel view with message list
│   │   │   ├── MessageBubble.tsx   ← single message
│   │   │   ├── AdaptiveCard.tsx    ← adaptive card with buttons
│   │   │   └── ApprovalActions.tsx ← buttons that advance scene
│   │   ├── dashboard/
│   │   │   ├── DashboardGrid.tsx   ← the 9-tile dashboard
│   │   │   ├── WatchTile.tsx       ← single tile (L1/L2/L3 badge)
│   │   │   └── DemoCard.tsx        ← detailed view of demo target
│   │   └── shared/
│   │       ├── StatusBadge.tsx     ← reusable L1/L2/L3 badge
│   │       ├── MetricChart.tsx     ← simple line/bar for metric drift viz
│   │       └── ScrollSection.tsx   ← styled containers
│   ├── lib/
│   │   ├── state/
│   │   │   ├── DemoContext.tsx     ← React Context wrapping the reducer
│   │   │   ├── demoReducer.ts      ← the 17-step state machine
│   │   │   └── demoActions.ts      ← action type definitions
│   │   ├── data/
│   │   │   ├── mockData.ts         ← imports from mock_data_seed.json
│   │   │   └── dataLoader.ts       ← typed accessors (see data_loader_template.ts)
│   │   └── choreography/
│   │       ├── metricDrift.ts      ← timed metric drift simulation
│   │       └── sceneTimings.ts     ← scene-to-scene timing
│   ├── styles/
│   │   └── globals.css             ← Tailwind directives + brand variables
│   └── types/
│       └── demo.ts                 ← TS types for the seed JSON
└── public/
    └── mock_data_seed.json         ← copied from 01_common/data/
```

Roughly 30 files. Most are <100 lines. Total project size: ~3000 lines of TypeScript/TSX with Copilot doing the heavy lift.

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10",
    "postcss": "^8",
    "tailwindcss": "^3.4.0",
    "typescript": "^5"
  }
}
```

Optional additions if time allows:
- `framer-motion` for richer animations (the metric drift moment benefits from this)
- `recharts` for proper charts (but the existing mock1 uses inline SVG bars — fine for demo)

## Tailwind config

Use the SYF brand colors as Tailwind extensions:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        syf: {
          yellow: '#FFCE32',
          'yellow-deep': '#E0B520',
          'yellow-soft': 'rgba(255,206,50,.12)',
          navy: '#002856',
          black: '#0a0e14',
        },
        panel: '#131820',
        'panel-2': '#1a2230',
        ink: '#f0f2f5',
        dim: '#9da9b8',
        faint: '#6b7785',
        danger: '#ff6b6b',
        warning: '#ffb454',
        success: '#7fd99b',
        pilot: '#5b8fc7',
        watch: '#FFCE32',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
```

## Bootstrap command

```bash
npx create-next-app@latest ai-pulse-demo --typescript --tailwind --app --no-src-dir
cd ai-pulse-demo
npm install lucide-react
# copy mock_data_seed.json from 01_common/data/ into public/
# start coding with Copilot
npm run dev
```

## How the routes work

| Route | Component | Demo phase |
|---|---|---|
| `/` | Redirect to `/dashboard` | Landing |
| `/jira` | `<JiraIssue />` for ACQ-3847 | Scene 1 (trigger) |
| `/confluence` | `<ReleasePage />` showing risk packet | Scenes 2-3 (review) |
| `/servicenow` | `<ChgTicket />` for CHG0049182 | Scenes 4-5 (CHG advancement) |
| `/teams` | `<TeamsChannel />` with conversation history | Scenes 1, 3, 5, 6, 7 (approvals + handoffs) |
| `/dashboard` | `<DashboardGrid />` with 9 watch tiles | Scenes 6, 7, 8 (post-deploy watch) |

The demo flow involves clicking between these routes as scenes advance. The `TabBar` provides quick switching.

## Scene control

The `SceneControls` component (in the AppShell) has Next / Prev buttons that dispatch `ADVANCE_SCENE` actions. This is for demo control — Vamshi controls pacing manually with arrow keys or button clicks.

Alternative: bind keyboard shortcuts (right arrow advances, left arrow rewinds).

## State management approach

```ts
// src/lib/state/DemoContext.tsx
'use client'
import { createContext, useReducer, useContext, ReactNode } from 'react'
import { demoReducer, initialState, DemoState, DemoAction } from './demoReducer'

const DemoContext = createContext<{
  state: DemoState
  dispatch: React.Dispatch<DemoAction>
} | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, initialState)
  return (
    <DemoContext.Provider value={{ state, dispatch }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider')
  return ctx
}
```

Every component that needs state calls `const { state, dispatch } = useDemo()`. Single source of truth.

## Performance notes

- All components rendered statically · no server fetches · no network roundtrips
- The 9-tile dashboard re-renders only when state changes · fast
- Inline SVG charts (no recharts) avoid bundle bloat

## What Copilot is good at here

Tell Copilot for each component:

> Build a React component that mocks the [Jira / Confluence / SNOW / Teams / Dashboard] UI. Use Tailwind classes only. Match the visual fidelity in `mock1_combined.html`. State comes from `useDemo()` returning `state.scene` and `state.data`. Use brand colors `syf-yellow`, `panel`, `panel-2`, `ink`, `dim`, etc.

Copilot will generate ~80% of each component correctly. You polish the last 20%.

## Common issues

| Symptom | Fix |
|---|---|
| Tailwind classes not applying | Verify content paths in `tailwind.config.ts` cover all `.tsx` files |
| Hydration mismatch warnings | Mark interactive components `'use client'` |
| State doesn't persist between routes | Confirm `DemoProvider` is in the root layout, not per-page |
| Component looks generic | Open the corresponding section in `mock1_combined.html` for visual reference |
| Brand colors aren't applying | Double-check Tailwind config and class names — they must match exactly |

---

*Next: `state_machine_spec.md` for the 17-step state machine that drives scene progression.*
