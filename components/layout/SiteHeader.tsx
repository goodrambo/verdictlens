import Link from 'next/link';
import { Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';
import { BrandMark } from '@/components/brand/BrandMark';
import { LocaleSwitch } from '@/components/layout/LocaleSwitch';

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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(7,17,31,0.78)] backdrop-blur-2xl">
      <div className="container-shell py-4">
        <div className="flex items-center justify-between gap-4">
          <BrandMark locale={locale} href={`/${locale}`} />

          <nav className="hidden items-center gap-6 text-sm text-[var(--text-muted)] lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>

          <LocaleSwitch locale={locale} path={`/${locale}`} />
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 text-sm text-[var(--text-muted)] lg:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="chip whitespace-nowrap hover:border-white/20 hover:bg-white/10 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
