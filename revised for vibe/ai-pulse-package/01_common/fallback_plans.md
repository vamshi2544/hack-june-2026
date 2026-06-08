# Fallback Plans · Layered Contingency Model

> If X fails, do Y. The principle: you can never end up with nothing. There is always a lower-fidelity version that ships.

## The contingency layers

```
LAYER 1 · Path B fully working           ← maximum credibility
    │
    ▼
LAYER 2 · Path B with some mocking       ← high credibility
    │
    ▼
LAYER 3 · Path E with optional live LLM  ← strong credibility · always achievable
    │
    ▼
LAYER 4 · Pre-recorded video             ← still credible · plays Tuesday no matter what
    │
    ▼
LAYER 5 · Slide-only deck pitch          ← floor · the deck always works
```

The team's job: get as far up the stack as possible. The package design ensures Layer 4 is always available.

## Decision tree

```
Monday 11:30 ET · Path commitment based on checks
   │
   ├─ All checks pass         → Build Layer 1 (Path B) · prep Layer 4 video
   ├─ 3 of 5 critical pass    → Build Layer 2 (Path B partial) · prep Layer 4 video
   ├─ Studio works · M365 partial → Build Layer 3 (Path E) · prep Layer 4 video
   └─ Studio doesn't work     → Build Layer 3 (Path E) · don't even try Studio
   
Monday 17:00 ET · Dry-run review
   │
   ├─ Demo runs cleanly       → Keep Layer 1/2/3 plan · record Layer 4 video
   ├─ Demo glitchy but workable → Add fixes · re-test · Layer 4 video as insurance
   └─ Demo breaks repeatedly  → Drop one layer down · record Layer 4 video as primary
   
Tuesday 08:30 ET · Sanity check
   │
   ├─ All systems green        → Live demo (Layer 1-3)
   ├─ One subsystem flaky      → Live demo with Layer 4 video as backup tab
   └─ Multiple things broken   → Layer 4 video is the primary pitch
```

## Per-failure-mode response

### Path B specific failures

#### Studio agent loses its mind / starts giving bad responses

**Time budget:** 15 min to attempt to fix · then fall back

**Fallback:**
- Reset the agent in Studio (clear conversation history · restart browser session)
- If still bad: switch to **pre-recorded RCA** for the L3 scene · drop the live Gen Answers call
- Narrate: "in production this uses live Studio generation; for the demo we're showing the pre-rendered output for reliability"

#### Adaptive Card click doesn't return to the topic

**Time budget:** 15 min

**Fallback:**
- Replace Adaptive Card with plain Teams messages: "Type APPROVE to approve, REJECT to reject"
- Anisha types the response · agent reads the text via regex match
- Lower fidelity but works · narrate during demo

#### SharePoint connector fails mid-demo

**Time budget:** can't fix mid-demo · pivot immediately

**Fallback:**
- Switch to fallback video for the affected scene
- "Let me show you the SharePoint side via the recording — back to live for the agent reasoning"

#### Jira automation rule stops firing

**Time budget:** can't fix mid-demo

**Fallback:**
- Manually paste the trigger message in Teams during demo
- "We'd normally trigger this from a Jira comment — for the demo I'll post directly"

### Path E specific failures

#### Local Next.js dev server crashes mid-demo

**Time budget:** 30 seconds to restart

**Fallback:**
- Run a second instance on a different port as warm standby
- Switch tabs to standby · keep going

#### Animation lags or stutters

**Time budget:** can't fix mid-demo

**Fallback:**
- Disable animations · use static state transitions
- Lower fidelity but reliable

#### Office laptop battery dies / freezes

**Time budget:** 1-3 minutes restart

**Fallback:**
- Switch to recorded video
- "My laptop just decided to take a break — let me show you the recording while I get back online"

### Generic / cross-path failures

#### Network goes down during demo

**Fallback:**
- For Path E: still works (local only)
- For Path B: switch to Layer 4 video immediately
- Have an offline copy of the deck PDF as ultimate fallback

#### Time pressure · pitch is running long

**Fallback:**
- Cut scene 4 (Confluence page detail)
- Cut scene 5 (first approval gate)
- Jump from "agent assembled risk packet" directly to "deploy completed"
- Keep the L3 RCA moment intact — that's the headline

#### Presenter loses voice / has technical mic issues

**Fallback:**
- Anisha or Sai Mohit picks up the script
- Or use the recorded video with audio overlay
- The team is interchangeable for narration

## The Layer 4 video specifications

The recorded fallback video should:

- Be 6-8 minutes (matches Idea 1 live timing)
- Have narration audio over the screen capture
- Show the COMPLETE happy path (no edits, no jumps)
- Be playable from a single file (MP4) on the office laptop
- Have a backup copy on a second device / cloud
- Be reviewed end-to-end Sunday or Monday evening before relying on it
- Be available offline (not depending on YouTube/Vimeo upload)

If the video itself has flaws, that's fine. Live demos have flaws too. Don't re-record 5 times trying to be perfect.

## The Layer 5 floor · deck-only pitch

If everything fails (rare but possible):

1. Open the deck PDF / HTML
2. Walk through slides 1-16 verbally
3. At slide 9 (the demo slide): "I'll narrate what you would see in the demo — the screens are in the recorded walkthrough we'll share after"
4. Strong opening + strong close · skip ambitious mid-section claims you can't show
5. Keep total under 8 min

The deck IS a working pitch on its own. It tells the story. The demo enhances credibility but isn't structurally required.

## Layer-jumping during Tuesday demo

**If you're 30 seconds into a layer-1 demo and something fails:**

Don't try to fix it live. Say: "I'm going to switch to the recording so we can see the full flow — then I'll answer questions live."

Switch tab. Play video. Resume narration at the close.

This is **graceful degradation** · the audience never sees panic.

## Pre-emptive communication

If you know Tuesday morning that something is degraded:

- Don't apologize at the start of the pitch
- Don't say "we wanted to do X but couldn't"
- Just present what works · the audience will judge what they see

If a judge asks "why didn't you build X?": "We built X in our architecture — happy to walk you through how it would integrate" (and then describe per the deck).

## What we will NEVER do

- Present nothing
- Skip the pitch
- Withdraw from the hackathon

The package design ensures at least Layer 5 is always achievable. The deck exists. The story exists. The team can always tell it.

## Pre-Tuesday confidence check

Before Tuesday submit, post in team chat:

```
Tuesday confidence check
Layer reachable: [1/2/3/4/5]
Live demo: [yes/no/partial]
Fallback video ready: [yes/no]
Backup video on second device: [yes/no]
Presenter: [Vamshi/Anisha/Sai Mohit] · backup: [name]
Confidence: [HIGH/MEDIUM/LOW]
```

If confidence is LOW, go to fallback video as primary. Live is for demos you trust.

---

*The contingency model is the floor. Everything above it is upside. You cannot lose this hackathon by failing the demo · only by failing to ship.*
