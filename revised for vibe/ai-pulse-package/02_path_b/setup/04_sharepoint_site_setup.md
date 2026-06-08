# 04 · SharePoint Site Setup

> Create the SharePoint site that holds the release pages (acting as Confluence) and the lists (acting as ServiceNow CHGs, INCs, and the metric/data store). Free with M365.

## What we're building

```
SharePoint Site: AI Pulse · Acquisition Releases
├── Site Pages
│   ├── Release 2026.06.08.aspx   ← Confluence-style release page
│   └── (more pages per release)
└── Lists
    ├── CHG Tickets            ← simulates ServiceNow CHGs
    ├── INC Records            ← simulates ServiceNow INCs
    ├── Past INCs (Database)   ← pre-seeded with 3 demo INCs
    ├── Metrics Snapshots      ← pre-seeded metric data
    ├── Bitbucket Diffs        ← pre-seeded diff content
    └── Active Watches         ← the ReleaseWatch dashboard
```

## Prerequisites

- Microsoft 365 account with SharePoint access
- Permission to create sites (most M365 accounts have this; check if not)

## Steps

### Step 1 · Create the site

1. Go to SharePoint home: `https://<your-tenant>.sharepoint.com`
2. Click **Create site**
3. Choose: **Team site** (gives you collaborative features)
4. Site name: `AI Pulse Acquisition Releases`
5. Site address: `AIPulseReleases` (becomes the URL slug)
6. Description: `Hackathon project · ReleasePilot + ReleaseWatch artifact store`
7. Privacy: **Private** (only team members access)
8. Language: English
9. Click **Next**
10. Add owners: yourself, Anisha, Sai Mohit
11. Click **Finish**

You should land on a brand-new site at `https://<your-tenant>.sharepoint.com/sites/AIPulseReleases`.

Save this URL in `path_b_demo_assets.md` as `sharepoint_site_url`.

### Step 2 · Create the lists

For each of the 6 lists in the structure above, repeat this process:

1. From the site home, click **+ New** → **List**
2. Choose **Blank list**
3. Enter the list name (from the structure above)
4. Click **Create**
5. The list opens with just a "Title" column · we'll add the other columns per `05_sharepoint_list_schemas.md`

### Step 3 · Configure list columns

For each list, follow the schemas in `05_sharepoint_list_schemas.md`. The schemas describe column name, type, and any constraints. Adding columns:

1. Open the list
2. Click **+ Add column**
3. Select the type (Single line text, Choice, Date, Multiple lines of text, etc.)
4. Configure per the schema
5. Save

### Step 4 · Pre-populate the lists with demo data

From `01_common/data/mock_data_seed.json`, populate:

- `Past INCs (Database)` list with the 3 INCs from `past_incidents` section
- `Metrics Snapshots` list with snapshots from `metric_snapshots` section (one row per snapshot timestamp)
- `Bitbucket Diffs` list with the 5 commits from `bitbucket_diff.commits` section
- `Active Watches` list with the 9 watch entries from `active_watches_dashboard.items` section

The `CHG Tickets` and `INC Records` lists are populated by the agent during the demo — leave them empty for the demo start.

You can populate these manually (click `+ New item` in each list) or use a bulk-paste import:

1. In a list, click **Edit in grid view**
2. Copy rows from a spreadsheet · paste in
3. Save

For 30-50 rows total, manual entry takes ~30 minutes. Worth pre-doing this Sunday so Monday is faster.

### Step 5 · Create the release page template

See `06_sharepoint_page_template.md` for the page template. For now, just verify you can create a page:

1. From site home, **+ New** → **Page**
2. Choose template: **Blank**
3. Save as: `Release-Template`
4. Don't fill in content yet — that's in step 06

### Step 6 · Configure site navigation

1. Site Settings → Site information → Edit menu
2. Add menu items pointing to:
   - Site home (auto)
   - CHG Tickets list
   - INC Records list
   - Active Watches list
   - Site Pages (for release pages)
3. Save

This gives the agent (and the jury) easy navigation during the demo.

### Step 7 · Set up permissions

1. Site Settings → Permissions
2. Confirm Vamshi, Anisha, Sai Mohit have **Members** role
3. If you want the Studio agent to write to the site: typically the agent uses your user identity by default, so giving yourself sufficient permission covers it
4. Test by creating a test list item in `Active Watches` to confirm write works

### Step 8 · Verify Studio connector access

1. Open Copilot Studio (separate tab)
2. In your agent's actions panel, try to add a **SharePoint** action
3. Authenticate against this same SharePoint site
4. Try a simple "Get items" action against `Active Watches`
5. Verify it returns rows

If Studio can see your SharePoint site, ✓ you're set.

## Common issues

| Symptom | Fix |
|---|---|
| "Permission denied" creating site | Ask your M365 admin to enable user site creation, or use a personal SharePoint Online account |
| List column limit hit | SharePoint allows 50 columns per list · should be well under that |
| Bulk paste shows weird formatting | Paste as plain text · then use grid view to adjust cells |
| Studio connector doesn't list your site | Wait ~5 min after site creation · indexing takes time |
| Page renders broken | Use one of the SharePoint built-in templates · don't try to inject HTML directly |

## Time estimate

- Site creation: 5 min
- 6 lists creation (just the lists, no columns): 10 min
- Column configuration per schemas: 25 min
- Pre-populating data: 30 min
- Page template: 10 min
- Verification: 10 min

Total: ~90 minutes. **Do this Sunday — don't burn Monday hours on it.**

## Why we use SharePoint (not real Confluence/SNOW)

- **No Synchrony tools touched** (hackathon rule)
- **SharePoint is free with M365** (no premium connectors needed)
- **Studio has native SharePoint connector** (no Power Automate Premium needed)
- **Real artifacts the jury can click into** (more credible than mocked UIs)

The visual fidelity to Confluence/SNOW is lower than a custom-built mock, but the architectural credibility is higher. Trade-off accepted per Path B.

---

*Next: `05_sharepoint_list_schemas.md` for the exact column definitions per list.*
