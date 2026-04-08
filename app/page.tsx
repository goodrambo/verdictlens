import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata, siteName } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: `${siteName} — Choose your language`,
  description: 'Choose English or Traditional Chinese to browse the bilingual VerdictLens catalog of AI models, skills, and use-case guides.',
  path: '/',
});

export default function RootPage() {
  return (
    <main className="min-h-screen">
      <div className="container-shell flex min-h-screen items-center justify-center py-16">
        <div className="glass-panel w-full max-w-2xl rounded-[36px] p-8 text-center md:p-10">
          <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-cyan-100">
            VerdictLens
          </div>
          <h1 className="mt-6 text-4xl font-semibold text-white md:text-5xl [text-wrap:balance]">
            AI model rankings, skills, and workflow guides
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">
            Choose your language to browse the bilingual catalog of AI models, practical skills, and use-case recommendations.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/en" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
              Enter English site
            </Link>
            <Link href="/zh-TW" className="rounded-full border border-white/15 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              進入繁體中文站
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
