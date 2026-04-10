import generatedRegistrySkills from '@/data/generated/registry-skills.generated.json';
import type { Skill } from '@/lib/types';
import { manualSkills } from './manual-skills';

const offSpecManualSkillSlugs = new Set([
  'langgraph',
  'langchain',
  'openai-agents-sdk',
  'weaviate',
  'mem0',
]);

const curatedSkills = manualSkills.filter((skill) => !offSpecManualSkillSlugs.has(skill.slug));
const curatedRepos = new Set(
  curatedSkills
    .map((skill) => normalizeRepo(skill.repoUrl ?? skill.preferredSourceUrl ?? skill.officialUrl ?? ''))
    .filter(Boolean),
);

const merged: Skill[] = [];
const seenSlugs = new Set<string>();
const seenRepos = new Set<string>();

for (const skill of curatedSkills) {
  pushSkill(skill);
}

for (const skill of generatedRegistrySkills as Skill[]) {
  const repoKey = normalizeRepo(skill.repoUrl ?? skill.preferredSourceUrl ?? '');
  if (repoKey && curatedRepos.has(repoKey)) continue;
  pushSkill(skill);
}

export const skills = merged;

function pushSkill(skill: Skill) {
  const repoKey = normalizeRepo(skill.repoUrl ?? skill.preferredSourceUrl ?? '');
  if (seenSlugs.has(skill.slug)) return;
  if (repoKey && seenRepos.has(repoKey)) return;
  seenSlugs.add(skill.slug);
  if (repoKey) seenRepos.add(repoKey);
  merged.push(skill);
}

function normalizeRepo(url: string) {
  if (!url) return '';
  const cleaned = url.split('#')[0].replace('/tree/HEAD', '').replace('/blob/HEAD', '');
  const match = cleaned.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)/i);
  return match ? match[1].replace(/\.git$/i, '').toLowerCase() : cleaned.toLowerCase();
}
