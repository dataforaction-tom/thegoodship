# Open Org System Architecture

How the data standard becomes a working system. Three components: the local agent (how records are created and maintained), the management interface (how humans inside organisations interact with it), and the funder discovery layer (how funders find, explore, and engage).

## Integration tiers

Open Org sits between several existing standards and infrastructures. Two of those connections are **load-bearing** — the system is weaker without them. The other two are **enhancements** — valuable, designed-for compatibility, but not required for the system to ship.

| Tier | Integration | Role | Status |
|------|-------------|------|--------|
| **Core** | [Murmurations](https://murmurations.network/) | Discovery — distributed, schema-composable index. Without it, profiles aren't findable. | Required from day one |
| **Core** | [Hypercerts](https://hypercerts.org/) | Verifiable evidence — activity claims, funding receipts. Without it, we'd reinvent attestation. | Required for evidence layer |
| **Future** | [`.context`](https://robboyett.com/context/context-format-light.html) | Knowledge packaging, provenance, AI orientation. Makes the agent smarter. | Designed-for, not required |
| **Future** | [Mozilla Data Collective](https://datacollective.mozilla.org/) | Collective data governance, ethical AI training. Makes the network sustainable. | Designed-for, not required |

The honest framing: design for Murmurations and Hypercerts from day one, even if the actual implementation comes later. Treat `.context` and MDC as compatible by design — the schema and architecture should not foreclose them — but do not let them block the core.

## The minimum viable principle

The schema validates loosely so no one is locked out. But "technically valid" is not the same as "useful." Each of the four core objects has a **minimum viable** shape — the smallest set of fields that makes the object actually do its job (discoverable, verifiable, matchable, auditable).

| Object | Technically valid | Minimum viable | The differentiator |
|--------|-------------------|----------------|---------------------|
| **Profile** | `name` + `mission.summary` (2 fields) | + `registration`, `geography`, `themes` (5 fields) | Verifiability and discoverability — without registration you can't be verified, without place + theme you can't be found |
| **Strategy** | one priority (1 field) | + `org_id`, `horizon`, ≥1 `tension` (4 fields) | Tensions — what the org is navigating. Without them, strategy is just an aspiration list |
| **Idea** | summary (1 field) | + `org_id`, `themes`, `place`, `status` (5 fields) | Place + status — what makes ideas matchable to local funders and to readiness |
| **Access Grant** | grantee + scope (2 fields) | + `granted_by`, `granted_at`, `expires_at` (5 fields) | Audit trail + expiry — what makes this a grant rather than an indefinite permission |

Tooling and documentation should always aim for the minimum viable. Validation should not block anything less.

## 1. The local agent

The agent is the organisation's node in the network. It runs on or for the organisation and does the work of turning existing organisational data into structured, federated Open Org records.

### What it does

**Pulls from existing systems.** The agent connects to what the organisation already uses — CRM, document stores, accounting systems, regulatory registers, board minute archives — via MCP servers, APIs, database connections, and document indexing. It doesn't require organisations to maintain a new system. It connects to the ones they have.

**Structures and drafts.** Using LLM assistance, the agent transforms raw data into structured Open Org objects. A strategy PDF becomes a draft `org-strategy` object with extracted priorities, themes, and tensions. CRM service delivery data becomes evidence summaries. Board minutes get scanned for governance updates. The agent proposes drafts — it never publishes without human approval.

**Enriches from public data.** The agent auto-populates identity fields from Charity Commission register data, Companies House filings, and existing llms.txt profiles. For many organisations, the baseline profile can be generated without any manual input at all.

**Maintains currency.** The agent monitors connected sources for changes — new accounts filed, updated CRM data, refreshed policies — and flags when profile sections may be stale. It can propose updates, which go through the management interface for approval.

**Publishes and federates.** On approval, the agent writes JSON files to the `.well-known/open-org/` directory, submits the profile to the Murmurations index, and federates updates via ActivityPub or AT Protocol.

**Handles access requests.** When a funder requests deeper access, the agent receives the request and routes it to the management interface for decision. On approval, it generates the access grant record, adjusts what's visible, and logs all subsequent access.

### MCP server integrations

The agent uses MCP (Model Context Protocol) to connect to organisational systems. Priority integrations:

| System | What the agent pulls | Priority |
|--------|---------------------|----------|
| **Charity Commission API** | Registration, objects, accounts dates, income | Auto on setup |
| **Companies House API** | Registration, directors, filing dates | Auto on setup |
| **Find That Charity** | Cross-references, org-id.guide identifiers | Auto on setup |
| **CRM (Salesforce, Lamplight, Charitylog, Airtable)** | Service delivery data, beneficiary counts, outcomes | High |
| **Document stores (Google Drive, SharePoint, Dropbox)** | Strategy documents, policies, board minutes | High |
| **Accounting (Xero, QuickBooks, Sage)** | Income breakdown, funding mix | Medium |
| **Impact tools (Lamplight, Impact reporting)** | Outcomes data, measurement frameworks | Medium |
| **Website / blog** | Narrative content, news, updates | Medium |
| **Hypercerts PDS** | Activity claims, measurements, evaluations | Medium |

### Deployment models

**Self-hosted.** The agent runs on the organisation's own infrastructure. Full control, full sovereignty. Suitable for larger organisations with technical capacity.

**Managed hosting.** A trusted provider runs the agent on the organisation's behalf. The organisation controls the data and approves all publications. The provider handles infrastructure. This is the model for most organisations.

**Shared infrastructure.** An infrastructure body (local CVS, community foundation, umbrella) runs agents for multiple organisations. Each organisation has its own profile and access controls, but the infrastructure is shared. This is the equity solution — it brings organisations into the network who couldn't maintain their own agent.

**Static fallback.** For organisations that can't run an agent at all, a static profile generated from public data (Charity Commission, Companies House, website scrape) provides a baseline presence. No management interface, no ideas or strategy — just identity and mission. Better than invisible.

### Agent lifecycle

```
1. Setup
   ├── Connect regulatory data sources (auto)
   ├── Connect CRM, documents, finance (guided setup)
   ├── Generate baseline profile from public data
   └── Organisation reviews and approves initial profile

2. Ongoing
   ├── Agent monitors connected sources for changes
   ├── Proposes draft updates to management interface
   ├── Humans review, edit, approve
   ├── Agent publishes, indexes, federates
   └── Agent handles inbound access requests

3. Periodic
   ├── Strategy review prompts (annual or per strategy period)
   ├── Evidence refresh (post-programme, post-evaluation)
   ├── Idea lifecycle management (seed → developing → ready)
   └── Stale content warnings
```

## 2. The management interface

The management interface is where humans inside the organisation interact with their Open Org presence. It's not an admin panel — it's a space for organisational reflection and editorial control.

### Core functions

**Dashboard.** Overview of the organisation's Open Org presence: profile completeness, published ideas and their status, strategy currency, recent access requests, who's been looking. Think of it as the organisation's view of itself as others see it.

**Draft review.** The agent proposes drafts. The management interface presents them for human review. A strategy document has been ingested and structured — does the extracted summary capture it? Are the priorities right? Are the themes accurate? The human edits, refines, and approves. Nothing goes live without this step.

**Idea workspace.** A space to draft, develop, and publish ideas. Ideas start as seeds — rough notes, a title and a sentence. Over time they gain structure: themes, place, indicative cost, evidence links, connections to other organisations' ideas. The workspace supports this evolution without requiring formal proposal writing.

**Strategy editor.** A structured editor for the strategy object. Guided prompts help surface the things organisations know but rarely articulate: what are you not doing? What tensions are you holding? What did you learn that changed your direction? Who trusts you and why? The editor makes the hidden knowledge visible.

**Access management.** Incoming access requests appear here. The interface shows who is requesting (with their stated purpose), what scope they want, and the organisation can approve, deny, or adjust scope. Active grants are visible with audit trails — who looked at what, when.

**Connection discovery.** The interface shows the organisation where its strategy themes overlap with other organisations in the network. "Three organisations near you also have food_access and community_development in their strategy. Want to explore connections?" This enables peer discovery, not just funder discovery.

### Roles and permissions

The management interface needs lightweight role-based access:

| Role | Can do |
|------|--------|
| **Admin** | Everything — connect systems, manage agent, approve publications, handle access requests |
| **Editor** | Review drafts, edit content, propose ideas and strategy updates, but not publish or manage access |
| **Viewer** | See the dashboard and current publications, but not edit |
| **Board** | Approve strategy publications and access grants (consent-based governance integration with Glade) |

For smaller organisations, one person does everything. For larger ones, the editorial flow might involve a CEO drafting strategy, a programme manager managing ideas, and a trustee approving publication.

### Governance integration

For organisations using Glade or similar governance tools, publication of strategy and access grant decisions can flow through formal decision processes. The management interface can require board consent before a strategy is published, or before full-access grants are made to funders. This isn't a technical requirement — it's an organisational design choice, configurable per organisation.

### Notifications

The agent and management interface generate notifications for:

- New access request received
- Draft update proposed by agent (source data changed)
- Idea status change suggested (evidence accumulating, connections forming)
- Strategy approaching review date
- Profile section flagged as stale
- New strategy theme overlap detected with another organisation

Notifications go via email, or through integration with Slack, Teams, etc.

## 3. Funder discovery layer

The funder-side experience. How funders find organisations, explore their work, understand their thinking, and enter into relationship.

### Discovery interface

The primary search and exploration tool for funders. Built as a Murmurations aggregator — it queries the index and presents results.

**Search modes:**

| Mode | What it does | Example |
|------|-------------|---------|
| **Theme search** | Find organisations working on specific themes | "food_access + Great Yarmouth" |
| **Place search** | Find organisations in a geography | "Norfolk" with map view |
| **Strategy match** | Find organisations with overlapping strategic priorities | "Show me organisations with food systems strategies in the East of England" |
| **Idea browse** | Browse published ideas by theme, place, cost range, status | "Ready ideas under £100k in the North East" |
| **Cluster view** | See groups of connected organisations and ideas | "Show me the food systems cluster in Great Yarmouth" |
| **Funder fit** | Describe funding priorities, find aligned organisations | "We fund community-led health interventions in coastal towns" |

**What funders see without access:**

The public layer — identity, mission summary, published idea summaries, strategy themes and priorities (but not full narrative), evidence summaries (but not full documents), and thematic tags. Enough to assess fit and decide whether to request deeper access.

**What funders see with access:**

The full picture — complete strategy including tensions, learning, relationships, and community mandate. Full evidence documents. Governance detail. Culture narratives. The things that would come out in a room.

### Strategy matcher

A dedicated tool within the discovery interface. The matcher:

1. Takes a funder's stated priorities (themes, places, scale, approach)
2. Queries the Murmurations index for Open Org strategy nodes
3. Computes alignment scores based on theme overlap, geographic fit, horizon match
4. Surfaces clusters — groups of organisations whose strategies converge
5. Shows the connections between them — shared ideas, overlapping priorities, complementary approaches

The matcher distinguishes between:
- **Direct alignment** — the organisation's strategy directly addresses the funder's priorities
- **Complementary alignment** — the organisation's work creates conditions for what the funder cares about
- **Ecosystem alignment** — the organisation is part of a cluster that collectively addresses the funder's priorities, even if individually the fit is partial

This last one is the real unlock. A funder interested in "reducing food insecurity in coastal Norfolk" might find no single organisation that addresses this comprehensively. But the strategy matcher surfaces a cluster: Org A runs community kitchens, Org B does social prescribing referrals, Org C manages a volunteer network, and their strategies all name food access as a priority. The funder funds the cluster, not a single bid.

### Access request flow

```
Funder                           Organisation
  │                                   │
  ├─── Discovers org via search ──────┤
  │                                   │
  ├─── Views public profile ──────────┤
  │    (identity, mission, themes,    │
  │     idea summaries, strategy      │
  │     priorities)                   │
  │                                   │
  ├─── Requests deeper access ────────┤
  │    (states purpose, desired       │
  │     scope: strategy detail,       │
  │     evidence, governance)         │
  │                                   │
  │    ┌─ Notification to org ────────┤
  │    │  Management interface        │
  │    │  shows request with          │
  │    │  requester info and          │
  │    │  stated purpose              │
  │    │                              │
  │    │  Org reviews, decides:       │
  │    │  ├── Grant (full or partial) │
  │    │  ├── Deny (with reason)      │
  │    │  └── Ask for more info       │
  │    └──────────────────────────────┤
  │                                   │
  ├─── Access granted ────────────────┤
  │    Funder can now see:            │
  │    - Full strategy narrative      │
  │    - Tensions, learning, failures │
  │    - Relationships, ecosystem     │
  │    - Full evidence documents      │
  │    - Governance detail            │
  │                                   │
  │    All access is logged.          │
  │    Org sees who viewed what.      │
  │                                   │
  ├─── Initiates dialogue ────────────┤
  │    (Outside the system — email,   │
  │     call, visit. The system       │
  │     enables the relationship,     │
  │     it doesn't replace it.)       │
  │                                   │
  ├─── Funding decision ──────────────┤
  │                                   │
  └─── Funding receipt (Hypercert) ───┤
       Idea status → funded           │
       Evidence trail begins          │
```

### Funder profile

Funders also have profiles in the system — lighter than organisational profiles, but present. A funder profile includes:

| Field | Purpose |
|-------|---------|
| `name` | Funder name |
| `type` | Foundation, statutory, corporate, community foundation, etc. |
| `priorities` | What they fund — themes, places, scales |
| `approach` | Prospective, retroactive, relational, open call, etc. |
| `typical_grant_range` | Scale signals |
| `access_history` | Visible to organisations — which orgs has this funder accessed? (Aggregate, not individual-level) |
| `funding_history` | Links to Hypercerts funding receipts |

This creates genuine mutuality. Organisations can see funder priorities before being approached. They can see whether a funder has been exploring their area or theme. The information asymmetry that the current system depends on starts to dissolve.

### LLM assistance on the funder side

The discovery interface uses LLM assistance for:

- **Natural language search** — "I'm looking for organisations in Norfolk that are doing interesting work on food and community" becomes a structured query against strategy themes and geography
- **Synthesis** — summarising a cluster of aligned organisations and their collective strategic direction
- **Fit assessment** — given a funder's priorities, explaining why specific organisations or clusters might be a good match, drawing on public profile data
- **Question generation** — suggesting questions a funder might want to explore in dialogue, based on the organisation's profile, strategy, and ideas

The LLM never makes funding decisions. It helps funders understand what they're looking at.

## Technical stack

### Agent

- **Runtime:** Node.js or Python, containerised
- **MCP servers:** Per-system integrations (CRM, docs, finance, regulatory APIs)
- **LLM:** Anthropic API for structuring, summarising, and drafting
- **Storage:** Local filesystem or object storage for JSON records
- **Web server:** Serves `.well-known/open-org/` directory
- **Federation:** ActivityPub server (or AT Protocol PDS)
- **Index submission:** Murmurations Index API

### Management interface

- **Framework:** Web application (React or similar)
- **Auth:** Lightweight role-based, ideally SSO with existing organisational identity
- **Real-time:** WebSocket for live notifications
- **Glade integration:** Webhook/API for governance decisions

### Funder discovery

- **Data source:** Murmurations index as primary, direct federation as secondary
- **Search:** Full-text + structured query across themes, place, strategy, ideas
- **Matching engine:** Vector similarity on strategy themes + geographic proximity + temporal alignment
- **LLM layer:** Anthropic API for natural language search and synthesis
- **Access management:** OAuth-based access grant flow between funder and organisation agents

## What gets built first

The system is large. It needs to be built incrementally. Priority order:

**Phase 1: Prove the concept.**
- Static profile generator (extend llmstxt.social to output Open Org profile JSON)
- Manual strategy and idea creation (web form, not agent-assisted)
- Submit to Murmurations index
- Basic funder search interface querying the index

**Phase 2: Add the agent.**
- MCP integrations for regulatory data (auto-populate identity)
- MCP integrations for document stores (ingest strategy documents)
- LLM-assisted structuring of strategy and evidence
- Management interface for review and approval
- Access request flow

**Phase 3: Add the matching.**
- Strategy matcher (theme overlap + geography)
- Cluster detection across organisations
- Idea connection discovery
- Funder profiles and mutual visibility

**Phase 4: Add federation and verification.**
- ActivityPub federation between agents
- Hypercerts integration for evidence verification
- Funding receipt flow
- Full audit trail

**Phase 5: Add collective data governance.**
- MDC integration for anonymised aggregate datasets
- Collective licence governance structure
- Sector-specific training data packaging
- Compensation and sustainability model

## 4. Knowledge packaging — `.context` format integration *(future enhancement)*

> **Tier:** Future / enhancement. Open Org can ship without `.context`. This section describes how the two formats are designed to compose, so that adding `.context` later doesn't require rework.


The hardest problem in this system isn't the schema. It's the gap between messy organisational reality and clean structured records. An organisation's strategy doesn't start as JSON. It starts as board away-day notes, a Word document with tracked changes, three corridor conversations, and a set of slides from two years ago. The culture layer is worse — it's in how people talk in meetings, in what gets celebrated, in what happens when things go wrong.

[`.context`](https://robboyett.com/context/context-format-light.html) is an open file format for capturing organisational knowledge in a portable, machine-readable form. A `.context` file is a ZIP archive with a defined internal structure — interview transcripts, process documentation, stakeholder profiles, decisions, learnings — bundled with provenance metadata (every claim traceable to its source) and an `AGENTS.md` orientation file that tells an AI how to reason with the contents.

It operates at a different layer from Open Org. Open Org defines *what* is described — the structured fields, the object types, the vocabulary. `.context` defines *how knowledge is packaged and transported* — the container, the provenance, the AI orientation. They complement each other.

### As an input to the local agent

The local agent pulls structured data from CRMs, regulatory APIs, and document stores. But the richest organisational knowledge — culture, relationships, learning from failure, community trust, strategic tensions — can't be extracted from a database. It comes from conversations, observations, and facilitated reflection.

A `.context` file is the mechanism for feeding this human-curated knowledge into the agent. A consultant, a programme officer, or a trustee captures the raw material — interview transcripts, observation notes, decision records, strategy workshop outputs — in a `.context` file with full provenance. The agent ingests it alongside automated data sources.

| Open Org schema field | `.context` source material | Why it helps |
|----------------------|---------------------------|-------------|
| `strategy.tensions` | Board discussion transcripts, away-day notes | Tensions surface in conversation, not documents |
| `strategy.not_doing` | Strategy workshop outputs, prioritisation exercises | Explicit decisions against are rarely written down |
| `strategy.learning` | Post-project reviews, staff reflections | What failed is oral knowledge — it lives in people's heads |
| `culture.narrative` | Staff interviews, observation notes | Culture is experienced, not documented |
| `strategy.relationships.community_mandate` | Community interviews, stakeholder mapping | Legitimacy and trust are relational, not structural |
| `strategy.relationships.ecosystem_position` | Referral pathway documentation, partnership reflections | How the organisation sees itself in context |

The provenance metadata in `.context` files means the agent knows the confidence level and source of each insight. A strategy tension derived from three independent interviews carries more weight than one from a single conversation. The agent can surface this when proposing structured Open Org objects for human review.

### As an output for funders

When a funder is granted deep access, they receive structured JSON — profile, strategy, evidence, ideas. But for sharing context internally (with a grants committee, a programme officer in another region, or a partner funder), a `.context` export packages the relevant Open Org objects alongside narrative context, provenance, and an `AGENTS.md` tailored to the funder's needs.

```
riverside-trust-for-cf-norfolk.context/
├── manifest.json                    # Metadata, access scope, expiry
├── README.md                        # What this is, who it's for
├── AGENTS.md                        # How to reason with this context
├── 01_context/
│   ├── profile-summary.md           # Rendered from org-profile.json
│   └── strategy-overview.md         # Rendered from org-strategy.json
├── 02_stakeholders/
│   └── key-relationships.md         # From strategy.relationships
├── 03_processes/
│   └── decision-making.md           # From governance and culture
├── 04_artefacts/
│   ├── community-kitchen-idea.md    # Rendered from org-idea.json
│   └── befriending-evaluation.md    # Rendered from evidence
├── 05_learnings/
│   └── what-shaped-our-strategy.md  # From strategy.learning
└── 06_open_questions/
    └── gaps-and-uncertainties.md    # Known unknowns, honest caveats
```

The `AGENTS.md` in this package would include Open Org schema references, access scope information (what the funder has been granted, what's excluded), and reasoning guidance — telling an AI assistant that this organisation's emphasis on learning from failure is a signal of health, not weakness.

### Interoperability considerations

Several open questions in the `.context` spec are directly relevant:

- **Composition and cross-referencing** between `.context` files maps to how profiles, strategies, and ideas relate across organisations. A funder exploring a cluster of aligned organisations might receive a composed `.context` containing relevant sections from multiple profiles.
- **Sensitive sections and encryption** maps to our tiered access model. A `.context` export could include encrypted sections that unlock based on access grant scope.
- **Structured `AGENTS.md`** — for Open Org purposes, the agent orientation should include schema references, access scope, and confidence calibration based on provenance quality.

### Where this sits in the build sequence

`.context` integration is not a prerequisite for any phase. It's an enhancement that improves quality at every phase:

- **Phase 1:** Consultants working with organisations to build initial profiles use `.context` files as their capture format
- **Phase 2:** The local agent gains a `.context` ingestion pathway alongside MCP integrations
- **Phase 3:** Funder discovery interface offers `.context` export for deep-access profiles
- **Phase 5:** `.context` files contributed (with consent) to MDC collective datasets include provenance metadata, improving dataset quality

## 5. Collective data layer — Mozilla Data Collective *(future enhancement)*

> **Tier:** Future / enhancement. Open Org can ship without MDC. This section describes how the published profile data could feed a collective dataset under fair, organisation-led governance — a direction the architecture should not foreclose, but does not depend on.


Everything above operates at the level of individual organisations and their relationships with individual funders. But the network as a whole generates something collectively valuable: a structured, longitudinal dataset of how social purpose organisations think, plan, learn, fail, and adapt. This dataset has uses beyond individual discovery — sector intelligence, policy research, and training sector-specific AI. It also needs governance that no individual organisation can provide alone.

Mozilla Data Collective (MDC) provides the infrastructure for this collective layer. MDC lets data owners share datasets while retaining ownership, setting custom licence terms, controlling who can access the data and for what purposes — with authenticated users, legally binding terms, and technical protections.

### What flows into MDC

The local agent already publishes structured data to `.well-known/open-org/` and submits profiles to the Murmurations index. The MDC integration adds a collective opt-in: organisations choose whether to contribute anonymised, structured data to a collectively governed dataset.

**What's contributed (when opted in):**

| Data | Anonymisation | Value for collective dataset |
|------|---------------|------------------------------|
| Strategy themes and priorities | Themes only, no narrative | Sector-wide strategic direction mapping |
| Strategy tensions and learning categories | Category tags only, no detail | What the sector is struggling with |
| Idea themes, places, status, indicative cost ranges | Anonymised, no org identity | Landscape of intent — what work is being proposed where |
| Evidence types, methodologies, outcome categories | Aggregated patterns | What kinds of evidence exist and what methods are used |
| Funding mix proportions | Anonymised bands | Sector financial health and sustainability patterns |
| Geographic distribution | Area codes only | Place-based coverage mapping |
| Idea connection patterns | Graph structure only | How work connects across the sector |
| Strategy horizon and maturity levels | Aggregated | Sectoral planning patterns |

**What's never contributed:**

- Full narrative content (strategy documents, culture descriptions, learning reflections)
- Identifiable information (names, registration numbers, contact details)
- Restricted-access content (anything behind an access grant)
- Content the organisation hasn't explicitly opted in to sharing

### Three dataset tiers on MDC

**Tier 1: Open sector intelligence.** Aggregated, anonymised pattern data. Strategy theme frequencies, geographic coverage, idea status distributions, evidence methodology trends. Published under CC-BY-SA. Available to everyone. Useful for: policy makers, infrastructure bodies, researchers studying the sector, funders designing programmes.

**Tier 2: Structured research dataset.** More granular structured data — anonymised strategy priorities with outcome categories, idea connection graphs, evidence-outcome patterns, funding mix distributions by theme and geography. Published with a custom MDC licence restricting use to research and sector development. Not available for commercial AI training. Useful for: academic researchers, think tanks, sector bodies producing state-of-the-sector analysis.

**Tier 3: AI training dataset.** The richest structured data — anonymised but detailed strategy patterns, learning categories, tension types, relationship patterns, idea evolution trajectories. Published with a restrictive licence: available for training sector-specific AI tools (strategy assistants, evidence synthesisers, matching engines) but not general-purpose commercial models. Governance: a data trust or cooperative structure representing contributing organisations decides the terms. Compensation via MDC's fee mechanism flows back to the collective.

### Technical integration

The MDC API provides the mechanism for publishing and accessing these datasets:

```
MDC API base: https://datacollective.mozillafoundation.org/api

GET  /datasets/:datasetId          — Get dataset details (licence, format, description)
POST /datasets/:datasetId/download — Get authenticated download URL (requires terms agreement)
```

The integration flow:

```
Local agent (org-side)
  │
  ├── Publishes profile, strategy, ideas to .well-known/open-org/
  ├── Submits to Murmurations index
  │
  └── If MDC opt-in enabled:
      ├── Extracts anonymised structured fields
      ├── Submits to MDC aggregator service
      └── Aggregator packages into collective dataset

MDC aggregator service (infrastructure)
  │
  ├── Periodically pulls opted-in structured data from Open Org agents
  ├── Anonymises and validates (strips any residual identifying fields)
  ├── Packages into tiered datasets (open / research / training)
  ├── Publishes to MDC with collectively governed licence terms
  └── Manages dataset versioning (quarterly or as threshold of new data reached)

MDC platform
  │
  ├── Hosts datasets with authentication and terms agreement
  ├── Enforces licence terms (custom per tier)
  ├── Tracks access and downloads
  ├── Routes compensation to collective fund (for Tier 3)
  └── Provides API access for programmatic consumers
```

### Governance

The collective dataset needs governance that represents the organisations whose data it contains. Options:

**Data trust model.** An independent legal entity holds the data on behalf of contributing organisations. Trustees are drawn from contributing organisations, infrastructure bodies, and independent members. The trust decides licence terms, approves access for edge cases, and manages compensation.

**Cooperative model.** Contributing organisations are members of a data cooperative. One member, one vote on governance decisions. Lower overhead than a trust but requires active participation.

**Delegated model.** Governance is delegated to an existing trusted body — a community foundation, an infrastructure organisation, or a sector body. Simpler to set up but depends on the legitimacy and neutrality of the delegate.

The governance model should be decided by the first cohort of contributing organisations, not prescribed by the standard.

### What this enables

**Sector-specific AI that actually understands the sector.** An LLM fine-tuned on a thousand real organisational strategies — including the tensions, the not-doing, the learning from failure — would be dramatically better at helping organisations think through their own strategy than one trained on generic business content.

**Evidence synthesis at scale.** Patterns across hundreds of evidence items reveal what approaches work where, what methodologies produce useful results, and where there are gaps in the evidence base.

**Funder intelligence.** Aggregate data on strategy themes and idea landscapes helps funders design programmes that respond to what organisations actually want to do, rather than guessing.

**Sector health monitoring.** Aggregated funding mix, sustainability direction, and resourcing gap data gives a real-time picture of sector financial health — more granular and more current than annual surveys.

**Collective bargaining power.** Individually, a small organisation's data has negligible commercial value. Collectively, a structured dataset of the sector's strategic thinking, evidence, and ideas is extremely valuable. MDC's model means the organisations benefit collectively from that value, on terms they set.

### Sustainability

The MDC integration creates a potential sustainability model for the whole system:

- **Tier 1 datasets** are free — they serve the sector and attract participation
- **Tier 2 datasets** may have a nominal access fee — compensating the infrastructure
- **Tier 3 datasets** carry a meaningful fee — MDC takes 5%, the rest flows to the collective fund
- The collective fund subsidises: shared agent infrastructure for smaller organisations, schema development and maintenance, strategy matching and discovery tools

This means the system isn't dependent on grant funding for its own survival. The data it generates, governed collectively, funds the infrastructure that generates the data.

