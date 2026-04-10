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
              ? 'The supporting stack is often what determines whether a model is usable in real work. This directory now scales past a thousand live entries by separating curated review, registry validation, and broader registry listing instead of pretending they are the same thing.'
              : '真正決定模型能不能穩定落地的，往往是支援工具層。這個目錄現在把人工 curated、registry 驗證與更廣泛的 registry 收錄分開呈現，讓 live catalog 在超過千筆之後仍然盡量保持可讀。'
          }
        />
        <SkillsExplorer skills={skills} locale={locale} />
      </div>
    </main>
  );
}
