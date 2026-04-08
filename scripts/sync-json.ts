import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { models, skills, useCases } from '../lib/data';
import { providerMap } from '../lib/content/providers';

const root = process.cwd();
const dataDir = join(root, 'public', 'data');
const publicDir = join(root, 'public');
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const locales = ['en', 'zh-TW'] as const;

type Locale = (typeof locales)[number];

function difficultyToScore(level: string) {
  if (level === 'Easy') return 94;
  if (level === 'Moderate') return 78;
  return 62;
}

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
    {
      pathFor: (locale: Locale) => localePath(locale),
      lastModified: siteUpdatedAt,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      pathFor: (locale: Locale) => localePath(locale, 'models'),
      lastModified: siteUpdatedAt,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      pathFor: (locale: Locale) => localePath(locale, 'skills'),
      lastModified: siteUpdatedAt,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      pathFor: (locale: Locale) => localePath(locale, 'compare'),
      lastModified: siteUpdatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      pathFor: (locale: Locale) => localePath(locale, 'use-cases'),
      lastModified: siteUpdatedAt,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...models.map((model) => ({
      pathFor: (locale: Locale) => localePath(locale, `models/${model.slug}`),
      lastModified: model.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...skills.map((skill) => ({
      pathFor: (locale: Locale) => localePath(locale, `skills/${skill.slug}`),
      lastModified: skill.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.75,
    })),
    ...useCases.map((useCase) => ({
      pathFor: (locale: Locale) => localePath(locale, `use-cases/${useCase.slug}`),
      lastModified: useCase.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
  ];

  const urls = [
    {
      path: '/',
      lastModified: siteUpdatedAt,
      changeFrequency: 'monthly',
      priority: 0.4,
      alternates: [] as Array<{ hreflang: string; href: string }>,
    },
    ...localizedSections.flatMap((section) =>
      locales.map((locale) => ({
        path: section.pathFor(locale),
        lastModified: section.lastModified,
        changeFrequency: section.changeFrequency,
        priority: section.priority,
        alternates: locales.map((alternateLocale) => ({
          hreflang: alternateLocale,
          href: absoluteUrl(section.pathFor(alternateLocale)),
        })),
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
    'version: 1',
    `site: ${absoluteUrl('/')}`,
    'name: VerdictLens',
    'description: Bilingual directory of AI models, skills, and use-case guides with editorial scoring, official links, and public JSON data.',
    `last_updated: ${new Date(siteUpdatedAt).toISOString()}`,
    'languages: en, zh-TW',
    'formats: text/html, application/json',
    '',
    '[overview]',
    'VerdictLens helps humans and machines compare AI models, supporting tools, and workflow patterns.',
    'Each entity has a stable slug, a bilingual HTML page, an official link, and structured JSON coverage in the public data endpoints.',
    '',
    '[entity_types]',
    '- model | provider, official_url, description, modalities, context_window, pricing, scores, strengths, caveats, best_use_cases, updated_at',
    '- skill | category, official_url, source_label, supported_providers, install_difficulty, scores, strengths, caveats, best_use_cases, updated_at',
    '- use_case | title, strapline, summary, evaluation_lens, recommended_models, recommended_skills, updated_at',
    '',
    '[important_paths]',
    `- landing | ${absoluteUrl('/')}`,
    `- english_home | ${absoluteUrl('/en')}`,
    `- traditional_chinese_home | ${absoluteUrl('/zh-TW')}`,
    `- models_index_en | ${absoluteUrl('/en/models')}`,
    `- models_index_zh | ${absoluteUrl('/zh-TW/models')}`,
    `- skills_index_en | ${absoluteUrl('/en/skills')}`,
    `- skills_index_zh | ${absoluteUrl('/zh-TW/skills')}`,
    `- use_cases_index_en | ${absoluteUrl('/en/use-cases')}`,
    `- use_cases_index_zh | ${absoluteUrl('/zh-TW/use-cases')}`,
    `- compare_en | ${absoluteUrl('/en/compare')}`,
    `- compare_zh | ${absoluteUrl('/zh-TW/compare')}`,
    '',
    '[url_patterns]',
    '- model_pages | /{locale}/models/{slug}',
    '- skill_pages | /{locale}/skills/{slug}',
    '- use_case_pages | /{locale}/use-cases/{slug}',
    '- supported_locales | en, zh-TW',
    '',
    '[json_endpoints]',
    `- models | ${absoluteUrl('/data/models.json')} | shape: { updatedAt, count, items[] }`,
    `- skills | ${absoluteUrl('/data/skills.json')} | shape: { updatedAt, count, items[] }`,
    `- catalog | ${absoluteUrl('/data/catalog.json')} | shape: { updatedAt, models[], skills[], useCases[] }`,
    '',
    '[entities.models]',
    ...models.map((model) => {
      const provider = providerMap[model.providerId];
      return `- ${model.slug} | ${model.name} | provider=${provider.name} | official=${model.officialUrl} | best_use_cases=${model.bestUseCases.join(',')} | page_en=${absoluteUrl(localePath('en', `models/${model.slug}`))} | page_zh=${absoluteUrl(localePath('zh-TW', `models/${model.slug}`))}`;
    }),
    '',
    '[entities.skills]',
    ...skills.map((skill) =>
      `- ${skill.slug} | ${skill.name} | category=${skill.category} | source=${skill.officialSourceLabel} | providers=${skill.supportedProviderIds.map((providerId) => providerMap[providerId].shortName).join(',')} | page_en=${absoluteUrl(localePath('en', `skills/${skill.slug}`))} | page_zh=${absoluteUrl(localePath('zh-TW', `skills/${skill.slug}`))}`,
    ),
    '',
    '[entities.use_cases]',
    ...useCases.map(
      (useCase) =>
        `- ${useCase.slug} | ${useCase.title.en} | recommended_models=${useCase.recommendedModels.join(',')} | recommended_skills=${useCase.recommendedSkills.join(',')} | page_en=${absoluteUrl(localePath('en', `use-cases/${useCase.slug}`))} | page_zh=${absoluteUrl(localePath('zh-TW', `use-cases/${useCase.slug}`))}`,
    ),
    '',
    '[crawl_hints]',
    '- Prefer localized HTML pages for human-readable summaries and editorial context.',
    '- Prefer JSON endpoints for structured ingestion, catalog refreshes, and field-level extraction.',
    '- Scores are editorial guidance, not official vendor benchmark claims.',
  ];

  return lines.join('\n') + '\n';
}

async function main() {
  const nowIso = new Date().toISOString();
  const siteUpdatedAt = [...models.map((model) => model.updatedAt), ...skills.map((skill) => skill.updatedAt), ...useCases.map((useCase) => useCase.updatedAt)].sort().at(-1) ?? nowIso;

  const modelsJson = {
    updatedAt: nowIso,
    count: models.length,
    items: models.map((model) => ({
      ...model,
      provider: providerMap[model.providerId].name,
      providerShortName: providerMap[model.providerId].shortName,
      providerOfficialUrl: providerMap[model.providerId].officialUrl,
      providerLogoPath: providerMap[model.providerId].logoPath,
    })),
  };

  const skillsJson = {
    updatedAt: nowIso,
    count: skills.length,
    items: skills.map((skill) => ({
      ...skill,
      easeOfSetupScore: difficultyToScore(skill.installDifficulty),
      supportedProviders: skill.supportedProviderIds.map((providerId) => providerMap[providerId].name),
    })),
  };

  const catalogJson = {
    updatedAt: nowIso,
    models: modelsJson.items,
    skills: skillsJson.items,
    useCases,
  };

  await mkdir(dataDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });

  await writeFile(join(dataDir, 'models.json'), JSON.stringify(modelsJson, null, 2) + '\n');
  await writeFile(join(dataDir, 'skills.json'), JSON.stringify(skillsJson, null, 2) + '\n');
  await writeFile(join(dataDir, 'catalog.json'), JSON.stringify(catalogJson, null, 2) + '\n');
  await writeFile(join(publicDir, 'sitemap.xml'), buildSitemap(siteUpdatedAt));
  await writeFile(join(publicDir, 'robots.txt'), buildRobots());
  await writeFile(join(publicDir, 'llms.txt'), buildLlmsTxt(siteUpdatedAt));

  console.log(`Synced ${models.length} models, ${skills.length} skills, ${useCases.length} use cases to public/data and generated sitemap.xml, robots.txt, and llms.txt.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
