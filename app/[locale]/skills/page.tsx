import type { Metadata } from 'next';
import { SkillsExplorer } from '@/components/SkillsExplorer';
import { SectionIntro } from '@/components/SectionIntro';
import { skills } from '@/lib/data';
import { getLocale, ui } from '@/lib/i18n';
import { absoluteUrl, siteName } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const copy = ui[locale];
  return {
    title: `${siteName} — ${copy.nav.skills}`,
    description: locale === 'en' ? 'Browse operational AI skills, tools, and workflow layers.' : '瀏覽 AI 技能、工具與工作流層。',
    openGraph: {
      title: `${siteName} — ${copy.nav.skills}`,
      description: locale === 'en' ? 'Browse operational AI skills, tools, and workflow layers.' : '瀏覽 AI 技能、工具與工作流層。',
      url: absoluteUrl(`/${locale}/skills`),
    },
  };
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
          body={locale === 'en' ? 'Because a great model without the right tool layer still fails in production.' : '因為再好的模型，缺了正確工具層，正式上線依然會失敗。'}
        />
        <SkillsExplorer skills={skills} locale={locale} />
      </div>
    </main>
  );
}
