# Open Org Standard — v0.1 (draft)

A data standard for self-sovereign organisational profiles, published ideas, and transparent access control. Designed for a world where organisations own their own truth and funders discover rather than gatekeep.

## Overview

The standard defines four core object types and a shared vocabulary:

```
open-org/
├── org-profile.schema.json        # The living organisational profile
├── org-strategy.schema.json       # Strategy as a first-class object
├── org-idea.schema.json           # Published ideas — seeds of intent
├── org-access-grant.schema.json   # Permissions, scoping, and audit
├── murmurations-integration.md    # How Open Org builds on Murmurations
├── system-architecture.md         # Agent, interfaces, integration tiers
└── vocabulary/
    └── themes.json                # Controlled thematic vocabulary (planned)
```

Each schema has an `x-minimum-viable-*` extension that captures the human-meaningful fields beyond the auto-generated metadata (`schema_version`, `id`, timestamps). The agent fills those automatically; the organisation provides the rest.

> **Note:** The `$id` URLs in the schemas (`https://openorg.standard/v0.1/...`) are reserved identifiers, not currently resolvable. They will be hosted at a stable URL when v0.1 leaves working-draft.

## Design principles

**Organisation-owned.** The organisation creates, hosts, and controls their profile. No central platform decides what's visible.

**Federated, not centralised.** Profiles communicate via open protocols (ActivityPub, AT Protocol, or both). The standard is protocol-agnostic — it defines the data, not the transport.

**Living, not static.** Profiles are updated continuously, fed by the organisation's own systems. Evidence accumulates longitudinally. Ideas evolve with version history.

**Tiered access.** Not everything is public. Organisations control what's visible and to whom, with logged and revocable access grants.

**Interoperable.** Builds on existing standards where possible — org-id.guide identifiers, ONS geography codes, Open Referral/HSDS for service data. Extensible for domain-specific needs.

**Minimum viable, not minimum required.** The schema validates with very little — `identity.name` and `mission.summary` at the leaf level — but "technically valid" is not the same as "useful". Each object type carries an `x-minimum-viable-*` extension describing the fields that make the object actually do its job (discoverable, verifiable, matchable, auditable). Tooling and documentation should aim for the minimum viable; validation should not block anything less.

## Object types

### org-profile (org-profile.schema.json)

The root object. Represents an organisation across six domains:

| Domain | Purpose | Required? |
|--------|---------|-----------|
| `identity` | Who they are — name, legal form, registration, geography, scale | `name` only |
| `mission` | What they exist to do — summary, theory of change, beneficiaries, themes | `summary` only |
| `evidence` | What they've done and learned — impact reports, evaluations, datasets | No |
| `governance` | How decisions are made — board, policies, accounts | No |
| `culture` | How they work — values, participation, equity, learning | No |
| `services` | What they deliver — references to HSDS records if they exist | No |
| `strategies` | How they think about the future — references to org-strategy objects | No |
| `ideas` | What they want to do — references to org-idea objects | No |
| `access` | Who can see what — public fields, request endpoint | No |

Key design decisions:

- **Registration is multi-registry.** Supports Charity Commission (E&W, Scotland, NI), Companies House, FCA Mutuals Register, and arbitrary additional registries. Uses org-id.guide format for cross-registry interop.
- **Geography uses ONS codes** alongside human-readable names, enabling programmatic place-based discovery.
- **Evidence items have their own sub-schema** with type, period, methodology, key findings, and per-item access levels. An evidence item can be `public`, `summary_public` (summary visible, full document requires access), or `restricted`.
- **Narrative content uses `narrative_ref`** — a union type that can be inline text, a relative file path (e.g. `culture/who-we-are.md`), or a full URI. This lets organisations keep rich narrative alongside structured data.
- **Extensions are namespaced.** The `extensions` field accepts arbitrary JSON keyed by domain namespace (e.g. `uk.housing`, `uk.health`), allowing sector-specific fields without polluting the core schema.

### org-idea (org-idea.schema.json)

A published idea — structured, discoverable, and connectable.

