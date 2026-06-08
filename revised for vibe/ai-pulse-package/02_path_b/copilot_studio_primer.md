# Copilot Studio Primer · Zero-Knowledge Start

> **Read this before Monday.** If you've never opened Copilot Studio, this primer covers everything you need to know to be productive in the first 90 minutes after access lands. No prior knowledge assumed.

---

## What is Copilot Studio?

Microsoft Copilot Studio is a no-code/low-code platform for building **AI agents** (Microsoft calls them "copilots"). An agent in Studio is a configurable LLM-powered chatbot that:

- Has an **identity** (a name, an avatar, a description)
- Has **instructions** (a system prompt — the agent's persona and behavior)
- Has **topics** (specific reasoning capabilities, like "generate an RCA")
- Has **channels** (where it talks to users — Teams, websites, a test panel)
- Has **knowledge sources** (documents, websites, SharePoint sites it can read)
- Can take **actions** (using Microsoft 365 connectors — post to Teams, send email, create SharePoint pages)

For our hackathon, the agent we're building is ReleasePilot + ReleaseWatch. The LLM behind it is provided by Microsoft (you don't choose the model — Studio handles it).

---

## What Studio is NOT

Set expectations correctly:

- **Studio is not Power Automate.** Power Automate runs workflows triggered by events. Studio runs conversations triggered by messages. They're different products that can talk to each other.
- **Studio is not a custom Python/Node agent framework.** You can't write `def my_function()` in Python. You configure topics and use prebuilt action nodes.
- **Studio is not GitHub Copilot.** Different product entirely. GitHub Copilot is the IDE autocomplete tool; Studio builds standalone agents.
- **Studio is not free in all configurations.** The base agent + Microsoft 365 connectors are typically standard. Premium connectors (Jira, Confluence, Salesforce, custom HTTP) require Power Automate Premium licensing.

---

## Key concepts (memorize these before Monday)

### Agent (a.k.a. Copilot)
The top-level thing you build in Studio. Has a name, a description, instructions, and a set of topics. One agent = one chatbot/bot.

### Topic
A conversation pattern the agent knows how to handle. Each topic has:
- **Trigger phrases** — what the user says to invoke this topic
- **Nodes** — the steps the topic executes (ask questions, call LLM, call an action, show messages)
- **Variables** — data passed between nodes

For our project, we'll have topics like: "Wake on Trigger", "Generate Risk Packet", "Classify Drift", "Generate L3 RCA".

### Generative answers / Generate response node
A node inside a topic that calls the LLM with a prompt and returns the response. This is where our actual prompts (l3_rca_prompt.md etc.) get pasted.

### Action / Connector action
A node that performs an external action — post to Teams, create SharePoint list item, send email. Available actions depend on what connectors your tenant has.

### Standard vs Premium connectors
- **Standard:** Free with Microsoft 365 licenses. Includes Teams, SharePoint, Outlook, Forms, OneDrive, Microsoft Lists.
- **Premium:** Requires Power Automate Premium license. Includes Jira, Confluence, ServiceNow, HTTP (generic), Custom Connector.

**Our build uses only Standard.** We treat any Jira/Bitbucket data as either pre-seeded in SharePoint (Standard) or pushed-into-M365 from Atlassian (free, no connector needed).

### Channel
Where the agent is published. Default channels include:
- **Test pane** (inside Studio itself — for development)
- **Demo site** (an auto-generated web page)
- **Microsoft Teams** (publish the agent as a Teams app/bot)
- **Custom website** (embed via JavaScript)
- **Direct Line REST API** (for programmatic access)

For our project: primary channel is **Microsoft Teams**.

### Instructions
The agent's persistent system prompt. Lives in the agent's settings. Applied to every conversation. This is where `master_agent_prompt.md` goes.

### Knowledge
Static reference data the agent can read. Sources include SharePoint sites, websites, uploaded files. Useful for agents that answer questions. For our project, we use it sparingly — most data lives in SharePoint lists the agent queries via actions.

---

## What the Studio UI looks like (mental model)

When you log in, you see:

