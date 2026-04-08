import Link from 'next/link';
import { clsx } from 'clsx';
import { Locale } from '@/lib/types';

export function LocaleSwitch({ locale, path = '' }: { locale: Locale; path?: string }) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const withoutLocale = normalizedPath.replace(/^\/(en|zh-TW)/, '') || '';

  return (
    <div className="inline-flex rounded-full border border-white/12 bg-white/6 p-1 text-xs text-[var(--text-muted)] backdrop-blur-xl">
      {(['en', 'zh-TW'] as const).map((item) => {
        const href = `/${item}${withoutLocale}`;
        return (
          <Link
            key={item}
            href={href}
            className={clsx(
              'rounded-full px-3 py-1.5 transition',
              locale === item ? 'bg-white text-slate-950' : 'hover:bg-white/10 hover:text-white',
            )}
          >
            {item}
          </Link>
        );
      })}
    </div>
  );
}
