import Link from 'next/link';
import type { Metadata } from 'next';
import { featuredModelSlugs, featuredSkillSlugs, modelMap, models, skillMap, skills, useCases } from '@/lib/data';
import { getProvider } from '@/lib/helpers';
import { getLocale, ui } from '@/lib/i18n';
import { absoluteUrl, buildMetadata, defaultMetadata, localePath, localizedAlternates, siteName } from '@/lib/site';
import { ModelCard } from '@/components/models/ModelCard';
import { SkillCard } from '@/components/skills/SkillCard';
import { UseCaseCard } from '@/components/use-cases/UseCaseCard';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { JsonLd } from '@/components/shared/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  return buildMetadata({
    title: `${siteName} — ${copy.sections.exploreModels}`,
    description: copy.hero.body,
    path: localePath(locale),
    alternates: localizedAlternates(),
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  const featuredModels = featuredModelSlugs.map((slug) => modelMap[slug]);
  const featuredSkills = featuredSkillSlugs.map((slug) => skillMap[slug]);
  const curatedSkillCount = skills.filter((skill) => skill.catalogTier === 'curated').length;
  const registryValidatedSkillCount = skills.filter((skill) => skill.catalogTier === 'registry-validated').length;
  const registryListedSkillCount = skills.filter((skill) => skill.catalogTier === 'registry-listed').length;

  const entryPaths = [
    {
      href: `/${locale}/models`,
      title: copy.paths.modelsTitle,
      body: copy.paths.modelsBody,
      action: copy.labels.browseAllModels,
    },
    {
      href: `/${locale}/skills`,
      title: copy.paths.skillsTitle,
      body: copy.paths.skillsBody,
      action: copy.labels.browseAllSkills,
    },
    {
      href: `/${locale}/use-cases`,
      title: copy.paths.useCasesTitle,
      body: copy.paths.useCasesBody,
      action: copy.labels.exploreGuides,
    },
  ];

  return (
    <main>
      <div className="container-shell py-10 md:py-16">
        <section className="hero-panel px-6 py-10 md:px-10 md:py-14">
          <div className="hero-orb left-8 top-10 h-36 w-36 bg-[var(--orb-1)]" />
          <div className="hero-orb right-10 top-12 h-40 w-40 bg-[var(--orb-2)]" />
          <div className="hero-orb bottom-10 left-1/3 h-28 w-28 bg-[var(--orb-3)]" />

          <div className="relative z-10 grid gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
            <div>
              <div className="inline-flex rounded-full border border-[var(--border-strong)] bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent-contrast)]">
                {copy.hero.eyebrow}
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold text-white md:text-6xl md:leading-[1.02] [text-wrap:balance]">
                {copy.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)] md:text-[1.15rem]">{copy.hero.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/${locale}/models`} className="btn-primary px-6 py-3 text-sm">
                  {copy.hero.primary}
                </Link>
                <Link href={`/${locale}/skills`} className="btn-secondary px-6 py-3 text-sm">
                  {copy.hero.secondary}
                </Link>
                <Link href={`/${locale}/use-cases`} className="btn-secondary px-6 py-3 text-sm">
                  {copy.hero.tertiary}
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="panel p-5 md:p-6">
                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                  {[
                    locale === 'en' ? `${models.length} verified AI models` : `${models.length} 個已驗證 AI 模型`,
                    locale === 'en'
                      ? `${skills.length} live skills · ${curatedSkillCount} curated · ${registryValidatedSkillCount} registry validated`
                      : `${skills.length} 個 live skills · ${curatedSkillCount} 個人工 curated · ${registryValidatedSkillCount} 個 registry 已驗證`,
                    locale === 'en'
                      ? `${registryListedSkillCount} additional registry-listed entries with visible trust layering`
                      : `${registryListedSkillCount} 個額外 registry 收錄項目，並保留可見的信任分層`,
                  ].map((item, index) => (
                    <div key={item} className="panel-subtle p-4">
                      <div className="text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted-2)]">0{index + 1}</div>
                      <div className="mt-2 text-base font-medium leading-7 text-white">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel p-5 md:p-6">
                <p className="text-label text-[var(--text-muted)]">{copy.sections.compareHeadline}</p>
                <div className="mt-4 space-y-3">
                  {featuredModels.slice(0, 3).map((model) => (
                    <div key={model.slug} className="panel-subtle flex items-center justify-between gap-4 px-4 py-3.5">
                      <div className="min-w-0">
                        <div className="font-medium text-white">{model.name}</div>
                        <div className="text-sm text-[var(--text-muted)]">{getProvider(model.providerId).name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted-2)]">Score</div>
                        <div className="text-xl font-semibold text-[var(--accent)]">{model.overallScore}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href={`/${locale}/compare`} className="mt-4 inline-flex items-center text-sm text-[var(--accent)] hover:text-white">
                  {copy.compare.title} →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <SectionIntro
            eyebrow={copy.sections.choosePath}
            title={locale === 'en' ? 'Three clear ways to start.' : '先從三條清楚路徑開始。'}
            body={
              locale === 'en'
                ? 'Browse by model, browse by supporting tools, or start from the job you need done. The site is now organized around those three decisions first.'
                : '你可以先看模型、先看支援工具，或直接從要完成的工作出發。首頁先把這三種決策路徑攤清楚。'
            }
          />
          <div className="grid gap-5 md:grid-cols-3">
            {entryPaths.map((path) => (
              <Link key={path.href} href={path.href} className="card block p-6 hover:border-[var(--border-strong)]">
                <h3 className="text-2xl font-semibold text-white">{path.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{path.body}</p>
                <div className="mt-5 text-sm font-medium text-[var(--accent)]">{path.action} →</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <SectionIntro
            eyebrow={copy.sections.featuredModels}
            title={copy.sections.exploreModels}
            body={locale === 'en' ? 'Browse leading models with clear pricing context, speed, strengths, and visible official links.' : '用更容易掃描的方式瀏覽主流模型，直接掌握價格、速度、優勢，並看到官方連結。'}
            action={<Link href={`/${locale}/models`} className="btn-secondary text-sm">{copy.nav.models}</Link>}
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
            body={locale === 'en' ? 'The tool layer often determines whether a model stays dependable in real work. These picks make that layer easier to inspect.' : '真正決定模型能不能穩定落地的，通常是工具與工作流層。這裡先把那一層整理得更好讀。'}
            action={<Link href={`/${locale}/skills`} className="btn-secondary text-sm">{copy.nav.skills}</Link>}
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
          <div className="panel p-6 md:p-8">
            <p className="text-label text-[var(--accent)]">{copy.sections.scoring}</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-white md:text-[2rem] [text-wrap:balance]">
              {locale === 'en' ? 'Structured enough to trust. Flexible enough to keep improving.' : '夠結構化，才值得參考；夠彈性，才跟得上變化。'}
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--text-muted)] md:text-[0.98rem]">
              <p>{copy.scoring.model}</p>
              <p>{copy.scoring.skill}</p>
              <p>{copy.labels.scoringDisclaimer}</p>
            </div>
          </div>

          <div className="panel p-6 md:p-8">
            <p className="text-label text-[var(--accent-2)]">{copy.sections.dataHeadline}</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-white md:text-[2rem] [text-wrap:balance]">
              {locale === 'en' ? 'Built with clean public data from day one.' : '從第一天起就提供乾淨、可公開使用的結構化資料。'}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)] md:text-[0.98rem]">
              {locale === 'en'
                ? 'Each endpoint is easy to inspect, reuse, or index—useful for websites, internal tooling, search, and AI answer engines.'
                : '每個端點都方便檢視、重用與索引，適合網站、內部工具、搜尋與 AI 回答引擎使用。'}
            </p>
            <div className="mt-6 space-y-3 text-sm text-[var(--text-muted)]">
              <Link href="/data/models.json" className="panel-subtle flex items-center justify-between gap-4 px-4 py-3 hover:bg-white/8">
                <span>{copy.labels.modelApi}</span>
                <span className="text-[var(--accent)]">/data/models.json</span>
              </Link>
              <Link href="/data/skills.json" className="panel-subtle flex items-center justify-between gap-4 px-4 py-3 hover:bg-white/8">
                <span>{copy.labels.skillApi}</span>
                <span className="text-[var(--accent)]">/data/skills.json</span>
              </Link>
              <Link href="/data/catalog.json" className="panel-subtle flex items-center justify-between gap-4 px-4 py-3 hover:bg-white/8">
                <span>{copy.labels.catalogApi}</span>
                <span className="text-[var(--accent)]">/data/catalog.json</span>
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
