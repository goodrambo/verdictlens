import Link from 'next/link';

export default function RootPage() {
  return (
    <main className="min-h-screen">
      <div className="container-shell flex min-h-screen items-center justify-center py-16">
        <div className="glass-panel w-full max-w-2xl rounded-[36px] p-8 text-center md:p-10">
          <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-cyan-100">
            ModelAtlas
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            AI Models & Skills Ratings
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">
            Choose your language to enter the bilingual MVP catalog.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/en" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950">
              Enter English site
            </Link>
            <Link href="/zh-TW" className="rounded-full border border-white/15 bg-white/6 px-6 py-3 text-sm font-semibold text-white">
              進入繁體中文站
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
