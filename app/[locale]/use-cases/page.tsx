import type { Metadata } from 'next';
import { SectionIntro } from '@/components/SectionIntro';
import { UseCaseCard } from '@/components/UseCaseCard';
import { getLocale, ui } from '@/lib/i18n';
import { useCases } from '@/lib/data';
import { absoluteUrl, siteName } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  const description =
    locale === 'en'
      ? 'Use-case guides for coding, research, and agent automation with recommended models and skills.'
      : '針對 coding、研究與 agent 自動化的使用場景指南，附推薦模型與技能。';

  return {
    title: `${siteName} — ${copy.useCases.title}`,
    description,
    openGraph: {
      title: `${siteName} — ${copy.useCases.title}`,
      description,
      url: absoluteUrl(`/${locale}/use-cases`),
    },
  };
}

export default async function UseCasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];

  return (
    <main>
      <div className="container-shell py-10 md:py-14">
        <SectionIntro
          eyebrow={copy.nav.useCases}
          title={copy.useCases.title}
          body={
            locale === 'en'
              ? 'Start with the job to be done. Each guide points to the models and skills most likely to fit.'
              : '先從要完成的工作出發，每份指南都會指出更適合的模型與技能組合。'
          }
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {useCases.map((item) => (
            <UseCaseCard key={item.slug} item={item} locale={locale} />
          ))}
        </div>
      </div>
    </main>
  );
}
