'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Locale, Skill } from '@/lib/types';
import { ui, pick } from '@/lib/i18n';
import { easeOfSetupScore, localizeDifficulty, localizeUseCase, scoreTone } from '@/lib/helpers';

type SkillSortKey = 'overall' | 'name' | 'category' | 'compatibility' | 'setup';
type SortDirection = 'asc' | 'desc';

export function SkillsExplorer({ skills, locale }: { skills: Skill[]; locale: Locale }) {
  const copy = ui[locale];
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [provider, setProvider] = useState('all');
  const [useCase, setUseCase] = useState('all');
  const [sortKey, setSortKey] = useState<SkillSortKey>('overall');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const categories = useMemo(() => Array.from(new Set(skills.map((item) => item.category))).sort(), [skills]);
  const providers = useMemo(() => Array.from(new Set(skills.flatMap((item) => item.supportedProviders))).sort(), [skills]);
  const useCases = useMemo(() => Array.from(new Set(skills.flatMap((item) => item.bestUseCases))), [skills]);

  const rankMap = useMemo(
    () =>
      Object.fromEntries(
        [...skills]
          .sort((a, b) => b.overallScore - a.overallScore || a.name.localeCompare(b.name))
          .map((item, index) => [item.slug, index + 1]),
      ),
    [skills],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = skills.filter((item) => {
      const text = `${item.name} ${item.category} ${item.tags.join(' ')} ${item.supportedProviders.join(' ')} ${item.bestUseCases.join(' ')}`.toLowerCase();
      return (
        (!q || text.includes(q)) &&
        (category === 'all' || item.category === category) &&
        (difficulty === 'all' || item.installDifficulty === difficulty) &&
        (provider === 'all' || item.supportedProviders.includes(provider)) &&
        (useCase === 'all' || item.bestUseCases.includes(useCase))
      );
    });

    const direction = sortDirection === 'asc' ? 1 : -1;

    return result.sort((a, b) => {
      let value = 0;

      if (sortKey === 'name') value = a.name.localeCompare(b.name);
      else if (sortKey === 'category') value = a.category.localeCompare(b.category) || b.overallScore - a.overallScore;
      else if (sortKey === 'compatibility') value = a.compatibilityScore - b.compatibilityScore || a.supportedProviders.length - b.supportedProviders.length;
      else if (sortKey === 'setup') value = easeOfSetupScore(a.installDifficulty, a.easeOfSetupScore) - easeOfSetupScore(b.installDifficulty, b.easeOfSetupScore);
      else value = a.overallScore - b.overallScore || a.name.localeCompare(b.name);

      return value * direction;
    });
  }, [skills, category, difficulty, provider, query, sortDirection, sortKey, useCase]);

  function updateSort(nextKey: SkillSortKey) {
    if (nextKey === sortKey) {
      setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === 'name' || nextKey === 'category' ? 'asc' : 'desc');
  }

  function clearFilters() {
    setQuery('');
    setCategory('all');
    setDifficulty('all');
    setProvider('all');
    setUseCase('all');
    setSortKey('overall');
    setSortDirection('desc');
  }

  const sortOptions: { key: SkillSortKey; label: string }[] = [
    { key: 'overall', label: copy.labels.sortTop },
    { key: 'compatibility', label: copy.labels.compatibilitySupport },
    { key: 'setup', label: copy.labels.setupDifficulty },
    { key: 'name', label: copy.labels.name },
    { key: 'category', label: copy.labels.category },
  ];

  const activeFilterCount = [query, category !== 'all', difficulty !== 'all', provider !== 'all', useCase !== 'all'].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[32px] p-4 md:p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-indigo-100/70">{locale === 'en' ? 'Operational stack board' : '工具堆疊看板'}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
              {locale === 'en' ? 'Review skills like a real operator deck.' : '用真正做營運與落地的角度來看技能清單。'}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              {locale === 'en'
                ? 'Compatibility, support coverage, setup friction, and use-case fit stay visible row by row, so teams can shortlist the operational layer faster.'
                : '把相容性、支援面、設定摩擦與場景適配逐列攤開，團隊更快決定要先導入哪一層能力。'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[26rem]">
            <MetricCard label={copy.labels.results} value={String(filtered.length)} tone="indigo" />
            <MetricCard label={copy.labels.overallScore} value={filtered[0] ? String(filtered[0].overallScore) : '—'} tone="violet" />
            <MetricCard label={copy.labels.category} value={filtered[0]?.category ?? '—'} tone="slate" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-2 text-sm text-slate-300">
            <span>{copy.labels.search}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="automation, browser, secrets..."
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-300/40"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>{copy.labels.category}</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-300/40">
              <option value="all">{copy.labels.all}</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>{copy.labels.difficulty}</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-300/40">
              <option value="all">{copy.labels.all}</option>
              <option value="Easy">{localizeDifficulty(locale, 'Easy')}</option>
              <option value="Moderate">{localizeDifficulty(locale, 'Moderate')}</option>
              <option value="Advanced">{localizeDifficulty(locale, 'Advanced')}</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>{copy.labels.supportedProviders}</span>
            <select value={provider} onChange={(event) => setProvider(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-300/40">
              <option value="all">{copy.labels.all}</option>
              {providers.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>{copy.labels.useCase}</span>
            <select value={useCase} onChange={(event) => setUseCase(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-300/40">
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
                    ? 'border-indigo-300/35 bg-indigo-300/12 text-indigo-50'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/8',
                )}
              >
                {option.label}
                {active ? <span className="text-xs text-indigo-100/70">{sortDirection === 'desc' ? '↓' : '↑'}</span> : null}
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
              <table className="min-w-[1180px] w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-950/55 text-xs uppercase tracking-[0.22em] text-slate-400">
                    <SortableHead label={copy.labels.rank} active={sortKey === 'overall'} direction={sortDirection} onClick={() => updateSort('overall')} />
                    <SortableHead label={copy.labels.name} active={sortKey === 'name'} direction={sortDirection} onClick={() => updateSort('name')} wide />
                    <SortableHead label={copy.labels.category} active={sortKey === 'category'} direction={sortDirection} onClick={() => updateSort('category')} />
                    <SortableHead label={copy.labels.overallScore} active={sortKey === 'overall'} direction={sortDirection} onClick={() => updateSort('overall')} />
                    <SortableHead label={copy.labels.compatibilitySupport} active={sortKey === 'compatibility'} direction={sortDirection} onClick={() => updateSort('compatibility')} />
                    <SortableHead label={copy.labels.setupDifficulty} active={sortKey === 'setup'} direction={sortDirection} onClick={() => updateSort('setup')} />
                    <th className="px-4 py-4 font-medium">{copy.labels.bestFor}</th>
                    <th className="px-4 py-4 font-medium">{copy.labels.viewDetails}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((skill) => (
                    <tr key={skill.slug} className="border-b border-white/6 align-top text-sm text-slate-200 transition hover:bg-indigo-300/[0.06]">
                      <td className="px-4 py-4">
                        <div className="inline-flex min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-sm font-semibold text-white">
                          #{rankMap[skill.slug]}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="min-w-[14rem] max-w-[18rem]">
                          <div className="text-base font-semibold text-white">{skill.name}</div>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{pick(locale, skill.description)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-sm text-slate-200">{skill.category}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className={clsx('inline-flex min-w-[5.5rem] flex-col rounded-[22px] border border-white/10 bg-gradient-to-br px-3 py-2', scoreTone(skill.overallScore))}>
                          <span className="text-[11px] uppercase tracking-[0.22em] text-white/60">Score</span>
                          <span className="mt-1 text-2xl font-semibold text-white">{skill.overallScore}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="min-w-[14rem] max-w-[16rem]">
                          <div className="font-medium text-white">{locale === 'en' ? 'Compatibility' : '相容性'} {skill.compatibilityScore}</div>
                          <div className="mt-2 text-sm leading-6 text-slate-400">{skill.supportedProviders.join(' · ')}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="min-w-[10rem]">
                          <span className="inline-flex rounded-full border border-indigo-300/20 bg-indigo-300/10 px-3 py-1 text-sm text-indigo-100">
                            {localizeDifficulty(locale, skill.installDifficulty)}
                          </span>
                          <div className="mt-2 text-sm text-slate-400">{locale === 'en' ? 'Ease score' : '易用分數'} {easeOfSetupScore(skill.installDifficulty, skill.easeOfSetupScore)}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex max-w-[16rem] flex-wrap gap-2">
                          {skill.bestUseCases.map((item) => (
                            <span key={item} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                              {localizeUseCase(locale, item)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Link href={`/${locale}/skills/${skill.slug}`} className="inline-flex items-center rounded-full border border-indigo-300/25 bg-indigo-300/10 px-4 py-2 text-sm font-medium text-indigo-100 transition hover:bg-indigo-300/20">
                          {copy.labels.viewDetails} →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-4 lg:hidden">
            {filtered.map((skill) => (
              <article key={skill.slug} className="rounded-[28px] border border-white/10 bg-white/[0.055] p-4 shadow-[0_20px_60px_rgba(2,8,23,0.24)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      #{rankMap[skill.slug]} · {skill.category}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-white">{skill.name}</h3>
                  </div>
                  <div className={clsx('rounded-[22px] border border-white/10 bg-gradient-to-br px-3 py-2 text-right', scoreTone(skill.overallScore))}>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">{copy.labels.overallScore}</div>
                    <div className="mt-1 text-2xl font-semibold text-white">{skill.overallScore}</div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-300">{pick(locale, skill.description)}</p>

                <div className="mt-4 grid gap-3 rounded-[24px] border border-white/8 bg-slate-950/45 p-4 text-sm md:grid-cols-2">
                  <InfoPair label={copy.labels.compatibilitySupport} value={`${locale === 'en' ? 'Score' : '分數'} ${skill.compatibilityScore} · ${skill.supportedProviders.join(' · ')}`} />
                  <InfoPair label={copy.labels.setupDifficulty} value={`${localizeDifficulty(locale, skill.installDifficulty)} · ${locale === 'en' ? 'Ease' : '易用'} ${easeOfSetupScore(skill.installDifficulty, skill.easeOfSetupScore)}`} />
                  <InfoPair label={copy.labels.bestFor} value={skill.bestUseCases.map((item) => localizeUseCase(locale, item)).join(' · ')} />
                  <InfoPair label={copy.labels.category} value={skill.category} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {skill.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link href={`/${locale}/skills/${skill.slug}`} className="mt-5 inline-flex items-center rounded-full border border-indigo-300/25 bg-indigo-300/10 px-4 py-2 text-sm font-medium text-indigo-100 transition hover:bg-indigo-300/20">
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
    <th className={clsx('px-4 py-4 font-medium', wide ? 'min-w-[18rem]' : undefined)}>
      <button type="button" onClick={onClick} className={clsx('inline-flex items-center gap-2 transition', active ? 'text-white' : 'hover:text-slate-200')}>
        {label}
        <span className="text-[11px] text-slate-500">{active ? (direction === 'desc' ? '↓' : '↑') : '↕'}</span>
      </button>
    </th>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: 'indigo' | 'violet' | 'slate' }) {
  const toneClass = tone === 'indigo'
    ? 'border-indigo-300/20 bg-indigo-300/10 text-indigo-50'
    : tone === 'violet'
      ? 'border-violet-300/20 bg-violet-300/10 text-violet-50'
      : 'border-white/10 bg-white/5 text-white';

  return (
    <div className={clsx('rounded-[24px] border px-4 py-3', toneClass)}>
      <div className="text-[11px] uppercase tracking-[0.24em] text-white/60">{label}</div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
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
