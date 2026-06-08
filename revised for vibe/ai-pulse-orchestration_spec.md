# Orchestration Spec · The Functional Demo (real code, mock data + reasoning)

> **This is the authoritative spec for the demo app.** It supersedes the scene-reveal model in `state_machine_spec.md` / `choreography_spec.md` (those are now visual reference only). The difference: the old model *revealed pre-baked screens* on a Next click. This model *runs real orchestration code* — the agent genuinely gathers, computes, fills, detects, and escalates. Only two things are faked: **data** (seed JSON instead of live APIs) and **reasoning** (a deterministic function instead of an LLM call).
>
> **Mock data ≠ mock app.** The machinery is real and vibe-coded. That's what the hackathon judges.

---

## 1 · The principle

| Layer | Real or mock? | Why |
|---|---|---|
| Agent orchestration (the sequence of steps) | **REAL CODE** | This is the product. It runs. |
| Risk-score computation | **REAL CODE** | A function that genuinely computes 0-100 from inputs |
| Confluence template fill | **REAL CODE** | A function that genuinely populates sections from gathered data |
| Drift detection | **REAL CODE** | A function that genuinely compares metrics to risk-packet thresholds |
| Approval flow (3 gates) | **REAL CODE** | Real click handlers advance real state |
| State transitions (CHG New→Assess→Implement) | **REAL CODE** | Driven by the orchestrator + approvals |
| Surface rendering (Jira/Confluence/SNOW/Teams/Dashboard) | **REAL CODE** | React views reading real state |
| **Data** (Jira issues, past INCs, Splunk logs, metrics) | **MOCK** (seed JSON) | Can't reach real APIs in a hackathon |
| **RCA reasoning** | **MOCK** (deterministic function) | No LLM reachable; returns seeded analysis at a marked seam |

Every mock has a **marked seam** in code: `// PROD: <real platform call>  // DEMO: <seed read>`. The architecture slide maps each seam to its production component.

---

## 2 · Production → Demo seam map

| Production (Synchrony Agentic AI Platform) | Demo function (TypeScript) | Seam |
|---|---|---|
| AgentCore Runtime | the orchestrator functions running in the browser | real logic, runs locally |
| AgentCore Memory | the `riskPacket` stored in state, re-read by ReleaseWatch | real (in-memory) |
| MCP Gateway → Jira | `gatherFromJira()` reads seed | `// PROD: MCP→Jira. DEMO: seed` |
| MCP Gateway → ServiceNow | `gatherFromServiceNow()` reads seed | `// PROD: MCP→ServiceNow. DEMO: seed` |
| MCP Gateway → SharePoint | `gatherFromSharePoint()` reads seed | `// PROD: MCP→SharePoint. DEMO: seed` |
| MCP Gateway → Splunk | `pullSplunkLogs()` streams seed lines | `// PROD: MCP→Splunk. DEMO: seed` |
| LLM Gateway → Claude | `generateRCA()` returns seeded analysis | `// PROD: LLM Gateway→Claude. DEMO: seeded` |
| HITL primitive | the 3 real-click approval gates | real (UI buttons) |
| Production language: Python | demo language: TypeScript | stated on the slide |

> When a judge asks "what's real?", the answer is: "The orchestration, the risk engine, the drift detection, and the approval flow are all real code running right now. Data comes from seed fixtures shaped like the real API responses, and the RCA is deterministic instead of a live Claude call — both are one-line seams that swap to the platform in production."

---

## 3 · Workflow state (single source of truth)

One reducer holds the whole workflow. Views read it; the orchestrator dispatches to it.

```ts
type Phase =
  | 'idle'              // before the Jira comment
  | 'pilot_gathering'   // ReleasePilot pulling from 3 sources
  | 'pilot_composing'   // computing risk score + filling Confluence
  | 'pilot_review'      // GATE 1: human reviews the release page
  | 'chg_assess'        // CHG submitted, in Assess
  | 'chg_approval'      // GATE 2: human approves advance to Implement
  | 'chg_implement'     // CHG in Implement
  | 'deploying'         // UDeploy running
  | 'deployed'          // deploy complete, ReleaseWatch wakes
  | 'watching_l1'       // hourly all-clear
  | 'watching_l2'       // amber drift detected
  | 'watching_l3'       // red, RCA generated, INC created
  | 'l3_ack'            // GATE 3: human acknowledges
  | 'recovering'        // fix applied
  | 'recovered';        // downstream back to baseline

interface WorkflowState {
  phase: Phase;
  activeSurface: 'jira'|'confluence'|'servicenow'|'teams'|'dashboard'|'agent';
  agentLog: LogLine[];          // streams what the agent is doing (the terminal)
  gathered: GatheredData | null;// what the 3-source gather returned
  riskPacket: RiskPacket | null;// computed (incl. risk score)
  confluencePage: PageModel | null; // null = blank; populated = filled page
  chgState: 'none'|'New'|'Assess'|'Implement'|'Watching'|'Closed-Pending-Review';
  teamsMessages: TeamsMessage[];// grows as agent posts; approval cards live here
  approvals: { gate1: boolean; gate2: boolean; gate3: 'pending'|'acknowledged'|'downgraded' };
  watchState: 'idle'|'L1'|'L2'|'L3'|'RECOVERED';
  metrics: MetricSnapshot;      // current metric values shown on dashboard/watch
  incident: IncidentModel | null;
  rca: RcaModel | null;
  emailSent: boolean;
}
```

