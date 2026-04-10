# VerdictLens skill scale-up promotion notes — 2026-04-10

## Final live count

- Total live skills after build: **1128**
- Tier breakdown:
  - **28** curated reviews
  - **547** community-registry validated MCP servers
  - **553** community-registry listed MCP servers

## Promotion logic used

To scale past 1000 without flattening everything into the same trust bucket:

1. Keep existing curated/manual entries, but remove the clearest off-spec framework/library-style items:
   - `langgraph`
   - `langchain`
   - `openai-agents-sdk`
   - `weaviate`
   - `mem0`
2. Import MCP-server-shaped entries from `photonx/awesome-mcp-registry`
3. Hard filters for live promotion:
   - `type === mcp-server`
   - GitHub maintainer repo present
   - description length >= 50 chars
   - exclude entries the upstream registry explicitly marked `validated: false`
   - exclude obvious meta/template/demo/catalog-style items by heuristic name/description filtering
   - dedupe by normalized GitHub repo
   - exclude repos already covered by the curated set
4. Promotion tiers:
   - `curated` = VerdictLens manual/curated review
   - `registry-validated` = upstream community registry marked validated/runnable
   - `registry-listed` = upstream registry listed and structurally clear, but not positively validated by that registry
5. Selection policy for scale:
   - keep all surviving `registry-validated` entries
   - fill the remaining batch using category-balanced round-robin from `registry-listed`
   - target generated batch size: **1100**

## Schema / UI support added

- Added `catalogTier` to skill records
- Added `artifactKind` (`mcp-server`, etc.) to skill records
- Added `community-registry` source kind
- Skills index now exposes tier counts and a tier filter
- Skill cards / detail pages now show tier badges and clearer trust copy
- Home page now describes the catalog as layered instead of pretending every live skill is equally verified

## Build status

- `npm run build` passes
- Static export generated successfully with **2320** total localized pages
- `public/data/skills.json` now reports `count: 1128`

## Caveats

- The scaled batch is intentionally broader than the old fully curated bar
- `registry-listed` entries are source-transparent but lighter-trust than curated/manual items
- The large imported batch is mostly MCP servers, so category distribution now skews toward automation / integration layers
