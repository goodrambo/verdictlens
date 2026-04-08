import Link from 'next/link';
import { Locale, UseCase } from '@/lib/types';
import { pick } from '@/lib/i18n';

export function UseCaseCard({ item, locale }: { item: UseCase; locale: Locale }) {
  return (
    <Link
      href={`/${locale}/use-cases/${item.slug}`}
      className="group rounded-[30px] border border-white/10 bg-gradient-to-br from-white/8 via-white/4 to-transparent p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/30"
    >
      <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cyan-100">
        {item.slug}
      </div>
      <h3 className="mt-4 text-2xl font-semibold text-white">{pick(locale, item.title)}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{pick(locale, item.summary)}</p>
      <div className="mt-5 text-sm font-medium text-cyan-100">Open playbook →</div>
    </Link>
  );
}
