'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';
import { Locale, Model } from '@/lib/types';
import { pick, ui } from '@/lib/i18n';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { compareHref, getPrimarySource, getProvider, localizeSpeed, localizeUseCase, modelBestFor, scoreTone, speedRank } from '@/lib/helpers';

type ModelSortKey = 'overall' | 'name' | 'cost' | 'speed';

const PAGE_SIZE = 8;

export function ModelsExplorer({ models, locale }: { models: Model[]; locale: Locale }) {
  const copy = ui[locale];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('all');
  const [useCase, setUseCase] = useState('all');
  const [sortKey, setSortKey] = useState<ModelSortKey>('overall');
  const [compareSelection, setCompareSelection] = useState<string[]>([]);

  const providers = useMemo(
    () => Array.from(new Set(models.map((item) => item.providerId))).map((providerId) => getProvider(providerId)).sort((a, b) => a.name.localeCompare(b.name)),
    [models],
  );
  const useCases = useMemo(() => Array.from(new Set(models.flatMap((item) => modelBestFor(item)))).sort(), [models]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return [...models]
      .filter((item) => {
        const providerName = getProvider(item.providerId).name;
        const searchable = [
          item.name,
          providerName,
          ...item.tags,
          ...item.worksWith,
          ...modelBestFor(item),
        ]
          .join(' ')
          .toLowerCase();

        return (!q || searchable.includes(q)) && (provider === 'all' || item.providerId === provider) && (useCase === 'all' || modelBestFor(item).includes(useCase));
      })
      .sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name);
        if (sortKey === 'cost') return b.scores.costEfficiency - a.scores.costEfficiency || a.name.localeCompare(b.name);
        if (sortKey === 'speed') return speedRank(b.speedCategory) - speedRank(a.speedCategory) || b.overallScore - a.overallScore;
        return b.overallScore - a.overallScore || a.name.localeCompare(b.name);
      });
  }, [models, provider, query, sortKey, useCase]);

  const rawPage = Number(searchParams.get('page') ?? '1');
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(Number.isFinite(rawPage) ? Math.floor(rawPage) : 1, 1), totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [currentPage, filtered]);

  const selectedModels = compareSelection.map((slug) => models.find((item) => item.slug === slug)).filter(Boolean) as Model[];

  function updatePage(nextPage: number) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    const params = new URLSearchParams(searchParams.toString());

    if (safePage <= 1) params.delete('page');
    else params.set('page', String(safePage));

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }

  function clearFilters() {
    setQuery('');
    setProvider('all');
    setUseCase('all');
    setSortKey('overall');
    updatePage(1);
  }

  function toggleCompare(slug: string) {
    setCompareSelection((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug);
      if (current.length >= 3) return [...current.slice(1), slug];
      return [...current, slug];
    });
  }

  return (
    <div className="space-y-6 md:space-y-7">
      <section className="panel p-5 md:p-6">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
          <div>
            <p className="text-label text-[var(--accent)]">{locale === 'en' ? 'Discovery → shortlist → compare' : 'Discovery → shortlist → compare'}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl [text-wrap:balance]">
              {locale === 'en' ? 'A lighter directory surface for faster first-pass decisions.' : '先用更輕的目錄表面，幫你更快做第一輪篩選。'}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
              {locale === 'en'
                ? 'The list now focuses on who the model is for, what the price/speed snapshot looks like, and how to jump into details or compare mode. Deeper context stays on the detail page.'
                : '列表現在只優先顯示這個模型適合誰、價格與速度大概如何，以及怎麼進入詳情或 compare；更深的資訊放回 detail page。'}
            </p>
          </div>

          <div className="panel-subtle p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{copy.labels.compareShortlist}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{copy.compare.shortlistHint}</p>
              </div>
              <span className="inline-flex min-w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 px-3 py-1 text-sm font-semibold text-white">
                {selectedModels.length}/3
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {selectedModels.length ? (
                selectedModels.map((model) => (
                  <div key={model.slug} className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-white">{model.name}</div>
                      <div className="truncate text-xs text-[var(--text-muted)]">{getProvider(model.providerId).name}</div>
                    </div>
                    <button type="button" onClick={() => toggleCompare(model.slug)} className="text-xs text-[var(--text-muted)] transition hover:text-white">
                      {copy.labels.removeFromCompare}
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 px-3 py-4 text-sm text-[var(--text-muted)]">
                  {locale === 'en' ? 'Pick models from the directory to start a shortlist.' : '先從列表挑模型，開始建立 shortlist。'}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={compareHref(locale, compareSelection)}
                className={clsx('btn-primary', selectedModels.length < 2 && 'pointer-events-none opacity-50')}
              >
                {copy.labels.compareSelected}
              </Link>
              <button type="button" onClick={() => setCompareSelection([])} className="btn-secondary text-sm">
                {copy.labels.clearSelection}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.search}</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                updatePage(1);
              }}
              placeholder={locale === 'en' ? 'Search by model, provider, workflow, or integration' : '依模型、供應商、工作流或整合搜尋'}
              className="input-base"
            />
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.provider}</span>
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
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
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
            { key: 'cost' as const, label: copy.labels.sortCost },
            { key: 'speed' as const, label: copy.labels.sortFast },
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
                sortKey === option.key ? 'border-[var(--border-strong)] bg-[var(--accent-soft)] text-[var(--accent-contrast)]' : 'text-[var(--text-muted)] hover:border-white/20 hover:bg-white/8 hover:text-white',
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
          <table className="w-full min-w-[1120px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-[var(--surface-2)] text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted-2)]">
                <th className="px-5 py-4 font-medium">{copy.labels.name}</th>
                <th className="px-5 py-4 font-medium">{copy.labels.bestFor}</th>
                <th className="px-5 py-4 font-medium">{locale === 'en' ? 'Snapshot' : '快速摘要'}</th>
                <th className="px-5 py-4 font-medium">{copy.labels.viewDetails}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((model, index) => {
                const providerInfo = getProvider(model.providerId);
                const primarySource = getPrimarySource(model);
                const selected = compareSelection.includes(model.slug);

                return (
                  <tr key={model.slug} className={clsx('border-b border-white/6 align-top text-[15px] text-slate-200 transition hover:bg-[var(--accent-soft)]', index % 2 === 0 ? 'bg-white/[0.015]' : undefined)}>
                    <td className="px-5 py-5">
                      <div className="min-w-[18rem] max-w-[24rem]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm text-[var(--text-muted)]">{providerInfo.name}</span>
                          <span className={clsx('rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium', scoreTone(model.overallScore))}>
                            {copy.labels.overallScore}: {model.overallScore}
                          </span>
                        </div>
                        <div className="mt-2 text-lg font-semibold text-white">{model.displayName}</div>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">{pick(locale, model.summary)}</p>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex max-w-[14rem] flex-wrap gap-2">
                        {modelBestFor(model).slice(0, 3).map((item) => (
                          <span key={item} className="chip text-xs text-[var(--text-muted)]">
                            {localizeUseCase(locale, item)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="min-w-[15rem] space-y-2 text-sm">
                        <div className="text-white">{model.pricing.input}</div>
                        <div className="text-[var(--text-muted)]">{model.pricing.output}</div>
                        <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                          <span className="chip">{localizeSpeed(locale, model.speedCategory)}</span>
                          <span className="chip">{model.contextWindow}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex min-w-[16rem] flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleCompare(model.slug)}
                          className={clsx('rounded-full border px-3.5 py-2 text-sm font-medium transition', selected ? 'border-[var(--border-strong)] bg-[var(--accent-soft)] text-[var(--accent-contrast)]' : 'border-white/10 bg-white/5 text-[var(--text-muted)] hover:border-white/20 hover:bg-white/8 hover:text-white')}
                        >
                          {selected ? copy.labels.removeFromCompare : copy.labels.addToCompare}
                        </button>
                        <a href={primarySource.url} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
                          {copy.labels.officialLink} ↗
                        </a>
                        <Link href={`/${locale}/models/${model.slug}`} className="btn-primary">
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
        {paginated.map((model) => {
          const providerInfo = getProvider(model.providerId);
          const primarySource = getPrimarySource(model);
          const selected = compareSelection.includes(model.slug);

          return (
            <article key={model.slug} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm text-[var(--text-muted)]">{providerInfo.name}</div>
                  <h3 className="mt-1 text-xl font-semibold text-white">{model.displayName}</h3>
                </div>
                <span className={clsx('rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium', scoreTone(model.overallScore))}>
                  {model.overallScore}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">{pick(locale, model.summary)}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {modelBestFor(model).slice(0, 2).map((item) => (
                  <span key={item} className="chip text-xs text-[var(--text-muted)]">
                    {localizeUseCase(locale, item)}
                  </span>
                ))}
                <span className="chip text-xs text-[var(--text-muted)]">{localizeSpeed(locale, model.speedCategory)}</span>
                <span className="chip text-xs text-[var(--text-muted)]">{model.contextWindow}</span>
              </div>

              <div className="mt-4 panel-subtle p-3.5 text-sm">
                <div className="text-white">{model.pricing.input}</div>
                <div className="mt-1 text-[var(--text-muted)]">{model.pricing.output}</div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleCompare(model.slug)}
                  className={clsx('rounded-full border px-3.5 py-2 text-sm font-medium transition', selected ? 'border-[var(--border-strong)] bg-[var(--accent-soft)] text-[var(--accent-contrast)]' : 'border-white/10 bg-white/5 text-[var(--text-muted)] hover:border-white/20 hover:bg-white/8 hover:text-white')}
                >
                  {selected ? copy.labels.removeFromCompare : copy.labels.addToCompare}
                </button>
                <a href={primarySource.url} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
                  {copy.labels.officialLink} ↗
                </a>
                <Link href={`/${locale}/models/${model.slug}`} className="btn-primary ml-auto">
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
