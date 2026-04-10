'use client';

import { clsx } from 'clsx';
import { Locale } from '@/lib/types';

type PaginationControlsProps = {
  locale: Locale;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
};

const WINDOW_SIZE = 5;

export function PaginationControls({ locale, currentPage, totalPages, totalItems, pageSize, onPageChange, className }: PaginationControlsProps) {
  if (totalItems === 0 || totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className={clsx('panel-subtle flex flex-col gap-3 rounded-[24px] p-4 md:flex-row md:items-center md:justify-between', className)}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{rangeLabel(locale, start, end, totalItems)}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--text-muted-2)]">
          {locale === 'en' ? `Page ${currentPage} of ${totalPages}` : `第 ${currentPage} / ${totalPages} 頁`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-[var(--text-muted)] transition hover:border-white/20 hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          {locale === 'en' ? 'Previous' : '上一頁'}
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={clsx(
              'inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-medium transition',
              page === currentPage
                ? 'border-[var(--border-strong)] bg-[var(--accent-soft)] text-[var(--accent-contrast)]'
                : 'border-white/10 bg-white/5 text-[var(--text-muted)] hover:border-white/20 hover:bg-white/8 hover:text-white',
            )}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-[var(--text-muted)] transition hover:border-white/20 hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          {locale === 'en' ? 'Next' : '下一頁'}
        </button>
      </div>
    </div>
  );
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, currentPage - Math.floor(WINDOW_SIZE / 2));
  const end = Math.min(totalPages, start + WINDOW_SIZE - 1);
  const normalizedStart = Math.max(1, end - WINDOW_SIZE + 1);

  return Array.from({ length: end - normalizedStart + 1 }, (_, index) => normalizedStart + index);
}

function rangeLabel(locale: Locale, start: number, end: number, total: number) {
  if (locale === 'en') return `Showing ${start}–${end} of ${total}`;
  return `顯示第 ${start}–${end} 筆，共 ${total} 筆`;
}
