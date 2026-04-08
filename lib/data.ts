import { featuredModelSlugs, featuredSkillSlugs, models, providers, providerMap, skills, useCases } from '@/lib/content';

export { featuredModelSlugs, featuredSkillSlugs, models, providers, providerMap, skills, useCases };

export const modelMap = Object.fromEntries(models.map((item) => [item.slug, item]));
export const skillMap = Object.fromEntries(skills.map((item) => [item.slug, item]));
export const useCaseMap = Object.fromEntries(useCases.map((item) => [item.slug, item]));
