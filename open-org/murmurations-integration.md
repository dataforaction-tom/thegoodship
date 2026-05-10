# Murmurations Integration

How the Open Org standard maps to and builds on the Murmurations protocol.

## Relationship

Murmurations provides the discovery and indexing infrastructure. Open Org contributes schemas to the Murmurations library rather than building a parallel discovery system. An organisation's Open Org profile is also a Murmurations node — it satisfies Open Org schemas and can simultaneously satisfy other Murmurations schemas (solidarity economy, regenerative, cooperative, etc.).

## Architecture mapping

| Murmurations concept | Open Org equivalent |
|----------------------|---------------------|
| Node | The organisation (hosting its profile via local agent) |
| Profile | The `org-profile` object, expressed as JSON at a hosted URL |
| Schema | Open Org schemas contributed to the Murmurations library |
| Index | The Murmurations index, tracking Open Org profiles alongside others |
| Aggregator | Funder discovery interfaces, strategy matchers, idea explorers |
| Library | The Murmurations library, containing Open Org field and schema definitions |

## Composable field design

Following Murmurations' composable ontology approach, Open Org fields should be defined as reusable Murmurations fields wherever possible. This means organisations can satisfy multiple schemas with a single profile.

### Shared fields (reuse from existing Murmurations schemas)

These fields already exist in Murmurations schemas and should be reused directly:

| Murmurations field | Open Org mapping | Notes |
|--------------------|------------------|-------|
| `name` | `identity.name` | Direct reuse |
| `url` | `identity.website` | Direct reuse |
| `description` | `mission.summary` | May need field alias |
| `geolocation` | `identity.geography` | Murmurations uses lat/lon; Open Org also uses ONS codes |
| `tags` | `mission.themes` | Murmurations has free-text tags; Open Org has a controlled vocabulary. Publish both. |
| `primary_url` | `identity.website` | Direct reuse |
| `image` | (not yet in Open Org) | Could be added to identity or culture |

### New fields contributed by Open Org

These are new field definitions that Open Org would contribute to the Murmurations library:

| Field | Type | Description |
|-------|------|-------------|
| `org_id_guide` | string | org-id.guide format identifier |
| `charity_registration` | object | Multi-registry registration numbers |
| `annual_income_band` | enum | Income band for scale signalling |
| `legal_form` | enum | Legal structure |
| `strategy_summary` | string | Plain language strategy summary |
| `strategy_themes` | array | Thematic tags from strategy — the key matching field |
| `strategy_horizon` | enum | Planning horizon |
| `strategy_ref` | uri | Link to full org-strategy object |
| `ideas_count` | integer | Number of published ideas |
| `ideas_ref` | uri | Link to ideas index |
| `access_request_endpoint` | uri | Where funders request deeper access |
| `evidence_count` | integer | Number of evidence items |
| `hypercerts_ref` | uri | Link to Hypercerts activity claims |

### Open Org Murmurations schemas

Two schemas contributed to the Murmurations library:

**`open_org_profile-v0.1.0`** — the core organisational profile schema. Includes shared fields (name, url, geolocation, tags) plus Open Org-specific fields (registration, strategy summary, ideas count, access endpoint). This is the schema aggregators query to find Open Org nodes.

**`open_org_strategy-v0.1.0`** — a lightweight strategy schema for matching. Includes strategy summary, themes, horizon, place, and priorities as structured tags. This is what the strategy matching layer queries.

### Example Murmurations profile

An organisation's hosted profile JSON, satisfying both the Open Org schema and a hypothetical solidarity economy schema:

```json
{
  "linked_schemas": [
    "open_org_profile-v0.1.0",
    "solidarity_economy-v1.0.0"
  ],

  "name": "Riverside Community Trust",
  "url": "https://riverside-trust.org.uk",
  "description": "Supporting isolated older people to build social connections and maintain independence through community-led programmes.",
  "geolocation": {
    "lat": 52.6074,
    "lon": 1.7295
  },
  "tags": ["older_people", "loneliness", "food_access", "social_prescribing"],

  "org_id_guide": "GB-CHC-1234567",
  "charity_registration": {
    "charity_commission_ew": "1234567"
  },
  "legal_form": "CIO",
  "annual_income_band": "250k-500k",

  "strategy_summary": "A three-year plan to build a place-based food system in Great Yarmouth, connecting community kitchens with social prescribing pathways and volunteer development infrastructure.",
  "strategy_themes": ["food_access", "social_prescribing", "community_development", "volunteering"],
  "strategy_horizon": "3_5_years",
  "strategy_ref": "https://riverside-trust.org.uk/.well-known/open-org/strategies/2025-2028.json",

  "ideas_count": 3,
  "ideas_ref": "https://riverside-trust.org.uk/.well-known/open-org/ideas/",
  "evidence_count": 5,
  "hypercerts_ref": "at://did:plc:riverside123/org.hypercerts.claim.activity",

  "access_request_endpoint": "https://riverside-trust.org.uk/.well-known/open-org/access/request",

  "sector": "solidarity_economy",
  "cooperative_type": "community_organisation"
}
```

This single JSON file gets submitted to the Murmurations index. Aggregators querying for `open_org_profile-v0.1.0` find it. Aggregators querying for `solidarity_economy-v1.0.0` also find it. Strategy matchers query `strategy_themes` across all Open Org nodes and find alignment.

## Hosting conventions

Open Org profiles and objects should be hosted at predictable URLs:

```
https://example.org/.well-known/open-org/
├── profile.json                           # The Murmurations profile
├── strategies/
│   └── 2025-2028.json                     # Full strategy object
├── ideas/
│   ├── index.json                         # List of ideas
│   ├── community-kitchen-network.json     # Individual idea
│   └── volunteer-pathway.json
├── evidence/
│   ├── index.json
│   └── befriending-eval.json
└── access/
    └── request                            # Access request endpoint
```

The `.well-known` convention ensures discoverability without requiring DNS or subdomain configuration. The local agent generates and serves these files.

## Strategy matching via Murmurations

The strategy matching layer is an aggregator in Murmurations terms. It:

1. Queries the Murmurations index for all nodes linked to `open_org_strategy-v0.1.0`
2. Pulls `strategy_themes`, `strategy_horizon`, and geolocation from each
3. Computes overlap: which organisations share themes? Which share place?
4. Surfaces clusters: "Three organisations in Norfolk all have food_access + community_development in their strategy themes"
5. Enables funders to explore these clusters, drill into individual strategies (via `strategy_ref`), and discover connected ideas

This is a standard Murmurations aggregator pattern — it's just querying a new schema for a new purpose.

## Hypercerts integration

Evidence items in the Open Org profile can reference Hypercerts activity claims:

```json
{
  "id": "befriending-2024",
  "type": "impact_report",
  "title": "Befriending Programme 2024-25",
  "hypercert_ref": "at://did:plc:riverside123/org.hypercerts.claim.activity/3k7",
  "ref": "evidence/befriending-2024.md"
}
```

When a Hypercert exists for a piece of work, the Open Org evidence item references it. The Hypercert provides the verifiable activity claim, measurements, and third-party evaluations. The Open Org evidence item provides the organisational context — how this evidence connects to the strategy, which ideas it supports, and how the organisation learned from it.

Funding receipts from Hypercerts (`org.hypercerts.funding.receipt`) can similarly be referenced from ideas that have moved to `funded` status, creating a complete trail from strategy → idea → funding → evidence → evaluation.
