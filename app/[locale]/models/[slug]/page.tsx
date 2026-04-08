import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { ScoreBar } from '@/components/ScoreBar';
import { modelMap, models, useCases } from '@/lib/data';
import { formatDate } from '@/lib/helpers';
import { getLocale, pick, ui } from '@/lib/i18n';
import { locales, absoluteUrl, siteName } from '@/lib/site';

export function generateStaticParams() {
  return locales.flatMap((locale) => models.map((model) => ({ locale, slug: model.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const model = modelMap[slug];
  if (!model) return {};

  return {
    title: `${model.name} — ${siteName}`,
    description: pick(locale, model.description),
    openGraph: {
      title: `${model.name} — ${siteName}`,
      description: pick(locale, model.description),
      url: absoluteUrl(`/${locale}/models/${model.slug}`),
    },
  };
}

export default async function ModelDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const copy = ui[locale];
  const model = modelMap[slug];

  if (!model) notFound();

  const relevantUseCases = useCases.filter((item) => model.bestUseCases.includes(item.slug));

  return (
    <main>
      <div className="container-shell py-10 md:py-14">
        <Link href={`/${locale}/models`} className="inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">
          ← {copy.labels.backToModels}
        </Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-panel rounded-[34px] p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/80">{model.provider}</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">{model.name}</h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">{pick(locale, model.description)}</p>
              </div>
              <div className="rounded-[28px] border border-cyan-300/15 bg-cyan-300/10 px-5 py-4 text-right">
                <div className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">{copy.labels.overallScore}</div>
                <div className="mt-1 text-4xl font-semibold text-white">{model.overallScore}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {model.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-4">
                <div className="text-sm text-slate-400">{copy.labels.contextWindow}</div>
                <div className="mt-1 text-lg font-medium text-white">{model.contextWindow}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-4">
                <div className="text-sm text-slate-400">{copy.labels.speed}</div>
                <div className="mt-1 text-lg font-medium text-white">{model.speedCategory}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-4">
                <div className="text-sm text-slate-400">Input pricing</div>
                <div className="mt-1 text-lg font-medium text-white">{model.pricing.input}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-4">
                <div className="text-sm text-slate-400">Output pricing</div>
                <div className="mt-1 text-lg font-medium text-white">{model.pricing.output}</div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[34px] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{copy.labels.scoreBreakdown}</p>
            <div className="mt-5 space-y-4">
              <ScoreBar label={locale === 'en' ? 'Capability' : '能力'} value={model.scores.capability} />
              <ScoreBar label={locale === 'en' ? 'Use-case fit' : '場景適配'} value={model.scores.useCaseFitness} />
              <ScoreBar label={locale === 'en' ? 'Cost efficiency' : '成本效率'} value={model.scores.costEfficiency} />
              <ScoreBar label={locale === 'en' ? 'Speed' : '速度'} value={model.scores.speed} />
              <ScoreBar label={locale === 'en' ? 'Reliability' : '可靠性'} value={model.scores.reliability} />
              <ScoreBar label={locale === 'en' ? 'Agent readiness' : 'Agent 就緒度'} value={model.scores.agentReadiness} />
              <ScoreBar label={locale === 'en' ? 'Ecosystem' : '生態'} value={model.scores.ecosystem} />
            </div>
            <p className="mt-6 text-sm leading-7 text-slate-400">{copy.labels.scoringDisclaimer}</p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="glass-panel rounded-[30px] p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.labels.strengths}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              {model.strengths.map((item) => (
                <li key={item.en} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3">{pick(locale, item)}</li>
              ))}
            </ul>
          </div>
          <div className="glass-panel rounded-[30px] p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.labels.caveats}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              {model.caveats.map((item) => (
                <li key={item.en} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3">{pick(locale, item)}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="glass-panel rounded-[30px] p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.labels.bestFor}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {relevantUseCases.map((item) => (
                <Link key={item.slug} href={`/${locale}/use-cases/${item.slug}`} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-4 hover:bg-white/8">
                  <div className="text-base font-medium text-white">{pick(locale, item.title)}</div>
                  <div className="mt-2 text-sm leading-7 text-slate-300">{pick(locale, item.summary)}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[30px] p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.labels.updatedAt}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{formatDate(locale, model.updatedAt)}</p>
            <h3 className="mt-6 text-sm uppercase tracking-[0.28em] text-slate-400">Modalities</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {model.modalities.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{item}</span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: model.name,
          description: pick(locale, model.description),
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
          url: absoluteUrl(`/${locale}/models/${model.slug}`),
        }}
      />
    </main>
  );
}
