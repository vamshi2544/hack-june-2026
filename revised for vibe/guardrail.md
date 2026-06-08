# Copilot Guardrail · Build the REAL app, not a screen mockup

> **How to use:** paste the block below into GitHub Copilot **once at the start of the build session** (before or right after `build_demo_app_prompt.md`). Copilot keeps it in context for the session. If you resume in a fresh session, **re-paste it** — Copilot won’t remember it otherwise. When Copilot says a block is done, you can hold it to the self-check by saying *“run the self-check.”*

-----

**GUARDRAIL — read before and obey throughout this build.**

We are building a **real, working agent application**, NOT a click-through mockup that just swaps pre-baked screens. The theme is vibe coding; the deliverable must be actual orchestration code. Mock **data**, never the **app**.

**The line you must not cross:** only two things are faked — the *inputs* (read from `mock_data_seed.json` instead of live systems) and *one reasoning step* (`generateRCA()` returns seeded text instead of calling an LLM). **Everything else must be real code that executes.** If you ever find yourself hardcoding a result that should be computed, or advancing the UI on a timer / `scene++` instead of in response to real state changes, STOP — that’s the failure mode.

**Non-negotiables — verify each holds as you build:**

1. **No scene/step integer driving the UI.** State is a phase-based `WorkflowState` reducer advanced by the orchestrator and by real click handlers — never a “next screen” counter. If `state_machine_spec.md` / `choreography_spec.md` imply a scene model, ignore them; `orchestration_spec.md` is the authoritative driver.
1. **Risk score is COMPUTED, not written in.** `computeRiskScore()` must take real inputs and return **72 (Elevated)** for application-consumer and **28 (Low)** for credit-apply. Prove it with a console assertion BEFORE any UI exists. If I change an input (e.g. drop the migration flag), the number must change.
1. **Drift is DETECTED, not labeled.** `detectDrift()` compares the metric snapshots to the risk-packet thresholds and returns the L1/L2/L3 classification. The amber/red states come from this function’s output, not from a hardcoded step.
1. **The 4 gates are REAL clicks on adaptive cards.** Proceed → Confirm → Approve → Acknowledge each post a `card` to Teams and then the orchestrator **blocks** until I actually click. No auto-advance through a gate. Between gates the agent runs autonomously and posts `status` messages continuously.
1. **Two distinct Teams message kinds.** `status` = post and continue (used at every step); `card` = post and wait for a click (the 4 gates). They render interleaved in one running feed.
1. **Real writes to real state.** `updateConfluence()` actually populates the QCPR docs + release page (blank → filled) from gathered data; `updateServiceNow()` actually transitions `chgState` and fires the email/Teams notification. These are functions with logic, not JSX that shows a finished screen.
1. **Every mock carries a seam comment:** `// PROD: <platform call>  // DEMO: <seed read>`. If a piece of code has no seam comment and isn’t real logic, it shouldn’t exist.
1. **The agent module (`lib/agent/*`) is UI-free** — pure logic + dispatch — so the “real code” is obvious in review. UI only reads state.

**Self-check before you tell me a block is done — answer these explicitly:**

- Did this block add real functions, or did it just render a screen?
- Is anything hardcoded that the spec says to compute or detect?
- Does the flow advance only via the orchestrator and real clicks (no timers / scene jumps faking progress)?
- Could I swap each seam to the real platform by changing one line?

If any answer is wrong, fix it before moving on. If a request from me would turn this into a screen-swap mock, push back and tell me.
