# 2026-04-13 catalog expansion notes

## Model source map

### Live / official-provider-backed now used
- **Google AI for Developers**
  - `https://ai.google.dev/gemini-api/docs/models/*`
  - `https://ai.google.dev/gemini-api/docs/pricing`
  - Trust: provider docs + pricing page
  - Added live: Gemini 2.5 Flash-Lite
- **xAI docs**
  - `https://docs.x.ai/developers/models`
  - Trust: provider docs page that includes model/pricing overview
  - Added live: Grok 4.20, Grok 4.1 Fast
- **Alibaba Cloud Model Studio**
  - `https://www.alibabacloud.com/help/en/model-studio/models`
  - `https://www.alibabacloud.com/help/en/model-studio/model-pricing`
  - Trust: provider docs + pricing page
  - Added live: Qwen3-Max, Qwen3.5-Plus, Qwen3-VL-Plus
- **Mistral docs**
  - `https://docs.mistral.ai/models/codestral-25-08`
  - Trust: provider docs page with context/pricing/features
  - Added live: Codestral 25.08

### Staged / next likely official model growth
- **Meta Llama family**
  - Valuable for open-weight family coverage, but official pricing/deployment comparability is weaker than API-first vendors.
  - Recommendation: stage once we decide how to present open-weight/non-hosted economics cleanly.
- **Official provider deltas inside already-covered vendors**
  - OpenAI reasoning-family / realtime-family additions
  - Anthropic secondary variants
  - More Google Gemini 2.5 / 3.x rows
  - Good for later growth, but lower coverage value than filling xAI + Alibaba first.

## Skill source map

### Live-promotion-ready / trustworthy enough for live
- **awesome-mcp-registry** (`photonx/awesome-mcp-registry`)
  - Current integrated source.
  - Strong enough for live when filtered into:
    - registry-validated
    - top balanced registry-listed
  - Rationale: structured metadata, validation signal, repo links, package layout, enough fields for dedupe and categorization.
- **Official MCP Registry** (`https://registry.modelcontextprotocol.io/` / `modelcontextprotocol/registry`)
  - Strong candidate for next live-grade ingestion.
  - Rationale: official registry path, likely best next source for canonical public servers.
  - Recommendation: integrate as a separate importer, then promote only entries with stable repo/source links and usable descriptions.

### Registry-like / stage first
- **Smithery** (`https://smithery.ai/`, `https://registry.smithery.ai/servers`)
  - Useful structured discovery source.
  - Stage first because it is third-party registry metadata, not the canonical project source.
- **Glama MCP registry** (`https://glama.ai/mcp/servers`)
  - Large and frequently updated, useful for coverage discovery.
  - Stage first because it is an aggregator and likely needs stronger dedupe / provenance normalization.
- **PulseMCP** (`https://www.pulsemcp.com/servers`, `https://www.pulsemcp.com/api`)
  - High-volume discovery feed with API.
  - Stage first because scale is high and junk risk rises without stronger provenance scoring.

### Discovery-only / not for direct live promotion
- **Awesome lists / topical GitHub lists**
  - e.g. `wong2/awesome-mcp-servers`, niche vertical lists
  - Good for finding holes, bad as direct live feed because metadata shape and maintenance quality vary a lot.
- **Search-engine/discovery surfaces**
  - Useful for spotting new repos and categories.
  - Not sufficient for live without canonical repo/source confirmation.

## Live quality rules kept
- Models must come from official provider pages or pricing pages.
- Prefer missing provider/family coverage over random long-tail variants.
- Avoid duplicates inside already-crowded families unless they add a distinct role.
- Skills live growth still uses:
  - MCP server only
  - GitHub repo required
  - description length floor
  - exclude explicitly unvalidated entries
  - exclude registry/template/demo/starter-style repos
  - dedupe by repo
  - keep validated and listed separated by tier
  - balance listed picks across categories instead of only taking one giant category

## Recommended next expansion plan
1. Add a dedicated importer for the official MCP Registry and keep its rows in a separate generated file.
2. Add a staging-only import path for Smithery / PulseMCP / Glama with explicit provenance and confidence fields.
3. Once staged pools exist, promote only entries that:
   - map cleanly to existing categories
   - have canonical maintainer repo/source links
   - have usable descriptions and non-junk naming
   - are not duplicates of already-live repos
4. Decide whether open-weight model entries need a separate pricing/deployment presentation before expanding Meta coverage.
