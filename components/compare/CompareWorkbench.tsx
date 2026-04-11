'use client';

import Link from 'next/link';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Locale, Model } from '@/lib/types';
import { ui } from '@/lib/i18n';
import { compareHref, getPrimarySource, getProvider, localizeSpeed, scoreTone } from '@/lib/helpers';

const metrics = [
  ['capability', 'Capability'],
  ['useCaseFitness', 'Use-case fit'],
  ['costEfficiency', 'Cost efficiency'],
  ['speed', 'Speed'],
  ['reliability', 'Reliability'],
  ['agentReadiness', 'Agent readiness'],
  ['ecosystem', 'Ecosystem'],
] as const;

const defaultSelection = ['gpt-5-4-pro', 'claude-3-7-sonnet', 'gemini-2-5-pro'];

export function CompareWorkbench({ models, locale, initialSelected }: { models: Model[]; locale: Locale; initialSelected: string[] }) {
  const copy = ui[locale];
  const [selected, setSelected] = useState<string[]>(normalizeSelection(initialSelected.length ? initialSelected : defaultSelection));
  const [syncEnabled, setSyncEnabled] = useState(initialSelected.length > 0);

  useEffect(() => {
    const fromUrl = readSelectedFromLocation();
    if (fromUrl.length) {
      setSelected(fromUrl);
      setSyncEnabled(true);
      return;
    }

    if (initialSelected.length) {
      setSelected(normalizeSelection(initialSelected));
      setSyncEnabled(true);
    }
  }, [initialSelected]);

  useEffect(() => {
    if (!syncEnabled) return;
    syncSelectionInUrl(locale, selected);
  }, [locale, selected, syncEnabled]);

  const active = useMemo(
    () => selected.map((slug) => models.find((item) => item.slug === slug)).filter(Boolean) as Model[],
    [models, selected],
  );

  return (
    <div className="space-y-6 md:space-y-7">
      <div className="panel grid gap-5 p-5 md:p-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-label text-[var(--accent)]">{copy.labels.compareShortlist}</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{locale === 'en' ? 'Pressure-test your finalists side by side.' : '把最後候選名單放在一起壓力測試。'}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
            {locale === 'en'
              ? 'This is the step after browsing: compare the practical differences that usually decide the shortlist—price, speed, context window, workflow fit, and official links.'
              : '這是瀏覽之後的下一步：把真正會影響決策的差異放在一起看，像是價格、速度、上下文視窗、工作流適配與官方連結。'}
          </p>
        </div>

        <div className="panel-subtle p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">{locale === 'en' ? 'Selected shortlist' : '已選 shortlist'}</p>
              <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                {active.length >= 2
                  ? (locale === 'en' ? 'Good to go. Adjust the slots below if you want to swap in another finalist.' : '已可直接比較；如果想換候選模型，下面可以隨時調整。')
                  : (locale === 'en' ? 'Pick two or three models here, or jump back to the directory to build the shortlist while browsing.' : '先在這裡挑 2 到 3 個模型，或回到模型目錄一邊瀏覽一邊建立 shortlist。')}
              </p>
            </div>
            <Link href={`/${locale}/models`} className="text-sm text-[var(--accent)] transition hover:text-white">
              {locale === 'en' ? 'Browse models' : '回到模型列表'} →
            </Link>
          </div>
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
                setSyncEnabled(true);
                setSelected(normalizeSelection(next));
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
                        <div className="mt-3 flex flex-wrap gap-3">
                          <Link href={`/${locale}/models/${model.slug}`} className="inline-flex items-center text-xs text-[var(--text-muted)] hover:text-white">
                            {copy.labels.viewDetails} →
                          </Link>
                          <Link href={compareHref(locale, active.map((item) => item.slug))} className="inline-flex items-center text-xs text-[var(--accent)] hover:text-white">
                            {locale === 'en' ? 'Share this compare view' : '分享這個比較頁'} →
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
        <div className="rounded-[28px] border border-dashed border-white/12 bg-white/4 p-10 text-center text-[var(--text-muted)]">
          <p>{copy.compare.empty}</p>
          <Link href={`/${locale}/models`} className="mt-4 inline-flex items-center text-[var(--accent)] hover:text-white">
            {locale === 'en' ? 'Build a shortlist from the model directory' : '到模型目錄建立 shortlist'} →
          </Link>
        </div>
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

function normalizeSelection(slugs: string[]) {
  return Array.from(new Set(slugs.filter(Boolean))).slice(0, 3);
}

function readSelectedFromLocation() {
  if (typeof window === 'undefined') return [];

  return normalizeSelection(
    (new URLSearchParams(window.location.search).get('models') ?? '')
      .split(',')
      .map((item) => item.trim()),
  );
}

function syncSelectionInUrl(locale: Locale, selected: string[]) {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  const nextHref = compareHref(locale, selected);
  const nextUrl = new URL(nextHref, url.origin);
  window.history.replaceState(window.history.state, '', `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
}
