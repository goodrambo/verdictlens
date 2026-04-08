'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Model, Locale } from '@/lib/types';
import { ui, pick } from '@/lib/i18n';
import { localizeSpeed, localizeUseCase, scoreTone, speedRank } from '@/lib/helpers';

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

  const providers = useMemo(() => Array.from(new Set(models.map((item) => item.provider))).sort(), [models]);
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
      const text = `${item.name} ${item.provider} ${item.tags.join(' ')} ${item.bestUseCases.join(' ')}`.toLowerCase();
      return (
        (!q || text.includes(q)) &&
        (provider === 'all' || item.provider === provider) &&
        (speed === 'all' || item.speedCategory === speed) &&
        (useCase === 'all' || item.bestUseCases.includes(useCase))
      );
    });

    const direction = sortDirection === 'asc' ? 1 : -1;

    return result.sort((a, b) => {
      let value = 0;

      if (sortKey === 'name') value = a.name.localeCompare(b.name);
      else if (sortKey === 'provider') value = a.provider.localeCompare(b.provider) || b.overallScore - a.overallScore;
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
      <section className="glass-panel rounded-[32px] px-4 py-5 md:px-6 md:py-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-100/70">{locale === 'en' ? 'AI model rankings' : 'AI 模型排名'}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl [text-wrap:balance]">
              {locale === 'en' ? 'A ranked view built for quick shortlists.' : '為快速篩選而設計的排名視圖。'}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              {locale === 'en'
                ? 'Score, pricing, speed, context window, and use-case fit stay in view, so teams can compare options without bouncing between detail pages.'
                : '把分數、價格、速度、上下文視窗與場景適配放在同一個視野裡，讓團隊不用來回切頁也能先做判斷。'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[28rem]">
            <MetricCard label={copy.labels.results} value={String(filtered.length)} tone="cyan" />
            <MetricCard label={copy.labels.overallScore} value={leader ? String(leader.overallScore) : '—'} tone="sky" />
            <MetricCard label={locale === 'en' ? 'Leading provider' : '目前領先供應商'} value={leader?.provider ?? '—'} tone="slate" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 text-sm text-slate-300">
            <span>{copy.labels.search}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale === 'en' ? 'Search by model, provider, tag, or use case' : '依模型、供應商、標籤或場景搜尋'}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>{copy.labels.provider}</span>
            <select value={provider} onChange={(event) => setProvider(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300/40">
              <option value="all">{copy.labels.all}</option>
              {providers.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>{copy.labels.speed}</span>
            <select value={speed} onChange={(event) => setSpeed(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300/40">
              <option value="all">{copy.labels.all}</option>
              <option value="Fast">{localizeSpeed(locale, 'Fast')}</option>
              <option value="Balanced">{localizeSpeed(locale, 'Balanced')}</option>
              <option value="Deliberate">{localizeSpeed(locale, 'Deliberate')}</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>{copy.labels.useCase}</span>
            <select value={useCase} onChange={(event) => setUseCase(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300/40">
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
              <button
                key={option.key}
                type="button"
                onClick={() => updateSort(option.key)}
                className={clsx(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition',
                  active
                    ? 'border-cyan-300/35 bg-cyan-300/12 text-cyan-50'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/8',
                )}
              >
                {option.label}
                {active ? <span className="text-xs text-cyan-100/70">{sortDirection === 'desc' ? '↓' : '↑'}</span> : null}
              </button>
            );
          })}

          <button type="button" onClick={clearFilters} className="ml-auto inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/8">
            {copy.labels.clearFilters}
            {activeFilterCount ? <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">{activeFilterCount}</span> : null}
          </button>
        </div>
      </section>

      {filtered.length ? (
        <>
          <section className="hidden overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(2,8,23,0.28)] backdrop-blur-xl lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-950/55 text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    <SortableHead label={copy.labels.rank} active={sortKey === 'overall'} direction={sortDirection} onClick={() => updateSort('overall')} />
                    <SortableHead label={copy.labels.name} active={sortKey === 'name'} direction={sortDirection} onClick={() => updateSort('name')} wide />
                    <SortableHead label={copy.labels.provider} active={sortKey === 'provider'} direction={sortDirection} onClick={() => updateSort('provider')} />
                    <SortableHead label={copy.labels.overallScore} active={sortKey === 'overall'} direction={sortDirection} onClick={() => updateSort('overall')} />
                    <th className="px-5 py-4 font-medium">{copy.labels.keyStrengths}</th>
                    <SortableHead label={copy.labels.pricing} active={sortKey === 'cost'} direction={sortDirection} onClick={() => updateSort('cost')} />
                    <SortableHead label={copy.labels.speed} active={sortKey === 'speed'} direction={sortDirection} onClick={() => updateSort('speed')} />
                    <th className="px-5 py-4 font-medium">{copy.labels.bestFor}</th>
                    <th className="px-5 py-4 font-medium">{copy.labels.viewDetails}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((model, index) => (
                    <tr key={model.slug} className={clsx('border-b border-white/6 align-top text-[15px] text-slate-200 transition hover:bg-cyan-300/[0.06]', index % 2 === 0 ? 'bg-white/[0.015]' : undefined)}>
                      <td className="px-5 py-5">
                        <div className="inline-flex min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-sm font-semibold text-white">
                          #{rankMap[model.slug]}
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="min-w-[16rem] max-w-[20rem]">
                          <div className="text-base font-semibold text-white">{model.name}</div>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{pick(locale, model.description)}</p>
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <span className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-slate-200">{model.provider}</span>
                      </td>
                      <td className="px-5 py-5">
                        <div className={clsx('inline-flex min-w-[5.75rem] flex-col rounded-[22px] border border-white/10 bg-gradient-to-br px-3 py-2.5', scoreTone(model.overallScore))}>
                          <span className="text-[11px] uppercase tracking-[0.22em] text-white/60">Score</span>
                          <span className="mt-1 text-2xl font-semibold text-white">{model.overallScore}</span>
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex max-w-[17rem] flex-wrap gap-2">
                          {model.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="min-w-[11.5rem] space-y-1 text-sm leading-6">
                          <div className="text-white"><span className="text-slate-500">{locale === 'en' ? 'Input' : '輸入'}</span> {model.pricing.input}</div>
                          <div className="text-slate-300"><span className="text-slate-500">{locale === 'en' ? 'Output' : '輸出'}</span> {model.pricing.output}</div>
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-sm text-cyan-100">
                          {localizeSpeed(locale, model.speedCategory)}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex max-w-[16rem] flex-wrap gap-2">
                          {model.bestUseCases.map((item) => (
                            <span key={item} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                              {localizeUseCase(locale, item)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <Link href={`/${locale}/models/${model.slug}`} className="inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20">
                          {copy.labels.viewDetails} →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 lg:hidden">
            {filtered.map((model) => (
              <article key={model.slug} className="rounded-[28px] border border-white/10 bg-white/[0.055] p-4 shadow-[0_20px_60px_rgba(2,8,23,0.24)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      #{rankMap[model.slug]} · {model.provider}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-white">{model.name}</h3>
                  </div>
                  <div className={clsx('rounded-[22px] border border-white/10 bg-gradient-to-br px-3 py-2 text-right', scoreTone(model.overallScore))}>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">{copy.labels.overallScore}</div>
                    <div className="mt-1 text-2xl font-semibold text-white">{model.overallScore}</div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-300">{pick(locale, model.description)}</p>

                <div className="mt-4 grid gap-3 rounded-[24px] border border-white/8 bg-slate-950/45 p-4 text-sm md:grid-cols-2">
                  <InfoPair label={copy.labels.pricing} value={`${locale === 'en' ? 'Input' : '輸入'} ${model.pricing.input} · ${locale === 'en' ? 'Output' : '輸出'} ${model.pricing.output}`} />
                  <InfoPair label={copy.labels.speed} value={localizeSpeed(locale, model.speedCategory)} />
                  <InfoPair label={copy.labels.contextWindow} value={model.contextWindow} />
                  <InfoPair label={copy.labels.bestFor} value={model.bestUseCases.map((item) => localizeUseCase(locale, item)).join(' · ')} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {model.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link href={`/${locale}/models/${model.slug}`} className="mt-5 inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20">
                  {copy.labels.viewDetails} →
                </Link>
              </article>
            ))}
          </section>
        </>
      ) : (
        <div className="rounded-[28px] border border-dashed border-white/12 bg-white/4 p-10 text-center text-slate-300">{copy.labels.noResults}</div>
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
        <span className="text-[11px] text-slate-500">{active ? (direction === 'desc' ? '↓' : '↑') : '↕'}</span>
      </button>
    </th>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: 'cyan' | 'sky' | 'slate' }) {
  const toneClass =
    tone === 'cyan'
      ? 'border-cyan-300/20 bg-cyan-300/10 text-cyan-50'
      : tone === 'sky'
        ? 'border-sky-300/20 bg-sky-300/10 text-sky-50'
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
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm leading-6 text-white">{value}</div>
    </div>
  );
}
