---
name: posthog-flag-create
description: >-
  Creates a PostHog flag of any OMR type — release, ops, perm, experiment or config — through the
  `omr` gateway connector, then adds the code gate in Ruby or Vue. Builds the shared key, picks the
  shape that type has to return, and creates it on in staging and dark in production. Use when
  someone says "add a feature
  flag", "put X behind a flag", "feature-flag this", or when a ticket says the work is gated or
  behind a flag. It only creates flags. Turning a flag on or off is a manual dashboard step, so do
  not use it to toggle a flag.
user_invocable: true
metadata:
  version: 2.0.0
  author: norbert.pabian
---

# Create a PostHog flag (via the OMR gateway)

OMR runs **two PostHog projects**: one for staging, one for production. Flags live there, not in
`AppConfig::Features` (legacy). The same key exists in both projects, so the code reads one key
everywhere and the project decides the environment.

Writing is done by the `omr` connector, with **per-user OAuth** — no personal API key, and every
call is constrained by your own PostHog access.

**This skill creates flags. It does not toggle them.** `posthog_flag_enable` and `_disable` exist
on the gateway and this skill still does not call them: launching production and killing a flag
are human decisions, made in the dashboard.

## Prerequisites

| Requirement | Why |
|---|---|
| the `omr` connector | exposes the PostHog tools — see `/omr-ai-os:overview` |
| your own PostHog connected at `/me/tools` | every call runs under your OAuth grant, not a shared key |
| capability package **PostHog — change feature flags** (`product-flags-write`) | gates every write tool. **PostHog — read feature flags** (`product-flags`) gates the read side |

The write package is a sensitive addon, because it is the only PostHog permission that changes
what production serves without a deploy or a PR.

A denied call means the grant is missing. A capability package is the only thing that grants it —
roles were removed entirely and grant nothing. Do not retry, and never fall back to a personal
API key. Offer to file the request, and call it only on a yes:

```js
request_access({ kind: 'package', target: 'PostHog — change feature flags', rationale: '…' })
```

## Tools

Every tool below takes `environment: 'staging' | 'production'`. Omit it and you act in the
configured default, which is production — so on a write, pass it.

**Write**
- `posthog_flag_create({ key, environment, name?, active?, rollout_percentage?, variants?, tags?, filters? })`
- `posthog_flag_update({ id, environment, ... })` — only the fields you pass change
- `posthog_flag_enable` / `posthog_flag_disable` — **not this skill's job**

**Read**
- `posthog_flag_get({ environment, id?, key? })` — by key, so an existence check is one call
- `posthog_flag_list({ environment, search?, active?, offset? })`
- `posthog_flag_status({ id, environment })`, `posthog_flag_activity({ id, environment })`
- `posthog_flag_evaluate({ id, environment, distinct_id? })` — what one person resolves to
- `posthog_whoami()` — which PostHog identity you are connected as

## 1. Name the key

`app__domain__feature__type`, every segment lower_snake_case. The same key is read by Ruby and by
the frontend, so agree on it once. The gateway validates this on create and names the rule it
broke, so a rejected key is a message to read, not a bug.

| Segment | Example | Rule |
|---|---|---|
| `app` | `reviews` | fixed set — see the table below |
| `domain` | `agency` | the gate's namespace |
| `feature` | `invite_flow` | the thing being gated |
| `type` | `release` | one of `release`, `ops`, `perm`, `exp`, `config` — no default, see below |

| Consumer | `app` |
|---|---|
| `reviews-api`, `reviews-frontend` | `reviews` |
| `eventmanager` | `manager` |
| `vuehaus` — `apps/festival` / `apps/hub` / `apps/jobs` | `festival` / `hub` / `jobs` |
| `festival-companion` | `festival` |
| `myomr` | `myomr` |
| `platform-api` | `platform` |
| festival ticketing (Rails) | `tickets` |
| festival checkout (Rails) | `checkout` |
| anything read by two or more apps | `shared` |

All ten codes are here, because `omr-common`, `omr-js` and the gateway all accept ten and a row
this table is missing is a key somebody composes by hand. The last four — `myomr`, `platform`,
`tickets` and `checkout` — are server-side: no frontend binds them, but the Rails consumers own
flags under them. `festival-companion` binds no app either — it calls
`createFeatureFlagHelpers(ph, posthogReady)` with no `app` — so each of its descriptors names
`festival` itself.

