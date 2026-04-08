import type { Metadata } from 'next';
import { CompareWorkbench } from '@/components/compare/CompareWorkbench';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { models } from '@/lib/data';
import { getLocale, ui } from '@/lib/i18n';
import { buildMetadata, localePath, localizedAlternates, siteName } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  const description =
    locale === 'en'
      ? 'Compare AI models side by side across score, pricing, speed, context window, and official links.'
      : '並排比較 AI 模型的分數、價格、速度、上下文視窗與官方連結。';

  return buildMetadata({
    title: `${siteName} — ${copy.compare.title}`,
    description,
    path: localePath(locale, 'compare'),
    alternates: localizedAlternates('compare'),
  });
}

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];

  return (
    <main>
      <div className="container-shell py-10 md:py-14">
        <SectionIntro eyebrow={copy.nav.compare} title={copy.compare.title} body={copy.compare.body} />
        <CompareWorkbench models={models} locale={locale} />
      </div>
    </main>
  );
}
