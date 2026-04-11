import type { Metadata } from 'next';
import { SkillsExplorer } from '@/components/skills/SkillsExplorer';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { skills } from '@/lib/data';
import { getLocale, ui } from '@/lib/i18n';
import { buildMetadata, localePath, localizedAlternates, siteName } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  const description =
    locale === 'en'
      ? 'Browse AI skills and tools with official sources, setup effort, provider support, and workflow fit visible by default.'
      : '瀏覽 AI 技能與工具，快速掌握官方來源、設定成本、供應商支援與工作流適配。';

  return buildMetadata({
    title: `${siteName} — ${copy.sections.exploreSkills}`,
    description,
    path: localePath(locale, 'skills'),
    alternates: localizedAlternates('skills'),
  });
}

export default async function SkillsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];

  return (
    <main>
      <div className="container-shell py-10 md:py-14">
        <SectionIntro
          eyebrow={copy.nav.skills}
          title={copy.sections.exploreSkills}
          body={
            locale === 'en'
              ? 'Browse the tools and workflow building blocks that make a model useful in real work. The goal here is simple: spot what helps, what it takes to set up, and where to click next.'
              : '瀏覽真正讓模型能在工作中派上用場的工具與工作流元件。這頁的目標很簡單：先看懂它能幫什麼、設定大概要花多少力氣，以及下一步該點哪裡。'
          }
        />
        <SkillsExplorer skills={skills} locale={locale} />
      </div>
    </main>
  );
}
