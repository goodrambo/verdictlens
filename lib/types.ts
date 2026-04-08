export type Locale = 'en' | 'zh-TW';

export type LocalizedText = {
  en: string;
  'zh-TW': string;
};

export type ScoreBlock = {
  capability: number;
  useCaseFitness: number;
  costEfficiency: number;
  speed: number;
  reliability: number;
  agentReadiness: number;
  ecosystem: number;
};

export type SkillScoreBlock = {
  utility: number;
  compatibility: number;
  easeOfSetup: number;
  reliability: number;
  docsQuality: number;
  adoption: number;
  safetyMaintenance: number;
};

export type Pricing = {
  input: string;
  output: string;
};

export type Model = {
  slug: string;
  name: string;
  provider: string;
  description: LocalizedText;
  modalities: string[];
  contextWindow: string;
  pricing: Pricing;
  speedCategory: 'Fast' | 'Balanced' | 'Deliberate';
  overallScore: number;
  scores: ScoreBlock;
  bestUseCases: string[];
  tags: string[];
  strengths: LocalizedText[];
  caveats: LocalizedText[];
  updatedAt: string;
};

export type Skill = {
  slug: string;
  name: string;
  category: string;
  description: LocalizedText;
  supportedProviders: string[];
  installDifficulty: 'Easy' | 'Moderate' | 'Advanced';
  utilityScore: number;
  compatibilityScore: number;
  reliabilityScore: number;
  docsScore: number;
  adoptionScore: number;
  safetyMaintenanceScore: number;
  easeOfSetupScore?: number;
  overallScore: number;
  bestUseCases: string[];
  tags: string[];
  strengths: LocalizedText[];
  caveats: LocalizedText[];
  updatedAt: string;
};

export type UseCase = {
  slug: string;
  title: LocalizedText;
  strapline: LocalizedText;
  summary: LocalizedText;
  evaluationLens: LocalizedText[];
  recommendedModels: string[];
  recommendedSkills: string[];
  updatedAt: string;
};
