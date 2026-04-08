import { clsx } from 'clsx';
import { ReactNode } from 'react';

export function ExternalLink({
  href,
  children,
  className,
  subtle = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  subtle?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={clsx(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition',
        subtle
          ? 'border-white/10 bg-white/5 text-[var(--text-muted)] hover:border-white/20 hover:bg-white/8 hover:text-white'
          : 'border-[var(--border-strong)] bg-[var(--accent-soft)] text-[var(--accent-contrast)] hover:bg-[var(--accent-soft-2)]',
        className,
      )}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
