import type { Metadata } from 'next';
import { SectionIntro } from '@/components/SectionIntro';
import { UseCaseCard } from '@/components/UseCaseCard';
import { getLocale, ui } from '@/lib/i18n';
import { useCases } from '@/lib/data';
import { absoluteUrl, siteName } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  return {
    title: `${siteName} — ${copy.nav.useCases}`,
    description: copy.useCases.body,
    openGraph: {
      title: `${siteName} — ${copy.nav.useCases}`,
      description: copy.useCases.body,
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
        <SectionIntro eyebrow={copy.nav.useCases} title={copy.useCases.title} body={copy.useCases.body} />
        <div className="grid gap-5 lg:grid-cols-3">
          {useCases.map((item) => (
            <UseCaseCard key={item.slug} item={item} locale={locale} />
          ))}
        </div>
      </div>
    </main>
  );
}
