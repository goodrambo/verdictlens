# VerdictLens live promotion batch - 2026-04-10

Promoted from staged to live after external validation:

- notion-mcp-server
- playwright-mcp
- docker-mcp-gateway
- tavily-mcp
- grafana-mcp
- xcodebuildmcp
- terraform-mcp-server
- elevenlabs-mcp
- vercel-skills
- x-research-skill

Validation signals used:

- Official maintainer-controlled repositories for every promoted item
- Official docs/blogs/guides where available (Notion, Playwright, Docker, Tavily, HashiCorp, Vercel, Grafana, ElevenLabs)
- External discovery surfaces as secondary signals, not ground truth (for example mcp.so / PulseMCP style MCP listings, agentskills.so, skills.sh, SkillHub-style marketplace visibility via search)

Intentional exclusions from the same staged pool:

- microsoft/mcp and openai/skills style catalog/list repos: useful references, but too meta to treat as a single end-user skill entry
- anthropic-cybersecurity-skills: real project, but too bundle-like/noisy as a single live skill record without deeper decomposition
- teammate-skill: clear concept, but privacy/data-ingestion implications and product framing felt too loose for this push
- project-architect: promising, but weaker independent discovery signal than x-research-skill in the time available

Why this subset passed:

- Clear install surface or usage path
- Concrete capability boundary
- Maintainer or official provenance strong enough to trust the summary
- Categories can stay coherent without hand-wavy framework inflation
