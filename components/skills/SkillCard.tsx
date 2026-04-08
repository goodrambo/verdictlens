import Link from 'next/link';
import { clsx } from 'clsx';
import { Locale, Skill } from '@/lib/types';
import { pick, ui } from '@/lib/i18n';
import { localizeDifficulty, scoreTone } from '@/lib/helpers';
import { ExternalLink } from '@/components/shared/ExternalLink';

export function SkillCard({ skill, locale }: { skill: Skill; locale: Locale }) {
  const copy = ui[locale];

  return (
    <article className="card group p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-label text-[var(--text-muted)]">{skill.category}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{skill.name}</h3>
        </div>
        <div className={clsx('rounded-[22px] border border-white/10 bg-gradient-to-br px-3 py-2 text-right', scoreTone(skill.overallScore))}>
          <div className="text-[11px] uppercase tracking-[0.2em]">{copy.labels.overallScore}</div>
          <div className="text-2xl font-semibold">{skill.overallScore}</div>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--text-muted)]">{pick(locale, skill.description)}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {skill.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="chip text-xs text-[var(--text-muted)]">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="panel-subtle p-3.5">
          <div className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted-2)]">{copy.labels.difficulty}</div>
          <div className="mt-2 font-medium text-white">{localizeDifficulty(locale, skill.installDifficulty)}</div>
        </div>
        <div className="panel-subtle p-3.5">
          <div className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted-2)]">{copy.labels.source}</div>
          <div className="mt-2 font-medium text-white">{skill.officialSourceLabel}</div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ExternalLink href={skill.preferredSourceUrl} subtle>
          {copy.labels.officialSource}
        </ExternalLink>
        <Link href={`/${locale}/skills/${skill.slug}`} className="btn-primary ml-auto">
          {copy.labels.viewDetails}
        </Link>
      </div>
    </article>
  );
}
