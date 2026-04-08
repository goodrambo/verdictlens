import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/JsonLd';
import { ScoreBar } from '@/components/shared/ScoreBar';
import { modelMap, models, useCases } from '@/lib/data';
import { formatDate, getProvider, localizeSpeed } from '@/lib/helpers';
import { getLocale, pick, ui } from '@/lib/i18n';
import { buildMetadata, localePath, localizedAlternates, locales, absoluteUrl, siteName } from '@/lib/site';
import { ProviderLogo } from '@/components/brand/ProviderLogo';
import { ExternalLink } from '@/components/shared/ExternalLink';

export function generateStaticParams() {
  return locales.flatMap((locale) => models.map((model) => ({ locale, slug: model.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const model = modelMap[slug];
  if (!model) return {};

  return buildMetadata({
    title: `${model.name} — ${siteName}`,
    description: pick(locale, model.summary),
    path: localePath(locale, `models/${model.slug}`),
    alternates: localizedAlternates(`models/${model.slug}`),
  });
}

export default async function ModelDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const copy = ui[locale];
  const model = modelMap[slug];

  if (!model) notFound();

  const provider = getProvider(model.providerId);
  const relevantUseCases = useCases.filter((item) => model.bestFor.includes(item.slug));

  return (
    <main>
      <div className="container-shell py-10 md:py-14">
        <Link href={`/${locale}/models`} className="btn-secondary text-sm">
          ← {copy.labels.backToModels}
        </Link>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="panel p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3">
                  <ProviderLogo providerId={model.providerId} className="h-12 w-12 rounded-2xl" />
                  <div>
                    <p className="text-label text-[var(--accent)]">{provider.name}</p>
                    <h1 className="mt-2 text-4xl font-semibold text-white md:text-5xl [text-wrap:balance]">{model.displayName}</h1>
                  </div>
                </div>
                <p className="mt-5 text-base leading-8 text-[var(--text-muted)] md:text-[1.05rem]">{pick(locale, model.summary)}</p>
              </div>
              <div className="rounded-[28px] border border-[var(--border-strong)] bg-[var(--accent-soft)] px-5 py-4 text-right">
                <div className="text-xs uppercase tracking-[0.28em] text-[var(--accent-contrast)]/70">{copy.labels.overallScore}</div>
                <div className="mt-1 text-4xl font-semibold text-white">{model.overallScore}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {model.tags.map((tag) => (
                <span key={tag} className="chip text-xs text-[var(--text-muted)]">{tag}</span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <ExternalLink href={model.officialUrl}>{copy.labels.officialSite}</ExternalLink>
              {model.docsUrl ? <ExternalLink href={model.docsUrl} subtle>{copy.labels.officialDocs}</ExternalLink> : null}
              {model.pricingUrl ? <ExternalLink href={model.pricingUrl} subtle>{copy.labels.pricing}</ExternalLink> : null}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label={copy.labels.contextWindow} value={model.contextWindow} />
              <MetricCard label={copy.labels.speed} value={localizeSpeed(locale, model.speedCategory)} />
              <MetricCard label={copy.labels.inputPricing} value={model.pricing.input} />
              <MetricCard label={copy.labels.outputPricing} value={model.pricing.output} />
            </div>
          </div>

          <div className="panel p-6 md:p-8">
            <p className="text-label text-[var(--text-muted)]">{copy.labels.scoreBreakdown}</p>
            <div className="mt-5 space-y-4">
              <ScoreBar label={locale === 'en' ? 'Capability' : '能力'} value={model.scores.capability} />
              <ScoreBar label={locale === 'en' ? 'Use-case fit' : '場景適配'} value={model.scores.useCaseFitness} />
              <ScoreBar label={locale === 'en' ? 'Cost efficiency' : '成本效率'} value={model.scores.costEfficiency} />
              <ScoreBar label={locale === 'en' ? 'Speed' : '速度'} value={model.scores.speed} />
              <ScoreBar label={locale === 'en' ? 'Reliability' : '可靠性'} value={model.scores.reliability} />
              <ScoreBar label={locale === 'en' ? 'Agent readiness' : 'Agent 就緒度'} value={model.scores.agentReadiness} />
              <ScoreBar label={locale === 'en' ? 'Ecosystem' : '生態'} value={model.scores.ecosystem} />
            </div>
            <p className="mt-6 text-sm leading-7 text-[var(--text-muted)]">{copy.labels.scoringDisclaimer}</p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <div className="panel p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.labels.bestFor}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {model.bestFor.map((item) => (
                <span key={item} className="chip text-sm text-[var(--text-muted)]">{item}</span>
              ))}
            </div>

            <h3 className="mt-6 text-sm uppercase tracking-[0.28em] text-[var(--text-muted-2)]">{copy.labels.worksWith}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {model.worksWith.map((item) => (
                <span key={item} className="chip text-xs text-[var(--text-muted)]">{item}</span>
              ))}
            </div>

            <h3 className="mt-6 text-sm uppercase tracking-[0.28em] text-[var(--text-muted-2)]">{copy.labels.modalities}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {model.modalities.map((item) => (
                <span key={item} className="chip text-xs text-[var(--text-muted)]">{item}</span>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.labels.sourceSignals}</h2>
            <div className="mt-4 space-y-3">
              {model.sourceRefs.map((source) => (
                <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="panel-subtle flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-white/8">
                  <div>
                    <div className="text-sm font-medium text-white">{source.label}</div>
                    <div className="mt-1 text-xs text-[var(--text-muted)]">Tier {source.trustTier} · {formatDate(locale, source.fetchedAt)}</div>
                  </div>
                  <span className="text-[var(--accent)]">↗</span>
                </a>
              ))}
            </div>
            <div className="mt-5 text-sm text-[var(--text-muted)]">{copy.labels.lastVerified}: {formatDate(locale, model.lastVerifiedAt)}</div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="panel p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.labels.strengths}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--text-muted)]">
              {model.strengths.map((item) => (
                <li key={item.en} className="panel-subtle px-4 py-3">{pick(locale, item)}</li>
              ))}
            </ul>
          </div>
          <div className="panel p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.labels.caveats}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--text-muted)]">
              {model.caveats.map((item) => (
                <li key={item.en} className="panel-subtle px-4 py-3">{pick(locale, item)}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6 panel p-6">
          <h2 className="text-2xl font-semibold text-white">{copy.labels.bestFor}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {relevantUseCases.map((item) => (
              <Link key={item.slug} href={`/${locale}/use-cases/${item.slug}`} className="panel-subtle px-4 py-4 transition hover:bg-white/8">
                <div className="text-base font-medium text-white">{pick(locale, item.title)}</div>
                <div className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{pick(locale, item.summary)}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: model.name,
          description: pick(locale, model.summary),
          applicationCategory: 'AI Model',
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            priceSpecification: `${model.pricing.input} | ${model.pricing.output}`,
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: model.overallScore,
            bestRating: 100,
            ratingCount: 1,
          },
          sameAs: [model.officialUrl, provider.officialUrl],
          url: absoluteUrl(`/${locale}/models/${model.slug}`),
        }}
      />
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel-subtle p-4">
      <div className="text-sm text-[var(--text-muted)]">{label}</div>
      <div className="mt-1 text-lg font-medium text-white">{value}</div>
    </div>
  );
}
