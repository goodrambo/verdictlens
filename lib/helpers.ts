import { models, skills } from '@/lib/data';
import { Locale } from '@/lib/types';
import { pick } from '@/lib/i18n';

export function getModel(slug: string) {
  return models.find((item) => item.slug === slug);
}

export function getSkill(slug: string) {
  return skills.find((item) => item.slug === slug);
}

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

export function summarizeTags(locale: Locale, tags: string[]) {
  return tags.map((tag) => pick(locale, { en: tag, 'zh-TW': tag })).join(' · ');
}
