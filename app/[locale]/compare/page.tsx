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
      ? 'Compare shortlisted AI models side by side across practical fit, pricing, speed, official links, and workflow support.'
      : '把 shortlisted AI 模型並排比較，集中檢視實際適配、價格、速度、官方連結與工作流支援。';

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
        <CompareWorkbench models={models} locale={locale} initialSelected={[]} />
      </div>
    </main>
  );
}
