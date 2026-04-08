import Link from 'next/link';
import { Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';
import { LocaleSwitch } from '@/components/LocaleSwitch';

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = ui[locale];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href={`/${locale}`} className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/25 via-sky-400/20 to-indigo-500/25 shadow-glow">
            <span className="text-sm font-semibold text-cyan-100">MA</span>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-white">{copy.brand}</div>
            <div className="text-xs text-slate-400">{locale === 'en' ? 'AI model intelligence' : 'AI 模型情報層'}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href={`/${locale}`} className="hover:text-white">{copy.nav.home}</Link>
          <Link href={`/${locale}/models`} className="hover:text-white">{copy.nav.models}</Link>
          <Link href={`/${locale}/skills`} className="hover:text-white">{copy.nav.skills}</Link>
          <Link href={`/${locale}/compare`} className="hover:text-white">{copy.nav.compare}</Link>
          <Link href={`/${locale}/use-cases`} className="hover:text-white">{copy.nav.useCases}</Link>
        </nav>

        <LocaleSwitch locale={locale} path={`/${locale}`} />
      </div>
    </header>
  );
}
