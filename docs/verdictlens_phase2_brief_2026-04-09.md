# VerdictLens Phase 2 Brief (2026-04-09)

## Strategic shift
VerdictLens should prioritize discovery, shortlist, and compare. Heavy scoring is not the current focus.

## Key lessons from competitors
### Hugging Face models
- Strength to borrow: discovery breadth, task/category browsing, freshness signals, filter-first exploration
- Weakness to avoid: too much raw inventory without helping users shortlist effectively

### Arena leaderboard
- Strength to borrow: fast glanceability, clear comparison framing, immediate ranking comprehension
- Weakness to avoid: over-centering a single leaderboard without enough practical selection context

### Artificial Analysis (agents)
- Strength to borrow: structured side-by-side comparison, practical capability breakdowns
- Weakness to avoid: overly analyst-facing presentation that reduces discovery ease for normal users

### OpenRouter models
- Strength to borrow: provider/price/modality shopping mindset, practical filtering
- Weakness to avoid: reducing the product to a model marketplace without workflow/skill context

## Product goal for Phase 2
Make the site much more intuitive for actual selection:
- easier discovery
- faster shortlist creation
- clearer compare journeys
- stronger official/source trust signals

## What to build in Phase 2
### Directory UX overhaul
- Improve models and skills directory information hierarchy
- Strengthen filters and sorting for actual selection tasks
- Add clearer “Best for” and “Works with” treatment
- Make compare entry more obvious from directory pages
- Improve use-case entry paths from list pages where appropriate
- Keep homepage changes limited unless needed to support this phase

### Source and official-link clarity
- Every model must show an official website link prominently
- Every skill must show the most canonical official source:
  - official docs
  - GitHub repo
  - official registry entry
  - prefer the most authoritative source, not arbitrary mirrors
- Source / last verified treatment should become easier to see

### Logos / visual recognition
- VerdictLens logo already exists from Phase 1; keep using it
- Provider/model visual recognition should improve
- If official logos are not legally/practically safe for full use yet, use a maintainable provider-brand tile system that still improves recognition

## Data-format design (practical and extensible)
The site should use a JSON-first content schema that can later map to DB tables. Do NOT overbuild a database first.

## Core principles
1. Every entity must have clear source metadata
2. Official links must be first-class fields, not embedded in prose
3. Compatibility and install/usefulness data must be structured
4. Data shape should support both HTML pages and machine-readable endpoints
5. Schema should be easy to evolve without breaking all pages

## Common entity base
All entities should conceptually support:
- id
- slug
- status
- displayName
- shortName
- summary
- officialUrl
- logo
- tags[]
- sourceRefs[]
- createdAt
- updatedAt
- lastVerifiedAt

## Provider format
```ts
export type Provider = {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  kind: 'model-vendor' | 'skill-vendor' | 'registry' | 'open-source' | 'framework';
  officialUrl: string;
  docsUrl?: string;
  logo: {
    type: 'svg' | 'png' | 'tile';
    path: string;
    alt: string;
  };
  sourceRefs: SourceRef[];
  updatedAt: string;
  lastVerifiedAt: string;
};
```

## Source format
```ts
export type SourceRef = {
  id: string;
  label: string;
  url: string;
  kind: 'official-docs' | 'official-site' | 'official-registry' | 'github' | 'pricing-page' | 'blog' | 'benchmark' | 'manual-review';
  trustTier: 1 | 2 | 3 | 4 | 5;
  fieldPaths?: string[];
  fetchedAt: string;
  notes?: string;
};
```

## Model format
```ts
export type ModelEntity = {
  id: string;
  slug: string;
  providerId: string;
  displayName: string;
  shortName?: string;
  family?: string;
  status: 'active' | 'preview' | 'deprecated';
  summary: LocalizedText;
  officialUrl: string;
  docsUrl?: string;
  pricingUrl?: string;
  logo?: ProviderLogoRef;
  modalities: {
    input: Array<'text' | 'image' | 'audio' | 'video' | 'file'>;
    output: Array<'text' | 'image' | 'audio' | 'video' | 'file' | 'json'>;
  };
  contextWindow?: string;
  maxOutputTokens?: string;
  pricing?: {
    inputUsdPerMillion?: string;
    outputUsdPerMillion?: string;
    notes?: string;
  };
  speedCategory?: 'fast' | 'balanced' | 'deliberate';
  toolSupport?: {
    functionCalling?: boolean;
    structuredOutput?: boolean;
    webSearch?: boolean;
    remoteMcp?: boolean;
    codeExecution?: boolean;
  };
  bestFor: string[];
  worksWith: string[];
  tags: string[];
  strengths: LocalizedText[];
  caveats: LocalizedText[];
  sourceRefs: SourceRef[];
  updatedAt: string;
  lastVerifiedAt: string;
};
```

## Skill format
```ts
export type SkillEntity = {
  id: string;
  slug: string;
  providerId?: string;
  displayName: string;
  shortName?: string;
  status: 'active' | 'beta' | 'deprecated';
  summary: LocalizedText;
  skillType: 'mcp' | 'api' | 'connector' | 'browser' | 'workflow' | 'coding' | 'memory' | 'search' | 'security' | 'extraction';
  officialUrl?: string;
  docsUrl?: string;
  repoUrl?: string;
  registryUrl?: string;
  preferredSourceUrl: string;
  logo?: ProviderLogoRef;
  deployment: 'local' | 'hosted' | 'hybrid';
  installMethod: 'github' | 'registry' | 'npm' | 'pip' | 'manual' | 'hosted';
  supportedHosts: string[];
  supportedModels?: string[];
  capabilities: string[];
  auth: {
    type: 'none' | 'api-key' | 'oauth' | 'local-config' | 'custom';
    notes?: string;
  };
  permissionProfile?: {
    level: 'low' | 'medium' | 'high';
    notes?: string;
  };
  bestFor: string[];
  worksWith: string[];
  setupDifficulty: 'easy' | 'moderate' | 'advanced';
  tags: string[];
  sourceRefs: SourceRef[];
  updatedAt: string;
  lastVerifiedAt: string;
};
```

## Use-case format
```ts
export type UseCaseEntity = {
  id: string;
  slug: string;
  displayName: string;
  summary: LocalizedText;
  userIntent: LocalizedText;
  keySelectionCriteria: LocalizedText[];
  recommendedModelSlugs: string[];
  recommendedSkillSlugs: string[];
  sourceRefs: SourceRef[];
  updatedAt: string;
  lastVerifiedAt: string;
};
```

## Important implementation guidance
- Keep these schemas in code first; do not build a full DB migration system in this phase
- Refactor current content files toward this shape incrementally
- Ensure pages and JSON endpoints can both consume the same structured data
- Prefer source-first rendering over vague editorial claims
- Skills should feel closer to a normalized registry layer than a loose blog directory
- The product should not become a generic marketplace clone

## SkillsMP comparison note
SkillsMP appears similar in one dimension: programmatic skill search/discovery via API. However, VerdictLens should be broader:
- models + skills + use-cases
- cross-ecosystem normalization
- stronger source transparency
- routing to canonical source
- later, optional API/registry/adapter layer

SkillsMP should be treated as a reference, not as the product to copy.