The seed JSON (`mock_data_seed.json`) is the fixture the gather functions read from. It is NOT the state — it's the "database" the mock MCP calls hit.

---

## 4 · The agent module (`lib/agent/`) — REAL functions

All are `async` and take a `dispatch` so they can stream progress. Artificial `await delay(ms)` makes the work feel live. Each marks its seam.

### `gather.ts`

```ts
// PROD: MCP Gateway → Jira.  DEMO: read seed.release_story + seed.subtasks
async function gatherFromJira(issueKey: string, dispatch): Promise<JiraResult> {
  log(dispatch, 'Reading Jira story ' + issueKey + ' + subtasks…');
  await delay(800);
  const story = seed.release_story;
  const subtasks = seed.subtasks;
  const appNames = story.components;                 // REAL extraction
  const migrationSubtask = subtasks.find(s => /migration/i.test(s.summary)); // REAL find
  const chgLink = seed.chg_ticket.chg_id;
  log(dispatch, `Found ${subtasks.length} subtasks · apps: ${appNames.join(', ')} · migration subtask: ${migrationSubtask?.issue_key}`);
  return { story, subtasks, appNames, migrationSubtask, chgLink };
}

// PROD: MCP Gateway → ServiceNow.  DEMO: filter seed.past_incidents by gathered app names
async function gatherFromServiceNow(appNames: string[], dispatch): Promise<Incident[]> {
  log(dispatch, `Querying ServiceNow for past INCs on: ${appNames.join(', ')}…`);
  await delay(900);
  const incs = seed.past_incidents.filter(i => appNames.includes(i.application)); // REAL filter
  log(dispatch, `Matched ${incs.length} past INCs · highest similarity: ${topSimilarity(incs)}`);
  return incs;
}

// PROD: MCP Gateway → SharePoint.  DEMO: return seed template + doc refs
async function gatherFromSharePoint(dispatch): Promise<TemplateBundle> {
  log(dispatch, 'Loading Synchrony Standard Release Page v3 template + attachments…');
  await delay(700);
  return { template: seed.confluence_release_template, excelDocs: ['Deployment-Checklist.xlsx','Rollback-Runbook.xlsx'] };
}
```

### `riskEngine.ts` — the "it actually computes" piece

```ts
// REAL FUNCTION — no mock. Computes a defensible 0-100 score.
interface RiskInputs {
  highSimilarityINCs: number; medSimilarityINCs: number; lowSimilarityINCs: number;
  requiresMigration: boolean; touchesMessaging: boolean; touchesContract: boolean;
  downstreamCount: number;
}
function computeRiskScore(inp: RiskInputs): { score: number; band: string; rationale: string } {
  let score = 10;                               // base
  score += inp.highSimilarityINCs * 16;
  score += inp.medSimilarityINCs  * 6;
  score += inp.lowSimilarityINCs  * 2;
  score += inp.requiresMigration ? 20 : 0;
  score += inp.touchesMessaging  ? 12 : 0;
  score += inp.touchesContract   ? 14 : 0;
  score += inp.downstreamCount   * 2;
  score = Math.min(100, score);
  const band = score >= 67 ? 'Elevated' : score >= 40 ? 'Moderate' : 'Low';
  return { score, band, rationale: buildRationale(inp) };
}
// application-consumer inputs {high:1,med:1,low:1,migration:true,messaging:true,contract:false,ds:3}
//   = 10+16+6+2+20+12+0+6 = 72 (Elevated)
// credit-apply inputs       {high:0,med:0,low:1,migration:false,messaging:false,contract:true,ds:1}
//   = 10+0+0+2+0+0+14+2 = 28 (Low)
```

> Demo flourish (optional, strong): a tiny toggle on the risk packet that flips `requiresMigration` off and recomputes live (72 → 52). Shows the score is real, not painted. Keep it subtle; don't let it distract from the main flow.

### `confluence.ts`

