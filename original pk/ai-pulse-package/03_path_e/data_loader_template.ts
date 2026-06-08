// ROUTING-BANNER
// REFERENCE ONLY: typed accessors over the seed are useful, but the agent module
// (lib/agent/*) reads the seed directly per orchestration_spec.md. teams_dialogue is
// posted by the orchestrator (postToTeams), not pulled by scene key. Use orchestration_spec.md.

// data_loader_template.ts
// Typed accessor module for mock_data_seed.json
// Drop this in src/lib/data/dataLoader.ts and import seed JSON in src/lib/data/mockData.ts

import seedJson from '@/public/mock_data_seed.json'

// =============================================================
// TYPE DEFINITIONS · derived from mock_data_seed.json structure
// =============================================================

export type ReleaseStory = {
  issue_key: string
  summary: string
  description: string
  issue_type: string
  status: string
  assignee: string
  reporter: string
  fix_version: string
  sprint: string
  application: string
  components: string[]
  labels: string[]
  created: string
  resolved: string
}

export type Subtask = {
  issue_key: string
  summary: string
  status: string
  assignee: string
  resolved: string
  pr_link: string
}

export type DownstreamApp = {
  application: string
  relationship: string
  queue?: string
  topic?: string
  criticality: 'primary' | 'secondary'
}

export type ServiceCatalogGraph = {
  application: string
  role: string
  downstream: DownstreamApp[]
  upstream: { application: string; relationship: string }[]
}

export type PastIncident = {
  inc_id: string
  date: string
  application: string
  short_description: string
  root_cause: string
  resolution: string
  duration_minutes: number
  severity: number
  pattern_tags: string[]
  similar_to_current_release: 'LOW' | 'MEDIUM' | 'HIGH'
}

export type FailureMode = {
  tag: string
  description: string
}

export type MetricShift = {
  expected_change: string
  rationale: string
  unexplained_threshold: string
}

export type ExpectedShifts = {
  producer_latency: MetricShift
  producer_throughput: MetricShift
  consumer_latency: MetricShift
  consumer_throughput: MetricShift
  rabbitmq_cluster_memory: MetricShift
}

export type MetricSnapshot = {
  timestamp: string
  comment?: string
  producer_throughput_per_min?: number
  producer_latency_ms?: number
  producer_cpu_percent?: number
  producer_heap_percent?: number
  producer_error_count_30min?: number
  consumer_throughput_per_min?: number
  consumer_latency_ms?: number
  rabbitmq_node1_memory_percent?: number
  rabbitmq_node2_memory_percent?: number
  rabbitmq_backpressure_active?: boolean
  rabbitmq_backpressure_started_at?: string
}

export type MetricSnapshots = {
  pre_deploy_baseline: MetricSnapshot
  yesterday_same_hour: MetricSnapshot
  last_week_same_hour: MetricSnapshot
  current_l2_amber_moment: MetricSnapshot
  current_l3_red_moment: MetricSnapshot
}

export type CommitDiff = {
  sha: string
  author: string
  date: string
  file: string
  summary: string
  diff_snippet: string
  behavioral_change: boolean
  plausible_cause_of?: string[]
}

export type BitbucketDiff = {
  repo: string
  compared_against: string
  current_build: string
  commit_count: number
  commits: CommitDiff[]
}

export type Approver = {
  role: string
  name: string
  status: 'Pending' | 'Approved' | 'Rejected'
  approved_at?: string
}

export type ChgTicket = {
  chg_id: string
  title: string
  application: string
  foundation_progression: string[]
  risk_classification: string
  linked_story: string
  release_page_link: string
  deploy_window_start: string
  deploy_window_end: string
  build_id: string
  state_progression: string[]
  current_state: string
  approvers: Approver[]
}

export type WatchItem = {
  chg_id: string
  application: string
  watch_state: 'L1_CLEAR' | 'L2_DRIFT' | 'L3_INC_OPEN' | 'RECOVERED' | 'CLOSED'
  started: string
  notes: string
  is_demo_target?: boolean
}

export type DemoTargetInc = {
  inc_id: string
  linked_chg: string
  title: string
  severity: number
  state: string
  assignment_group: string
  created_by: string
  rca_confidence: number
  evidence_summary: string
}

export type TeamsMessage = {
  from: string
  ts: string
  is_bot: boolean
  content: string
}

