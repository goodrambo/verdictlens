'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Locale, Skill } from '@/lib/types';
import { pick, ui } from '@/lib/i18n';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { easeOfSetupScore, getPrimarySource, localizeCatalogTier, localizeDifficulty, localizeSkillCategory, localizeUseCase, providerNames, scoreTone, skillBestFor } from '@/lib/helpers';

type SkillSortKey = 'overall' | 'name' | 'compatibility' | 'setup';
type SkillCatalogKey = 'all' | 'curated' | 'registry-validated' | 'registry-listed';

const PAGE_SIZE = 9;

export function SkillsExplorer({ skills, locale }: { skills: Skill[]; locale: Locale }) {
  const copy = ui[locale];
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [skillType, setSkillType] = useState('all');
  const [provider, setProvider] = useState('all');
  const [catalogTier, setCatalogTier] = useState<SkillCatalogKey>('all');
  const [useCase, setUseCase] = useState('all');
  const [sortKey, setSortKey] = useState<SkillSortKey>('overall');
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [currentPage, filtered]);

  useEffect(() => {
    setPage(readPageFromLocation());
  }, []);

  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
      syncPageInUrl(currentPage);
    }
  }, [currentPage, page]);

  function updatePage(nextPage: number) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setPage(safePage);
    syncPageInUrl(safePage);
  }

  function clearFilters() {
    setQuery('');
    setCategory('all');
    setSkillType('all');
    setProvider('all');
    setCatalogTier('all');
    setUseCase('all');
    setSortKey('overall');
    updatePage(1);
  }

  const curatedCount = skills.filter((item) => item.catalogTier === 'curated').length;
  const registryValidatedCount = skills.filter((item) => item.catalogTier === 'registry-validated').length;
  const registryListedCount = skills.filter((item) => item.catalogTier === 'registry-listed').length;

  return (
    <div className="space-y-6 md:space-y-7">
      <section className="panel p-5 md:p-6">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
          <div>
            <p className="text-label text-[var(--accent-2)]">{locale === 'en' ? 'Tools and integrations' : '工具與整合'}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl [text-wrap:balance]">
              {locale === 'en' ? 'Find useful AI tools without decoding the whole catalog.' : '不用先讀懂整個目錄，也能先找到有用的 AI 工具。'}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
              {locale === 'en'
                ? 'Use the first pass to answer four quick questions: what does it help with, who is it for, how much setup does it need, and where should you click next?'
                : '第一輪先回答四個問題就夠了：它在幫什麼、適合誰、設定大概多麻煩，以及下一步該點哪裡。'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label={copy.labels.results} value={String(filtered.length)} />
            <MetricCard label={locale === 'en' ? 'Editor-reviewed' : '編輯精選'} value={String(curatedCount)} />
            <MetricCard label={locale === 'en' ? 'Verified listings' : '已驗證收錄'} value={String(registryValidatedCount)} />
            <MetricCard label={locale === 'en' ? 'Directory listings' : '目錄收錄'} value={String(registryListedCount)} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <label className="space-y-2 text-sm text-[var(--text-muted)] xl:col-span-2">
            <span>{copy.labels.search}</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                updatePage(1);
              }}
              placeholder={locale === 'en' ? 'Search by tool, category, provider, or capability' : '依工具、分類、供應商或能力搜尋'}
              className="input-base"
            />
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.category}</span>
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                updatePage(1);
              }}
              className="input-base"
            >
              <option value="all">{copy.labels.all}</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {localizeSkillCategory(locale, skills.find((skill) => skill.categoryId === item) ?? skills[0])}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{locale === 'en' ? 'Skill type' : '技能類型'}</span>
            <select
              value={skillType}
              onChange={(event) => {
                setSkillType(event.target.value);
                updatePage(1);
              }}
              className="input-base"
            >
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
            <select
              value={catalogTier}
              onChange={(event) => {
                setCatalogTier(event.target.value as SkillCatalogKey);
                updatePage(1);
              }}
              className="input-base"
            >
              <option value="all">{copy.labels.all}</option>
              <option value="curated">{localizeCatalogTier(locale, 'curated')}</option>
              <option value="registry-validated">{localizeCatalogTier(locale, 'registry-validated')}</option>
              <option value="registry-listed">{localizeCatalogTier(locale, 'registry-listed')}</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.supportedProviders}</span>
            <select
              value={provider}
              onChange={(event) => {
                setProvider(event.target.value);
                updatePage(1);
              }}
              className="input-base"
            >
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
            <select
              value={useCase}
              onChange={(event) => {
                setUseCase(event.target.value);
                updatePage(1);
              }}
              className="input-base"
            >
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
              onClick={() => {
                setSortKey(option.key);
                updatePage(1);
              }}
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

      {filtered.length ? (
        <PaginationControls locale={locale} currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={updatePage} />
      ) : null}

      <section className="hidden overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] shadow-[var(--shadow-soft)] backdrop-blur-xl lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1160px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-[var(--surface-2)] text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted-2)]">
                <th className="px-5 py-4 font-medium">{copy.labels.name}</th>
                <th className="px-5 py-4 font-medium">{copy.labels.bestFor}</th>
                <th className="px-5 py-4 font-medium">{locale === 'en' ? 'Setup snapshot' : '安裝摘要'}</th>
                <th className="px-5 py-4 font-medium">{copy.labels.viewDetails}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((skill, index) => {
                const primarySource = getPrimarySource(skill);

                return (
                  <tr key={skill.slug} className={clsx('border-b border-white/6 align-top text-[15px] text-slate-200 transition hover:bg-[var(--accent-soft-2)]', index % 2 === 0 ? 'bg-white/[0.015]' : undefined)}>
                    <td className="px-5 py-5">
                      <div className="min-w-[19rem] max-w-[24rem]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="chip text-[11px] text-[var(--accent-2)]">{localizeCatalogTier(locale, skill.catalogTier)}</span>
                          <span className={clsx('rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium', scoreTone(skill.overallScore))}>
                            {copy.labels.overallScore}: {skill.overallScore}
                          </span>
                        </div>
                        <div className="mt-2 text-lg font-semibold text-white">{skill.displayName}</div>
                        <div className="mt-1 text-sm text-[var(--text-muted)]">{localizeSkillCategory(locale, skill)}{skill.subCategory ? ` · ${skill.subCategory}` : ''} · {skill.skillType}</div>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">{pick(locale, skill.summary)}</p>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex max-w-[15rem] flex-wrap gap-2">
                        {skillBestFor(skill).slice(0, 3).map((item) => (
                          <span key={item} className="chip text-xs text-[var(--text-muted)]">
                            {localizeUseCase(locale, item)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="min-w-[16rem] space-y-2 text-sm">
                        <div className="text-white">{skill.installMethod} · {skill.deployment}</div>
                        <div className="text-[var(--text-muted)]">{localizeDifficulty(locale, skill.installDifficulty)} · {providerNames(skill.supportedProviderIds).slice(0, 3).join(' · ') || '—'}</div>
                        <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                          {skill.supportedHosts.slice(0, 2).map((host) => (
                            <span key={host} className="chip">{host}</span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex min-w-[16rem] flex-wrap items-center gap-2">
                        <a href={primarySource.url} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
                          {copy.labels.preferredSource} ↗
                        </a>
                        <Link href={`/${locale}/skills/${skill.slug}`} className="btn-primary">
                          {copy.labels.viewDetails}
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-4 lg:hidden">
        {paginated.map((skill) => {
          const primarySource = getPrimarySource(skill);

          return (
            <article key={skill.slug} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip text-[11px] text-[var(--accent-2)]">{localizeCatalogTier(locale, skill.catalogTier)}</span>
                    <span className="text-sm text-[var(--text-muted)]">{localizeSkillCategory(locale, skill)}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-white">{skill.displayName}</h3>
                </div>
                <span className={clsx('rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium', scoreTone(skill.overallScore))}>
                  {skill.overallScore}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">{pick(locale, skill.summary)}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {skillBestFor(skill).slice(0, 2).map((item) => (
                  <span key={item} className="chip text-xs text-[var(--text-muted)]">
                    {localizeUseCase(locale, item)}
                  </span>
                ))}
                <span className="chip text-xs text-[var(--text-muted)]">{localizeDifficulty(locale, skill.installDifficulty)}</span>
              </div>

              <div className="mt-4 panel-subtle p-3.5 text-sm">
                <div className="text-white">{skill.installMethod} · {skill.deployment}</div>
                <div className="mt-1 text-[var(--text-muted)]">{providerNames(skill.supportedProviderIds).slice(0, 3).join(' · ') || '—'}</div>
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

      {filtered.length ? (
        <PaginationControls locale={locale} currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={updatePage} />
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

function readPageFromLocation() {
  if (typeof window === 'undefined') return 1;

  const raw = Number(new URLSearchParams(window.location.search).get('page') ?? '1');
  return Number.isFinite(raw) ? Math.max(1, Math.floor(raw)) : 1;
}

function syncPageInUrl(page: number) {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  if (page <= 1) url.searchParams.delete('page');
  else url.searchParams.set('page', String(page));
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}
