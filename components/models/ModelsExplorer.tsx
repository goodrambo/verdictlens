'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Locale, Model } from '@/lib/types';
import { pick, ui } from '@/lib/i18n';
import { getProvider, localizeSpeed, localizeUseCase, scoreTone, speedRank } from '@/lib/helpers';

type ModelSortKey = 'overall' | 'name' | 'provider' | 'cost' | 'speed';
type SortDirection = 'asc' | 'desc';

export function ModelsExplorer({ models, locale }: { models: Model[]; locale: Locale }) {
  const copy = ui[locale];
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('all');
  const [speed, setSpeed] = useState('all');
  const [useCase, setUseCase] = useState('all');
  const [sortKey, setSortKey] = useState<ModelSortKey>('overall');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const providers = useMemo(
    () => Array.from(new Set(models.map((item) => item.providerId))).map((providerId) => getProvider(providerId)).sort((a, b) => a.name.localeCompare(b.name)),
    [models],
  );
  const useCases = useMemo(() => Array.from(new Set(models.flatMap((item) => item.bestUseCases))), [models]);

  const rankMap = useMemo(
    () =>
      Object.fromEntries(
        [...models]
          .sort((a, b) => b.overallScore - a.overallScore || a.name.localeCompare(b.name))
          .map((item, index) => [item.slug, index + 1]),
      ),
    [models],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = models.filter((item) => {
      const providerName = getProvider(item.providerId).name;
      const text = `${item.name} ${providerName} ${item.tags.join(' ')} ${item.bestUseCases.join(' ')}`.toLowerCase();
      return (
        (!q || text.includes(q)) &&
        (provider === 'all' || item.providerId === provider) &&
        (speed === 'all' || item.speedCategory === speed) &&
        (useCase === 'all' || item.bestUseCases.includes(useCase))
      );
    });

    const direction = sortDirection === 'asc' ? 1 : -1;

    return result.sort((a, b) => {
      let value = 0;

      if (sortKey === 'name') value = a.name.localeCompare(b.name);
      else if (sortKey === 'provider') value = getProvider(a.providerId).name.localeCompare(getProvider(b.providerId).name) || b.overallScore - a.overallScore;
      else if (sortKey === 'cost') value = a.scores.costEfficiency - b.scores.costEfficiency || a.name.localeCompare(b.name);
      else if (sortKey === 'speed') value = speedRank(a.speedCategory) - speedRank(b.speedCategory) || b.overallScore - a.overallScore;
      else value = a.overallScore - b.overallScore || a.name.localeCompare(b.name);

      return value * direction;
    });
  }, [models, provider, query, sortDirection, sortKey, speed, useCase]);

  function updateSort(nextKey: ModelSortKey) {
    if (nextKey === sortKey) {
      setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === 'name' || nextKey === 'provider' ? 'asc' : 'desc');
  }

  function clearFilters() {
    setQuery('');
    setProvider('all');
    setSpeed('all');
    setUseCase('all');
    setSortKey('overall');
    setSortDirection('desc');
  }

  const sortOptions: { key: ModelSortKey; label: string }[] = [
    { key: 'overall', label: copy.labels.sortTop },
    { key: 'cost', label: copy.labels.sortCost },
    { key: 'speed', label: copy.labels.sortFast },
    { key: 'name', label: copy.labels.name },
    { key: 'provider', label: copy.labels.provider },
  ];

  const activeFilterCount = [query, provider !== 'all', speed !== 'all', useCase !== 'all'].filter(Boolean).length;
  const leader = filtered[0];

  return (
    <div className="space-y-6 md:space-y-7">
      <section className="panel p-4 md:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-label text-[var(--accent)]">{locale === 'en' ? 'AI model directory' : 'AI 模型目錄'}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl [text-wrap:balance]">
              {locale === 'en' ? 'A shortlist-ready view with official links built in.' : '把 shortlist 需要的資訊與官方連結直接放進列表。'}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
              {locale === 'en'
                ? 'Score, pricing, speed, provider, and official site stay close together so you can scan faster before opening detail pages.'
                : '把分數、價格、速度、供應商與官方網站放在相近位置，先快速判斷，再決定要不要進詳情頁。'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[28rem]">
            <MetricCard label={copy.labels.results} value={String(filtered.length)} tone="accent" />
            <MetricCard label={copy.labels.overallScore} value={leader ? String(leader.overallScore) : '—'} tone="secondary" />
            <MetricCard label={locale === 'en' ? 'Leading provider' : '目前領先供應商'} value={leader ? getProvider(leader.providerId).shortName : '—'} tone="neutral" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.search}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale === 'en' ? 'Search by model, provider, tag, or use case' : '依模型、供應商、標籤或場景搜尋'}
              className="input-base"
            />
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.provider}</span>
            <select value={provider} onChange={(event) => setProvider(event.target.value)} className="input-base">
              <option value="all">{copy.labels.all}</option>
              {providers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.speed}</span>
            <select value={speed} onChange={(event) => setSpeed(event.target.value)} className="input-base">
              <option value="all">{copy.labels.all}</option>
              <option value="Fast">{localizeSpeed(locale, 'Fast')}</option>
              <option value="Balanced">{localizeSpeed(locale, 'Balanced')}</option>
              <option value="Deliberate">{localizeSpeed(locale, 'Deliberate')}</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.useCase}</span>
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
          {sortOptions.map((option) => {
            const active = sortKey === option.key;
            return (
              <button key={option.key} type="button" onClick={() => updateSort(option.key)} className={clsx('chip text-sm transition', active ? 'border-[var(--border-strong)] bg-[var(--accent-soft)] text-[var(--accent-contrast)]' : 'text-[var(--text-muted)] hover:border-white/20 hover:bg-white/8 hover:text-white')}>
                {option.label}
                {active ? <span className="text-xs opacity-70">{sortDirection === 'desc' ? '↓' : '↑'}</span> : null}
              </button>
            );
          })}

          <button type="button" onClick={clearFilters} className="chip ml-auto text-sm text-[var(--text-muted)] hover:border-white/20 hover:bg-white/8 hover:text-white">
            {copy.labels.clearFilters}
            {activeFilterCount ? <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">{activeFilterCount}</span> : null}
          </button>
        </div>
      </section>

      {filtered.length ? (
        <>
          <section className="hidden overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] shadow-[var(--shadow-soft)] backdrop-blur-xl lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1260px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-[var(--surface-2)] text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted-2)]">
                    <SortableHead label={copy.labels.rank} active={sortKey === 'overall'} direction={sortDirection} onClick={() => updateSort('overall')} />
                    <SortableHead label={copy.labels.name} active={sortKey === 'name'} direction={sortDirection} onClick={() => updateSort('name')} wide />
                    <SortableHead label={copy.labels.provider} active={sortKey === 'provider'} direction={sortDirection} onClick={() => updateSort('provider')} />
                    <SortableHead label={copy.labels.overallScore} active={sortKey === 'overall'} direction={sortDirection} onClick={() => updateSort('overall')} />
                    <th className="px-5 py-4 font-medium">{copy.labels.pricing}</th>
                    <SortableHead label={copy.labels.speed} active={sortKey === 'speed'} direction={sortDirection} onClick={() => updateSort('speed')} />
                    <th className="px-5 py-4 font-medium">{copy.labels.bestFor}</th>
                    <th className="px-5 py-4 font-medium">{copy.labels.officialLink}</th>
                    <th className="px-5 py-4 font-medium">{copy.labels.viewDetails}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((model, index) => {
                    const providerInfo = getProvider(model.providerId);
                    return (
                      <tr key={model.slug} className={clsx('border-b border-white/6 align-top text-[15px] text-slate-200 transition hover:bg-[var(--accent-soft)]', index % 2 === 0 ? 'bg-white/[0.015]' : undefined)}>
                        <td className="px-5 py-5">
                          <div className="inline-flex min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-sm font-semibold text-white">
                            #{rankMap[model.slug]}
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <div className="min-w-[18rem] max-w-[22rem]">
                            <div className="text-base font-semibold text-white">{model.name}</div>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">{pick(locale, model.description)}</p>
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-slate-200">{providerInfo.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <div className={clsx('inline-flex min-w-[5.75rem] flex-col rounded-[22px] border border-white/10 bg-gradient-to-br px-3 py-2.5', scoreTone(model.overallScore))}>
                            <span className="text-[11px] uppercase tracking-[0.22em] text-white/60">Score</span>
                            <span className="mt-1 text-2xl font-semibold text-white">{model.overallScore}</span>
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <div className="min-w-[11.5rem] space-y-1 text-sm leading-6">
                            <div className="text-white"><span className="text-[var(--text-muted-2)]">{locale === 'en' ? 'Input' : '輸入'}</span> {model.pricing.input}</div>
                            <div className="text-[var(--text-muted)]"><span className="text-[var(--text-muted-2)]">{locale === 'en' ? 'Output' : '輸出'}</span> {model.pricing.output}</div>
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <span className="inline-flex rounded-full border border-[var(--border-strong)] bg-[var(--accent-soft)] px-3 py-1.5 text-sm text-[var(--accent-contrast)]">
                            {localizeSpeed(locale, model.speedCategory)}
                          </span>
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex max-w-[16rem] flex-wrap gap-2">
                            {model.bestUseCases.map((item) => (
                              <span key={item} className="chip bg-[var(--surface-2)] text-xs text-[var(--text-muted)]">
                                {localizeUseCase(locale, item)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <a href={model.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm text-[var(--accent)] transition hover:text-white">
                            {copy.labels.officialSite} ↗
                          </a>
                        </td>
                        <td className="px-5 py-5">
                          <Link href={`/${locale}/models/${model.slug}`} className="btn-primary">
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

          <section className="grid gap-4 md:grid-cols-2 lg:hidden">
            {filtered.map((model) => {
              const providerInfo = getProvider(model.providerId);
              return (
                <article key={model.slug} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                        #{rankMap[model.slug]} · {providerInfo.shortName}
                      </div>
                      <h3 className="mt-3 text-xl font-semibold text-white">{model.name}</h3>
                    </div>
                    <div className={clsx('rounded-[22px] border border-white/10 bg-gradient-to-br px-3 py-2 text-right', scoreTone(model.overallScore))}>
                      <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">{copy.labels.overallScore}</div>
                      <div className="mt-1 text-2xl font-semibold text-white">{model.overallScore}</div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{pick(locale, model.description)}</p>

                  <div className="mt-4 grid gap-3 rounded-[24px] border border-white/8 bg-[var(--surface-2)] p-4 text-sm md:grid-cols-2">
                    <InfoPair label={copy.labels.pricing} value={`${locale === 'en' ? 'Input' : '輸入'} ${model.pricing.input} · ${locale === 'en' ? 'Output' : '輸出'} ${model.pricing.output}`} />
                    <InfoPair label={copy.labels.speed} value={localizeSpeed(locale, model.speedCategory)} />
                    <InfoPair label={copy.labels.contextWindow} value={model.contextWindow} />
                    <InfoPair label={copy.labels.bestFor} value={model.bestUseCases.map((item) => localizeUseCase(locale, item)).join(' · ')} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {model.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="chip text-xs text-[var(--text-muted)]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <a href={model.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm text-[var(--accent)] transition hover:text-white">
                      {copy.labels.officialSite} ↗
                    </a>
                    <Link href={`/${locale}/models/${model.slug}`} className="btn-primary ml-auto">
                      {copy.labels.viewDetails}
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      ) : (
        <div className="rounded-[28px] border border-dashed border-white/12 bg-white/4 p-10 text-center text-[var(--text-muted)]">{copy.labels.noResults}</div>
      )}
    </div>
  );
}

function SortableHead({
  label,
  active,
  direction,
  onClick,
  wide = false,
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <th className={clsx('px-5 py-4 font-medium', wide ? 'min-w-[20rem]' : undefined)}>
      <button type="button" onClick={onClick} className={clsx('inline-flex items-center gap-2 transition', active ? 'text-white' : 'hover:text-slate-200')}>
        {label}
        <span className="text-[11px] text-[var(--text-muted-2)]">{active ? (direction === 'desc' ? '↓' : '↑') : '↕'}</span>
      </button>
    </th>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: 'accent' | 'secondary' | 'neutral' }) {
  const toneClass =
    tone === 'accent'
      ? 'border-[var(--border-strong)] bg-[var(--accent-soft)] text-[var(--accent-contrast)]'
      : tone === 'secondary'
        ? 'border-[var(--border-strong-2)] bg-[var(--accent-soft-2)] text-white'
        : 'border-white/10 bg-white/5 text-white';

  return (
    <div className={clsx('rounded-[24px] border px-4 py-3.5', toneClass)}>
      <div className="text-[11px] uppercase tracking-[0.24em] text-white/60">{label}</div>
      <div className="mt-2 text-xl font-semibold leading-7">{value}</div>
    </div>
  );
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted-2)]">{label}</div>
      <div className="mt-2 text-sm leading-6 text-white">{value}</div>
    </div>
  );
}
