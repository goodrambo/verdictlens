import type { Metadata } from 'next';
import { Locale } from '@/lib/types';

export const locales: Locale[] = ['en', 'zh-TW'];
export const defaultLocale: Locale = 'en';
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const siteName = 'VerdictLens';
export const siteTagline = {
  en: 'AI model, skill, and workflow guide',
  'zh-TW': 'AI 模型、技能與工作流指南',
};

export const ogImage = {
  path: '/og-cover.png',
  width: 1200,
  height: 630,
  alt: 'VerdictLens — AI model rankings, skills, and workflow guides',
};

export const defaultMetadata = {
  title: 'VerdictLens — AI model rankings, skills, and workflow guides',
  description:
    'Compare AI models, operational skills, and use-case guides with structured scores, pricing context, and machine-readable data.',
};

export function relativeUrl(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export function absoluteUrl(path: string) {
  return new URL(relativeUrl(path), siteUrl).toString();
}

export function localePath(locale: Locale, path = '') {
  const normalized = path.replace(/^\/+|\/+$/g, '');
  return normalized ? `/${locale}/${normalized}` : `/${locale}`;
}

export function localizedAlternates(path = '') {
  return Object.fromEntries(locales.map((locale) => [locale, localePath(locale, path)])) as Record<Locale, string>;
}

export function buildMetadata({
  title,
  description,
  path,
  alternates,
}: {
  title: string;
  description: string;
  path: string;
  alternates?: Partial<Record<Locale, string>>;
}): Metadata {
  const imageUrl = absoluteUrl(ogImage.path);

  return {
    title,
    description,
    alternates: {
      canonical: path,
      ...(alternates ? { languages: alternates } : {}),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName,
      url: absoluteUrl(path),
      images: [
        {
          url: imageUrl,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
