import { providerMap } from '@/lib/content/providers';
import { Locale, Model, ProviderId, Skill, SourceKind, SourceRef } from '@/lib/types';
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

export function localizeSourceKind(locale: Locale, kind: SourceKind) {
  return pick(locale, sourceKindLabels[kind] ?? { en: kind, 'zh-TW': kind });
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
