'use client';

import { useMemo, useState } from 'react';
import { Locale, Skill } from '@/lib/types';
import { SkillCard } from '@/components/SkillCard';
import { ui } from '@/lib/i18n';

export function SkillsExplorer({ skills, locale }: { skills: Skill[]; locale: Locale }) {
  const copy = ui[locale];
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [provider, setProvider] = useState('all');

  const categories = Array.from(new Set(skills.map((item) => item.category)));
  const providers = Array.from(new Set(skills.flatMap((item) => item.supportedProviders)));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills
      .filter((item) => {
        const text = `${item.name} ${item.category} ${item.tags.join(' ')} ${item.supportedProviders.join(' ')}`.toLowerCase();
        return (
          (!q || text.includes(q)) &&
          (category === 'all' || item.category === category) &&
          (difficulty === 'all' || item.installDifficulty === difficulty) &&
          (provider === 'all' || item.supportedProviders.includes(provider))
        );
      })
      .sort((a, b) => b.overallScore - a.overallScore);
  }, [skills, query, category, difficulty, provider]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-[30px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl md:grid-cols-4 md:p-5">
        <label className="space-y-2 text-sm text-slate-300">
          <span>{copy.labels.search}</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="automation, browser, secrets..." className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-300/35" />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>{copy.labels.category}</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-indigo-300/35">
            <option value="all">{copy.labels.all}</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>{copy.labels.difficulty}</span>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-indigo-300/35">
            <option value="all">{copy.labels.all}</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>{copy.labels.supportedProviders}</span>
          <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-indigo-300/35">
            <option value="all">{copy.labels.all}</option>
            {providers.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {filtered.length ? (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-white/12 bg-white/4 p-10 text-center text-slate-300">{copy.labels.noResults}</div>
      )}
    </div>
  );
}
