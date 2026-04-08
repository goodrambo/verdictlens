import Link from 'next/link';
import { Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = ui[locale];

  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-[1.5fr_1fr] md:py-12">
        <div>
          <h3 className="text-xl font-semibold text-white">{copy.brand}</h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">{copy.footer.line1}</p>
          <p className="mt-1 max-w-xl text-sm leading-7 text-slate-400">{copy.footer.line2}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm text-slate-300">
          <div className="space-y-2">
            <p className="font-medium text-white">{locale === 'en' ? 'Browse' : '瀏覽'}</p>
            <Link href={`/${locale}/models`} className="block transition hover:text-white">{copy.nav.models}</Link>
            <Link href={`/${locale}/skills`} className="block transition hover:text-white">{copy.nav.skills}</Link>
            <Link href={`/${locale}/compare`} className="block transition hover:text-white">{copy.nav.compare}</Link>
            <Link href={`/${locale}/use-cases`} className="block transition hover:text-white">{copy.nav.useCases}</Link>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-white">{locale === 'en' ? 'Data' : '資料'}</p>
            <Link href="/data/models.json" className="block transition hover:text-white">/data/models.json</Link>
            <Link href="/data/skills.json" className="block transition hover:text-white">/data/skills.json</Link>
            <Link href="/data/catalog.json" className="block transition hover:text-white">/data/catalog.json</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