export type SeedData = {
  _meta: { team: string; participants: string[]; demo_scenario: string; expected_l3_confidence: number }
  release_story: ReleaseStory
  subtasks: Subtask[]
  service_catalog_graph: ServiceCatalogGraph
  past_incidents: PastIncident[]
  known_failure_modes: FailureMode[]
  expected_metric_shifts: ExpectedShifts
  metric_snapshots: MetricSnapshots
  bitbucket_diff: BitbucketDiff
  chg_ticket: ChgTicket
  active_watches_dashboard: { items: WatchItem[]; comment: string }
  demo_target_inc: DemoTargetInc
  notification_targets: { distribution_list: string; teams_channel_release_pilot: string; teams_channel_release_watch: string; on_call_user_alias: string }
  teams_dialogue: { scene_1_jira_pickup: TeamsMessage[]; scene_7_l3_human_response: TeamsMessage[] }
}

// =============================================================
// MAIN ACCESSOR · single import surface for all components
// =============================================================

export const seedData: SeedData = seedJson as SeedData

// =============================================================
// CONVENIENCE ACCESSORS · use these in components for cleaner code
// =============================================================

export function getReleaseStory(): ReleaseStory {
  return seedData.release_story
}

export function getSubtasks(): Subtask[] {
  return seedData.subtasks
}

export function getServiceCatalog(): ServiceCatalogGraph {
  return seedData.service_catalog_graph
}

export function getPastIncidents(filter?: { application?: string; minRelevance?: 'LOW' | 'MEDIUM' | 'HIGH' }): PastIncident[] {
  let incidents = seedData.past_incidents
  if (filter?.application) {
    incidents = incidents.filter(i => i.application === filter.application)
  }
  if (filter?.minRelevance) {
    const order = { LOW: 0, MEDIUM: 1, HIGH: 2 }
    incidents = incidents.filter(i => order[i.similar_to_current_release] >= order[filter.minRelevance!])
  }
  return incidents
}

export function getMetricSnapshot(name: keyof MetricSnapshots): MetricSnapshot {
  return seedData.metric_snapshots[name]
}

export function getExpectedShifts(): ExpectedShifts {
  return seedData.expected_metric_shifts
}

export function getBitbucketDiff(): BitbucketDiff {
  return seedData.bitbucket_diff
}

export function getChgTicket(): ChgTicket {
  return seedData.chg_ticket
}

export function getWatchItems(): WatchItem[] {
  return seedData.active_watches_dashboard.items
}

export function getDemoTargetInc(): DemoTargetInc {
  return seedData.demo_target_inc
}

export function getTeamsDialogue(scene: 'scene_1_jira_pickup' | 'scene_7_l3_human_response'): TeamsMessage[] {
  return seedData.teams_dialogue[scene]
}

export function getKnownFailureModes(): FailureMode[] {
  return seedData.known_failure_modes
}

// =============================================================
// DERIVED HELPERS · convenience computations
// =============================================================

export function getCommitsByBehavioral(): { behavioral: CommitDiff[]; non_behavioral: CommitDiff[] } {
  const commits = seedData.bitbucket_diff.commits
  return {
    behavioral: commits.filter(c => c.behavioral_change),
    non_behavioral: commits.filter(c => !c.behavioral_change),
  }
}

export function getSuspectCommit(): CommitDiff | null {
  // For the demo, the suspect commit is the one with plausible_cause_of set
  return seedData.bitbucket_diff.commits.find(c => c.plausible_cause_of && c.plausible_cause_of.length > 0) ?? null
}

export function getDemoTargetWatch(): WatchItem | undefined {
  return seedData.active_watches_dashboard.items.find(w => w.is_demo_target)
}

// =============================================================
// USAGE EXAMPLE in a component:
//
//   import { getReleaseStory, getPastIncidents, getSuspectCommit } from '@/lib/data/dataLoader'
//
//   export function JiraIssue() {
//     const story = getReleaseStory()
//     return <div>{story.summary}</div>
//   }
//
//   export function L3RcaSection() {
//     const suspect = getSuspectCommit()
//     const pastIncidents = getPastIncidents({ minRelevance: 'HIGH' })
//     return <pre>{suspect?.sha} · {pastIncidents.length} past INCs</pre>
//   }
// =============================================================
