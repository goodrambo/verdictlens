# AI Models & Skills Ratings — MVP Spec v0.1

## Goal
Ship today a polished bilingual (en / zh-TW) MVP website that presents a curated database of AI models and practical skills/tools, with strong visual design, clear UX, basic SEO foundations, and an agent-readable structure.

## Core product thesis
This is not only a leaderboard. It is a searchable evaluation and comparison layer for both humans and AI agents.

## Primary audiences
1. Humans comparing models or skills
2. AI agents that need structured, machine-readable evaluation data

## MVP scope (today)
### Pages
1. Home page
   - Hero section
   - Value proposition
   - Featured models
   - Featured skills
   - Top use cases
   - "How scoring works" summary
2. Models index
   - Search + filter + sort
   - Card/grid or table view
3. Skills index
   - Search + filter + sort
   - Card/grid view
4. Compare page
   - Compare 2-3 models side by side
5. Use-case landing page(s)
   - At least 3: coding, research, agent automation
6. Model detail page
7. Skill detail page

## Content/data requirements
Seed with realistic demo data:
- 12-18 models
- 12-18 skills/tools
- 3 use cases minimum

Each model should include:
- slug, name, provider, description
- modalities
- contextWindow
- pricing input/output
- speed category
- overallScore
- score breakdown: capability, costEfficiency, speed, reliability, agentReadiness, ecosystem
- best use cases
- tags

Each skill should include:
- slug, name, category
- supported model/providers
- install/setup difficulty
- utilityScore, compatibilityScore, reliabilityScore, docsScore
- best use cases
- tags

## Scoring system (MVP)
### Model weighted score
- capability: 30
- useCaseFitness: 25
- costEfficiency: 15
- speed: 10
- reliability: 10
- agentReadiness: 10

### Skill weighted score
- utility: 25
- compatibility: 20
- easeOfSetup: 15
- reliability: 15
- docsQuality: 10
- adoption: 10
- safetyMaintenance: 5

Show a clear disclaimer that MVP scores are framework examples combining benchmark-informed inputs, structured criteria, and editorial weighting.

## UX/UI direction
- Premium dark theme with clean gradients and glass/card layers
- Modern, editorial, high-trust feel
- Strong typography hierarchy
- Extremely clear filtering and comparison flows
- Responsive from desktop to mobile
- Use subtle motion only where helpful

## SEO foundations
- Next.js metadata per page
- title, description, open graph defaults
- semantic headings
- machine-readable JSON-LD where practical
- crawlable static routes for seeded entities
- clean URL structure

## Agent-readable foundations
- Expose structured JSON data in-app
- Add an API route or static JSON endpoint for models and skills
- Include updatedAt timestamps and slugs

## Suggested tech stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- local seeded data files (no DB yet)

## Shipping target for today
A polished front-end MVP with seeded data, usable navigation, strong first impression, and at least one working compare experience.

## Non-goals for today
- auth
- CMS
- real benchmark ingestion pipeline
- user reviews
- public deployment automation if credentials are unavailable

## Success criteria
- Looks launch-worthy, not template-generic
- User can browse models and skills quickly
- User can compare models side by side
- Site clearly communicates future scoring logic and product vision
- Easy to extend into a real platform later
