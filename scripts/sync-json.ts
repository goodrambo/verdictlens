import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { models, providers, skills, useCases } from '../lib/data';

const root = process.cwd();
const dataDir = join(root, 'public', 'data');
const publicDir = join(root, 'public');
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const locales = ['en', 'zh-TW'] as const;

type Locale = (typeof locales)[number];

function relativeUrl(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

function absoluteUrl(path: string) {
  return new URL(relativeUrl(path), siteUrl).toString();
}

function localePath(locale: Locale, path = '') {
  const normalized = path.replace(/^\/+|\/+$/g, '');
  return normalized ? `/${locale}/${normalized}` : `/${locale}`;
}

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function buildSitemap(siteUpdatedAt: string) {
  const localizedSections = [
    { pathFor: (locale: Locale) => localePath(locale), lastModified: siteUpdatedAt, changeFrequency: 'daily', priority: 1 },
    { pathFor: (locale: Locale) => localePath(locale, 'models'), lastModified: siteUpdatedAt, changeFrequency: 'daily', priority: 0.9 },
    { pathFor: (locale: Locale) => localePath(locale, 'skills'), lastModified: siteUpdatedAt, changeFrequency: 'daily', priority: 0.9 },
    { pathFor: (locale: Locale) => localePath(locale, 'compare'), lastModified: siteUpdatedAt, changeFrequency: 'weekly', priority: 0.85 },
    { pathFor: (locale: Locale) => localePath(locale, 'use-cases'), lastModified: siteUpdatedAt, changeFrequency: 'weekly', priority: 0.85 },
    ...models.map((model) => ({ pathFor: (locale: Locale) => localePath(locale, `models/${model.slug}`), lastModified: model.updatedAt, changeFrequency: 'weekly', priority: 0.8 })),
    ...skills.map((skill) => ({ pathFor: (locale: Locale) => localePath(locale, `skills/${skill.slug}`), lastModified: skill.updatedAt, changeFrequency: 'weekly', priority: 0.78 })),
    ...useCases.map((useCase) => ({ pathFor: (locale: Locale) => localePath(locale, `use-cases/${useCase.slug}`), lastModified: useCase.updatedAt, changeFrequency: 'weekly', priority: 0.8 })),
  ];

  const urls = [
    { path: '/', lastModified: siteUpdatedAt, changeFrequency: 'monthly', priority: 0.4, alternates: [] as Array<{ hreflang: string; href: string }> },
    ...localizedSections.flatMap((section) =>
      locales.map((locale) => ({
        path: section.pathFor(locale),
        lastModified: section.lastModified,
        changeFrequency: section.changeFrequency,
        priority: section.priority,
        alternates: locales.map((alternateLocale) => ({ hreflang: alternateLocale, href: absoluteUrl(section.pathFor(alternateLocale)) })),
      })),
    ),
  ];

  const entries = urls
    .map((entry) => {
      const alternates = entry.alternates
        .map((alternate) => `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${xmlEscape(alternate.href)}" />`)
        .join('\n');

      return [
        '  <url>',
        `    <loc>${xmlEscape(absoluteUrl(entry.path))}</loc>`,
        `    <lastmod>${new Date(entry.lastModified).toISOString()}</lastmod>`,
        `    <changefreq>${entry.changeFrequency}</changefreq>`,
        `    <priority>${entry.priority.toFixed(1)}</priority>`,
        alternates,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
}

function buildRobots() {
  return `User-agent: *
Allow: /

# Machine-readable guide for AI crawlers and answer engines
# ${absoluteUrl('/llms.txt')}

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;
}

function buildLlmsTxt(siteUpdatedAt: string) {
  const lines = [
    '# VerdictLens',
    '',
    'version: 2',
    `site: ${absoluteUrl('/')}`,
    'name: VerdictLens',
    'description: Discovery, shortlist, compare, and compatibility guide for AI models and skills with official-source signals and structured public data.',
    `last_updated: ${new Date(siteUpdatedAt).toISOString()}`,
    'languages: en, zh-TW',
    'formats: text/html, application/json',
    '',
    '[product_direction]',
    '- verdictlens is not a generic marketplace clone',
    '- primary flow is discovery -> shortlist -> compare -> routing/compatibility',
    '- skills are modeled as a normalized registry/index layer',
    '- public JSON is shaped for future APIs, team features, registration, saved lists, and routing logic',
    '',
    '[entity_types]',
    '- provider | official_url, docs_url, logo, source_refs, last_verified_at',
    '- model | provider, official_url, docs_url, pricing_url, best_for, works_with, source_refs, last_verified_at, scores, pricing, modalities',
    '- skill | category, skill_type, preferred_source_url, install_method, deployment, supported_hosts, supported_providers, capabilities, permission_profile, works_with, source_refs, last_verified_at',
    '- use_case | title, summary, evaluation_lens, recommended_models, recommended_skills, source_refs, last_verified_at',
    '',
    '[important_paths]',
    `- landing | ${absoluteUrl('/')}`,
    `- models_index_en | ${absoluteUrl('/en/models')}`,
    `- skills_index_en | ${absoluteUrl('/en/skills')}`,
    `- compare_en | ${absoluteUrl('/en/compare')}`,
    `- models_json | ${absoluteUrl('/data/models.json')}`,
    `- skills_json | ${absoluteUrl('/data/skills.json')}`,
    `- providers_json | ${absoluteUrl('/data/providers.json')}`,
    `- catalog_json | ${absoluteUrl('/data/catalog.json')}`,
    '',
    '[entities.models]',
    ...models.map((model) => `- ${model.slug} | ${model.name} | provider=${model.providerId} | best_for=${model.bestFor.join(',')} | works_with=${model.worksWith.join(',')} | official=${model.officialUrl}`),
    '',
    '[entities.skills]',
    ...skills.map((skill) => `- ${skill.slug} | ${skill.name} | type=${skill.skillType} | install=${skill.installMethod} | deployment=${skill.deployment} | providers=${skill.supportedProviderIds.join(',')} | preferred_source=${skill.preferredSourceUrl}`),
    '',
    '[crawl_hints]',
    '- Prefer localized HTML pages for human-readable summaries and editorial context.',
    '- Prefer JSON endpoints for structured ingestion, shortlist generation, and compatibility analysis.',
    '- Scores are editorial guidance, not vendor benchmark claims.',
  ];

  return lines.join('\n') + '\n';
}

async function main() {
  const nowIso = new Date().toISOString();
  const siteUpdatedAt = [...models.map((model) => model.updatedAt), ...skills.map((skill) => skill.updatedAt), ...useCases.map((useCase) => useCase.updatedAt)].sort().at(-1) ?? nowIso;

  const providersJson = {
    updatedAt: nowIso,
    count: providers.length,
    items: providers,
  };

  const modelsJson = {
    updatedAt: nowIso,
    count: models.length,
    shortlistReady: true,
    comparePath: '/compare',
    items: models,
  };

  const skillsJson = {
    updatedAt: nowIso,
    count: skills.length,
    registryReady: true,
    items: skills,
  };

  const catalogJson = {
    updatedAt: nowIso,
    productDirection: {
      mode: 'discovery-shortlist-compare-routing',
      marketplaceClone: false,
      hooks: ['api', 'team-features', 'registration', 'saved-lists', 'routing-layer'],
    },
    providers: providersJson.items,
    models: modelsJson.items,
    skills: skillsJson.items,
    useCases,
  };

  await mkdir(dataDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });

  await writeFile(join(dataDir, 'providers.json'), JSON.stringify(providersJson, null, 2) + '\n');
  await writeFile(join(dataDir, 'models.json'), JSON.stringify(modelsJson, null, 2) + '\n');
  await writeFile(join(dataDir, 'skills.json'), JSON.stringify(skillsJson, null, 2) + '\n');
  await writeFile(join(dataDir, 'catalog.json'), JSON.stringify(catalogJson, null, 2) + '\n');
  await writeFile(join(publicDir, 'sitemap.xml'), buildSitemap(siteUpdatedAt));
  await writeFile(join(publicDir, 'robots.txt'), buildRobots());
  await writeFile(join(publicDir, 'llms.txt'), buildLlmsTxt(siteUpdatedAt));

  console.log(`Synced ${providers.length} providers, ${models.length} models, ${skills.length} skills, and ${useCases.length} use cases.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
