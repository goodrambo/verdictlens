import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';

export function BrandMark({ locale, href, compact = false }: { locale: Locale; href?: string; compact?: boolean }) {
  const copy = ui[locale];
  const content = (
    <>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface-2)] shadow-[var(--shadow-soft)]">
        <Image src="/brand/verdictlens-mark.svg" alt="VerdictLens mark" width={44} height={44} className="h-full w-full" />
      </div>
      <div className="min-w-0">
        <Image src="/brand/verdictlens-wordmark.svg" alt="VerdictLens" width={164} height={32} className="h-7 w-auto" priority />
        {!compact ? <div className="mt-0.5 truncate text-xs text-[var(--text-muted)]">{copy.brandTagline}</div> : null}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="group flex min-w-0 items-center gap-3">
        {content}
      </Link>
    );
  }

  return <div className="flex min-w-0 items-center gap-3">{content}</div>;
}
