<!-- SUPERSEDED-BANNER -->
> ⚠️ **REFERENCE ONLY — Copilot Studio path, abandoned in the platform pivot. Old scenario. Do not build from this.**

# 01 · Jira Setup

> Set up a personal Atlassian Cloud Free Jira project that the team can use for the demo. Vamshi already has a personal Jira; this is about creating the project + the story for the demo trigger.

## Prerequisites

- Personal Atlassian Cloud account (free tier, up to 10 users)
- Admin access (your own account is admin in personal Cloud)
- The seed data from `01_common/data/mock_data_seed.json`

## Steps

### Step 1 · Create the project

1. Log into your Atlassian Cloud at `https://<your-workspace>.atlassian.net`
2. Click **Projects** → **Create project**
3. Choose template: **Scrum** (or Kanban — either works)
4. Project name: `AI Pulse Acquisition APIs`
5. Key: `ACQ` (this becomes the prefix for issue keys, matching the seed data)
6. Click **Create**

### Step 2 · Add team members

1. Project Settings → People → Add people
2. Invite Anisha and Sai Mohit by email (their work emails are fine — free tier allows 10 users)
3. Assign them the **Member** role
4. Save

### Step 3 · Create the release story (the demo trigger)

Use the seed data from `mock_data_seed.json` → `release_story` section.

1. In the project, click **Create issue**
2. Fill in:
   - Issue type: **Story**
   - Summary: `Enable durable messaging for acquisition decision events`
   - Description: paste the description from seed data
   - Components: create a component called `acquisition-decision-orchestrator` and assign it
   - Labels: `release-candidate`, `messaging`
   - Fix version: create a version `2026.06.08` and assign it
3. Save · note the issue key it creates (likely `ACQ-1` if this is your first issue; rename or note this for the demo)

### Step 4 · Create the 4 subtasks

For each subtask in `mock_data_seed.json` → `subtasks`:

1. Open the parent story (`ACQ-1` or whatever key)
2. Click **Add child** → **Sub-task**
3. Fill in summary from seed data
4. Status: transition to **Done** (we want them all closed at demo time)
5. Assignee: as per seed data

### Step 5 · Close the parent story

1. Open the parent story
2. Transition state through To Do → In Progress → Done
3. Verify all 4 subtasks are in Done state

### Step 6 · Verify webhook capability

1. Project Settings → Automation → **Create rule** (don't configure yet — just verify the option exists)
2. If you see "Create rule" with actions like "Send web request" available, you're good
3. Cancel without saving — the actual rule comes in step 02

### Step 7 · Get your API token (for any direct API verification later)

1. Click your avatar → **Manage account** → **Security** → **API tokens**
2. Create a new token labeled `ai-pulse-hackathon`
3. **Copy it now** — Atlassian shows it once. Save it in `path_b_demo_assets.md`.
4. We probably won't use this token in Path B (no direct API calls), but it's good to have.

## Verification

After this step, you should be able to:
- Navigate to your release story in Jira (key like `ACQ-3847` or matching your numbering)
- See 4 subtasks, all in Done state
- See the Fix Version `2026.06.08`
- Type a test comment and save it

## Common issues

- **"Free tier user limit reached"** — only 10 users allowed; remove unused users
- **"Components not editable"** — give yourself project admin role (you should have it by default on personal Cloud)
- **Webhooks vs Automation** — Atlassian Cloud Free includes Automation. Webhooks are also available but Automation is easier for our use case. We use Automation in step 02.

## Time estimate

15–20 minutes if everything goes smoothly. 30 minutes if you hit user limit issues.

---

*Next: `02_jira_automation_rule.md` to wire the comment trigger.*
