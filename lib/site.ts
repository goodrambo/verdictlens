import { Locale } from '@/lib/types';

export const locales: Locale[] = ['en', 'zh-TW'];
export const defaultLocale: Locale = 'en';
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const siteName = 'ModelAtlas';
export const siteTagline = {
  en: 'AI Models & Skills Ratings',
  'zh-TW': 'AI 模型與技能評分平台',
};

export const defaultMetadata = {
  title: 'ModelAtlas — AI Models & Skills Ratings',
  description:
    'Compare AI models and practical agent skills with structured scores, bilingual explanations, and machine-readable data.',
};

export function relativeUrl(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export function absoluteUrl(path: string) {
  return `${siteUrl}${relativeUrl(path)}`;
}
