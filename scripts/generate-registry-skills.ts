import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { manualSkills } from '../lib/content/manual-skills';
import type { LocalizedText, Skill } from '../lib/types';

const REGISTRY_REPO = 'https://github.com/photonx/awesome-mcp-registry.git';
const REGISTRY_WEB_URL = 'https://github.com/photonx/awesome-mcp-registry';
const REGISTRY_RAW_BASE = 'https://raw.githubusercontent.com/photonx/awesome-mcp-registry/main';
const TARGET_GENERATED_COUNT = 1100;
const OFF_SPEC_MANUAL_SKILL_SLUGS = new Set(['langgraph', 'langchain', 'openai-agents-sdk', 'weaviate', 'mem0']);
const BAD_PATTERN = /\b(registry|catalog|directory|template|boilerplate|starter|scaffold|example|examples|demo|sample|tutorial|course)\b/i;

type RegistryIndexEntry = {
  category?: string;
  path?: string;
  validated?: boolean;
  tools?: Record<string, { name?: string; description?: string }>;
};

type RegistryPackage = {
  type?: string;
  name?: string;
  packageName?: string;
  description?: string;
  url?: string;
  runtime?: string;
  license?: string;
  env?: Record<string, { description?: string; required?: boolean }>;
};

type Candidate = {
  packageName: string;
  name: string;
  description: string;
  url: string;
  runtime: string;
  category: string;
  path: string;
  validated?: boolean;
  tools: string[];
  envKeys: string[];
  repoKey: string;
  descLen: number;
  qualityScore: number;
};

function main() {
  const registryDir = cloneRegistry();
  const now = new Date().toISOString();
  const curatedSkills = manualSkills.filter((skill) => !OFF_SPEC_MANUAL_SKILL_SLUGS.has(skill.slug));
  const curatedRepos = new Set(
    curatedSkills
      .map((skill) => normalizeRepo(skill.repoUrl ?? skill.preferredSourceUrl ?? skill.officialUrl ?? ''))
      .filter(Boolean),
  );

  const index = JSON.parse(readFileSync(join(registryDir, 'indexes', 'packages-list.json'), 'utf8')) as Record<string, RegistryIndexEntry>;

  const rawCandidates: Candidate[] = [];

  const packagesDir = join(registryDir, 'packages');
  for (const relativePath of walkJson(packagesDir)) {
    const fullPath = join(packagesDir, relativePath);
    const pkg = JSON.parse(readFileSync(fullPath, 'utf8')) as RegistryPackage;
    const indexEntry = index[pkg.packageName ?? ''] ?? {};
    const category = relativePath.split('/')[0] ?? indexEntry.category ?? 'uncategorized';
    const validated = indexEntry.validated;
    const description = (pkg.description ?? '').trim().replace(/\s+/g, ' ');
    const name = (pkg.name ?? pkg.packageName ?? '').trim();
    const url = (pkg.url ?? '').trim();

    if (pkg.type !== 'mcp-server') continue;
    if (!url.startsWith('https://github.com/')) continue;
    if (!name || description.length < 50) continue;
    if (validated === false) continue;
    if (BAD_PATTERN.test(name) || BAD_PATTERN.test(description)) continue;

    const repoKey = normalizeRepo(url);
    if (!repoKey || curatedRepos.has(repoKey)) continue;

    const tools = Object.keys(indexEntry.tools ?? {}).slice(0, 4);
    const envKeys = Object.keys(pkg.env ?? {});
    const qualityScore = (validated === true ? 1000 : 0) + tools.length * 30 + description.length + Math.max(0, 20 - envKeys.length * 2);

    rawCandidates.push({
      packageName: pkg.packageName ?? name,
      name,
      description,
      url,
      runtime: (pkg.runtime ?? 'unknown').toLowerCase(),
      category,
      path: relativePath,
      validated,
      tools,
      envKeys,
      repoKey,
      descLen: description.length,
      qualityScore,
    });
  }

  const deduped = new Map<string, Candidate>();
  for (const candidate of rawCandidates) {
    const current = deduped.get(candidate.repoKey);
    if (!current || candidate.qualityScore > current.qualityScore) {
      deduped.set(candidate.repoKey, candidate);
    }
  }

  const allCandidates = [...deduped.values()];
  const validatedCandidates = allCandidates
    .filter((candidate) => candidate.validated === true)
    .sort((a, b) => b.qualityScore - a.qualityScore || a.name.localeCompare(b.name));
  const listedCandidates = pickBalancedListedCandidates(
    allCandidates.filter((candidate) => candidate.validated !== true),
    Math.max(TARGET_GENERATED_COUNT - validatedCandidates.length, 0),
  );

  const selected = [...validatedCandidates, ...listedCandidates]
    .sort((a, b) => tierRank(b.validated) - tierRank(a.validated) || b.qualityScore - a.qualityScore || a.name.localeCompare(b.name))
    .slice(0, TARGET_GENERATED_COUNT);

  const generatedSkills = selected.map((candidate, index) => buildSkill(candidate, now, index));

  const outPath = join(process.cwd(), 'data', 'generated', 'registry-skills.generated.json');
  mkdirSync(join(process.cwd(), 'data', 'generated'), { recursive: true });
  writeFileSync(outPath, JSON.stringify(generatedSkills, null, 2) + '\n');

  const combinedCount = curatedSkills.length + generatedSkills.length;
  const breakdown = {
    curated: curatedSkills.length,
    registryValidated: generatedSkills.filter((skill) => skill.catalogTier === 'registry-validated').length,
    registryListed: generatedSkills.filter((skill) => skill.catalogTier === 'registry-listed').length,
    combined: combinedCount,
  };

  console.log(JSON.stringify(breakdown, null, 2));

  rmSync(registryDir, { recursive: true, force: true });
}

