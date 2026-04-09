import { providers, providerMap } from './providers';
import { models } from './models';
import { skills } from './skills';
import { useCases } from './use-cases';

export { providers, providerMap, models, skills, useCases };

export const featuredModelSlugs = ['gpt-5', 'claude-sonnet-4-6', 'gemini-2-5-pro', 'sonar-pro'];
export const featuredSkillSlugs = ['codex-cli', 'notion-mcp-server', 'docker-mcp-gateway', 'vercel-skills'];

export { models as allModels, skills as allSkills, useCases as allUseCases };
