import type { Metadata } from 'next';
import { CompareWorkbench } from '@/components/CompareWorkbench';
import { SectionIntro } from '@/components/SectionIntro';
import { models } from '@/lib/data';
import { getLocale, ui } from '@/lib/i18n';
import { absoluteUrl, siteName } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  return {
    title: `${siteName} — ${copy.nav.compare}`,
    description: copy.compare.body,
    openGraph: {
      title: `${siteName} — ${copy.nav.compare}`,
      description: copy.compare.body,
      url: absoluteUrl(`/${locale}/compare`),
    },
  };
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
