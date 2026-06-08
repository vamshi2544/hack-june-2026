# Prompts · README

> Four LLM prompts that power the agent's reasoning. Same prompts for Path B (paste into Copilot Studio) or Path E (paste into Claude/ChatGPT for screen-share moment).

## What's in here

| File | Purpose | When invoked | Cost |
|---|---|---|---|
| `master_agent_prompt.md` | Top-level agent persona + behavior | Always (pasted into Studio agent instructions) | One-time setup |
| `risk_packet_prompt.md` | Synthesize structured risk packet | Once per release · pre-deploy by ReleasePilot | 1 LLM call |
| `l2_drift_prompt.md` | Classify drift as explained/unexplained | Every L1 check when threshold crossed | Per drift event |
| `l3_rca_prompt.md` | Generate evidence-backed RCA + confidence | Once at L3 escalation | 1 LLM call (highest stakes) |

## How they fit together

```
PRE-DEPLOY
  master_agent_prompt (always active as agent context)
       │
       ▼
  risk_packet_prompt → produces risk packet section in Confluence page
       │
       ▼
  (handoff via risk packet artifact)

POST-DEPLOY
  master_agent_prompt (still active, now under ReleaseWatch persona)
       │
       ▼
  L1 hourly check (templated, no LLM call)
       │
       ▼ (drift detected)
  l2_drift_prompt → classify EXPLAINED or UNEXPLAINED → maybe escalate L2 amber
       │
       ▼ (pattern persists / worsens)
  l3_rca_prompt → produce RCA with confidence → post Adaptive Card
       │
       ▼
  Human acknowledges → cadence relaxes → watch for recovery
```

## Testing order (this weekend)

1. **`l3_rca_prompt.md` first.** It's the highest-stakes prompt and the demo's strongest moment. Use the test harness inside the file with Claude or ChatGPT. Verify the output matches the expected shape. Iterate on system-prompt rules until it does.
2. **`risk_packet_prompt.md` second.** Test that the synthesis is structured, specific, and lists falsifiable expectations.
3. **`l2_drift_prompt.md` third.** Test classification calibration with multiple scenarios (clearly explained drift, clearly unexplained drift, partial cases).
4. **`master_agent_prompt.md` last.** This sets the overall persona. Test once you've validated the specific reasoning prompts.

## Where these go in Path B vs Path E

### Path B (Copilot Studio)

- `master_agent_prompt.md` → Studio agent's **Instructions** field
- `risk_packet_prompt.md` → topic node inside Studio (Generate Risk Packet)
- `l2_drift_prompt.md` → topic node inside Studio (Classify Drift)
- `l3_rca_prompt.md` → topic node inside Studio (Generate L3 RCA) — the **money topic**

See `02_path_b/setup/08_studio_agent_topics.md` for topic-by-topic build instructions.

### Path E (local React app)

The prompts are not strictly needed for Path E since reasoning is scripted. But:
- Show one of these prompts in the pitch deck slide explaining "this is the actual prompt that powers the L3 RCA in production."
- During the live demo's L3 moment, optionally switch to a browser tab with the prompt pasted into Claude/ChatGPT for a live LLM moment.
- Useful as evidence of "real AI thinking" for the judges who ask "where's the AI?"

## Prompt versioning discipline

These prompts will evolve. After each iteration:

1. Update the file (don't create new versions inline)
2. Add a note at the top of the file: "v2 (tightened evidence ordering)"
3. If output changes substantially, also update the expected-output sections in the test harness
4. Commit to git after each meaningful change

If a prompt produces a worse output after an edit, revert to the previous git version. Don't fight a regression — restart the iteration cleanly.

## Anti-patterns to avoid

- **Don't combine prompts.** Each one is sized for its specific task. A "do everything" mega-prompt is harder to debug and produces lower-quality output.
- **Don't pre-fill placeholders with mock values inside the prompt files.** Placeholders should remain literal `{{ placeholder_name }}` text — the integration layer fills them in at runtime.
- **Don't add Synchrony confidential information to prompts.** Mock everything. Use fictional INC numbers (INC0221904, INC0218763, INC0214098 are invented).
- **Don't optimize prompts based on a single demo run.** Test against 3–5 variations of the input to ensure robustness.

---

*Prompts are the agent's voice. These four files determine whether the demo is impressive or vague. Spend Sunday refining them.*
