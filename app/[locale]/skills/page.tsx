import type { Metadata } from 'next';
import { SkillsExplorer } from '@/components/SkillsExplorer';
import { SectionIntro } from '@/components/SectionIntro';
import { skills } from '@/lib/data';
import { getLocale, ui } from '@/lib/i18n';
import { buildMetadata, localePath, localizedAlternates, siteName } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  const description =
    locale === 'en'
      ? 'Browse ranked AI skills and tooling with setup effort, provider support, and best-fit workflows visible by default.'
      : '瀏覽 AI 技能與工具排名，快速掌握設定成本、供應商支援與最適工作流。';

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
              ? 'Browse ranked AI skills and tooling with compatibility, setup effort, and workflow fit visible row by row.'
              : '用更清楚的排名清單檢視 AI 技能與工具，把相容性、設定成本與工作流適配直接攤開。'
          }
        />
        <SkillsExplorer skills={skills} locale={locale} />
      </div>
    </main>
  );
}
