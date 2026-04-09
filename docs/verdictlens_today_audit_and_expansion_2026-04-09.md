# VerdictLens Today Brief — External UI/UX audit + catalog expansion + schema refinement (2026-04-09)

## Today's priorities
1. Audit the live external UI/UX carefully
2. Expand the number of models with accurate official-source-backed data
3. Expand the number of skills with accurate official-source-backed data and thoughtful categorization

## Product principle
Accuracy > quantity. If a field cannot be verified from strong sources, leave it blank or mark as unavailable rather than guessing.

## Part A — External UI/UX audit
### Goal
Review the current live site like a real user.

### Audit focus
- Homepage clarity: is it obvious what the site does and where to start?
- Models directory: can a user quickly find and shortlist candidates?
- Skills directory: does it feel like a practical selection/index layer?
- Compare flow: is it obvious and useful?
- Use-case entry: is navigation intuitive?
- Link behavior: any awkward, dead-end, or confusing click paths?
- Copy: any confusing wording, vague labels, or jargon?
- Mobile/tablet assumptions from the current component structure and responsive code

### Output
- A concise UX findings list
- Fixes for the most important friction points in this phase if feasible

## Part B — Model catalog expansion
### Goal
Materially increase model coverage today while keeping data accurate.

### Requirements
- Add more mainstream, currently relevant models across major providers
- Every model must have:
  - official URL
  - provider
  - summary
  - modalities
  - context window if verifiable
  - pricing if verifiable from official source (or clearly unavailable)
  - tool support if verifiable
  - bestFor / worksWith where supportable
  - sourceRefs
  - lastVerifiedAt
- Prefer official docs / official model pages / official pricing pages / official provider docs
- Avoid speculative or outdated numbers

### Coverage target for today
- Expand beyond current small set toward a clearly stronger mainstream catalog
- Focus on quality and breadth across major providers, not exhaustive long-tail completeness

## Part C — Skills catalog expansion
### Goal
Materially increase skills coverage today and make the taxonomy more useful.

### Requirements
- Add more mainstream, practically useful skills/tools
- Every skill must have:
  - canonical name
  - category
  - summary
  - preferredSourceUrl
  - official docs / repo / registry links as applicable
  - installMethod
  - deployment
  - supportedHosts
  - supportedProviders if known
  - capabilities
  - permission/auth posture if supportable
  - sourceRefs
  - lastVerifiedAt
- Use official or maintainer-controlled sources where possible
- Skills may reference SkillsMP as one market signal / discovery reference, but VerdictLens should not clone its shape blindly

### Category design
Create a thoughtful but practical category system that can grow later. Suggested top-level categories (adjust if a better grouping emerges):
- Model Access & Routing
- Research & Search
- Browser & Computer Use
- Coding & Dev Tools
- Workflow & Automation
- Memory & Knowledge
- Data Extraction & Parsing
- Communication & Collaboration
- Security, Auth & Secrets
- Media, Audio & Vision
- Deployment & Operations

The category system must be stable, human-readable, and later API-friendly.

## Part D — Data format / schema refinement
### Goal
Make the model/skill storage format more practical and extensible.

### Requirements
- Refine current content structures to better support expansion
- Keep JSON/code-first content, do not overbuild a DB system now
- Ensure official links and sourceRefs are first-class fields
- Ensure categories and compatibility fields are structured, not buried in prose
- Prepare for future routing / registration / API use without implementing all of it now

### Key design principle
The site should be able to act as:
- a human-readable discovery layer
- a machine-readable metadata layer
- a future routing/compatibility layer

## Non-goals for today
- full account/registration system
- full saved shortlist system
- huge long-tail catalog explosion
- arbitrary score inflation or unverifiable benchmark claims

## Final response required
- UI/UX findings and what was fixed
- how many models/skills are now included
- what schema/category changes were introduced
- how source accuracy was enforced
- build status
- commit hash
