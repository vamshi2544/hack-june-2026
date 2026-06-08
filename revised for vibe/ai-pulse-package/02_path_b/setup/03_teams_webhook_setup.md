# 03 · Teams Incoming Webhook Setup

> Create a webhook URL in your Teams channel that Jira can POST to. Free Teams feature. No premium licensing.

## What's an Incoming Webhook?

A unique URL attached to a Teams channel. Anyone with the URL can POST a message to that channel. Used for one-way notifications from external systems.

## Prerequisites

- Access to a Microsoft Teams team (your AI Pulse hackathon team should have one)
- Permission to install connectors in channels (usually team members can; team owner if not)

## Steps

### Step 1 · Create the channels (if not already done)

In your AI Pulse team, create two channels:

1. `#release-pilot-channel` — for the trigger handoff and pre-deploy flow
2. `#release-watch-acquisition` — for post-deploy monitoring and human handoff

### Step 2 · Install Incoming Webhook connector

On Microsoft 365 environments without the legacy "Incoming Webhook" connector, you'll use the **Workflows** app instead. Both approaches are documented below — try Workflows first, fall back to Connector if needed.

#### Approach A · Microsoft Workflows (recommended)

1. Open `#release-pilot-channel`
2. Click **...** (more options) at top of channel
3. Click **Workflows**
4. Find template: **Post to a channel when a webhook request is received**
5. Click **Continue**
6. Name the flow: `Jira to Release Pilot Channel`
7. Click **Next**
8. Select team and channel: AI Pulse → #release-pilot-channel
9. Click **Add workflow**
10. The page now shows your **Webhook URL** — **copy this immediately**

Save the URL in `path_b_demo_assets.md` under `jira_to_teams_webhook_url`.

#### Approach B · Incoming Webhook (legacy connector, may not be available)

1. Open `#release-pilot-channel`
2. Click **...** at top of channel
3. Click **Connectors**
4. Find **Incoming Webhook**
5. Click **Configure**
6. Name: `Jira Release Trigger`
7. Optionally upload an icon
8. Click **Create**
9. Copy the URL · save to `path_b_demo_assets.md`

If you don't see "Connectors" option, Approach B is disabled in your tenant — use Approach A.

### Step 3 · Test the webhook

From your terminal (Mac) or PowerShell (Windows):

**curl test (Mac/Linux):**
```bash
curl -H "Content-Type: application/json" \
     -d '{"text": "Test message from terminal"}' \
     "<YOUR_WEBHOOK_URL>"
```

**PowerShell test:**
```powershell
Invoke-RestMethod -Uri "<YOUR_WEBHOOK_URL>" `
                  -Method Post `
                  -ContentType "application/json" `
                  -Body '{"text": "Test message from PowerShell"}'
```

You should see a `1` response and the message appear in `#release-pilot-channel`.

If it works: ✓ proceed to step 4
If not:
- Re-check the URL (paste in browser — should give an error since it's POST-only, but at least the domain should resolve)
- Verify your terminal can reach Microsoft cloud endpoints
- Check Teams app permissions in your tenant

### Step 4 · Repeat for the watch channel

If you want ReleaseWatch to also receive direct external posts (less common — the agent usually posts directly), repeat steps 1–3 for `#release-watch-acquisition`. For our build, the agent posts to this channel itself, so you may not need a webhook here.

### Step 5 · Save the URLs

In `path_b_demo_assets.md`, record:

```
jira_to_teams_webhook_url: <paste URL>
release_pilot_channel_name: #release-pilot-channel
release_watch_channel_name: #release-watch-acquisition
```

Keep this URL private — anyone with it can post to your channel.

## Adaptive Card payload format

The webhook accepts JSON with this top-level structure for rich cards:

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
        "body": [ ... ]
      }
    }
  ]
}
```

The full payload our Jira automation rule sends is in `02_jira_automation_rule.md`.

For plain text, just `{"text": "your message"}` works.

## Limits to know

- Throttling: ~4 requests/sec per webhook · plenty for our use case
- Payload size: < 28 KB
- Adaptive Card version supported in Teams: up to 1.4 (some 1.5+ features won't render)
- Webhook URL lifetime: indefinite, but rotates if you reconfigure the workflow

## Common issues

| Symptom | Fix |
|---|---|
| Webhook URL works in curl but not from Jira | Check Jira Automation's "Send web request" action is enabled and not throttled |
| Message appears with no formatting | Payload is plain text — wrap in Adaptive Card format if you want rich rendering |
| 400 Bad Request | JSON malformed · paste into jsonlint.com to verify |
| 410 Gone | Webhook was deleted or expired · regenerate |
| Workflows app missing in your channel | Tenant admin disabled it · use Connector approach or ask admin |

## Time estimate

10 minutes if Workflows app works on first try. 20 minutes if you have to troubleshoot tenant permissions.

---

*Next: `04_sharepoint_site_setup.md` for the SharePoint site that holds release pages and lists.*
