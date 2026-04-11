import { providerMap } from '@/lib/content/providers';
import { getSkillCategory } from '@/lib/content/skill-categories';
import { Locale, Model, ProviderId, Skill, SkillCatalogTier, SourceKind, SourceRef } from '@/lib/types';
import { pick } from '@/lib/i18n';

const useCaseLabels = {
  coding: { en: 'Coding', 'zh-TW': 'Coding' },
  research: { en: 'Research', 'zh-TW': '研究' },
  'agent-automation': { en: 'Agent automation', 'zh-TW': 'Agent 自動化' },
} as const;

const sourceKindLabels: Record<SourceKind, { en: string; 'zh-TW': string }> = {
  'official-docs': { en: 'Official docs', 'zh-TW': '官方文件' },
  'official-site': { en: 'Official site', 'zh-TW': '官方網站' },
  'official-registry': { en: 'Official registry', 'zh-TW': '官方 registry' },
  'community-registry': { en: 'Community registry', 'zh-TW': '社群 registry' },
  github: { en: 'GitHub', 'zh-TW': 'GitHub' },
  'pricing-page': { en: 'Pricing page', 'zh-TW': '價格頁' },
  blog: { en: 'Blog', 'zh-TW': '部落格' },
  benchmark: { en: 'Benchmark', 'zh-TW': 'Benchmark' },
  'manual-review': { en: 'Manual review', 'zh-TW': '人工整理' },
};

