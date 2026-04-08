'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type ReactNode, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Locale, Model } from '@/lib/types';
import { ui } from '@/lib/i18n';
import { getPrimarySource, getProvider, localizeSpeed, scoreTone } from '@/lib/helpers';

const metrics = [
  ['capability', 'Capability'],
  ['useCaseFitness', 'Use-case fit'],
  ['costEfficiency', 'Cost efficiency'],
  ['speed', 'Speed'],
  ['reliability', 'Reliability'],
  ['agentReadiness', 'Agent readiness'],
  ['ecosystem', 'Ecosystem'],
] as const;

export function CompareWorkbench({ models, locale, initialSelected }: { models: Model[]; locale: Locale; initialSelected: string[] }) {
  const copy = ui[locale];
  const searchParams = useSearchParams();
  const seededFromQuery = (searchParams.get('models') ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
  const seeded = seededFromQuery.length ? seededFromQuery : initialSelected.length ? initialSelected : ['gpt-5-4-pro', 'claude-3-7-sonnet', 'gemini-2-5-pro'];
  const [selected, setSelected] = useState<string[]>(Array.from(new Set(seeded)).slice(0, 3));

  const active = useMemo(
    () => selected.map((slug) => models.find((item) => item.slug === slug)).filter(Boolean) as Model[],
    [models, selected],
  );

  return (
    <div className="space-y-6 md:space-y-7">
      <div className="panel grid gap-5 p-5 md:p-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-label text-[var(--accent)]">{copy.labels.compareShortlist}</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{locale === 'en' ? 'Compare a real shortlist, not abstract rankings.' : '比較真正的 shortlist，不是只比抽象排名。'}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
            {locale === 'en'
              ? 'Use this table after discovery to pressure-test practical differences: price, speed, workflow fit, official links, and likely stack compatibility.'
              : '這個頁面是 discovery 之後的壓力測試：把價格、速度、工作流適配、官方連結與可能的 stack 相容性一起看。'}
          </p>
        </div>

        <div className="panel-subtle p-4">
          <p className="text-sm font-medium text-white">{locale === 'en' ? 'Selected shortlist' : '已選 shortlist'}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {active.map((model) => (
              <span key={model.slug} className="chip text-xs text-[var(--text-muted)]">{model.name}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="panel grid gap-4 p-4 md:grid-cols-3 md:p-6">
        {[0, 1, 2].map((slot) => (
          <label key={slot} className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.compare.selectSlot} {slot + 1}</span>
            <select
              value={selected[slot] ?? ''}
              onChange={(e) => {
                const next = [...selected];
                next[slot] = e.target.value;
                setSelected(Array.from(new Set(next.filter(Boolean))).slice(0, 3));
              }}
              className="input-base"
            >
              <option value="">—</option>
              {models.map((item) => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {active.length >= 2 ? (
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/6 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="min-w-[1120px] w-full text-left">
              <thead className="border-b border-white/10 bg-[var(--surface-2)] text-sm text-[var(--text-muted)]">
                <tr>
                  <th className="px-5 py-4 font-medium text-white">{locale === 'en' ? 'Metric' : '指標'}</th>
                  {active.map((model) => {
                    const provider = getProvider(model.providerId);
                    const primarySource = getPrimarySource(model);
                    return (
                      <th key={model.slug} className="min-w-[300px] px-5 py-4 align-top">
                        <div className="text-base font-semibold text-white">{model.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.24em] text-[var(--text-muted-2)]">{provider.name}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {model.bestFor.slice(0, 2).map((item) => (
                            <span key={item} className="chip text-[11px] text-[var(--text-muted)]">{item}</span>
                          ))}
                        </div>
                        <div className="mt-4 space-y-2 text-xs">
                          <a href={primarySource.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-[var(--accent)] hover:text-white">
                            {primarySource.label} ↗
                          </a>
                          <div className="text-[var(--text-muted)]">{copy.labels.worksWith}: {model.worksWith.slice(0, 2).join(' · ') || '—'}</div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link href={`/${locale}/models/${model.slug}`} className="inline-flex items-center text-xs text-[var(--text-muted)] hover:text-white">
                            {copy.labels.viewDetails} →
                          </Link>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <Row label={copy.labels.overallScore} values={active.map((model) => <div key={model.slug} className={clsx('inline-flex rounded-2xl border border-white/10 bg-gradient-to-br px-4 py-2', scoreTone(model.overallScore))}><span className="text-2xl font-semibold">{model.overallScore}</span></div>)} shaded />
                <Row label={copy.labels.bestFor} values={active.map((model) => model.bestFor.join(' · '))} />
                <Row label={copy.labels.worksWith} values={active.map((model) => model.worksWith.slice(0, 3).join(' · ') || '—')} shaded />
                <Row label={copy.labels.contextWindow} values={active.map((model) => model.contextWindow)} />
                <Row label={copy.labels.speed} values={active.map((model) => localizeSpeed(locale, model.speedCategory))} shaded />
                <Row label={copy.labels.inputPricing} values={active.map((model) => model.pricing.input)} />
                <Row label={copy.labels.outputPricing} values={active.map((model) => model.pricing.output)} shaded />
                <Row label={copy.labels.lastVerified} values={active.map((model) => new Intl.DateTimeFormat(locale === 'zh-TW' ? 'zh-TW' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(model.lastVerifiedAt)))} />
                {metrics.map(([key, label], index) => (
                  <Row key={key} label={locale === 'zh-TW' ? translateMetric(label) : label} values={active.map((model) => model.scores[key])} shaded={index % 2 === 0} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-white/12 bg-white/4 p-10 text-center text-[var(--text-muted)]">{copy.compare.empty}</div>
      )}
    </div>
  );
}

function Row({ label, values, shaded = false }: { label: string; values: Array<string | number | ReactNode>; shaded?: boolean }) {
  return (
    <tr className={clsx('border-b border-white/6', shaded && 'bg-white/[0.02]')}>
      <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{label}</td>
      {values.map((value, index) => (
        <td key={`${label}-${index}`} className="px-5 py-4 text-white">{value}</td>
      ))}
    </tr>
  );
}

function translateMetric(label: string) {
  const map: Record<string, string> = {
    Capability: '能力',
    'Use-case fit': '場景適配',
    'Cost efficiency': '成本效率',
    Speed: '速度',
    Reliability: '可靠性',
    'Agent readiness': 'Agent 就緒度',
    Ecosystem: '生態',
  };
  return map[label] ?? label;
}