```ts
// REAL FUNCTION. Populates each template section from gathered + computed data.
function fillTemplate(t: Template, g: GatheredData, rp: RiskPacket): PageModel {
  return {
    title: `Release ${g.story.fix_version} · ${g.appNames[0]} · ${t.template_name}`,
    sections: t.sections.map(s => ({
      title: s.title,
      body: renderSection(s.key, g, rp)   // REAL switch over section keys → real content
    })),
    attachments: g.excelDocs,
    riskScore: rp.score, riskBand: rp.band
  };
}
```

### `watch.ts`

```ts
// PROD: MCP Gateway → Splunk.  DEMO: stream seed log lines into the terminal
async function pullSplunkLogs(dispatch): Promise<void> {
  log(dispatch, 'index=app-consumer source=publisher · pulling last 10m…');
  for (const line of seed.splunk_stream) { await delay(120); log(dispatch, line); }
}

// REAL FUNCTION. Compares current metrics to the risk packet's expected shifts.
function detectDrift(m: MetricSnapshot, rp: RiskPacket): DriftResult {
  const findings = [];
  for (const [metric, rule] of Object.entries(rp.expectedShifts)) {
    const delta = pctDelta(m[metric], rule.baseline);     // REAL math
    const explained = withinExpected(delta, rule);        // REAL comparison
    if (!explained) findings.push({ metric, delta, severity: classify(delta, rule) });
  }
  return { anyUnexplained: findings.length > 0, findings, level: worstLevel(findings) };
}
// L1 snapshot → all within baseline → no findings → green
// L2 snapshot → sms-consumer −89% vs "no change" rule (15% threshold) → UNEXPLAINED → amber
// L3 snapshot → publish 0 + all downstream 0 → critical → red

// THE seam.  PROD: LLM Gateway → Claude with assembled evidence.  DEMO: seeded analysis.
async function generateRCA(evidence: Evidence, dispatch): Promise<RcaModel> {
  log(dispatch, 'Assembling evidence → LLM Gateway → Claude … [DEMO: deterministic]');
  await delay(1400);
  return seed.l3_rca_expected;   // the pre-written RCA at 0.84
}
```

### `notify.ts`

```ts
function postToTeams(dispatch, msg: TeamsMessage) { dispatch({type:'TEAMS_POST', msg}); }
function sendEmail(dispatch, dl: string)         { dispatch({type:'EMAIL_SENT', dl}); }
```

### `orchestrator.ts` — ties it together (REAL sequencing)

```ts
async function runReleasePilot(issueKey, dispatch) {
  setPhase('pilot_gathering');
  const jira  = await gatherFromJira(issueKey, dispatch);
  const incs  = await gatherFromServiceNow(jira.appNames, dispatch);
  const tmpl  = await gatherFromSharePoint(dispatch);
  setPhase('pilot_composing');
  const rp    = buildRiskPacket(jira, incs, computeRiskScore(deriveInputs(jira, incs)));
  const page  = fillTemplate(tmpl.template, {...jira, excelDocs: tmpl.excelDocs}, rp);
  dispatch({type:'CONFLUENCE_FILLED', page, riskPacket: rp});   // blank → filled
  postToTeams(dispatch, reviewCard(page));                       // GATE 1 card appears
  setPhase('pilot_review');                                      // now WAIT for human click
}

// GATE 1 approve handler:
function onApproveGate1(dispatch) {
  dispatch({type:'CHG_SUBMIT'}); setChg('Assess');               // CHG created + Assess
  postToTeams(dispatch, advanceCard());                          // GATE 2 card
  setPhase('chg_approval');
}
// GATE 2 approve handler:
async function onApproveGate2(dispatch) {
  setChg('Implement'); setPhase('deploying');
  await runDeploy(dispatch);                                     // UDeploy progress → complete
  setPhase('deployed'); await runReleaseWatch(dispatch);         // hand off to Watch
}

async function runReleaseWatch(dispatch) {
  loadRiskPacketFromMemory();                                    // re-reads the stored risk packet (A2A/Memory analog)
  setWatch('L1'); setPhase('watching_l1');
  await pullSplunkLogs(dispatch);
  let drift = detectDrift(seed.metrics.l1, riskPacket);          // explained → stay green
  await delay(1500);
  dispatch({type:'METRICS', m: seed.metrics.l2});
  drift = detectDrift(seed.metrics.l2, riskPacket);              // UNEXPLAINED → amber
  setWatch('L2'); setPhase('watching_l2'); sendEmail(dispatch, seed.dl);
  postToTeams(dispatch, amberCard());
  await delay(1800);
  dispatch({type:'METRICS', m: seed.metrics.l3});
  drift = detectDrift(seed.metrics.l3, riskPacket);              // critical → red
  setWatch('L3'); setPhase('watching_l3');
  const rca = await generateRCA(assembleEvidence(), dispatch);
  dispatch({type:'INC_CREATED', inc: seed.demo_target_inc, rca});
  postToTeams(dispatch, l3Card(rca));                            // GATE 3 card
}
// GATE 3 acknowledge handler:
async function onAcknowledge(dispatch) {
  setPhase('recovering'); postToTeams(dispatch, ackConfirm());
  await delay(1500);
  dispatch({type:'METRICS', m: seed.metrics.recovered});         // downstream back to baseline
  setWatch('RECOVERED'); setPhase('recovered');
}
```