A festival-companion sub-app is a **domain**, not an app: the registry's own example is
`festival__checkout__miles_earn__ops`. Flags are never deleted, so a key filed under the wrong
app stays wrong.

**There is no default type.** Both builders *drop* an omitted one — `.filter(Boolean)` in omr-js,
`.compact` in omr-common — so `flag({ domain, feature })` composes a three-segment key that never
matches the four-segment key you created. Pass the type on both sides, or on neither.

## 2. Pick the type — it decides the shape

PostHog does not derive the shape from the key, so the wrong one is created without complaint and
then never resolves.

| `type` | Returns | Create it with |
|---|---|---|
| `release` | boolean | `rollout_percentage: 100` |
| `ops` | boolean | same — a permanent kill switch |
| `perm` | boolean | same — a permanent entitlement gate |
| `exp` | variant string | `variants: [...]`, percentages summing to 100 |
| `config` | payload | a whole `filters` object — see below |

An `exp` key created as a boolean is the trap: `useExperiment` keeps the value only when it is a
string, so the flag looks healthy in the dashboard and every variant reads `undefined`.

A raw `filters` object **replaces** everything the typed args would have built — `buildFilters`
returns it verbatim — so `rollout_percentage` is dropped and the flag is stored with no release
conditions, which matches nobody. Pass the groups entry yourself:

```js
filters: { groups: [{ properties: [], rollout_percentage: 100 }], payloads: { 'true': '<json>' } }
```

## 3. Create it, twice

The same key in both projects — the flag is one thing, the two copies are how the environments
get it. Staging carries it **on**, production **created but disabled**, so launching is one
dashboard toggle and nothing reaches real users on creation.

For each of `staging` then `production`:

1. `posthog_flag_get({ key, environment })` — an existing flag is reported and that project
   skipped. Never update or re-create a flag someone may have toggled by hand.
   **A `No feature flag with key …` error is the answer that means "create it"**, not a failed
   step: the tool throws on a miss instead of returning nothing.
2. `posthog_flag_create(...)` with that `environment` and the tags below.
3. Report the key and both flags. The response carries an `id` and no URL, so build it —
   `https://eu.posthog.com/project/<project id>/feature_flags/<id>`, where the project is
   `132628` for staging and `97590` for production unless an admin has repointed the connector.
   If the second call fails, say which project has the flag and which does not: a key that exists
   in one project only fails closed in the other.

```js
posthog_flag_create({
  key: 'reviews__agency__invite_flow__release',
  environment: 'staging',
  name: 'Gates the agency invite flow',
  active: true,                  // staging is on
  rollout_percentage: 100,
  tags: ['app:reviews', 'type:release', 'domain:agency'],
})

posthog_flag_create({
  key: 'reviews__agency__invite_flow__release',
  environment: 'production',
  name: 'Gates the agency invite flow',
  active: false,                 // created dark; launching is a human decision
  rollout_percentage: 100,
  tags: ['app:reviews', 'type:release', 'domain:agency'],
})
```

An experiment differs only in the shape:

```js
variants: [
  { key: 'control',   rollout_percentage: 50 },
  { key: 'variant-a', rollout_percentage: 50 },
]
```

Three rules the gateway does not enforce for you:

- **Tags, always** — `app:<app>`, `type:<type>`, `domain:<domain>`. Every OMR app shares one flat
  flag list per project; the tags are what keeps it filterable.
- **No property filter.** The frontend picks its project from the environment and sends no
  `environment` person property, so a filter on it matches the Rails backend only and leaves every
  browser-read flag off.
- **Move it into the `<app>/` folder** in the dashboard. The API has no field for it.

## 4. Gate it in code

Never call `posthog-ruby` or `posthog-js` straight from a resolver, job, model or component.

**Ruby.** Every flag lives in **one** top-level `FeatureFlag` module, `app/services/feature_flag.rb`,
as one `<domain>_<feature>_enabled?` method. Never add a per-domain `Agencies::FeatureFlag`: one file is
the repo's flag inventory, the Ruby twin of `featureFlagCatalog.ts`. If the module exists, add a
method. If not, create it.

If the repo already has a wrapper that injects `environment` (`Posthog::FeatureFlag` in
`reviews-api`), call it. If not, call the gem wrapper and inject the property yourself:

