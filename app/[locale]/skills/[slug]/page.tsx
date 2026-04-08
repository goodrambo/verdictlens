import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { ScoreBar } from '@/components/ScoreBar';
import { skillMap, skills, useCases } from '@/lib/data';
import { formatDate, localizeDifficulty } from '@/lib/helpers';
import { getLocale, pick, ui } from '@/lib/i18n';
import { locales, absoluteUrl, siteName } from '@/lib/site';

export function generateStaticParams() {
  return locales.flatMap((locale) => skills.map((skill) => ({ locale, slug: skill.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const skill = skillMap[slug];
  if (!skill) return {};

  return {
    title: `${skill.name} — ${siteName}`,
    description: pick(locale, skill.description),
    openGraph: {
      title: `${skill.name} — ${siteName}`,
      description: pick(locale, skill.description),
      url: absoluteUrl(`/${locale}/skills/${skill.slug}`),
    },
  };
}

export default async function SkillDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const copy = ui[locale];
  const skill = skillMap[slug];

  if (!skill) notFound();

  const relevantUseCases = useCases.filter((item) => skill.bestUseCases.some((useCaseSlug) => item.slug === useCaseSlug));

  return (
    <main>
      <div className="container-shell py-10 md:py-14">
        <Link href={`/${locale}/skills`} className="inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">
          ← {copy.labels.backToSkills}
        </Link>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel rounded-[34px] p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.32em] text-indigo-100/80">{skill.category}</p>
                <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl [text-wrap:balance]">{skill.name}</h1>
                <p className="mt-4 text-base leading-8 text-slate-300 md:text-[1.05rem]">{pick(locale, skill.description)}</p>
              </div>
              <div className="rounded-[28px] border border-indigo-300/15 bg-indigo-300/10 px-5 py-4 text-right">
                <div className="text-xs uppercase tracking-[0.28em] text-indigo-100/70">{copy.labels.overallScore}</div>
                <div className="mt-1 text-4xl font-semibold text-white">{skill.overallScore}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{tag}</span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-4">
                <div className="text-sm text-slate-400">{copy.labels.difficulty}</div>
                <div className="mt-1 text-lg font-medium text-white">{localizeDifficulty(locale, skill.installDifficulty)}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-4 md:col-span-1 xl:col-span-2">
                <div className="text-sm text-slate-400">{copy.labels.supportedProviders}</div>
                <div className="mt-1 text-lg font-medium text-white">{skill.supportedProviders.join(' · ')}</div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[34px] p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">{copy.labels.scoreBreakdown}</p>
            <div className="mt-5 space-y-4">
              <ScoreBar label={locale === 'en' ? 'Utility' : '實用性'} value={skill.utilityScore} />
              <ScoreBar label={locale === 'en' ? 'Compatibility' : '相容性'} value={skill.compatibilityScore} />
              <ScoreBar label={locale === 'en' ? 'Ease of setup' : '安裝難度'} value={skill.easeOfSetupScore ?? (skill.installDifficulty === 'Easy' ? 94 : skill.installDifficulty === 'Moderate' ? 78 : 62)} />
              <ScoreBar label={locale === 'en' ? 'Reliability' : '可靠性'} value={skill.reliabilityScore} />
              <ScoreBar label={locale === 'en' ? 'Docs quality' : '文件品質'} value={skill.docsScore} />
              <ScoreBar label={locale === 'en' ? 'Adoption' : '採用度'} value={skill.adoptionScore} />
              <ScoreBar label={locale === 'en' ? 'Safety & maintenance' : '安全維護'} value={skill.safetyMaintenanceScore} />
            </div>
            <p className="mt-6 text-sm leading-7 text-slate-400">{copy.labels.scoringDisclaimer}</p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="glass-panel rounded-[30px] p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.labels.strengths}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              {skill.strengths.map((item) => (
                <li key={item.en} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3">{pick(locale, item)}</li>
              ))}
            </ul>
          </div>
          <div className="glass-panel rounded-[30px] p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.labels.caveats}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              {skill.caveats.map((item) => (
                <li key={item.en} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3">{pick(locale, item)}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="glass-panel rounded-[30px] p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.labels.bestFor}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {relevantUseCases.map((item) => (
                <Link key={item.slug} href={`/${locale}/use-cases/${item.slug}`} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-4 transition hover:bg-white/8">
                  <div className="text-base font-medium text-white">{pick(locale, item.title)}</div>
                  <div className="mt-2 text-sm leading-7 text-slate-300">{pick(locale, item.summary)}</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-[30px] p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.labels.updatedAt}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{formatDate(locale, skill.updatedAt)}</p>
          </div>
        </section>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: skill.name,
          description: pick(locale, skill.description),
          applicationCategory: 'AI Skill',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: skill.overallScore,
            bestRating: 100,
            ratingCount: 1,
          },
          url: absoluteUrl(`/${locale}/skills/${skill.slug}`),
        }}
      />
    </main>
  );
}