function cloneRegistry() {
  const dir = mkdtempSync(join(tmpdir(), 'awesome-mcp-registry-'));
  execFileSync('git', ['clone', '--depth', '1', REGISTRY_REPO, dir], { stdio: 'ignore' });
  return dir;
}

function* walkJson(root: string): Generator<string> {
  const stack = [''];
  while (stack.length) {
    const prefix = stack.pop()!;
    const abs = join(root, prefix);
    for (const entry of readDir(abs)) {
      const relative = prefix ? `${prefix}/${entry}` : entry;
      const full = join(root, relative);
      if (isDirectory(full)) {
        stack.push(relative);
      } else if (entry.endsWith('.json')) {
        yield relative;
      }
    }
  }
}

function readDir(path: string) {
  return readdirSync(path, { withFileTypes: true }).map((entry) => entry.name);
}

function isDirectory(path: string) {
  return statSync(path).isDirectory();
}

function pickBalancedListedCandidates(candidates: Candidate[], limit: number) {
  const byCategory = new Map<string, Candidate[]>();
  for (const candidate of candidates.sort((a, b) => b.qualityScore - a.qualityScore || a.name.localeCompare(b.name))) {
    const list = byCategory.get(candidate.category) ?? [];
    list.push(candidate);
    byCategory.set(candidate.category, list);
  }

  const categories = [...byCategory.keys()].sort((a, b) => {
    const delta = (byCategory.get(b)?.length ?? 0) - (byCategory.get(a)?.length ?? 0);
    return delta || a.localeCompare(b);
  });

  const picked: Candidate[] = [];
  while (picked.length < limit) {
    let progressed = false;
    for (const category of categories) {
      const queue = byCategory.get(category);
      if (!queue?.length) continue;
      picked.push(queue.shift()!);
      progressed = true;
      if (picked.length >= limit) break;
    }
    if (!progressed) break;
  }

  return picked;
}

