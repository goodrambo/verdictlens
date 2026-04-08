import Link from 'next/link';
import { Locale, UseCase } from '@/lib/types';
import { pick, ui } from '@/lib/i18n';

export function UseCaseCard({ item, locale }: { item: UseCase; locale: Locale }) {
  const copy = ui[locale];

  return (
    <Link href={`/${locale}/use-cases/${item.slug}`} className="card group block p-6 hover:border-[var(--border-strong)]">
      <div className="inline-flex rounded-full border border-[var(--border-strong)] bg-[var(--accent-soft)] px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[var(--accent-contrast)]">
        {item.slug}
      </div>
      <h3 className="mt-4 text-2xl font-semibold text-white">{pick(locale, item.title)}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{pick(locale, item.summary)}</p>
      <div className="mt-5 text-sm font-medium text-[var(--accent)]">{copy.labels.exploreGuides} →</div>
    </Link>
  );
}
