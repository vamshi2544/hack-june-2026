# 07 · Studio Agent Setup

> Build the actual Copilot Studio agent that will run ReleasePilot + ReleaseWatch. **Prerequisite: read `copilot_studio_primer.md` first if you've never used Studio.**

## What you're building

A single Copilot Studio agent named `AI Pulse Release Agent` with:
- Master agent instructions (the persona)
- 5 topics (Trigger Handler, Generate Risk Packet, Classify Drift, Generate L3 RCA, Post Adaptive Card and Wait)
- Connections to SharePoint and Teams
- Published to the `#release-pilot-channel` and `#release-watch-acquisition` Teams channels

This is one of two big workstreams Monday morning. Allow 2–3 hours total for agent + topics + testing.

## Prerequisites

- Studio access verified (Monday Check 01 passed)
- SharePoint site set up with all 6 lists (step 04 done)
- Teams channels created with Incoming Webhook (step 03 done)
- The 4 prompt files open in another tab (`01_common/prompts/*.md`)

## Steps

### Step 1 · Create the agent

1. Open `https://copilotstudio.microsoft.com` (or your tenant's Studio URL)
2. Verify you land in the correct environment · top-right environment selector
3. Click **Create** → **New agent**
4. Wizard may ask: "What can your agent help with?" — skip / minimize
5. Agent name: `AI Pulse Release Agent`
6. Description: `Two-agent release lifecycle automation for Synchrony's acquisition API platform. ReleasePilot does pre-deploy work; ReleaseWatch does post-deploy monitoring. Hackathon project by team AI Pulse.`
7. Language: English
8. Click **Create**

The agent should open in the editor with default empty topics.

### Step 2 · Set the instructions (the master prompt)

1. In the left sidebar, click **Overview** (or **Details**, depending on tenant version)
2. Find the **Instructions** field (may be labeled "Custom instructions" or "Agent description for AI")
3. Paste the **Combined agent persona** section from `01_common/prompts/master_agent_prompt.md`
4. Save

If you don't see an Instructions field, look in **Settings → Generative AI** or **Settings → AI capabilities**. Tenant versions vary.

### Step 3 · Enable generative answers

1. **Settings → Generative AI** (or **AI Capabilities**)
2. Enable **Generative answers**
3. For knowledge sources: leave empty for now (we'll add SharePoint as a knowledge source in a later step if needed)
4. Save

### Step 4 · Add SharePoint as a knowledge source

This lets the agent reference SharePoint pages and lists in conversation.

1. **Knowledge** (left sidebar)
2. **Add knowledge**
3. Choose **SharePoint**
4. Authenticate as your account
5. Paste the SharePoint site URL: `https://<your-tenant>.sharepoint.com/sites/AIPulseReleases`
6. Choose: **Include subsites and pages**
7. Save

The agent will index the SharePoint site (may take a few minutes).

### Step 5 · Test basic agent response

1. Open the **Test bot** pane (right side of editor)
2. Type: `Hello, who are you?`
3. The agent should respond per the instructions you pasted — describing itself as ReleasePilot/ReleaseWatch
4. If response is generic ("I am an AI assistant…"), the instructions didn't take effect · re-paste them

### Step 6 · Connect to Microsoft 365 (actions)

1. Left sidebar → **Tools** or **Actions** or **Plugins** (varies by version)
2. Add tool / connection
3. Add **SharePoint** connection (sign in)
4. Add **Microsoft Teams** connection (sign in)
5. Add **Outlook** or **Office 365 Outlook** connection (sign in)

After each connection, you should see a list of available actions. Verify these are present:
- SharePoint: **Get items**, **Create item**, **Update item**, **Create page**
- Teams: **Post message in chat or channel**, **Post adaptive card and wait for response**
- Outlook: **Send an email (V2)**

If any of these are missing, your tenant may have restrictions · note in `m365_connector_inventory.md`.

### Step 7 · Publish to Teams

1. Left sidebar → **Channels**
2. Click **Microsoft Teams**
3. Click **Turn on Teams**
4. Configure:
   - Display name: `Release Pilot`
   - Description: `AI Pulse hackathon agent`
   - Icon: any small image (optional)
5. Click **Make my agent available to others** → **For my company**
6. Once status is "Available in Teams", click **Open in Teams**
7. Add the agent to `#release-pilot-channel`
8. Add the agent to `#release-watch-acquisition`

### Step 8 · Smoke test in Teams

1. In `#release-pilot-channel`, type `@Release Pilot hello`
2. The agent should respond
3. If it doesn't:
   - Verify the agent is added to the channel
   - Check tenant admin hasn't blocked custom agents in Teams
   - Wait a few minutes — Teams provisioning can lag

### Step 9 · Save and version

1. Studio doesn't have git, but it does have versions
2. **Settings → Versions** (if available)
3. Click **Save version** with name `v0-initial-setup`
4. Note the version ID for rollback if needed

## What the agent looks like at end of this step

You have:
- An agent that responds to `@Release Pilot` in Teams
- Master prompt active (it knows it's a release agent)
- M365 connections wired
- SharePoint knowledge source indexed
- 5 empty topics ready to be filled

What you don't have yet:
- Topic-specific logic (next step)
- Trigger phrase matching for the Jira-routed messages (next step)
- Actual Create page / Create list item actions (next step)

## Verification before moving on

- [ ] Agent name appears correctly in Studio
- [ ] Master prompt visible in Instructions field
- [ ] Test bot pane returns persona-appropriate responses
- [ ] SharePoint, Teams, Outlook actions all listed in available tools
- [ ] Agent visible in `#release-pilot-channel`
- [ ] `@Release Pilot hello` returns a response in Teams

If all 6 checks pass, you're ready for topic building. If any fail, debug before moving on — topics depend on these working.

## Common issues

| Symptom | Fix |
|---|---|
| "Failed to create agent" | Likely tenant permission — ask hackathon organizers |
| Instructions field not visible | Look under Settings → Generative AI (location varies) |
| Test bot says "I don't have an answer" to everything | Generative answers not enabled |
| SharePoint connector says "Sign in required" repeatedly | Auth token issue · sign out and back in to Studio · try again |
| Teams publishing button is grayed out | Tenant has disabled custom agents in Teams · use Studio's built-in **Test in Teams** as fallback |
| Agent appears in channel but doesn't respond | Allow 5-10 min for Teams to register the new agent |

## Time estimate

90–120 minutes if all goes smoothly. Allow up to 3 hours for first-time Studio user, including troubleshooting.

---

*Next: `08_studio_agent_topics.md` for the actual topic-by-topic build.*