| Field | Purpose |
|-------|---------|
| `status` | Lifecycle: `seed` → `developing` → `ready` → `funded` → `archived` |
| `place` | Where it would happen, with ONS codes |
| `themes` | Shared vocabulary with profile themes |
| `indicative_cost` | Range (lower/upper), not a budget — a signal of scale |
| `evidence_base` | Links back to evidence items in the profile, with relevance notes |
| `connections` | Links to ideas from other organisations |
| `collaborators` | Organisations involved, with roles and confirmation status |
| `versions` | Change log showing how the idea evolved |

Key design decisions:

- **Ideas have a lifecycle.** The `status` field means funders can filter for ideas that are ready for funding versus those still being shaped. Both are valuable to see.
- **Connections have a controlled vocabulary** for relationship types: `complementary`, `builds_on`, `alternative_approach`, `shared_beneficiaries`, `shared_place`, `prerequisite`, `downstream`. This enables cluster discovery — funders can find groups of connected ideas across organisations.
- **Connections can be mutual or unilateral.** The `mutual` flag indicates whether the other organisation has confirmed the connection. Unconfirmed connections are still visible — they signal intent.
- **Indicative cost is a range, not a figure.** This deliberately avoids the precision theatre of full budgets at the idea stage. Lower and upper bounds signal scale.
- **Version history is append-only.** Funders see trajectory. An idea that's been refined over two years, gathering evidence and collaborators, tells a very different story from one published yesterday.

### org-strategy (org-strategy.schema.json)

The strategic thinking layer — how the organisation sees its future, what it has chosen to prioritise, what it has chosen not to do, and how all of this connects to its ideas and evidence.

| Field | Purpose |
|-------|---------|
| `status` | Lifecycle: `draft` → `active` → `under_review` → `superseded` → `archived` |
| `period` | Time horizon with start, end, and rough planning horizon |
| `priorities` | Ordered strategic priorities with themes, outcomes, dependencies, and maturity |
| `not_doing` | What the organisation has explicitly decided against — and why |
| `assumptions` | What the strategy assumes to be true about the world |
| `tensions` | Acknowledged trade-offs and how the organisation navigates them |
| `relationships` | Key partnerships, ecosystem position, and community mandate |
| `learning` | What shaped this strategy — failures, pivots, feedback, surprises |
| `resource_model` | Funding mix, sustainability direction, resourcing gaps |
| `idea_refs` | Links to ideas that flow from this strategy |
| `versions` | How the strategy has evolved, with triggers for each change |

Key design decisions:

- **Strategy is the most matchable object.** The `themes` field at both strategy and priority level enables cross-organisation alignment detection. Two organisations 30 miles apart both have `food_access` and `community_development` in their strategy themes but have never connected — the matching layer surfaces this.
- **`not_doing` is a first-class field.** What an organisation has chosen not to do is often more revealing than what it will do. It signals strategic discipline, self-awareness, and honest assessment of capacity. Funders almost never see this.
- **`tensions` acknowledges that strategy involves trade-offs.** "Growth vs depth" or "earned income vs mission purity" — organisations that can name their tensions are usually the ones managing them well.
- **`learning` surfaces the hidden knowledge.** What failed, what changed, how the organisation responds to things going wrong. This is the opposite of what application forms reward. It's also one of the strongest signals of organisational health.
- **`relationships` captures ecosystem position and community trust.** Not formal partnership letters, but how the organisation understands its legitimacy — who trusts them, who they refer to, what role they play that others don't. This is the social capital that never makes it into an application.
- **`resource_model` is strategic, not financial.** It shows funding mix, sustainability direction, and gaps — not a detailed budget. Funders see whether the organisation is diversifying, at risk, or stable.
- **`idea_refs` connects strategy to ideas.** A funder seeing an idea now also sees: this idea is part of a coherent strategic direction, it serves a specific priority, and the priority is backed by evidence. This is a fundamentally different signal from a standalone project proposal.
- **Default access is `summary_public`.** Strategy summaries, themes, and priorities are visible. Full narratives, tensions, learning, and relationships require an access grant. Strategies contain sensitive information and organisations must control the depth of what's shared.

