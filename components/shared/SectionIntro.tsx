import { ReactNode } from 'react';

export function SectionIntro({ eyebrow, title, body, action }: { eyebrow: string; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="text-label text-[var(--accent)]">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-[2rem] [text-wrap:balance]">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-muted)] md:text-base">{body}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
