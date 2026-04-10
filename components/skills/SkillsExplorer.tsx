'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Locale, Skill } from '@/lib/types';
import { pick, ui } from '@/lib/i18n';
import { easeOfSetupScore, formatDate, getOfficialFieldPaths, getPrimarySource, localizeCatalogTier, localizeDifficulty, localizeFieldPath, localizeSkillCategory, localizeUseCase, providerNames, scoreTone, skillBestFor } from '@/lib/helpers';

type SkillSortKey = 'overall' | 'name' | 'compatibility' | 'setup';
type SkillCatalogKey = 'all' | 'curated' | 'registry-validated' | 'registry-listed';

export function SkillsExplorer({ skills, locale }: { skills: Skill[]; locale: Locale }) {
  const copy = ui[locale];
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [skillType, setSkillType] = useState('all');
  const [provider, setProvider] = useState('all');
  const [catalogTier, setCatalogTier] = useState<SkillCatalogKey>('all');
  const [useCase, setUseCase] = useState('all');
  const [sortKey, setSortKey] = useState<SkillSortKey>('overall');

  const categories = useMemo(() => Array.from(new Set(skills.map((item) => item.categoryId))).sort(), [skills]);
  const skillTypes = useMemo(() => Array.from(new Set(skills.map((item) => item.skillType))).sort(), [skills]);
  const providers = useMemo(() => Array.from(new Set(skills.flatMap((item) => item.supportedProviderIds))).sort(), [skills]);
  const useCases = useMemo(() => Array.from(new Set(skills.flatMap((item) => skillBestFor(item)))).sort(), [skills]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return [...skills]
      .filter((item) => {
        const searchable = [
          item.name,
          item.category,
          item.subCategory ?? '',
          item.skillType,
          item.catalogTier,
          ...item.tags,
          ...item.worksWith,
          ...providerNames(item.supportedProviderIds),
          ...skillBestFor(item),
          ...item.capabilities,
        ]
          .join(' ')
          .toLowerCase();

        return (!q || searchable.includes(q))
          && (category === 'all' || item.categoryId === category)
          && (skillType === 'all' || item.skillType === skillType)
          && (provider === 'all' || item.supportedProviderIds.includes(provider as Skill['supportedProviderIds'][number]))
          && (catalogTier === 'all' || item.catalogTier === catalogTier)
          && (useCase === 'all' || skillBestFor(item).includes(useCase));
      })
      .sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name);
        if (sortKey === 'compatibility') return b.compatibilityScore - a.compatibilityScore || b.supportedProviderIds.length - a.supportedProviderIds.length;
        if (sortKey === 'setup') return easeOfSetupScore(b.installDifficulty, b.easeOfSetupScore) - easeOfSetupScore(a.installDifficulty, a.easeOfSetupScore) || a.name.localeCompare(b.name);
        return b.overallScore - a.overallScore || a.name.localeCompare(b.name);
      });
  }, [catalogTier, category, provider, query, skillType, skills, sortKey, useCase]);

  function clearFilters() {
    setQuery('');
    setCategory('all');
    setSkillType('all');
    setProvider('all');
    setCatalogTier('all');
    setUseCase('all');
    setSortKey('overall');
  }

  const curatedCount = skills.filter((item) => item.catalogTier === 'curated').length;
  const registryValidatedCount = skills.filter((item) => item.catalogTier === 'registry-validated').length;
  const registryListedCount = skills.filter((item) => item.catalogTier === 'registry-listed').length;

  return (
    <div className="space-y-6 md:space-y-7">
      <section className="panel p-5 md:p-6">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
          <div>
            <p className="text-label text-[var(--accent-2)]">{locale === 'en' ? 'Layered skill registry' : '分層技能 registry'}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl [text-wrap:balance]">
              {locale === 'en' ? 'Scale and trust are separated on purpose.' : '刻意把規模與信任分開呈現。'}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
              {locale === 'en'
                ? 'Curated reviews, registry-validated MCP servers, and broader registry-listed entries now share one live catalog—but each item keeps its own source trail and trust layer visible by default.'
                : '現在把人工 curated、registry 已驗證的 MCP server，以及更廣泛的 registry 收錄項目放進同一個 live catalog；但每個項目的來源軌跡與信任層級都會直接標出來。'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label={copy.labels.results} value={String(filtered.length)} />
            <MetricCard label={locale === 'en' ? 'Curated' : '人工 curated'} value={String(curatedCount)} />
            <MetricCard label={locale === 'en' ? 'Registry validated' : 'registry 已驗證'} value={String(registryValidatedCount)} />
            <MetricCard label={locale === 'en' ? 'Registry listed' : 'registry 已收錄'} value={String(registryListedCount)} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <label className="space-y-2 text-sm text-[var(--text-muted)] xl:col-span-2">
            <span>{copy.labels.search}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale === 'en' ? 'Search by skill, category, provider, or capability' : '依技能、分類、供應商或能力搜尋'}
              className="input-base"
            />
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.category}</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="input-base">
              <option value="all">{copy.labels.all}</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {localizeSkillCategory(locale, skills.find((skill) => skill.categoryId === item) ?? skills[0])}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{locale === 'en' ? 'Registry type' : 'Registry 類型'}</span>
            <select value={skillType} onChange={(event) => setSkillType(event.target.value)} className="input-base">
              <option value="all">{copy.labels.all}</option>
              {skillTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.catalogTier}</span>
            <select value={catalogTier} onChange={(event) => setCatalogTier(event.target.value as SkillCatalogKey)} className="input-base">
              <option value="all">{copy.labels.all}</option>
              <option value="curated">{localizeCatalogTier(locale, 'curated')}</option>
              <option value="registry-validated">{localizeCatalogTier(locale, 'registry-validated')}</option>
              <option value="registry-listed">{localizeCatalogTier(locale, 'registry-listed')}</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.supportedProviders}</span>
            <select value={provider} onChange={(event) => setProvider(event.target.value)} className="input-base">
              <option value="all">{copy.labels.all}</option>
              {providers.map((item) => (
                <option key={item} value={item}>
                  {providerNames([item as Skill['supportedProviderIds'][number]])[0]}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)] xl:col-start-6">
            <span>{copy.labels.bestFor}</span>
            <select value={useCase} onChange={(event) => setUseCase(event.target.value)} className="input-base">
              <option value="all">{copy.labels.all}</option>
              {useCases.map((item) => (
                <option key={item} value={item}>
                  {localizeUseCase(locale, item)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {[
            { key: 'overall' as const, label: copy.labels.sortTop },
            { key: 'compatibility' as const, label: copy.labels.compatibilitySupport },
            { key: 'setup' as const, label: copy.labels.setupDifficulty },
            { key: 'name' as const, label: copy.labels.name },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSortKey(option.key)}
              className={clsx(
                'chip text-sm transition',
                sortKey === option.key ? 'border-[var(--border-strong-2)] bg-[var(--accent-soft-2)] text-white' : 'text-[var(--text-muted)] hover:border-white/20 hover:bg-white/8 hover:text-white',
              )}
            >
              {option.label}
            </button>
          ))}
          <button type="button" onClick={clearFilters} className="chip ml-auto text-sm text-[var(--text-muted)] hover:border-white/20 hover:bg-white/8 hover:text-white">
            {copy.labels.clearFilters}
          </button>
        </div>
      </section>

      <section className="hidden overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] shadow-[var(--shadow-soft)] backdrop-blur-xl lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1460px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-[var(--surface-2)] text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted-2)]">
                <th className="px-5 py-4 font-medium">{copy.labels.name}</th>
                <th className="px-5 py-4 font-medium">{copy.labels.bestFor}</th>
                <th className="px-5 py-4 font-medium">{copy.labels.worksWith}</th>
                <th className="px-5 py-4 font-medium">{copy.labels.installMethod}</th>
                <th className="px-5 py-4 font-medium">{copy.labels.trustSignals}</th>
                <th className="px-5 py-4 font-medium">{copy.labels.viewDetails}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((skill, index) => {
                const primarySource = getPrimarySource(skill);
                const officialFieldPaths = getOfficialFieldPaths(skill);

                return (
                  <tr key={skill.slug} className={clsx('border-b border-white/6 align-top text-[15px] text-slate-200 transition hover:bg-[var(--accent-soft-2)]', index % 2 === 0 ? 'bg-white/[0.015]' : undefined)}>
                    <td className="px-5 py-5">
                      <div className="min-w-[18rem] max-w-[21rem]">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-base font-semibold text-white">{skill.displayName}</div>
                              <span className="chip text-[11px] text-[var(--accent-2)]">{localizeCatalogTier(locale, skill.catalogTier)}</span>
                            </div>
                            <div className="mt-1 text-sm text-[var(--text-muted)]">{localizeSkillCategory(locale, skill)}{skill.subCategory ? ` · ${skill.subCategory}` : ''} · {skill.skillType}</div>
                          </div>
                          <div className={clsx('rounded-2xl border border-white/10 bg-gradient-to-br px-3 py-2 text-right', scoreTone(skill.overallScore))}>
                            <div className="text-[11px] uppercase tracking-[0.2em] text-white/65">Score</div>
                            <div className="text-xl font-semibold text-white">{skill.overallScore}</div>
                          </div>
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">{pick(locale, skill.summary)}</p>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex max-w-[14rem] flex-wrap gap-2">
                        {skillBestFor(skill).map((item) => (
                          <span key={item} className="chip text-xs text-[var(--text-muted)]">
                            {localizeUseCase(locale, item)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="max-w-[18rem] space-y-2 text-sm">
                        <div className="text-white">{providerNames(skill.supportedProviderIds).join(' · ')}</div>
                        <div className="text-[var(--text-muted)]">{skill.worksWith.slice(0, 3).join(' · ')}</div>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="min-w-[15rem] space-y-2 text-sm">
                        <div className="text-white">{skill.installMethod} · {skill.deployment}</div>
                        <div className="text-[var(--text-muted)]">{localizeDifficulty(locale, skill.installDifficulty)} · {copy.labels.supportedHosts}: {skill.supportedHosts.slice(0, 2).join(' / ')}</div>
                        <div className="text-[var(--accent-2)]">{locale === 'en' ? 'Permission' : '權限'}: {skill.permissionProfile?.level ?? '—'}</div>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="min-w-[15rem] space-y-2 text-sm">
                        <div className="chip inline-flex text-[11px] text-[var(--text-muted)]">{localizeCatalogTier(locale, skill.catalogTier)}</div>
                        <a href={primarySource.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-[var(--accent)] hover:text-white">
                          {primarySource.label} ↗
                        </a>
                        <div className="text-[var(--text-muted)]">{copy.labels.lastVerified}: {formatDate(locale, skill.lastVerifiedAt)}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {(officialFieldPaths.length ? officialFieldPaths : ['summary']).slice(0, 3).map((fieldPath) => (
                            <span key={fieldPath} className="chip text-[11px] text-[var(--text-muted)]">
                              {localizeFieldPath(locale, fieldPath)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <Link href={`/${locale}/skills/${skill.slug}`} className="btn-primary">
                        {copy.labels.viewDetails}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-4 lg:hidden">
        {filtered.map((skill) => {
          const primarySource = getPrimarySource(skill);
          const officialFieldPaths = getOfficialFieldPaths(skill);

          return (
            <article key={skill.slug} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-[var(--text-muted)]">{localizeSkillCategory(locale, skill)}{skill.subCategory ? ` · ${skill.subCategory}` : ''} · {skill.skillType}</div>
                  <h3 className="mt-1 text-xl font-semibold text-white">{skill.displayName}</h3>
                  <div className="mt-2 inline-flex chip text-[11px] text-[var(--accent-2)]">{localizeCatalogTier(locale, skill.catalogTier)}</div>
                </div>
                <div className={clsx('rounded-2xl border border-white/10 bg-gradient-to-br px-3 py-2 text-right', scoreTone(skill.overallScore))}>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/65">Score</div>
                  <div className="text-xl font-semibold text-white">{skill.overallScore}</div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{pick(locale, skill.summary)}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoBlock label={copy.labels.catalogTier} value={localizeCatalogTier(locale, skill.catalogTier)} />
                <InfoBlock label={copy.labels.bestFor} value={skillBestFor(skill).map((item) => localizeUseCase(locale, item)).join(' · ')} />
                <InfoBlock label={copy.labels.worksWith} value={skill.worksWith.slice(0, 3).join(' · ')} />
                <InfoBlock label={copy.labels.installMethod} value={`${skill.installMethod} · ${skill.deployment}`} />
                <InfoBlock label={copy.labels.supportedProviders} value={providerNames(skill.supportedProviderIds).join(' · ')} />
                <InfoBlock label={copy.labels.supportedHosts} value={skill.supportedHosts.join(' · ')} />
                <InfoBlock label={copy.labels.lastVerified} value={formatDate(locale, skill.lastVerifiedAt)} />
                <InfoBlock label={copy.labels.sourceSignals} value={(officialFieldPaths.length ? officialFieldPaths : ['summary']).slice(0, 3).map((fieldPath) => localizeFieldPath(locale, fieldPath)).join(' · ')} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <a href={primarySource.url} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
                  {copy.labels.preferredSource} ↗
                </a>
                <Link href={`/${locale}/skills/${skill.slug}`} className="btn-primary ml-auto">
                  {copy.labels.viewDetails}
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {!filtered.length ? (
        <div className="rounded-[28px] border border-dashed border-white/12 bg-white/4 p-10 text-center text-[var(--text-muted)]">{copy.labels.noResults}</div>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel-subtle p-4">
      <div className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted-2)]">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel-subtle p-3.5">
      <div className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted-2)]">{label}</div>
      <div className="mt-2 text-sm leading-6 text-white">{value || '—'}</div>
    </div>
  );
}
