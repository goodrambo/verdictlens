import { Locale } from '@/lib/types';

export const locales: Locale[] = ['en', 'zh-TW'];
export const defaultLocale: Locale = 'en';
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const siteName = 'ModelAtlas';
export const siteTagline = {
  en: 'AI model, skill, and workflow guide',
  'zh-TW': 'AI 模型、技能與工作流指南',
};

export const defaultMetadata = {
  title: 'ModelAtlas — AI model rankings, skills, and workflow guides',
  description:
    'Compare AI models, operational skills, and use-case guides with structured scores, pricing context, and machine-readable data.',
};

export function relativeUrl(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export function absoluteUrl(path: string) {
  return `${siteUrl}${relativeUrl(path)}`;
}
