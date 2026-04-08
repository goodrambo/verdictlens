import { providers, providerMap } from './providers';
import { models } from './models';
import { skills } from './skills';
import { useCases } from './use-cases';

export { providers, providerMap, models, skills, useCases };

export const featuredModelSlugs = ['gpt-5-4-pro', 'claude-3-7-sonnet', 'gemini-2-5-pro', 'gpt-5-mini'];
export const featuredSkillSlugs = ['codex-cli', 'langgraph', 'playwright', '1password-cli'];

export { models as allModels, skills as allSkills, useCases as allUseCases };
