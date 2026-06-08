<!-- ROUTING-BANNER -->
> ⚠️ **READ THIS FIRST — VISUAL/TIMING REFERENCE ONLY. The 'feel' (streamed logs, gradual metric drift) is useful, but the driver is the orchestrator in orchestration_spec.md §4-5, not scene timings.**
> The authoritative architecture is **orchestration_spec.md** (phase-based workflow + real agent functions + 3 real-click gates). The build order is in **build_demo_app_prompt.md**. Do NOT build the scene-integer / Next-button model described below.

# Choreography Spec · Path E

> The timing and motion of the demo. When metrics drift. When work notes appear. When the agent "thinks."

## Why choreography matters

A static "click → next scene" demo feels like a slide deck. A choreographed demo feels alive — the agent appears to be reasoning in real time, metrics gradually degrade, the room can see the cascade happening. The difference is between "I built a mockup" and "look at the system working."

The goal isn't real animation. The goal is *just enough* timing to feel alive without ever waiting too long.

## Pacing principles

1. **Manual advance is the default.** Vamshi clicks "Next" between scenes. The presenter controls timing.
2. **Auto-advance only for "thinking" moments.** When the agent is reasoning (scenes 2, 6, 9), auto-advance after 1.5-2s with a typing indicator.
3. **No scene takes longer than 8 seconds.** Even the "watch" phase compresses real time aggressively. L1 hourly checks happen in 2 seconds of demo time.
4. **Animations are subtle.** Number-tickers (latency climbing 150ms → 2400ms), tile color transitions (green → amber → red), typing indicators. Not bouncy CSS.

## Per-scene timing

| Scene | Hold time | Animations |
|---|---|---|
| 1. JIRA_TRIGGER | 4s (manual advance) | Comment appears with subtle slide-in |
| 2. AGENT_WAKING | 2s (auto-advance) | Typing dots in Teams · "ETA 90s" text |
| 3. RISK_PACKET_DONE | 5s (manual advance) | Risk packet section "writes itself" (text streams in over 800ms) |
| 4. CONFLUENCE_PUBLISHED | 4s (manual) | Page fades in |
| 5. APPROVAL_GATE_1_PENDING | wait for click | Card slides into Teams · subtle pulse on Approve button |
| 6. APPROVAL_GATE_1_APPROVED | 1s (auto-advance) | Approve button shows pressed state · message replaces card |
| 7. CHG_CREATED | 4s (manual) | CHG row appears in SNOW · State badge animates Assess |
| 8. APPROVAL_GATE_2_PENDING | wait for click | Card slides in |
| 9. APPROVAL_GATE_2_APPROVED | 1s (auto-advance) | Same as 6 |
| 10. CHG_IMPLEMENT | 4s (manual) | State badge changes to Implement · email notifications appear |
| 11. DEPLOY_RUNNING | 3s (auto-advance) | Dashboard tile appears with "Deploying..." spinner |
| 12. WATCH_L1_CLEAR | 6s (manual) | Tile turns green · "Hourly all-clear" status |
| 13. WATCH_L2_AMBER | 5s (manual) | **The big one** · see below |
| 14. WATCH_L3_RED | 8s (manual) | Tile turns red · INC tile slides in · RCA text streams |
| 15. HUMAN_HANDOFF | wait for click | Adaptive Card with action buttons |
| 16. HUMAN_ACK | 4s (manual) | Anisha's reply appears |
| 17. RECOVERY_DETECTED | 4s (auto) | Tile turns green · "RECOVERED" badge · victory feel |

Total demo runtime: ~5-7 minutes with smooth pacing.

## The big choreography moment · Scene 13 → 14 (the metric drift cascade)

This is the dramatic visual moment of the demo. Get this right.

### What happens

1. Tile is green (L1_CLEAR). All metrics look fine.
2. Vamshi clicks Next.
3. Over ~3 seconds:
   - Consumer latency number ticks up: 540 → 800 → 1200 → 1800 → 2400 ms (animated counter)
   - Consumer throughput drops: 142 → 95 → 60 → 31 (animated counter)
   - Tile color shifts: green → amber (subtle CSS transition)
   - sms-consumer inbound bar drains: 85 → 42 → 9 → 0 /min (email + audit follow)
   - "L2 amber" badge appears on tile
4. A Teams message slides into the right panel: "⚠ L2 amber: sms-consumer inbound 85→9/min · unexplained"
5. Email notification icon shows a "1" badge.
6. State is now WATCH_L2_AMBER.

