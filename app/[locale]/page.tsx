import Link from 'next/link';
import type { Metadata } from 'next';
import { featuredModelSlugs, featuredSkillSlugs, modelMap, skillMap, useCases } from '@/lib/data';
import { getLocale, ui } from '@/lib/i18n';
import { absoluteUrl, defaultMetadata, siteName } from '@/lib/site';
import { ModelCard } from '@/components/ModelCard';
import { SkillCard } from '@/components/SkillCard';
import { UseCaseCard } from '@/components/UseCaseCard';
import { SectionIntro } from '@/components/SectionIntro';
import { JsonLd } from '@/components/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  return {
    title: `${siteName} — ${copy.sections.exploreModels}`,
    description: copy.hero.body,
    alternates: {
      languages: {
        en: '/en',
        'zh-TW': '/zh-TW',
      },
    },
    openGraph: {
      title: `${siteName} — ${copy.sections.exploreModels}`,
      description: copy.hero.body,
      url: absoluteUrl(`/${locale}`),
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  const featuredModels = featuredModelSlugs.map((slug) => modelMap[slug]);
  const featuredSkills = featuredSkillSlugs.map((slug) => skillMap[slug]);

  return (
    <main>
      <div className="container-shell py-10 md:py-16">
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/72 to-slate-950/92 px-6 py-12 shadow-glow md:px-10 md:py-16">
          <div className="hero-orb left-10 top-12 h-32 w-32 bg-cyan-400/20" />
          <div className="hero-orb right-10 top-16 h-40 w-40 bg-indigo-500/20" />
          <div className="hero-orb bottom-10 left-1/3 h-28 w-28 bg-emerald-300/15" />

          <div className="relative z-10 grid gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
            <div>
              <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-100">
                {copy.hero.eyebrow}
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold text-white md:text-6xl md:leading-[1.02] [text-wrap:balance]">
                {copy.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-[1.15rem]">{copy.hero.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/${locale}/models`} className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
                  {copy.hero.primary}
                </Link>
                <Link href={`/${locale}/compare`} className="rounded-full border border-white/15 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12">
                  {copy.hero.secondary}
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="glass-panel rounded-[28px] p-5 md:p-6">
                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                  {[copy.hero.meta1, copy.hero.meta2, copy.hero.meta3].map((item, index) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                      <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">0{index + 1}</div>
                      <div className="mt-2 text-base font-medium leading-7 text-white">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-panel rounded-[28px] p-5 md:p-6">
                <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">{copy.sections.compareHeadline}</p>
                <div className="mt-4 space-y-3">
                  {featuredModels.slice(0, 3).map((model) => (
                    <div key={model.slug} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5">
                      <div className="min-w-0">
                        <div className="font-medium text-white">{model.name}</div>
                        <div className="text-sm text-slate-400">{model.provider}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Score</div>
                        <div className="text-xl font-semibold text-cyan-100">{model.overallScore}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <SectionIntro
            eyebrow={copy.sections.featuredModels}
            title={copy.sections.exploreModels}
            body={locale === 'en' ? 'Browse leading models with clear pricing context, speed, strengths, and best-fit use cases.' : '用更容易掃描的方式瀏覽主流模型，直接掌握價格、速度、優勢與適合場景。'}
            action={<Link href={`/${locale}/models`} className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white transition hover:bg-white/10">{copy.nav.models}</Link>}
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredModels.map((model) => (
              <ModelCard key={model.slug} model={model} locale={locale} />
            ))}
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <SectionIntro
            eyebrow={copy.sections.featuredSkills}
            title={copy.sections.exploreSkills}
            body={locale === 'en' ? 'The tooling layer often determines whether a model stays reliable in real work, not just in a quick trial.' : '真正決定模型能不能穩定落地的，通常是工具與工作流層，而不只是一次試用的表現。'}
            action={<Link href={`/${locale}/skills`} className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white transition hover:bg-white/10">{copy.nav.skills}</Link>}
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredSkills.map((skill) => (
              <SkillCard key={skill.slug} skill={skill} locale={locale} />
            ))}
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <SectionIntro eyebrow={copy.sections.topUseCases} title={copy.useCases.title} body={copy.useCases.body} />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((item) => (
              <UseCaseCard key={item.slug} item={item} locale={locale} />
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 xl:grid-cols-[1.1fr_0.9fr] md:mt-20">
          <div className="glass-panel rounded-[32px] p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-100/80">{copy.sections.scoring}</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-white md:text-[2rem] [text-wrap:balance]">
              {locale === 'en' ? 'Structured enough to trust. Flexible enough to keep improving.' : '夠結構化，才值得參考；夠彈性，才跟得上變化。'}
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300 md:text-[0.98rem]">
              <p>{copy.scoring.model}</p>
              <p>{copy.scoring.skill}</p>
              <p>{copy.labels.scoringDisclaimer}</p>
            </div>
          </div>

          <div className="glass-panel rounded-[32px] p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.32em] text-indigo-100/80">{copy.sections.dataHeadline}</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-white md:text-[2rem] [text-wrap:balance]">
              {locale === 'en' ? 'Built with clean public data from day one.' : '從第一天起就提供乾淨、可公開使用的結構化資料。'}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-[0.98rem]">
              {locale === 'en'
                ? 'Each endpoint is easy to inspect, reuse, or index—useful for websites, internal tooling, search, and AI answer engines.'
                : '每個端點都方便檢視、重用與索引，適合網站、內部工具、搜尋與 AI 回答引擎使用。'}
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <Link href="/data/models.json" className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 hover:bg-white/8">
                <span>{copy.labels.modelApi}</span>
                <span className="text-cyan-100">/data/models.json</span>
              </Link>
              <Link href="/data/skills.json" className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 hover:bg-white/8">
                <span>{copy.labels.skillApi}</span>
                <span className="text-cyan-100">/data/skills.json</span>
              </Link>
              <Link href="/data/catalog.json" className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 hover:bg-white/8">
                <span>{copy.labels.catalogApi}</span>
                <span className="text-cyan-100">/data/catalog.json</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: defaultMetadata.title,
          url: absoluteUrl(`/${locale}`),
          inLanguage: locale,
          description: copy.hero.body,
        }}
      />
    </main>
  );
}
