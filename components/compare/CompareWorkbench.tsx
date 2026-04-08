'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Locale, Model } from '@/lib/types';
import { ui } from '@/lib/i18n';
import { getProvider, localizeSpeed, scoreTone } from '@/lib/helpers';

const metrics = [
  ['capability', 'Capability'],
  ['useCaseFitness', 'Use-case fit'],
  ['costEfficiency', 'Cost efficiency'],
  ['speed', 'Speed'],
  ['reliability', 'Reliability'],
  ['agentReadiness', 'Agent readiness'],
  ['ecosystem', 'Ecosystem'],
] as const;

export function CompareWorkbench({ models, locale }: { models: Model[]; locale: Locale }) {
  const copy = ui[locale];
  const [selected, setSelected] = useState<string[]>(['gpt-5-4-pro', 'claude-3-7-sonnet', 'gemini-2-5-pro']);

  const active = useMemo(
    () => selected.map((slug) => models.find((item) => item.slug === slug)).filter(Boolean) as Model[],
    [models, selected],
  );

  return (
    <div className="space-y-6 md:space-y-7">
      <div className="panel grid gap-4 p-4 md:grid-cols-3 md:p-6">
        {[0, 1, 2].map((slot) => (
          <label key={slot} className="space-y-2 text-sm text-[var(--text-muted)]">
            <span>{copy.compare.selectSlot} {slot + 1}</span>
            <select
              value={selected[slot] ?? ''}
              onChange={(e) => {
                const next = [...selected];
                next[slot] = e.target.value;
                setSelected(next);
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
            <table className="min-w-[980px] w-full text-left">
              <thead className="border-b border-white/10 bg-[var(--surface-2)] text-sm text-[var(--text-muted)]">
                <tr>
                  <th className="px-5 py-4 font-medium text-white">{locale === 'en' ? 'Metric' : '指標'}</th>
                  {active.map((model) => {
                    const provider = getProvider(model.providerId);
                    return (
                      <th key={model.slug} className="min-w-[260px] px-5 py-4 align-top">
                        <div className="text-base font-semibold text-white">{model.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.24em] text-[var(--text-muted-2)]">{provider.name}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a href={model.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs text-[var(--accent)] hover:text-white">
                            {copy.labels.officialSite} ↗
                          </a>
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
                <tr className="border-b border-white/6 bg-white/[0.02]">
                  <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{copy.labels.overallScore}</td>
                  {active.map((model) => (
                    <td key={model.slug} className="px-5 py-4">
                      <div className={clsx('inline-flex rounded-2xl border border-white/10 bg-gradient-to-br px-4 py-2', scoreTone(model.overallScore))}>
                        <span className="text-2xl font-semibold">{model.overallScore}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/6">
                  <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{copy.labels.contextWindow}</td>
                  {active.map((model) => <td key={model.slug} className="px-5 py-4 text-white">{model.contextWindow}</td>)}
                </tr>
                <tr className="border-b border-white/6 bg-white/[0.02]">
                  <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{copy.labels.speed}</td>
                  {active.map((model) => <td key={model.slug} className="px-5 py-4 text-white">{localizeSpeed(locale, model.speedCategory)}</td>)}
                </tr>
                <tr className="border-b border-white/6">
                  <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{copy.labels.inputPricing}</td>
                  {active.map((model) => <td key={model.slug} className="px-5 py-4 text-white">{model.pricing.input}</td>)}
                </tr>
                <tr className="border-b border-white/6 bg-white/[0.02]">
                  <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{copy.labels.outputPricing}</td>
                  {active.map((model) => <td key={model.slug} className="px-5 py-4 text-white">{model.pricing.output}</td>)}
                </tr>
                {metrics.map(([key, label], index) => (
                  <tr key={key} className={clsx('border-b border-white/6 last:border-b-0', index % 2 === 0 ? undefined : 'bg-white/[0.02]')}>
                    <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{locale === 'zh-TW' ? translateMetric(label) : label}</td>
                    {active.map((model) => (
                      <td key={model.slug} className="px-5 py-4 text-white">{model.scores[key]}</td>
                    ))}
                  </tr>
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
