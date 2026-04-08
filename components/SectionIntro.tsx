import { ReactNode } from 'react';

export function SectionIntro({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-200/80">{eyebrow}</p> : null}
        <h2 className="max-w-3xl text-3xl font-semibold text-white md:text-4xl [text-wrap:balance]">{title}</h2>
        {body ? <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-[1.05rem]">{body}</p> : null}
      </div>
      {action ? <div className="shrink-0 pt-1">{action}</div> : null}
    </div>
  );
}