function buildSkill(candidate: Candidate, now: string, index: number): Skill {
  const mapping = mapCategory(candidate.category);
  const installDifficulty = chooseInstallDifficulty(candidate.runtime, candidate.envKeys.length);
  const easeOfSetup = installDifficulty === 'Easy' ? 88 : installDifficulty === 'Moderate' ? 72 : 58;
  const utilityScore = clamp(52 + candidate.tools.length * 5 + (candidate.validated === true ? 8 : 0), 48, 82);
  const compatibilityScore = clamp(58 + (mapping.categoryId === 'workflow-automation' ? 4 : 0) + (candidate.runtime === 'node' || candidate.runtime === 'python' ? 3 : 0), 52, 78);
  const reliabilityScore = candidate.validated === true ? 68 : 54;
  const docsScore = clamp(54 + Math.round(candidate.descLen / 10), 54, 78);
  const adoptionScore = candidate.validated === true ? 60 : 46;
  const safetyMaintenanceScore = permissionLevel(candidate.category) === 'high' ? 50 : 56;
  const overallScore = Math.round(
    utilityScore * 0.25 +
      compatibilityScore * 0.2 +
      easeOfSetup * 0.15 +
      reliabilityScore * 0.15 +
      docsScore * 0.1 +
      adoptionScore * 0.1 +
      safetyMaintenanceScore * 0.05,
  );
  const authType = chooseAuthType(candidate.envKeys);
  const permission = permissionLevel(candidate.category);
  const tags = Array.from(new Set(['mcp', candidate.runtime, candidate.category.replace(/-/g, ' '), candidate.validated === true ? 'registry validated' : 'registry listed'])).filter(Boolean);
  const capabilities = candidate.tools.length
    ? candidate.tools.map(humanizeToken).slice(0, 4)
    : fallbackCapabilities(mapping.categoryId, candidate.category);
  const slug = uniqueSlug(candidate, index);
  const tier = candidate.validated === true ? 'registry-validated' : 'registry-listed';
  const tierLabel = tier === 'registry-validated' ? 'community registry validated' : 'community registry listed';
  const summary = t(candidate.description);

  return {
    id: `skill:${slug}`,
    slug,
    status: 'active',
    displayName: candidate.name,
    name: candidate.name,
    categoryId: mapping.categoryId,
    categoryLabel: mapping.categoryLabel,
    category: mapping.categoryLabel.en,
    subCategory: mapping.subCategory,
    skillType: 'mcp',
    catalogTier: tier,
    artifactKind: 'mcp-server',
    summary,
    description: summary,
    repoUrl: candidate.url,
    registryUrl: `${REGISTRY_WEB_URL}/blob/main/packages/${candidate.path}`,
    preferredSourceUrl: candidate.url,
    officialSourceLabel: 'Maintainer repo',
    deployment: 'local',
    installMethod: candidate.runtime === 'node' ? 'npm' : candidate.runtime === 'python' ? 'pip' : 'manual',
    supportedHosts: ['MCP-compatible host'],
    supportedProviderIds: ['any'],
    capabilities,
    auth: {
      type: authType,
      notes: candidate.envKeys.length ? `Registry listing shows ${candidate.envKeys.length} environment variable(s) for setup.` : 'No required environment variables were declared in the imported registry listing.',
    },
    permissionProfile: {
      level: permission,
      notes: permission === 'high' ? 'This server likely touches local tools, files, browsers, or operational systems; review scopes before enabling it.' : permission === 'medium' ? 'Review runtime access and upstream service permissions before enabling it in production.' : 'Operational surface appears narrower, but VerdictLens still recommends host-level review before installation.',
    },
    installDifficulty,
    setupDifficulty: installDifficulty === 'Easy' ? 'easy' : installDifficulty === 'Moderate' ? 'moderate' : 'advanced',
    utilityScore,
    compatibilityScore,
    reliabilityScore,
    docsScore,
    adoptionScore,
    safetyMaintenanceScore,
    easeOfSetupScore: easeOfSetup,
    overallScore,
    bestFor: bestUseCases(mapping.categoryId),
    bestUseCases: bestUseCases(mapping.categoryId),
    worksWith: ['MCP-compatible hosts', tierLabel],
    tags,
    strengths: [
      t('Clear MCP-server-shaped capability boundary from a maintainer-controlled repository and structured registry entry.'),
      t(candidate.validated === true ? 'Imported from a community registry entry marked as validated/runnable, so it clears a higher live-catalog bar than generic discovery-only listings.' : 'Imported from a structured community registry with enough metadata to keep the live entry specific instead of hand-wavy.'),
    ],
    caveats: [
      t('VerdictLens has not manually reviewed every operational claim for this entry; trust the repo and source links more than the editorial score.'),
      t(candidate.validated === true ? 'Community validation is still weaker than direct official-document verification, so production teams should inspect permissions and install instructions before rollout.' : 'This entry was promoted under the wider scale-up threshold: structurally clear and source-transparent, but not manually or officially verified end-to-end by VerdictLens.'),
    ],
    sourceRefs: [
      {
        id: `github:${slug}`,
        label: `${candidate.name} repo`,
        url: candidate.url,
        kind: 'github',
        trustTier: 4,
        fetchedAt: now,
        fieldPaths: ['repoUrl'],
        notes: 'Maintainer-controlled repository used as the primary live source for this entry.',
      },
      {
        id: `community-registry:${slug}`,
        label: 'Awesome MCP Registry listing',
        url: `${REGISTRY_WEB_URL}/blob/main/packages/${candidate.path}`,
        kind: 'community-registry',
        trustTier: candidate.validated === true ? 3 : 2,
        fetchedAt: now,
        fieldPaths: ['summary', 'description', 'subCategory', 'installMethod', 'capabilities'],
        notes: candidate.validated === true ? 'Community registry marks this entry as validated/runnable.' : 'Community registry provides structured metadata, but no positive runtime-validation flag was imported for this entry.',
      },
      {
        id: `manual-review:${slug}`,
        label: `${candidate.name} VerdictLens scale review`,
        url: 'https://verdictlens.local/manual-review',
        kind: 'manual-review',
        trustTier: 3,
        fetchedAt: now,
        fieldPaths: ['bestFor', 'worksWith', 'permissionProfile', 'overallScore'],
        notes: 'VerdictLens promotion logic derived category mapping, use-case fit, and editorial scoring from structured registry metadata.',
      },
    ],
    updatedAt: now,
    lastVerifiedAt: now,
  };
}

