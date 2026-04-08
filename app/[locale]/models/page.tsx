import type { Metadata } from 'next';
import { ModelsExplorer } from '@/components/models/ModelsExplorer';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { models } from '@/lib/data';
import { getLocale, ui } from '@/lib/i18n';
import { buildMetadata, localePath, localizedAlternates, siteName } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  const description =
    locale === 'en'
      ? 'Browse AI models with official links, pricing, speed, context window, and best-fit use cases visible at a glance.'
      : '瀏覽 AI 模型，快速掌握官方連結、價格、速度、上下文視窗與最適使用場景。';

  return buildMetadata({
    title: `${siteName} — ${copy.sections.exploreModels}`,
    description,
    path: localePath(locale, 'models'),
    alternates: localizedAlternates('models'),
  });
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
          body={
            locale === 'en'
              ? 'A cleaner model directory for discovery, shortlisting, and jumping to official vendor pages without losing the ranking context.'
              : '更清楚的模型目錄，方便做探索、shortlist，並直接跳到官方頁面，同時保留排名脈絡。'
          }
        />
        <ModelsExplorer models={models} locale={locale} />
      </div>
    </main>
  );
}