### org-access-grant (org-access-grant.schema.json)

The permissions and audit layer.

| Field | Purpose |
|-------|---------|
| `requester` | Who's asking — with type (funder, commissioner, researcher, etc.) |
| `status` | `pending` → `granted` / `denied` → `expired` / `revoked` |
| `purpose` | Why they want access, in their words |
| `scope` | Which profile sections, evidence items, and ideas are accessible |
| `audit` | Immutable log of every access event |

Key design decisions:

- **No indefinite access.** `expires_at` is required on granted access. Organisations must actively renew.
- **Granular scoping.** Access can be granted to specific profile sections, specific evidence items, specific ideas. `include_narratives` controls whether full documents are accessible or just summaries.
- **The audit log is append-only and immutable.** Every profile view, evidence access, and data export is recorded. The organisation sees exactly who looked at what and when.
- **Revocation is explicit.** Access can be revoked at any time with an optional reason. This is logged.
- **Requester types shape expectations.** A funder requesting access is different from a researcher or a peer organisation. The type field enables organisations to make informed decisions.

## Vocabulary

### Themes (vocabulary/themes.json)

30 canonical thematic tags covering the breadth of social purpose work. Used in both `mission.themes` (what the organisation works on) and idea `themes` (what the idea is about). This shared vocabulary enables cross-network discovery.

Themes are deliberately broad. Specificity comes from combinations — an organisation tagged `food_access` + `older_people` + `loneliness` tells a clearer story than a single narrow category ever could.

The vocabulary is extensible. Organisations can use unlisted tags, but canonical tags enable interoperability.

## Integrations

### Core integrations — design for these from day one

These are architectural dependencies. The system is weaker without them.

| Integration | Role | Why it's core |
|------------|------|---------------|
| **Murmurations** | Discovery and indexing | Provides the distributed discovery infrastructure so Open Org doesn't need to build a platform. Composable schemas mean organisations satisfy multiple standards with one profile. Strategy matching is a Murmurations aggregator. |
| **Hypercerts** | Evidence and verification | Provides verifiable, independently attestable activity claims, measurements, and evaluations. Open Org references Hypercerts as evidence rather than inventing its own attestation layer. Funding receipts close the loop from idea to impact. |

### Future integrations — compatible by design, not required to ship

These enhance the system but don't block the core. Acknowledged in the architecture, designed for compatibility.

| Integration | Role | Why it's future |
|------------|------|-----------------|
| **.context** | Knowledge packaging and provenance | Improves agent quality by providing rich, provenance-tracked organisational knowledge as input. Enables portable context exports for funders. But the agent works without it — MCP integrations and direct document ingestion cover the basics. |
| **Mozilla Data Collective** | Collective data governance and AI training | Provides the governance mechanism for collective datasets and a sustainability model via ethical data licensing. But the system delivers value to individual organisations and funders without the collective layer. |

### Standards references

These are existing standards that Open Org references or aligns with, not runtime integrations:

| Standard | Relationship |
|----------|-------------|
| **org-id.guide** | Used for `identity.identifiers.org_id`. Cross-registry identification. |
| **ONS geography codes** | Used for `identity.geography` and idea/strategy `place`. Place-based discovery. |
| **Open Referral UK / HSDS** | Referenced, not duplicated. The `services` field links to HSDS records. Open Org describes the organisation; HSDS describes services. |
| **360Giving** | Complementary. 360Giving describes grants after the fact. Open Org describes organisations and ideas before and during funding. |
| **Charity Commission data** | Profiles seeded from CC register data. Open Org enriches this with living evidence, ideas, strategy, and culture. |
| **Companies House** | Registration numbers and basic corporate data feed into `identity.registration`. |
| **llms.txt** | The `identity.identifiers.llms_txt` field links to the organisation's machine-readable profile. Open Org is the richer standard; llms.txt is the lightweight entry point. |

## Access model

The default posture is **selective visibility**:

