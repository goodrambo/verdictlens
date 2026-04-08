'use client';

import { useMemo, useState } from 'react';
import { Model, Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';
import { ModelCard } from '@/components/ModelCard';
import { speedRank } from '@/lib/helpers';

export function ModelsExplorer({ models, locale }: { models: Model[]; locale: Locale }) {
  const copy = ui[locale];
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('all');
  const [speed, setSpeed] = useState('all');
  const [sort, setSort] = useState('top');

  const providers = Array.from(new Set(models.map((item) => item.provider)));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = models.filter((item) => {
      const text = `${item.name} ${item.provider} ${item.tags.join(' ')}`.toLowerCase();
      return (
        (!q || text.includes(q)) &&
        (provider === 'all' || item.provider === provider) &&
        (speed === 'all' || item.speedCategory === speed)
      );
    });

    return result.sort((a, b) => {
      if (sort === 'fast') return speedRank(b.speedCategory) - speedRank(a.speedCategory) || b.overallScore - a.overallScore;
      if (sort === 'cost') return b.scores.costEfficiency - a.scores.costEfficiency || b.overallScore - a.overallScore;
      return b.overallScore - a.overallScore;
    });
  }, [models, provider, query, sort, speed]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-[30px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl md:grid-cols-4 md:p-5">
        <label className="space-y-2 text-sm text-slate-300">
          <span>{copy.labels.search}</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="GPT, coding, OpenAI..." className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/35" />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>{copy.labels.provider}</span>
          <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-cyan-300/35">
            <option value="all">{copy.labels.all}</option>
            {providers.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>{copy.labels.speed}</span>
          <select value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-cyan-300/35">
            <option value="all">{copy.labels.all}</option>
            <option value="Fast">Fast</option>
            <option value="Balanced">Balanced</option>
            <option value="Deliberate">Deliberate</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>{copy.labels.sort}</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-cyan-300/35">
            <option value="top">{copy.labels.sortTop}</option>
            <option value="fast">{copy.labels.sortFast}</option>
            <option value="cost">{copy.labels.sortCost}</option>
          </select>
        </label>
      </div>

      {filtered.length ? (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((model) => (
            <ModelCard key={model.slug} model={model} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-white/12 bg-white/4 p-10 text-center text-slate-300">{copy.labels.noResults}</div>
      )}
    </div>
  );
}
