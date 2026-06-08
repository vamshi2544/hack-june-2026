# Demo Dry Run Script

> The end-to-end rehearsal procedure. Run twice Monday evening minimum. Once Tuesday morning before submit.

## Why dry runs matter

You can't know if the demo flows smoothly until you actually present it end-to-end with the team watching. Dry runs catch: pacing problems, scene transitions that look broken, narration that doesn't match what's on screen, technical glitches under demo-like conditions.

Two dry runs Monday evening at minimum. Three if time allows. One final Tuesday morning.

## Dry run roles

| Role | Person | What they do |
|---|---|---|
| Presenter | Vamshi | Drives the laptop · narrates per `pitch_script.md` |
| "Anisha" approver | Anisha (yes, herself — playing herself on-call) | Clicks Approve buttons · types reply at scene 16 |
| "Second human" | Sai Mohit | Observes timing · notes glitches · second clicker if needed |
| Timekeeper | Sai Mohit (dual role) | Times each segment · flags if running long |

## Setup before each dry run (~3 min)

1. Reset state — restart the React app (Path E) or refresh browser tabs (Path B)
2. Clear Teams chat history of test messages (or use a fresh channel)
3. Reset SharePoint demo CHG to its starting state (Path B)
4. Open browser tabs in order:
   - **Path B:** Jira story · Teams channels · SharePoint release page · SharePoint Active Watches dashboard
   - **Path E:** localhost:3000/jira · /confluence · /servicenow · /teams · /dashboard
5. Open `pitch_script.md` in a side window or printed (cue cards)
6. Open a timer · start when ready

## Dry run sequence

### Stage 1 · Opening (target 1:30)

1. Presenter begins with the opening narration
2. Slides 1-4 visible · advance per script
3. Timekeeper notes start time

**Watch for:**
- Pacing — opening should be confident but not rushed
- Eye contact — presenter looking at audience, not screen
- Clarity of value prop — does the audience understand what you're solving?

### Stage 2 · Live demo (target 5:00)

The 8 scenes per `pitch_script.md`. Presenter walks through each:

| Scene | Time | What to observe |
|---|---|---|
| 1 | :15 | Jira comment posts cleanly · Teams responds quickly |
| 2-3 | :30 | Risk packet appears with right content · narration matches |
| 4 | :40 | Confluence page renders fully · risk packet section visible |
| 5 | :30 | First Adaptive Card clean · Anisha clicks approve smoothly |
| 6-7 | :40 | CHG state transitions · second approval · email visible |
| 8 | :60 | Metric drift animation smooth · L2 amber alert lands |
| 9 (L3) | :90 | RCA streams legibly · INC creation visible · confidence shown |
| 10 (handoff) | :60 | L3 Adaptive Card · Anisha acknowledges · cadence relaxes · Anisha types reply · recovery |

**Watch for:**
- Any scene that takes longer than expected · note time deltas
- Any glitch (wrong text, button not responding, network delay)
- Narration synchronization with screen — talking about something not yet visible is a tell

### Stage 3 · Closing (target 1:00)

1. Presenter switches to architecture slide
2. Narrates the three principles
3. Closes with "From comment to confidence · we're done"

**Watch for:**
- Confidence in voice
- Strong close (not trailing off)
- Right slide visible at the right moment

## Post-dry-run debrief (10 min)

Right after each dry run, team huddles:

1. Timekeeper announces total time + any segment over target
2. Each observer names top 1-3 issues they noticed
3. Presenter names what felt wrong
4. Team agrees on top 3 fixes
5. Decide: fix in next 60 min OR park for tomorrow

Don't try to fix everything · 3 fixes max per dry run.

## What "good" looks like

- Total time: 6-8 minutes (Idea 1) · 4-5 minutes (Idea 2)
- No more than 1 visible glitch
- Narration matches the screen continuously
- Presenter sounds confident, not reading
- Audience would understand the architecture without the narration

## What "bad" looks like

- Total time over 10 min
- Multiple visible glitches (text wrong, button broken, scene out of order)
- Long pauses mid-demo
- Presenter looking at script during demo
- Audience wouldn't follow without the explicit narration

If first dry run is bad, fix the top 3 issues and do dry run 2. If second dry run is still bad, you've found a structural problem — consider falling back to Idea 2 (shorter scope) or to the recorded video plan.

## Recording the fallback video (after dry run 2)

If dry run 2 is acceptable, record it. This video plays Tuesday if anything breaks live.

### Tools

- **OBS Studio** (free · most reliable) OR
- **QuickTime Player** (Mac built-in · simpler)
- Aim for 1080p · 30 fps · MP4 output
- Audio: presenter's voice over the screen capture

### Recording procedure

1. Reset state per the dry-run setup
2. Start recording
3. **Don't restart if you fumble a line** — keep going · live demos have flaws too · realism is fine
4. Aim for 6-8 minutes total
5. Save the file with a clear name: `ai-pulse-demo-fallback-v1.mp4`
6. Verify the video plays back without errors
7. **Save a backup copy** to a different location (USB, cloud, second laptop)

### When to use the fallback video Tuesday

- Live demo breaks more than once mid-walkthrough
- Network/infrastructure failure during live (Teams down, Studio rate-limited)
- Browser crash · cannot recover in 30 seconds
- Presenter loses voice / has emergency

Have the video URL or local file ready in a separate browser tab. If live demo fails: "We have a recorded walkthrough that captures the full flow — let me play that, then I'll answer questions live."

## Common dry-run issues

| Symptom | Fix |
|---|---|
| Demo runs 12+ min on first try | Cut scenes 4-5 · trim opening · adjust pacing |
| Animations choppy on the office laptop | Reduce animation duration · use static transitions |
| Adaptive Card click hangs (Path B) | Restart Studio agent · clear browser cache · or downgrade to plain messages |
| L3 RCA stream too fast to read | Slow the typing speed in `StreamingText` config |
| Anisha's approval feels rushed | Add a "review" pause in the script before clicking |
| Audience doesn't track what's on screen | Add cursor highlights · slow down scene transitions |

---

*Two dry runs Monday is a hard requirement. Three is better. One Tuesday morning is non-negotiable.*
