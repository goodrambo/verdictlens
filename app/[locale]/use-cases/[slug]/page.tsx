import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ModelCard } from '@/components/models/ModelCard';
import { SkillCard } from '@/components/skills/SkillCard';
import { JsonLd } from '@/components/shared/JsonLd';
import { modelMap, skillMap, useCaseMap, useCases } from '@/lib/data';
import { formatDate } from '@/lib/helpers';
import { getLocale, pick, ui } from '@/lib/i18n';
import { buildMetadata, localePath, localizedAlternates, locales, absoluteUrl, siteName } from '@/lib/site';

export function generateStaticParams() {
  return locales.flatMap((locale) => useCases.map((item) => ({ locale, slug: item.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const item = useCaseMap[slug];
  if (!item) return {};

  return buildMetadata({
    title: `${pick(locale, item.title)} — ${siteName}`,
    description: pick(locale, item.summary),
    path: localePath(locale, `use-cases/${item.slug}`),
    alternates: localizedAlternates(`use-cases/${item.slug}`),
  });
}

export default async function UseCaseDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const copy = ui[locale];
  const item = useCaseMap[slug];

  if (!item) notFound();

  const recommendedModels = item.recommendedModels.map((modelSlug) => modelMap[modelSlug]).filter(Boolean);
  const recommendedSkills = item.recommendedSkills.map((skillSlug) => skillMap[skillSlug]).filter(Boolean);

  return (
    <main>
      <div className="container-shell py-10 md:py-14">
        <Link href={`/${locale}/use-cases`} className="btn-secondary text-sm">
          ← {copy.labels.backToUseCases}
        </Link>

        <section className="mt-6 panel p-6 md:p-8">
          <div className="inline-flex rounded-full border border-[var(--border-strong)] bg-[var(--accent-soft)] px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-[var(--accent-contrast)]">
            {item.slug}
          </div>
          <h1 className="mt-5 text-4xl font-semibold text-white md:text-5xl [text-wrap:balance]">{pick(locale, item.title)}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">{pick(locale, item.strapline)}</p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--text-muted)]">{pick(locale, item.summary)}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {item.evaluationLens.map((lens) => (
              <div key={lens.en} className="panel-subtle p-4 text-sm leading-7 text-[var(--text-muted)]">
                {pick(locale, lens)}
              </div>
            ))}
          </div>

          <div className="mt-8 text-sm text-[var(--text-muted)]">{copy.labels.updatedAt}: {formatDate(locale, item.updatedAt)}</div>
        </section>

        <section className="mt-8 md:mt-10">
          <div className="mb-6">
            <p className="text-label text-[var(--accent)]">{copy.labels.recommendedStack}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{locale === 'en' ? 'Recommended models' : '推薦模型'}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recommendedModels.map((model) => (
              <ModelCard key={model.slug} model={model} locale={locale} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold text-white">{locale === 'en' ? 'Recommended skills' : '推薦技能'}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recommendedSkills.map((skill) => (
              <SkillCard key={skill.slug} skill={skill} locale={locale} />
            ))}
          </div>
        </section>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: pick(locale, item.title),
          description: pick(locale, item.summary),
          url: absoluteUrl(`/${locale}/use-cases/${item.slug}`),
        }}
      />
    </main>
  );
}