export function formatDate(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(locale === 'zh-TW' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export function scoreTone(score: number) {
  if (score >= 90) return 'from-emerald-300/25 to-cyan-300/15 text-emerald-100';
  if (score >= 85) return 'from-sky-300/25 to-indigo-300/15 text-sky-100';
  if (score >= 80) return 'from-violet-300/25 to-fuchsia-300/15 text-violet-100';
  return 'from-white/15 to-white/5 text-white';
}

export function speedRank(speed: string) {
  return speed === 'Fast' ? 3 : speed === 'Balanced' ? 2 : 1;
}

export function easeOfSetupScore(difficulty: string, score?: number) {
  if (typeof score === 'number') return score;
  if (difficulty === 'Easy') return 94;
  if (difficulty === 'Moderate') return 78;
  return 62;
}

export function localizeSpeed(locale: Locale, speed: string) {
  const labels = {
    Fast: { en: 'Fast', 'zh-TW': '快速' },
    Balanced: { en: 'Balanced', 'zh-TW': '均衡' },
    Deliberate: { en: 'Deliberate', 'zh-TW': '深思型' },
  } as const;

  return pick(locale, labels[speed as keyof typeof labels] ?? { en: speed, 'zh-TW': speed });
}

export function localizeDifficulty(locale: Locale, difficulty: string) {
  const labels = {
    Easy: { en: 'Easy', 'zh-TW': '容易' },
    Moderate: { en: 'Moderate', 'zh-TW': '中等' },
    Advanced: { en: 'Advanced', 'zh-TW': '進階' },
  } as const;

  return pick(locale, labels[difficulty as keyof typeof labels] ?? { en: difficulty, 'zh-TW': difficulty });
}

export function localizeUseCase(locale: Locale, slug: string) {
  return pick(locale, useCaseLabels[slug as keyof typeof useCaseLabels] ?? { en: slug, 'zh-TW': slug });
}

const catalogTierLabels: Record<SkillCatalogTier, { en: string; 'zh-TW': string }> = {
  curated: { en: 'Editor-reviewed', 'zh-TW': '編輯精選' },
  'registry-validated': { en: 'Verified listing', 'zh-TW': '已驗證收錄' },
  'registry-listed': { en: 'Directory listing', 'zh-TW': '目錄收錄' },
};

export function localizeSourceKind(locale: Locale, kind: SourceKind) {
  return pick(locale, sourceKindLabels[kind] ?? { en: kind, 'zh-TW': kind });
}

export function localizeCatalogTier(locale: Locale, tier: SkillCatalogTier) {
  return pick(locale, catalogTierLabels[tier] ?? { en: tier, 'zh-TW': tier });
}

export function localizeSkillCategory(locale: Locale, skill: Pick<Skill, 'categoryId' | 'categoryLabel'>) {
  return pick(locale, skill.categoryLabel ?? getSkillCategory(skill.categoryId).label);
}

const fieldPathLabels: Record<string, { en: string; 'zh-TW': string }> = {
  officialUrl: { en: 'Official link', 'zh-TW': '官方連結' },
  docsUrl: { en: 'Docs link', 'zh-TW': '文件連結' },
  pricing: { en: 'Pricing', 'zh-TW': '價格' },
  pricingUrl: { en: 'Pricing page', 'zh-TW': '價格頁' },
  summary: { en: 'Summary', 'zh-TW': '摘要' },
  description: { en: 'Description', 'zh-TW': '說明' },
  modalities: { en: 'Modalities', 'zh-TW': '模態' },
  modalityProfile: { en: 'Modality profile', 'zh-TW': '模態設定' },
  contextWindow: { en: 'Context window', 'zh-TW': '上下文視窗' },
  maxOutputTokens: { en: 'Max output', 'zh-TW': '最大輸出' },
  toolSupport: { en: 'Tool support', 'zh-TW': '工具支援' },
  supportedProviderIds: { en: 'Supported providers', 'zh-TW': '支援供應商' },
  supportedHosts: { en: 'Supported hosts', 'zh-TW': '支援載體' },
  installMethod: { en: 'Install method', 'zh-TW': '安裝方式' },
  deployment: { en: 'Deployment model', 'zh-TW': '部署模式' },
  auth: { en: 'Auth', 'zh-TW': '驗證方式' },
  permissionProfile: { en: 'Permission posture', 'zh-TW': '權限姿態' },
  repoUrl: { en: 'Repository', 'zh-TW': '程式庫' },
  registryUrl: { en: 'Registry link', 'zh-TW': 'Registry 連結' },
  officialSourceLabel: { en: 'Preferred source label', 'zh-TW': '主要來源標籤' },
  categoryId: { en: 'Category', 'zh-TW': '分類' },
  subCategory: { en: 'Subcategory', 'zh-TW': '子分類' },
  capabilities: { en: 'Capabilities', 'zh-TW': '能力' },
  bestFor: { en: 'Best-fit guidance', 'zh-TW': '適合場景建議' },
  worksWith: { en: 'Works-with guidance', 'zh-TW': '搭配建議' },
  strengths: { en: 'Strengths', 'zh-TW': '優勢' },
  caveats: { en: 'Caveats', 'zh-TW': '注意事項' },
  overallScore: { en: 'Overall score', 'zh-TW': '總分' },
  scores: { en: 'Score breakdown', 'zh-TW': '分項評分' },
};

export function localizeFieldPath(locale: Locale, fieldPath: string) {
  return pick(locale, fieldPathLabels[fieldPath] ?? { en: fieldPath, 'zh-TW': fieldPath });
}

export function getOfficialFieldPaths(item: { sourceRefs: SourceRef[] }) {
  return Array.from(
    new Set(
      item.sourceRefs
        .filter((source) => source.trustTier >= 5)
        .flatMap((source) => source.fieldPaths ?? []),
    ),
  );
}

export function getProvider(providerId: ProviderId) {
  return providerMap[providerId];
}

export function providerName(providerId: ProviderId) {
  return providerMap[providerId]?.name ?? providerId;
}

export function providerNames(providerIds: ProviderId[]) {
  return providerIds.map((providerId) => providerName(providerId));
}

export function getPrimarySource(item: { sourceRefs: SourceRef[]; preferredSourceUrl?: string; officialUrl?: string }) {
  if (item.preferredSourceUrl) {
    const preferred = item.sourceRefs.find((source) => source.url === item.preferredSourceUrl);
    if (preferred) return preferred;
  }

  if (item.officialUrl) {
    const official = item.sourceRefs.find((source) => source.url === item.officialUrl);
    if (official) return official;
  }

  return item.sourceRefs[0];
}

export function compareHref(locale: Locale, slugs: string[]) {
  const cleaned = Array.from(new Set(slugs.filter(Boolean))).slice(0, 3);
  const query = cleaned.length ? `?models=${cleaned.join(',')}` : '';
  return `/${locale}/compare${query}`;
}

export function modelBestFor(model: Model) {
  return model.bestFor.length ? model.bestFor : model.bestUseCases;
}

export function skillBestFor(skill: Skill) {
  return skill.bestFor.length ? skill.bestFor : skill.bestUseCases;
}
