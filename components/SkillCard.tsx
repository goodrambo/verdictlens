import Link from 'next/link';
import { clsx } from 'clsx';
import { Locale, Skill } from '@/lib/types';
import { pick, ui } from '@/lib/i18n';
import { localizeDifficulty, scoreTone } from '@/lib/helpers';

export function SkillCard({ skill, locale }: { skill: Skill; locale: Locale }) {
  const copy = ui[locale];

  return (
    <article className="group rounded-[30px] border border-white/10 bg-white/6 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.16)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-indigo-300/30 hover:bg-white/8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">{skill.category}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{skill.name}</h3>
        </div>
        <div className={clsx('rounded-[22px] border border-white/10 bg-gradient-to-br px-3 py-2 text-right', scoreTone(skill.overallScore))}>
          <div className="text-[11px] uppercase tracking-[0.2em]">{copy.labels.overallScore}</div>
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

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-3.5">
          <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{copy.labels.difficulty}</div>
          <div className="mt-2 font-medium text-white">{localizeDifficulty(locale, skill.installDifficulty)}</div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-3.5">
          <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{copy.labels.supportedProviders}</div>
          <div className="mt-2 font-medium text-white">{skill.supportedProviders.slice(0, 2).join(' · ')}</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="text-sm text-slate-400">{skill.category}</span>
        <Link href={`/${locale}/skills/${skill.slug}`} className="rounded-full border border-indigo-300/25 bg-indigo-300/10 px-4 py-2 text-sm font-medium text-indigo-100 transition hover:bg-indigo-300/20">
          {copy.labels.viewDetails}
        </Link>
      </div>
    </article>
  );
}
