'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Locale, Skill } from '@/lib/types';
import { ui, pick } from '@/lib/i18n';
import { easeOfSetupScore, localizeDifficulty, localizeUseCase, providerNames, scoreTone } from '@/lib/helpers';

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
  const providers = useMemo(() => Array.from(new Set(skills.flatMap((item) => item.supportedProviderIds))).sort(), [skills]);
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
      const text = `${item.name} ${item.category} ${item.tags.join(' ')} ${providerNames(item.supportedProviderIds).join(' ')} ${item.bestUseCases.join(' ')}`.toLowerCase();
      return (
        (!q || text.includes(q)) &&
        (category === 'all' || item.category === category) &&
        (difficulty === 'all' || item.installDifficulty === difficulty) &&
        (provider === 'all' || item.supportedProviderIds.includes(provider as Skill['supportedProviderIds'][number])) &&
        (useCase === 'all' || item.bestUseCases.includes(useCase))
      );
    });

    const direction = sortDirection === 'asc' ? 1 : -1;

    return result.sort((a, b) => {
      let value = 0;

      if (sortKey === 'name') value = a.name.localeCompare(b.name);
      else if (sortKey === 'category') value = a.category.localeCompare(b.category) || b.overallScore - a.overallScore;
      else if (sortKey === 'compatibility') value = a.compatibilityScore - b.compatibilityScore || a.supportedProviderIds.length - b.supportedProviderIds.length;
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
  const leader = filtered[0];

  return (
    <div className="space-y-6 md:space-y-7">
      <section className="panel p-4 md:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-label text-[var(--accent-2)]">{locale === 'en' ? 'AI skills and tooling' : 'AI 技能與工具層'}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl [text-wrap:balance]">
              {locale === 'en' ? 'The operational layer, organized for faster decisions.' : '把落地工具層整理成更容易判斷的清單。'}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
              {locale === 'en'
                ? 'Official sources, provider coverage, setup effort, and workflow fit stay visible row by row so teams can evaluate supporting tools quickly.'
                : '把官方來源、供應商支援、設定成本與工作流適配逐列攤開，讓團隊更快看懂支援工具值不值得用。'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[28rem]">
            <MetricCard label={copy.labels.results} value={String(filtered.length)} tone="accent" />
            <MetricCard label={copy.labels.overallScore} value={leader ? String(leader.overallScore) : '—'} tone="secondary" />
            <MetricCard label={locale === 'en' ? 'Leading category' : '目前領先分類'} value={leader?.category ?? '—'} tone="neutral" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.search}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale === 'en' ? 'Search by skill, category, provider, or workflow' : '依技能、分類、供應商或工作流搜尋'}
              className="input-base"
            />
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.category}</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="input-base">
              <option value="all">{copy.labels.all}</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.labels.difficulty}</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="input-base">
              <option value="all">{copy.labels.all}</option>
              <option value="Easy">{localizeDifficulty(locale, 'Easy')}</option>
              <option value="Moderate">{localizeDifficulty(locale, 'Moderate')}</option>
              <option value="Advanced">{localizeDifficulty(locale, 'Advanced')}</option>
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
              <button key={option.key} type="button" onClick={() => updateSort(option.key)} className={clsx('chip text-sm transition', active ? 'border-[var(--border-strong-2)] bg-[var(--accent-soft-2)] text-white' : 'text-[var(--text-muted)] hover:border-white/20 hover:bg-white/8 hover:text-white')}>
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
                    <SortableHead label={copy.labels.category} active={sortKey === 'category'} direction={sortDirection} onClick={() => updateSort('category')} />
                    <SortableHead label={copy.labels.overallScore} active={sortKey === 'overall'} direction={sortDirection} onClick={() => updateSort('overall')} />
                    <SortableHead label={copy.labels.compatibilitySupport} active={sortKey === 'compatibility'} direction={sortDirection} onClick={() => updateSort('compatibility')} />
                    <SortableHead label={copy.labels.setupDifficulty} active={sortKey === 'setup'} direction={sortDirection} onClick={() => updateSort('setup')} />
                    <th className="px-5 py-4 font-medium">{copy.labels.officialLink}</th>
                    <th className="px-5 py-4 font-medium">{copy.labels.viewDetails}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((skill, index) => (
                    <tr key={skill.slug} className={clsx('border-b border-white/6 align-top text-[15px] text-slate-200 transition hover:bg-[var(--accent-soft-2)]', index % 2 === 0 ? 'bg-white/[0.015]' : undefined)}>
                      <td className="px-5 py-5">
                        <div className="inline-flex min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-sm font-semibold text-white">
                          #{rankMap[skill.slug]}
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="min-w-[18rem] max-w-[22rem]">
                          <div className="text-base font-semibold text-white">{skill.name}</div>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">{pick(locale, skill.description)}</p>
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <span className="chip text-sm text-white">{skill.category}</span>
                      </td>
                      <td className="px-5 py-5">
                        <div className={clsx('inline-flex min-w-[5.75rem] flex-col rounded-[22px] border border-white/10 bg-gradient-to-br px-3 py-2.5', scoreTone(skill.overallScore))}>
                          <span className="text-[11px] uppercase tracking-[0.22em] text-white/60">Score</span>
                          <span className="mt-1 text-2xl font-semibold text-white">{skill.overallScore}</span>
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="min-w-[14rem] max-w-[18rem] space-y-2">
                          <div className="font-medium text-white">{locale === 'en' ? 'Compatibility' : '相容性'} {skill.compatibilityScore}</div>
                          <div className="text-sm leading-6 text-[var(--text-muted)]">{providerNames(skill.supportedProviderIds).join(' · ')}</div>
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="min-w-[10rem] space-y-2">
                          <span className="inline-flex rounded-full border border-[var(--border-strong-2)] bg-[var(--accent-soft-2)] px-3 py-1.5 text-sm text-white">
                            {localizeDifficulty(locale, skill.installDifficulty)}
                          </span>
                          <div className="text-sm text-[var(--text-muted)]">{locale === 'en' ? 'Ease score' : '易用分數'} {easeOfSetupScore(skill.installDifficulty, skill.easeOfSetupScore)}</div>
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <a href={skill.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm text-[var(--accent)] transition hover:text-white">
                          {skill.officialSourceLabel} ↗
                        </a>
                      </td>
                      <td className="px-5 py-5">
                        <Link href={`/${locale}/skills/${skill.slug}`} className="btn-primary">
                          {copy.labels.viewDetails}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 lg:hidden">
            {filtered.map((skill) => (
              <article key={skill.slug} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      #{rankMap[skill.slug]} · {skill.category}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-white">{skill.name}</h3>
                  </div>
                  <div className={clsx('rounded-[22px] border border-white/10 bg-gradient-to-br px-3 py-2 text-right', scoreTone(skill.overallScore))}>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">{copy.labels.overallScore}</div>
                    <div className="mt-1 text-2xl font-semibold text-white">{skill.overallScore}</div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{pick(locale, skill.description)}</p>

                <div className="mt-4 grid gap-3 rounded-[24px] border border-white/8 bg-[var(--surface-2)] p-4 text-sm md:grid-cols-2">
                  <InfoPair label={copy.labels.compatibilitySupport} value={`${locale === 'en' ? 'Score' : '分數'} ${skill.compatibilityScore} · ${providerNames(skill.supportedProviderIds).join(' · ')}`} />
                  <InfoPair label={copy.labels.setupDifficulty} value={`${localizeDifficulty(locale, skill.installDifficulty)} · ${locale === 'en' ? 'Ease' : '易用'} ${easeOfSetupScore(skill.installDifficulty, skill.easeOfSetupScore)}`} />
                  <InfoPair label={copy.labels.bestFor} value={skill.bestUseCases.map((item) => localizeUseCase(locale, item)).join(' · ')} />
                  <InfoPair label={copy.labels.source} value={skill.officialSourceLabel} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {skill.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="chip text-xs text-[var(--text-muted)]">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a href={skill.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm text-[var(--accent)] transition hover:text-white">
                    {copy.labels.officialSource} ↗
                  </a>
                  <Link href={`/${locale}/skills/${skill.slug}`} className="btn-primary ml-auto">
                    {copy.labels.viewDetails}
                  </Link>
                </div>
              </article>
            ))}
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
      ? 'border-[var(--border-strong-2)] bg-[var(--accent-soft-2)] text-white'
      : tone === 'secondary'
        ? 'border-[var(--border-strong)] bg-[var(--accent-soft)] text-[var(--accent-contrast)]'
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
