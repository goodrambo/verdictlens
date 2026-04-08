import Link from 'next/link';
import { clsx } from 'clsx';
import { Locale, Model } from '@/lib/types';
import { pick, ui } from '@/lib/i18n';
import { getProvider, localizeSpeed, scoreTone } from '@/lib/helpers';
import { ProviderLogo } from '@/components/brand/ProviderLogo';
import { ExternalLink } from '@/components/shared/ExternalLink';

export function ModelCard({ model, locale }: { model: Model; locale: Locale }) {
  const copy = ui[locale];
  const provider = getProvider(model.providerId);

  return (
    <article className="card group p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <ProviderLogo providerId={model.providerId} className="h-11 w-11 rounded-2xl" />
          <div className="min-w-0">
            <p className="text-label text-[var(--text-muted)]">{provider.name}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{model.name}</h3>
          </div>
        </div>
        <div className={clsx('rounded-[22px] border border-white/10 bg-gradient-to-br px-3 py-2 text-right', scoreTone(model.overallScore))}>
          <div className="text-[11px] uppercase tracking-[0.2em]">{copy.labels.overallScore}</div>
          <div className="text-2xl font-semibold">{model.overallScore}</div>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--text-muted)]">{pick(locale, model.description)}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {model.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="chip text-xs text-[var(--text-muted)]">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="panel-subtle p-3.5">
          <div className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted-2)]">{copy.labels.contextWindow}</div>
          <div className="mt-2 font-medium text-white">{model.contextWindow}</div>
        </div>
        <div className="panel-subtle p-3.5">
          <div className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted-2)]">{copy.labels.speed}</div>
          <div className="mt-2 font-medium text-white">{localizeSpeed(locale, model.speedCategory)}</div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ExternalLink href={model.officialUrl} subtle>
          {copy.labels.officialSite}
        </ExternalLink>
        <Link href={`/${locale}/models/${model.slug}`} className="btn-primary ml-auto">
          {copy.labels.viewDetails}
        </Link>
      </div>
    </article>
  );
}