function uniqueSlug(candidate: Candidate, index: number) {
  const repo = candidate.repoKey.replace(/[^a-z0-9]+/g, '-');
  return `mcp-${repo || slugify(candidate.packageName || candidate.name)}-${index + 1}`;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function normalizeRepo(url: string) {
  const cleaned = url.split('#')[0].replace('/tree/HEAD', '').replace('/blob/HEAD', '');
  const match = cleaned.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)/i);
  return match ? match[1].replace(/\.git$/i, '').toLowerCase() : '';
}

function mapCategory(category: string) {
  const normalized = category.toLowerCase();
  if (['browser-automation'].includes(normalized)) return meta('browser-web', 'Browser automation');
  if (['search-data-extraction', 'translation-services'].includes(normalized)) return meta('research-retrieval', humanizeToken(category));
  if (['knowledge-memory', 'databases', 'data-platforms'].includes(normalized)) return meta('memory-knowledge', humanizeToken(category));
  if (['developer-tools', 'coding-agents', 'command-line', 'version-control', 'cloud-platforms', 'file-systems'].includes(normalized)) return meta('coding-devtools', humanizeToken(category));
  if (['security'].includes(normalized)) return meta('security-secrets', humanizeToken(category));
  if (['data-science-tools', 'finance-fintech', 'monitoring'].includes(normalized)) return meta('data-extraction', humanizeToken(category));
  return meta('workflow-automation', humanizeToken(category));
}

function meta(categoryId: Skill['categoryId'], subCategory: string) {
  const categoryLabels: Record<Skill['categoryId'], LocalizedText> = {
    'agent-frameworks': t('Agent frameworks', 'Agent 框架'),
    'workflow-automation': t('Workflow automation', '工作流自動化'),
    'browser-web': t('Browser & web interaction', '瀏覽器與網頁互動'),
    'research-retrieval': t('Research & retrieval', '研究與檢索'),
    'memory-knowledge': t('Memory & knowledge', '記憶與知識層'),
    'coding-devtools': t('Coding & devtools', 'Coding 與開發工具'),
    'security-secrets': t('Security & secrets', '安全與密鑰管理'),
    'execution-sandboxes': t('Execution & sandboxes', '執行環境與沙盒'),
    'data-extraction': t('Data extraction', '資料擷取'),
  };

  return { categoryId, categoryLabel: categoryLabels[categoryId], subCategory };
}

function bestUseCases(categoryId: Skill['categoryId']) {
  if (categoryId === 'coding-devtools' || categoryId === 'browser-web') return ['coding', 'agent-automation'];
  if (categoryId === 'research-retrieval' || categoryId === 'data-extraction' || categoryId === 'memory-knowledge') return ['research', 'agent-automation'];
  return ['agent-automation'];
}

function chooseInstallDifficulty(runtime: string, envCount: number): Skill['installDifficulty'] {
  if ((runtime === 'node' || runtime === 'python') && envCount <= 1) return 'Easy';
  if (envCount <= 4) return 'Moderate';
  return 'Advanced';
}

function chooseAuthType(envKeys: string[]): Skill['auth']['type'] {
  if (!envKeys.length) return 'none';
  return envKeys.some((key) => /(token|secret|key|password)/i.test(key)) ? 'api-key' : 'custom';
}

function permissionLevel(category: string): NonNullable<Skill['permissionProfile']>['level'] {
  const normalized = category.toLowerCase();
  if (['browser-automation', 'developer-tools', 'command-line', 'cloud-platforms', 'file-systems', 'security', 'version-control'].includes(normalized)) return 'high';
  if (['search-data-extraction', 'translation-services', 'art-and-culture'].includes(normalized)) return 'low';
  return 'medium';
}

function fallbackCapabilities(categoryId: Skill['categoryId'], category: string) {
  if (categoryId === 'browser-web') return ['browser control', 'web tasks', 'session automation'];
  if (categoryId === 'research-retrieval') return ['retrieval', 'search workflows', 'grounded lookup'];
  if (categoryId === 'memory-knowledge') return ['knowledge access', 'state lookup', 'structured records'];
  if (categoryId === 'coding-devtools') return ['developer workflows', 'tool execution', 'local operations'];
  if (categoryId === 'security-secrets') return ['access control', 'sensitive operations', 'credential-aware tasks'];
  if (categoryId === 'data-extraction') return ['structured extraction', 'analysis support', 'data transformation'];
  return [humanizeToken(category), 'automation', 'host integration'];
}

function humanizeToken(value: string) {
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function tierRank(value?: boolean) {
  return value === true ? 2 : value === false ? 0 : 1;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function t(en: string, zhTW = en): LocalizedText {
  return { en, 'zh-TW': zhTW };
}

main();