```ruby
# app/services/feature_flag.rb
module FeatureFlag
  def self.agency_invite_flow_enabled?(distinct_id:)
    Omr::Common::Posthog::FeatureFlags.get(
      app: 'reviews', domain: 'agency', feature: 'invite_flow', type: 'release',
      distinct_id:, person_properties: { environment: Rails.env.to_s }
    ) == true
  end
end
```

Fail closed — compare to `true`, because the gem returns `nil` when PostHog is unreachable.

**Vue / Nuxt.** Three files, and never a raw key at the callsite. `reviews-frontend` and
`eventmanager` both already have the first one:

1. `composables/useFeatureFlag.ts` binds the app once:

```ts
export const { useFeatureFlag, isFeatureEnabled, useExperiment, getExperimentVariant } =
  createFeatureFlagHelpers(ph, posthogReady, { app: 'reviews' })
```

2. `composables/featureFlagCatalog.ts` is the app's flag inventory. Add the descriptor there in
the same PR that reads it:

```ts
export const FEATURE_FLAG = {
  AGENCY: {
    SELF_SERVICE_CLAIM: flag({ domain: 'agency', feature: 'self_service_claim', type: 'release' }),
  },
} as const
```

3. The callsite reads the catalogue entry:

```ts
// component — reactive, a readonly Ref<boolean>
const { enabled } = useFeatureFlag(FEATURE_FLAG.AGENCY.SELF_SERVICE_CLAIM)

// route middleware or a handler — async, resolves once the flags are loaded
const enabled = await isFeatureEnabled(FEATURE_FLAG.PROFILE.MODULE)

// an exp flag returns the variant string, not a boolean
const { variant } = useExperiment(FEATURE_FLAG.PRODUCT.NEW_LAYOUT)
```

In `eventmanager` a route can also carry `meta: { featureFlag: FEATURE_FLAG.X.Y }`. The global
guard redirects when the flag is off.

`distinct_id` MUST be the myomr user id on both sides. The frontend gets it from
`identifyFromJwtCookie('myomr.auth')`. Any other id evaluates the flag for a different person than
Customer.io and Segment see. `posthog_flag_evaluate({ id, distinct_id })` checks one person
without touching the app.

## 5. Roll out and kill — manual

- **Launch production:** enable the flag in the production project.
- **Kill it:** disable the flag in the project that serves the broken environment. Every gate
  fails closed, so no deploy is needed.

## Testing

PostHog is a network boundary. Stub the gate, never the HTTP call:

```ruby
before { allow(FeatureFlag).to receive(:agency_invite_flow_enabled?).and_return(true) }
```

In Ruby, give every flag a suite-wide default in one support file, `spec/support/feature_flags.rb`,
so no spec reaches PostHog by accident. Add the method name to its one `receive_messages` call, in the
same PR as the method; create the file only if it is missing:

```ruby
RSpec.configure do |config|
  config.before { allow(FeatureFlag).to receive_messages(agency_invite_flow_enabled?: false) }
end
```

That default also stubs the module in its own spec, so `spec/services/feature_flag_spec.rb` calls
through to the real method and asserts what reaches PostHog:

```ruby
before { allow(described_class).to receive(:agency_invite_flow_enabled?).and_call_original }
```

```ts
vi.mock('~/composables/useFeatureFlag', () => ({ useFeatureFlag: () => ({ enabled }) }))
```

Cover both paths: on and off.

## Boundaries

- Creation only. No toggle, no delete, no rollout-percentage tooling — the gateway can toggle
  and set rollout, and this skill still does not. Deleting a flag is a dashboard action: the
  gateway has no delete tool, and `posthog_flag_update` writes only name, filters and tags, so
  there is no soft delete either.
- New flags go to PostHog. `AppConfig::Features` is legacy and is being migrated.
- Two projects, one key. Never give staging and production different keys.
- The key grammar has three implementations — `Omr::Common::Posthog::FeatureFlagKey`
  (omr-common), `packages/core-ui/src/posthog/featureFlagKey.ts` (omr-js) and
  `src/lib/posthog/flag-key.ts` (the gateway). They compose and validate the same key, so a
  change to one is a change to all three, plus this table.
- The flag, not the experiment. An `exp` flag serves the variants; attaching it to a PostHog
  Experiment for the statistics readout is a dashboard step. Design the test with
  `/calvin-sdlc:posthog-ab-test-setup` first — hypothesis, primary metric, sample size.