1. `identity` and `mission` are public by default (configurable via `access.public_fields`)
2. Evidence summaries are visible; full documents require access
3. Ideas are public by default (that's the point — discoverability)
4. Governance, culture, and detailed evidence require an access grant
5. Access grants are logged, time-limited, and revocable
6. The organisation always sees who's looking

This balances discoverability (funders can find organisations) with sovereignty (organisations control the depth of what's shared).

## Integration with Murmurations (core)

Open Org does not build its own discovery infrastructure. Instead, it contributes schemas and fields to the Murmurations protocol — a distributed data sharing network already designed for purpose-driven organisations.

Each Open Org profile is also a Murmurations node. It satisfies Open Org schemas and can simultaneously satisfy other Murmurations schemas (solidarity economy, cooperative, regenerative, etc.) through Murmurations' composable ontology approach. A single JSON file. Multiple schemas. One submission to the index.

The strategy matching layer is a Murmurations aggregator — it queries the index for strategy themes and geography across all Open Org nodes, computes overlap, and surfaces clusters of aligned organisations.

See `murmurations-integration.md` for the full field mapping, hosting conventions, and example profile.

## Integration with Hypercerts (core)

Evidence items in the Open Org profile can reference Hypercerts activity claims. This gives evidence a verifiable, distributed foundation:

- The **Hypercert** provides the activity claim, structured measurements, and third-party evaluations — owned by the creator, cryptographically signed, independently attestable
- The **Open Org evidence item** provides organisational context — how this evidence connects to the strategy, which ideas it supports, how the organisation learned from it

When an idea moves to `funded` status, Hypercerts funding receipts create a verifiable trail from strategy → idea → funding → evidence → evaluation. This closes the loop that 360Giving opens from the other direction.

Open Org does not duplicate what Hypercerts does. It references it. The organisational layer (who, why, where next) sits on top of the evidence layer (what was done, how well, verified by whom).

## Federation

The standard is protocol-agnostic. The same profile, ideas, and access grants can be expressed over:

- **ActivityPub** — each organisation is an actor, publishing activities (new idea, updated evidence, access granted) to followers
- **AT Protocol** — profiles, ideas, and access grants become lexicon record types, with DID-based identity
- **Static hosting** — a simple HTTPS endpoint serving JSON files, for organisations that don't need real-time federation
- **Hybrid** — federate via one protocol, serve static JSON as a fallback

The local agent handles protocol translation. The data model doesn't change.

## Getting started

The schema validates with just `identity.name` and `mission.summary`. But a minimum viable profile — one that can actually be discovered, matched, and verified — needs five fields:

| Field | Why it's needed | Auto-populatable? |
|-------|----------------|-------------------|
| `identity.name` | Who they are | Yes — from CC/CH register |
| `identity.registration` | Verifiable against a public register | Yes — it's the input |
| `identity.geography.primary_area` | Place-based discovery | Yes — from CC register |
| `mission.summary` | What they exist to do | Partial — CC objects need rewriting |
| `mission.themes` | Thematic matching and strategy alignment | Partial — extractable from objects/website |

A charity number is enough to auto-populate all five. The organisation reviews the mission summary and themes, approves, and they're discoverable.

A minimum viable profile:

```json
{
  "schema_version": "open-org/v0.1",
  "updated": "2026-05-10T10:00:00Z",
  "identity": {
    "name": "Riverside Community Trust",
    "registration": {
      "charity_commission_ew": "1234567"
    },
    "geography": {
      "primary_area": "Great Yarmouth",
      "primary_area_code": "E07000145"
    }
  },
  "mission": {
    "summary": "Supporting isolated older people to build social connections and maintain independence through community-led programmes.",
    "themes": ["older_people", "loneliness", "community_development"]
  }
}
```

Five fields. Discoverable by place and theme. Verifiable against the Charity Commission register. Everything else grows from here.

## Status

This is v0.1 — a draft for discussion. The schema, vocabulary, and access model are all subject to change based on feedback from organisations and funders.

## Licence

CC BY-SA 4.0. The standard is open. Anyone can implement it.
