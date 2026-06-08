# Monday Morning Checks · 10:00 – 11:30 ET

> Six verification checks to run Monday June 8 morning. The results decide path commitment. Time-box each check to 15 minutes max.

**Runner:** Vamshi (others standby for testing).
**Output:** filled-in `02_path_b/m365_connector_inventory.md` + path decision posted to team chat.
**Hard rule:** total elapsed time ≤ 90 minutes. After that, commit to a path with whatever you have.

---

## Check 01 · Copilot Studio access (15 min)

**Goal:** verify you can create an agent and get an LLM response.

1. Open browser tab · go to the Studio URL provided by organizers (or `https://copilotstudio.microsoft.com`)
2. Sign in with the provided credentials
3. Click **Create** → **New copilot/agent**
4. Name: `AI Pulse Test`
5. In Instructions: paste "You are a test agent. Respond 'AI Pulse online' to any message."
6. Save · open Test pane
7. Send "hello"
8. **Pass criteria:** response is "AI Pulse online" or close
9. **Fail criteria:** can't create agent · or generic response · or timeout

Record in `m365_connector_inventory.md` → Studio Specific Verifications.

---

## Check 02 · M365 Standard connectors (15 min)

**Goal:** verify the Standard connectors we need are reachable from Studio.

In the test agent from Check 01:
1. Tools → Add tool → search for **SharePoint** · add connection (sign in)
2. Verify "Get items", "Create item", "Update item", "Create page" actions are listed
3. Add **Microsoft Teams** connection · verify "Post message" and "Post adaptive card and wait for a response"
4. Add **Office 365 Outlook** · verify "Send email (V2)"
5. **Pass criteria:** all 3 connections established and listed actions match
6. **Fail criteria:** any connector blocked or premium-flagged

Record results in inventory doc.

---

## Check 03 · Publish agent to Teams (15 min)

**Goal:** verify the test agent can be installed in a Teams channel and respond.

1. In Studio: Channels → Microsoft Teams → Turn on
2. Configure name and icon · Make available "For my company"
3. Wait for status "Available in Teams" (~5 min)
4. Click Open in Teams · add to a test channel
5. In Teams: `@AI Pulse Test hello`
6. **Pass criteria:** agent responds in channel within 10s
7. **Fail criteria:** publishing blocked · or agent installed but doesn't respond

This is the gate for the "killer demo moment" (the Teams handoff). If this fails, Path B drops to Path C (Studio + SharePoint without Teams) or Path E.

---

## Check 04 · Adaptive Card with action button (15 min)

**Goal:** verify the agent can post a card with buttons and receive the click.

In your test agent:
1. Create a new topic · Trigger phrase: "test card"
2. Add a "Post adaptive card and wait for a response" node (Microsoft Teams action)
3. Use this payload:
   ```json
   {
     "type": "AdaptiveCard",
     "version": "1.4",
     "body": [{ "type": "TextBlock", "text": "Approval test", "weight": "Bolder" }],
     "actions": [
       { "type": "Action.Submit", "title": "Yes", "data": { "response": "yes" } },
       { "type": "Action.Submit", "title": "No",  "data": { "response": "no" } }
     ]
   }
   ```
4. After the card node, add a Message: `You clicked: @{Topic.LastMessage.Value.response}`
5. Save · in Teams type `@AI Pulse Test test card`
6. Card appears · click Yes
7. **Pass criteria:** agent replies "You clicked: yes"
8. **Fail criteria:** card doesn't render · button click doesn't return · response not extractable

This is the gate for the **L3 human handoff moment.** Critical for Path B credibility.

---

## Check 05 · Jira → Teams webhook (10 min)

**Goal:** verify the trigger flow works.

1. In your AI Pulse Teams channel: ... → Workflows → "Post to a channel when a webhook request is received"
2. Configure · copy the webhook URL
3. From terminal:
   ```bash
   curl -H "Content-Type: application/json" \
        -d '{"text":"Test from terminal"}' \
        "<paste URL>"
   ```
4. **Pass criteria:** message appears in the channel
5. **Fail criteria:** 401/403/network error

If Pass: Jira can wake the agent. If Fail: trigger flow has to go via email-out, more brittle but workable.

---

## Check 06 · Generative answers quota / cost (5 min)

**Goal:** estimate how many demo runs you can do without exhausting credits.

1. In Studio · check the agent's analytics / billing tab (location varies)
2. Look for "messages consumed" or "credits remaining" or similar
3. Run 5 test messages · check the counter
4. Extrapolate: each demo will involve roughly 4-6 LLM calls. You need ~30 calls of headroom across Monday + Tuesday.
5. **Pass criteria:** plenty of headroom · or no visible quota
6. **Fail criteria:** quota visibly tight (< 30 calls remaining) — note this and plan to limit test runs

---

## Decision matrix (when all 6 checks done)

| Checks 01-06 result | Path commitment |
|---|---|
| All pass | **Path B** · full real-surface implementation |
| 01-02 pass, 03 fail (Teams publish blocked) | **Path D** · Studio agent + share Direct Line URL with jury · or local SPA fronting Studio |
| 01-02 pass, 04 fail (cards blocked) | **Path C** · Studio + SharePoint, plain messages instead of cards |
| 01 pass, 02 fail (connectors blocked) | **Path E** · local React app · use Studio prompts as evidence |
| 01 fail (Studio access broken) | **Path E** · pure local · cite Studio in architecture slide |
| 05 fail only | Use Jira email-out instead of webhook (workable but slower) |
| 06 quota tight | Limit test runs Monday afternoon · run Studio only on the live demo |

---

## Output by 11:30 ET

Post in team chat:

```
MONDAY CHECKS RESULT · 11:30 ET
Check 01 (Studio access): PASS / FAIL · notes
Check 02 (Standard connectors): PASS / FAIL · notes
Check 03 (Teams publish): PASS / FAIL · notes
Check 04 (Adaptive Cards): PASS / FAIL · notes
Check 05 (Jira webhook): PASS / FAIL · notes
Check 06 (Quota): OK / TIGHT · notes
PATH COMMITMENT: B / C / D / E
NEXT STEP: see [team_allocation.md]
```

Then everyone runs to their workstream per `team_allocation.md`.

---

*Don't deliberate. Run, log, decide, move. The team is waiting after 11:30.*
