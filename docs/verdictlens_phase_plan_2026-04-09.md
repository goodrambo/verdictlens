# VerdictLens Phase Plan (2026-04-09)

## Product priority shift
VerdictLens should first become a strong discovery / shortlist / compare platform for AI models and skills. Heavy scoring is secondary. UI/UX must optimize for clarity, fast understanding, and smooth selection.

## Non-negotiable product requirements
1. Build in phases, not all at once.
2. Keep codebase modular and easy to maintain.
3. Prepare file and content organization early so later expansion is clean.
4. Every model should have a visible official website link.
5. Every skill should have a visible official source link (GitHub or official docs, whichever is more canonical).
6. Add a simple, clear VerdictLens logo.
7. Add provider/model logos where appropriate so users can identify at a glance.
8. Reconsider the color system so it is clearer and more product-like.
9. Before and after shipping, perform serious click-through QA and UX review.

## Deferred but must be recorded
- User registration / accounts are important for eventual conversion; pure browsing is not enough long-term.
- Coverage is still too thin; later the catalog must expand to include mainstream models and skills across the market.

## Phase 1 — Foundation refactor + design system + information architecture
### Goal
Create a maintainable base that supports later modular iteration.

### Scope
- Reorganize codebase into clearer module groups (home, directories, compare, use-cases, shared UI, data adapters, brand assets)
- Introduce provider metadata structure for:
  - official URL
  - logo asset reference
  - short brand name
- Add official link fields to model and skill display flows
- Create a simple VerdictLens wordmark/logo and place it in header / metadata assets
- Introduce a cleaner color system / tokens for the site
- Improve homepage information architecture so the 3 main entry paths are obvious:
  - Browse Models
  - Browse Skills
  - Start from Use Cases
- Improve visible copy to be clearer and more direct
- Do not massively expand catalog yet

### Deliverables
- Refactored file structure
- Brand/logo assets
- Color tokens / theme cleanup
- Official links visible on key pages
- Homepage navigation and hierarchy improved
- Build passes

## Phase 2 — Directory UX overhaul
### Goal
Make models and skills pages truly useful for discovery and shortlist creation.

### Scope
- Sharpen column priority and content hierarchy on models / skills pages
- Add better Best for / Works with / Official link treatment
- Improve filtering and sorting ergonomics
- Add provider/model logos into list rows/cards where useful
- Improve compare entry points from list pages
- Tighten mobile and tablet behavior

### Deliverables
- Better discovery UX
- Faster shortlist flow
- Better scanability and first-glance understanding

## Phase 3 — Use-case and compare decision layer
### Goal
Turn use-case and compare pages into actual decision tools.

### Scope
- Strengthen the 4 key use-case pages
- Add clearer recommended models / skills per use case
- Improve compare page with more decision-oriented structure
- Add source transparency and last verified placement where useful

## Phase 4 — QA, polish, and launch hardening
### Goal
Ship confidently and reduce obvious UX mistakes.

### Scope
- Click every major route manually
- Check empty states, broken links, awkward copy, visual inconsistencies, and routing oddities
- Review pre-launch and post-launch behavior like a real user
- Fix rough edges found in QA

## Later backlog (not now)
- registration / user accounts
- saved lists / watchlists
- larger catalog expansion
- lightweight fit/confidence signals
- change history / alerts
- natural-language recommendation layer
