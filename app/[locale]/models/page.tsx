import type { Metadata } from 'next';
import { ModelsExplorer } from '@/components/ModelsExplorer';
import { SectionIntro } from '@/components/SectionIntro';
import { models } from '@/lib/data';
import { getLocale, ui } from '@/lib/i18n';
import { absoluteUrl, siteName } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  const description =
    locale === 'en'
      ? 'Browse ranked AI models with pricing, speed, context window, and best-fit use cases visible at a glance.'
      : '瀏覽 AI 模型排名，快速掌握價格、速度、上下文視窗與最適使用場景。';

  return {
    title: `${siteName} — ${copy.sections.exploreModels}`,
    description,
    openGraph: {
      title: `${siteName} — ${copy.sections.exploreModels}`,
      description,
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
          body={
            locale === 'en'
              ? 'Browse ranked AI models with score, pricing, speed, context window, and best-fit use cases visible at a glance.'
              : '用更容易掃描的排名視圖比較 AI 模型，直接掌握分數、價格、速度、上下文視窗與最適場景。'
          }
        />
        <ModelsExplorer models={models} locale={locale} />
      </div>
    </main>
  );
}
