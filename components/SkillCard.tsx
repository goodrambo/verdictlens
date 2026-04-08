import Link from 'next/link';
import { Locale, Skill } from '@/lib/types';
import { pick, ui } from '@/lib/i18n';
import { scoreTone } from '@/lib/helpers';
import { clsx } from 'clsx';

export function SkillCard({ skill, locale }: { skill: Skill; locale: Locale }) {
  const copy = ui[locale];

  return (
    <article className="group rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-indigo-300/30 hover:bg-white/8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{skill.category}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{skill.name}</h3>
        </div>
        <div className={clsx('rounded-2xl border border-white/10 bg-gradient-to-br px-3 py-2 text-right', scoreTone(skill.overallScore))}>
          <div className="text-xs uppercase tracking-[0.2em]">{copy.labels.overallScore}</div>
          <div className="text-2xl font-semibold">{skill.overallScore}</div>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-300">{pick(locale, skill.description)}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {skill.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-300">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
        <span>{copy.labels.difficulty}: {skill.installDifficulty}</span>
        <span>{skill.supportedProviders.slice(0, 2).join(' · ')}</span>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-slate-400">{skill.category}</span>
        <Link href={`/${locale}/skills/${skill.slug}`} className="rounded-full border border-indigo-300/25 bg-indigo-300/10 px-4 py-2 text-sm font-medium text-indigo-100 transition hover:bg-indigo-300/20">
          {copy.labels.viewDetails}
        </Link>
      </div>
    </article>
  );
}
