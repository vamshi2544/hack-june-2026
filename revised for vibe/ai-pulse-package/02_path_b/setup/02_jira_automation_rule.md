# 02 · Jira Automation Rule (the trigger)

> The rule that wakes the agent. Fires on `@release-pilot` comment, posts to Teams Incoming Webhook. Free Jira feature, no premium.

## What this rule does

```
Trigger: Comment added to an issue
Filter: comment text contains "@release-pilot"
Branch:  Look up all subtasks of the triggering issue (so we have them in the payload)
Action:  Send web request to Teams Incoming Webhook URL with FULL structured payload
         (story + subtasks + fix version + assignee + components + labels)
```

## Why we send the full payload (architectural decision)

Studio has no way to *pull* from Jira without a Premium Power Automate connector (blocked for the hackathon). So we push everything Studio needs in the trigger event itself. Jira Automation has access to all the smart values we need; this is free and works on Atlassian Cloud Free.

**The principle:** *Jira is one-way push. Everything Studio needs from Jira is packed into the trigger event. Everything else lives in SharePoint, which Studio reads natively.*

For production, the Jira Premium connector closes this gap and Studio can pull live data. For the hackathon, full push gives us the same end state without the licensing.

## Prerequisites

- Step `01_jira_setup.md` complete (project and story exist)
- Step `03_teams_webhook_setup.md` complete (you have the Teams Incoming Webhook URL ready) — **build that first if you haven't**

## The exact rule configuration

### Step 1 · Open Automation

1. Project Settings → **Automation**
2. Click **Create rule**

### Step 2 · Set the trigger

1. Trigger: **Issue commented**
2. Save and continue

### Step 3 · Add a condition

1. **Add component** → **Condition** → **Issue fields condition**
2. Field: **Comment**
3. Condition: **contains**
4. Value: `@release-pilot`
5. Save

This ensures the rule fires only on comments mentioning `@release-pilot`, not on every comment.

### Step 4 · Add the subtask lookup action (so we can include them in the payload)

1. **Add component** → **Action** → **Lookup issues**
2. JQL: `parent = {{issue.key}}`
3. Save

This populates the `{{lookupIssues}}` smart value with all subtasks of the triggering story. We reference them in the web request body below.

### Step 5 · Add the web request action (the rich payload)

1. **Add component** → **Action** → **Send web request**
2. Webhook URL: **paste your Teams Incoming Webhook URL** (from step 03)
3. HTTP method: `POST`
4. Web request body: select **Custom data**
5. Custom data: paste the JSON below

```json
{
  "type": "message",
  "attachments": [
    {
      "contentType": "application/vnd.microsoft.card.adaptive",
      "content": {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.4",
        "body": [
          {
            "type": "TextBlock",
            "text": "🔔 New release trigger from Jira · {{issue.key}}",
            "weight": "Bolder",
            "size": "Medium"
          },
          {
            "type": "FactSet",
            "facts": [
              { "title": "Issue:", "value": "{{issue.key}}" },
              { "title": "Summary:", "value": "{{issue.summary}}" },
              { "title": "Fix Version:", "value": "{{issue.fixVersions.name}}" },
              { "title": "Assignee:", "value": "{{issue.assignee.displayName}}" },
              { "title": "Reporter:", "value": "{{issue.reporter.displayName}}" },
              { "title": "Components:", "value": "{{issue.components.name}}" },
              { "title": "Labels:", "value": "{{issue.labels}}" },
              { "title": "Comment by:", "value": "{{comment.author.displayName}}" }
            ]
          },
          {
            "type": "TextBlock",
            "text": "**Description:**",
            "weight": "Bolder"
          },
          {
            "type": "TextBlock",
            "text": "{{issue.description}}",
            "wrap": true,
            "size": "Small"
          },
          {
            "type": "TextBlock",
            "text": "**Subtasks ({{lookupIssues.size}}):**",
            "weight": "Bolder"
          },
          {
            "type": "TextBlock",
            "text": "{{#lookupIssues}}• {{key}} · {{summary}} · {{status.name}} · {{assignee.displayName}}\n{{/}}",
            "wrap": true,
            "size": "Small"
          },
          {
            "type": "TextBlock",
            "text": "**Trigger comment:** {{comment.body}}",
            "wrap": true,
            "isSubtle": true,
            "size": "Small"
          },
          {
            "type": "TextBlock",
            "text": "@release-pilot wake up · all release context above",
            "wrap": true,
            "weight": "Bolder",
            "color": "Accent"
          }
        ]
      }
    }
  ]
}
```