```
┌─────────────────────────────────────────────────────────────┐
│ COPILOT STUDIO                                              │
│                                                             │
│ ┌─ Left sidebar ─┐  ┌────── Main canvas ──────────────┐    │
│ │ Overview       │  │                                 │    │
│ │ Topics  ←──── here you build conversation logic     │    │
│ │ Plugins        │  │                                 │    │
│ │ Channels       │  │   [visual node-based editor]    │    │
│ │ Analytics      │  │                                 │    │
│ │ Settings       │  │                                 │    │
│ └────────────────┘  └─────────────────────────────────┘    │
│                                                             │
│ ┌─ Right pane ─┐                                            │
│ │ Test bot     │ ← chat with your agent here to debug     │
│ └──────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

The **Test bot** pane is critical — every change you make can be tested instantly without publishing. Use it constantly Monday.

---

## What a topic looks like (visual editor)

Topics are built as flowcharts. Each box is a node. Lines connect nodes in execution order:

```
┌──────────────┐
│  Trigger     │  ← "When user says '@release-pilot go' or similar"
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Get release info     │  ← Optional: call an action to fetch SharePoint data
│ (SharePoint Get Item)│
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Generate response    │  ← The LLM call · here we paste the risk packet prompt
│ (Generative Answer)  │
│  - prompt: ...       │
│  - inputs: ...       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Create SharePoint    │  ← Action: write the result back as a SharePoint page
│ Page                 │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Send message in      │  ← Action: post to Teams channel
│ Teams channel        │
└──────────────────────┘
```

You drag-and-drop nodes from a palette and connect them. No code required for most flows.

---

## How our agent maps to Studio concepts

| What we want | How it lives in Studio |
|---|---|
| ReleasePilot + ReleaseWatch persona | Agent's **Instructions** field (paste `master_agent_prompt.md`) |
| Wake on Jira trigger | **Topic 1: "Process Release Trigger"** — trigger phrase matches the Jira-routed message from Teams |
| Synthesize risk packet | **Topic 2: "Generate Risk Packet"** — Generative answer node with `risk_packet_prompt.md` |
| Publish Confluence-like page | Inside Topic 2 — **Create page (SharePoint)** action node |
| Approval gate | Inside Topic 2 — **Post adaptive card and wait for a response (Teams)** action node |
| Create/update CHG | **Update item (SharePoint Lists)** action node — list represents CHG table |
| Send notifications | **Send email (Outlook)** + **Post message in channel (Teams)** action nodes |
| Detect drift post-deploy | **Topic 3: "Classify Drift"** — Generative answer with `l2_drift_prompt.md` |
| Generate L3 RCA | **Topic 4: "Generate L3 RCA"** — the money topic — Generative answer with `l3_rca_prompt.md` |
| Post Adaptive Card with actions | Inside Topic 4 — **Post adaptive card (Teams)** action node |

Total topics needed: **4 main + 1 trigger** = 5 topics.

---

## Things that surprise people on day 1

- **The trigger phrase matching is fuzzy.** "@release-pilot go" and "release pilot start" probably both fire the same topic. Specify multiple trigger phrases for robustness.
- **Each topic has a max length.** Very long topics with many nodes become hard to maintain. Split into sub-topics if you go over ~15 nodes.
- **Variables have scope.** A variable created in one topic is not automatically visible in another. Use the "Topic Output" feature to pass data between topics.
- **The Test bot pane resets state between sessions.** If you're debugging a stateful flow, start fresh each test.
- **There's no "git" for Studio.** Changes are saved to the cloud. Use the "Save as version" feature to snapshot. Document your topic logic in markdown (these files) so you can rebuild if needed.
- **Generative answers can hallucinate.** Always include explicit constraints in the system prompt (see our prompts — they have "do not invent" clauses).
- **Adaptive Card responses come back as a separate event.** When you post a card and wait for response, the topic flow pauses and resumes when the user clicks. This is async-aware behavior; design topics with this in mind.

---

## What to do in the first 30 minutes Monday

Sequence after access lands:

1. **Open Copilot Studio in a browser tab on the SYF laptop.** URL is typically `https://copilotstudio.microsoft.com` but the organizers may give you a specific URL.
2. **Sign in with your provided account.** Note any error messages.
3. **Click "Create" or "New copilot".** Give it the name `AI Pulse Release Agent` or similar.
4. **Skip the wizard prompts** for now — we'll configure manually.
5. **Open Settings → Generative AI** (location varies by tenant version). Look for "Custom instructions" or "Agent description" field.
6. **Paste a placeholder instruction** (just to test): "You are a test agent. Respond with 'Hello, AI Pulse' to any message."
7. **Test it in the right pane.** If you get "Hello, AI Pulse" back, the basic flow works.
8. **Save.** Document what worked and what didn't in `m365_connector_inventory.md`.

Once basic agent creation works, the rest of the topics get built per `08_studio_agent_topics.md`.

---

## What to do if access fails Monday

If Studio doesn't load, or you can't create an agent, or topics fail to save:

- **First:** restart browser, clear cache, try again.
- **Second:** ask the hackathon organizers for tenant credentials verification.
- **If still blocked:** commit to Path E. The pitch becomes "we designed for Copilot Studio; tenant constraints meant we built the prototype locally; in production this runs on Studio per the architecture slide."

Don't lose more than 30 minutes to Studio access issues. Path E is a complete fallback.

---

## What to verify with the organizers Monday

Have these specific questions ready when office hours open:

1. **Which Studio tier is this tenant?** (affects connector availability)
2. **Is Power Automate Premium licensed?** (probably no, but confirm)
3. **What's the message/credit quota?** (affects how many demo runs are safe)
4. **Can we publish an agent to a Teams channel we control?** (yes/no for the killer demo moment)
5. **Are there any restricted connectors we should know about?** (maps to our Monday Check 04)

---

## Glossary

| Term | Plain English |
|---|---|
| Copilot | Microsoft's word for "agent" in this product |
| Topic | A conversation pattern (like a function) |
| Trigger | The user phrase that starts a topic |
| Node | One step in a topic's flow |
| Connector | An adapter to talk to an external service |
| Adaptive Card | A rich UI block in Teams with buttons and structured fields |
| Direct Line | The REST API for talking to a published agent programmatically |
| Knowledge | Static reference data the agent can search |
| Channel | A surface where the agent is exposed (Teams, web, etc.) |
| Variable | A named value passed between nodes in a topic |
| Tenant | Your Microsoft 365 organizational instance |

---

## Recommended reading after this primer

If you have 20 more minutes Sunday and want extra context:

- The Studio docs landing page (search "Copilot Studio overview" — Microsoft docs)
- Our package's `02_path_b/setup/07_studio_agent_setup.md` for the specific agent build steps
- Our package's `02_path_b/setup/08_studio_agent_topics.md` for the per-topic build instructions

But honestly: this primer plus the setup docs is enough to walk in Monday and build. The Studio UI is discoverable once you know the concepts.

---

*You don't need to be a Studio expert. You need to know enough vocabulary to find buttons and enough patterns to configure topics. This primer covers both.*