---

## 5 · The event flow with the 3 real-click gates

```
[Jira view] user types "@release-pilot go", clicks Save
   └─► runReleasePilot()  — autonomous:
         gatherFromJira → gatherFromServiceNow → gatherFromSharePoint
         → computeRiskScore → fillTemplate
         → Confluence view flips blank → filled (risk 72, Excel docs attached)
         → Teams: "Review release page" card
   ╔══ GATE 1 ── human clicks [Approve] in Teams ══╗
   └─► CHG submitted → Assess · Teams: "Approve advance to Implement" card
   ╔══ GATE 2 ── human clicks [Approve] in Teams ══╗
   └─► CHG → Implement → UDeploy runs → deploy complete
         → ReleaseWatch wakes, re-reads risk packet
         → pullSplunkLogs (terminal streams what it's reading)
         → detectDrift(L1) = explained → dashboard tile green
         → metrics shift → detectDrift(L2) = UNEXPLAINED → tile amber, email + Teams amber card
         → metrics shift → detectDrift(L3) = critical → tile red
         → generateRCA → INC created → Teams: L3 card (Acknowledge / Downgrade / Open INC)
   ╔══ GATE 3 ── human clicks [Acknowledge] in Teams ══╗
   └─► cadence relaxes → metrics recover → tile green RECOVERED
```

Between gates, the agent runs by itself (with streamed logs and animated transitions). At each gate it **stops and waits for a real click**. Three clicks total drive the whole demo.

**Presenter override (safety):** a hidden `?present=true` adds tiny "force next" affordances so a misclick on stage can't dead-end the demo. The gates still work by real click; the override is only a safety net.

---

## 6 · Surface render rules (what each view shows by phase)

| Surface | idle | after gather | after fill | watching | recovered |
|---|---|---|---|---|---|
| **Jira** | story + subtasks + comment box | comment posted, "ReleasePilot working…" | — | — | — |
| **Confluence** | **blank / "template not yet filled"** | "ReleasePilot composing…" | **full filled page** (risk 72, sections, Excel attachments) | same | same |
| **ServiceNow** | no CHG | — | CHG New | badge advances Assess→Implement→Watching | Closed-Pending-Review |
| **Teams** | empty channel | Pilot status posts | **Gate 1 review card** | amber card, **L3 card** | ack confirm |
| **Dashboard** | 9 tiles (credit-apply green r28, target idle) | — | — | target tile L1→L2→L3 | target RECOVERED |
| **Agent terminal** | empty | **streams gather logs** | streams compose logs | **streams Splunk pull + drift + RCA** | recovery log |

The **blank-then-filled Confluence** and the **streamed Splunk logs** are exactly the "show what it's doing" moments you asked for — both are real state transitions, not reveals.

---

## 7 · Seed additions needed

The current `mock_data_seed.json` covers most of this. Copilot should add (or the build can extend):
- `splunk_stream`: array of ~8 log lines ReleaseWatch "pulls" (publisher init DEBUG line, downstream rate lines, the deploy-time correlation line).
- `metrics.l1 / l2 / l3 / recovered`: the four metric snapshots (already present as `metric_snapshots.*` — map them).
- `excelDocs`: the two SharePoint attachment names (Deployment-Checklist.xlsx, Rollback-Runbook.xlsx).

Everything else (story, subtasks incl. migration, past INCs, risk inputs, RCA, INC, CHG, dashboard tiles, teams dialogue) is already in the seed.

---

## 8 · What stays from the old specs

- **Brand tokens, fonts, component styling** — unchanged (see `react_app_spec.md`).
- **The 5 surfaces + visual fidelity** — unchanged (match `mock1_combined.html` look).
- **The 23-ish component inventory** — mostly the same components; they now read live state instead of scene flags.
- **What changes:** the *driver*. Old = `scene` integer advanced by Next. New = `phase` advanced by the orchestrator + 3 real-click gates. Replace the scene reducer with the workflow reducer + orchestrator above.

---

*This is near-production behavior without the platform: real orchestration, real risk engine, real drift detection, real approval flow — mock data, mock reasoning, TypeScript instead of Python. The seams are one-liners that swap to the Synchrony Agentic AI Platform in production. That's the honest, defensible, vibe-coded story.*
