import type { Metadata } from 'next';
import { ModelsExplorer } from '@/components/ModelsExplorer';
import { SectionIntro } from '@/components/SectionIntro';
import { models } from '@/lib/data';
import { getLocale, ui } from '@/lib/i18n';
import { absoluteUrl, siteName } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  return {
    title: `${siteName} — ${copy.nav.models}`,
    description: locale === 'en' ? 'Search, filter, and compare curated AI model profiles.' : '搜尋、篩選並比較精選 AI 模型檔案。',
    openGraph: {
      title: `${siteName} — ${copy.nav.models}`,
      description: locale === 'en' ? 'Search, filter, and compare curated AI model profiles.' : '搜尋、篩選並比較精選 AI 模型檔案。',
      url: absoluteUrl(`/${locale}/models`),
    },
  };
}

export default async function ModelsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];

  return (
    <main>
      <div className="container-shell py-10 md:py-14">
        <SectionIntro
          eyebrow={copy.nav.models}
          title={copy.sections.exploreModels}
          body={locale === 'en' ? 'Find the right trade-off between capability, cost, speed, and agent readiness.' : '快速找到能力、成本、速度與 agent readiness 之間最適合的平衡。'}
        />
        <ModelsExplorer models={models} locale={locale} />
      </div>
    </main>
  );
}