### Implementation approach

Use `requestAnimationFrame` for the number tickers:

```ts
// src/lib/choreography/metricDrift.ts
export function animateMetricDrift(
  from: MetricSnapshot,
  to: MetricSnapshot,
  durationMs: number,
  onTick: (snapshot: MetricSnapshot) => void
) {
  const startTime = performance.now()

  function tick(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / durationMs, 1)
    const eased = easeInOutQuad(progress)

    onTick({
      consumerLatencyMs: interpolate(from.consumerLatencyMs, to.consumerLatencyMs, eased),
      consumerThroughput: interpolate(from.consumerThroughput, to.consumerThroughput, eased),
      rabbitmqNode1Memory: interpolate(from.rabbitmqNode1Memory, to.rabbitmqNode1Memory, eased),
      // ... etc
    })

    if (progress < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

function interpolate(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}
```

Tile color transition is just CSS:

```css
.tile {
  transition: background-color 800ms ease, border-color 800ms ease;
}
.tile[data-state="L1_CLEAR"] { background: rgba(127, 217, 155, 0.1); border: 1px solid #7fd99b; }
.tile[data-state="L2_DRIFT"] { background: rgba(255, 180, 84, 0.1); border: 1px solid #ffb454; }
.tile[data-state="L3_INC_OPEN"] { background: rgba(255, 107, 107, 0.1); border: 1px solid #ff6b6b; }
```

## The other big moment · Scene 14 (L3 RCA generation)

When the L3 RCA "appears" on screen, you have two options:

### Option A · Text streams in (recommended)

Pre-load the RCA text. Render it character by character (or word by word) over ~3 seconds. Feels like the agent is generating in real time.

```tsx
function StreamingText({ fullText, durationMs = 3000 }) {
  const [visibleChars, setVisibleChars] = useState(0)
  useEffect(() => {
    const intervalMs = durationMs / fullText.length
    const interval = setInterval(() => {
      setVisibleChars(c => {
        if (c >= fullText.length) {
          clearInterval(interval)
          return c
        }
        return c + 1
      })
    }, intervalMs)
    return () => clearInterval(interval)
  }, [fullText, durationMs])

  return <pre>{fullText.slice(0, visibleChars)}<span className="cursor">▌</span></pre>
}
```

### Option B · Live Claude/ChatGPT call (riskier but cooler)

Vamshi switches to a separate browser tab, pastes the actual `l3_rca_prompt.md` with filled-in values, the LLM generates the response live. Captures back to the demo flow with a screenshot or by typing the result.

This is dramatic but adds risk (latency, response quality variability). Use Option A by default, Option B only if you're confident.

## Typing indicators

When the agent is "thinking" (scenes 2, 5, 8 before approval, 14 before RCA), show a typing indicator:

```tsx
<div className="flex gap-1 items-center">
  <span className="text-dim text-xs">Release Pilot is typing</span>
  <span className="typing-dot" />
  <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
  <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
</div>
```

```css
@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
}
.typing-dot {
  width: 4px; height: 4px;
  background: var(--dim);
  border-radius: 50%;
  animation: typing-bounce 1.4s infinite;
}
```

## Reduced-motion fallback

For accessibility (and for demo presenters who hate motion), respect `prefers-reduced-motion`:

```ts
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReducedMotion) {
  // skip animations · snap to final state
}
```

For the hackathon demo, you control the laptop · safe to ignore. But add the check if you have 10 spare minutes — judges may have accessibility preferences.

## Common issues

| Symptom | Fix |
|---|---|
| Animations feel choppy | Use CSS transitions instead of JS where possible (browser GPU acceleration) |
| Numbers tick irregularly | Use `requestAnimationFrame`, not `setInterval` · setInterval drifts |
| Streaming text appears all at once | Verify state updates trigger re-renders · check React.memo isn't blocking |
| Scene 13 → 14 timing is off | Hold scene 13 manually until amber pulse settles · then advance |
| Reduced motion preference breaks demo | Override during demo time · just remove the check temporarily |

## Demo-time controls

The `SceneControls` component should have:
- **Next** button (→ arrow key)
- **Prev** button (← arrow key) · for accidental advances
- **Reset** button (R key, with confirmation)
- **Jump to scene** dropdown (for recovering from mistakes mid-demo)

Hide these in production. Use a `?demo=true` URL param to show them, or only show in dev mode.

---

*The choreography is what makes Path E feel like a real product instead of a mockup. Spend a couple of polish hours here if everything else is on track.*
