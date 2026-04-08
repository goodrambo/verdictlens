import Link from 'next/link';
import { Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';
import { LocaleSwitch } from '@/components/LocaleSwitch';

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  const navItems = [
    { href: `/${locale}`, label: copy.nav.home },
    { href: `/${locale}/models`, label: copy.nav.models },
    { href: `/${locale}/skills`, label: copy.nav.skills },
    { href: `/${locale}/compare`, label: copy.nav.compare },
    { href: `/${locale}/use-cases`, label: copy.nav.useCases },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/78 backdrop-blur-2xl">
      <div className="container-shell py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/${locale}`} className="group flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/25 via-sky-400/20 to-indigo-500/25 shadow-glow">
              <span className="text-sm font-semibold text-cyan-100">MA</span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-wide text-white">{copy.brand}</div>
              <div className="truncate text-xs text-slate-400">{locale === 'en' ? 'AI model & workflow guide' : 'AI 模型與工作流指南'}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>

          <LocaleSwitch locale={locale} path={`/${locale}`} />
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 text-sm text-slate-300 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