**Smart values explained:**
- `{{issue.*}}` — all fields on the triggering story
- `{{lookupIssues.*}}` — populated by the Lookup issues action in step 4
- `{{lookupIssues.size}}` — count of subtasks
- `{{#lookupIssues}}...{{/}}` — iterator: renders the inner template for each subtask, joining with newlines
- `{{comment.*}}` — the comment that triggered the rule

The Studio agent will receive ALL of this in the Teams message and can extract every field it needs without ever calling back to Jira.

### Step 6 · HTTP headers

Add header:
- Key: `Content-Type`
- Value: `application/json`

### Step 7 · Name and enable

1. Name the rule: `Wake ReleasePilot on @release-pilot comment`
2. Description: `Fires when a Jira comment contains @release-pilot. Pushes the full story + subtask context to Teams.`
3. Owner: yourself
4. **Save and turn on**

## What Studio reads from where (the data sourcing map)

Once the rule is configured, here's exactly what data flows where:

| Studio needs | Comes from | How |
|---|---|---|
| Jira story (key, summary, description, fix version, assignee) | This webhook payload | Embedded in the Adaptive Card facts + description block |
| Jira subtasks (all of them) | This webhook payload | Embedded via `{{#lookupIssues}}` iterator |
| Components, labels | This webhook payload | Embedded in facts |
| Past INCs | SharePoint `Past INCs` list | Studio "Get items" action with JQL-equivalent filter |
| Service catalog / downstream apps | SharePoint (or hardcoded in topic) | Studio "Get items" or topic variable |
| Bitbucket diffs | SharePoint `Bitbucket Diffs` list | Studio "Get items" action |
| Metric snapshots (baselines + current) | SharePoint `Metrics Snapshots` list | Studio "Get items" action |
| Release notes intent | This webhook payload (description block) + Confluence page | Mostly from description; expected shifts from the risk packet section once the agent writes it |
| CHG ticket (live state) | SharePoint `CHG Tickets` list | Studio reads/writes |
| INC ticket (live state) | SharePoint `INC Records` list | Studio creates at L3 |

**Net: zero runtime calls back to Jira.** All Jira data is in the trigger payload. All other data is in SharePoint.

## Testing the rule

1. Open the release story (`ACQ-3847` or whatever)
2. Add a comment: `@release-pilot go — testing the automation rule`
3. Save the comment
4. Go to your Teams channel (the one with the Incoming Webhook)
5. You should see the Adaptive Card appear within a few seconds

If nothing appears:
- Check Automation → **Audit log** in Jira for the rule execution
- Verify the Teams Webhook URL is correct (paste it into a browser — should NOT load a page; it's a POST-only endpoint)
- Check that "Send web request" action shows success (200 status)
- Try a simpler payload first (just text, no Adaptive Card) to verify the wire

## Common issues

| Symptom | Fix |
|---|---|
| Rule fires but Teams shows nothing | Webhook URL is stale (Teams Incoming Webhooks rotate); regenerate in step 03 |
| Rule doesn't fire on comment | Re-check condition — `contains` is case-sensitive in some Jira versions; try lowercase `@release-pilot` |
| 400 error from Teams | JSON payload format invalid — paste into a JSON validator first |
| Free tier rule executions exhausted (100/month) | We're well within limit; ignore |
| Smart values come through as literal text | Use `{{issue.key}}` not `{{ issue.key }}` — no spaces inside braces |

## Why we use Adaptive Card format in the webhook payload

The Teams Incoming Webhook can accept either plain text or an Adaptive Card. We use Adaptive Card so the message is structured — easier for the Studio agent to parse the fields. You could send plain text and have the agent parse it with regex, but structured is cleaner.

## What this rule does NOT do

- It does NOT call Studio directly. It just posts to a Teams channel.
- Studio "sees" the message because the Studio agent is **published to that Teams channel** (see step 07_studio_agent_setup.md). When a new message arrives in the channel and contains the agent's trigger phrases, the agent wakes up.
- Alternatively (depending on Studio configuration): Power Automate has a "When a message is posted in a channel" trigger that can invoke the Studio agent via Direct Line. See step 09_power_automate_flows.md for that pattern.

## Time estimate

10–15 minutes once you have the webhook URL.

---

*Next: `03_teams_webhook_setup.md` for the webhook URL, or `04_sharepoint_site_setup.md` if you've already done webhook setup.*
