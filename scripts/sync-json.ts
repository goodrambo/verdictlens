import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { models, skills, useCases } from '../lib/data';

const root = process.cwd();
const outDir = join(root, 'public', 'data');

function difficultyToScore(level: string) {
  if (level === 'Easy') return 94;
  if (level === 'Moderate') return 78;
  return 62;
}

async function main() {
  const modelsJson = {
    updatedAt: new Date().toISOString(),
    count: models.length,
    items: models,
  };

  const skillsJson = {
    updatedAt: new Date().toISOString(),
    count: skills.length,
    items: skills.map((skill) => ({
      ...skill,
      easeOfSetupScore: difficultyToScore(skill.installDifficulty),
    })),
  };

  const catalogJson = {
    updatedAt: new Date().toISOString(),
    models: modelsJson.items,
    skills: skillsJson.items,
    useCases,
  };

  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'models.json'), JSON.stringify(modelsJson, null, 2) + '\n');
  await writeFile(join(outDir, 'skills.json'), JSON.stringify(skillsJson, null, 2) + '\n');
  await writeFile(join(outDir, 'catalog.json'), JSON.stringify(catalogJson, null, 2) + '\n');

  console.log(`Synced ${models.length} models, ${skills.length} skills, ${useCases.length} use cases to public/data.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
