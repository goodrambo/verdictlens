export type Locale = 'en' | 'zh-TW';

export type ProviderId =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'xai'
  | 'deepseek'
  | 'meta'
  | 'alibaba-cloud'
  | 'mistral'
  | 'cohere'
  | 'perplexity'
  | 'any'
  | 'local';

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

export type Pricing = {
  input: string;
  output: string;
  inputUsdPerMillion?: string;
  outputUsdPerMillion?: string;
  notes?: string;
};

export type SourceKind =
  | 'official-docs'
  | 'official-site'
  | 'official-registry'
  | 'community-registry'
  | 'github'
  | 'pricing-page'
  | 'blog'
  | 'benchmark'
  | 'manual-review';

export type SourceRef = {
  id: string;
  label: string;
  url: string;
  kind: SourceKind;
  trustTier: 1 | 2 | 3 | 4 | 5;
  fieldPaths?: string[];
  fetchedAt: string;
  notes?: string;
};

export type ProviderLogo = {
  type: 'svg' | 'png' | 'tile';
  path: string;
  alt: string;
};

export type Provider = {
  id: ProviderId;
  slug: string;
  name: string;
  shortName: string;
  kind: 'model-vendor' | 'skill-vendor' | 'registry' | 'open-source' | 'framework';
  officialUrl: string;
  docsUrl?: string;
  logo: ProviderLogo;
  logoPath: string;
  sourceRefs: SourceRef[];
  updatedAt: string;
  lastVerifiedAt: string;
};

export type Model = {
  id: string;
  slug: string;
  status: 'active' | 'preview' | 'deprecated';
  displayName: string;
  shortName?: string;
  name: string;
  providerId: ProviderId;
  family?: string;
  summary: LocalizedText;
  description: LocalizedText;
  officialUrl: string;
  docsUrl?: string;
  pricingUrl?: string;
  logo?: ProviderLogo;
  modalities: string[];
  modalityProfile?: {
    input: Array<'text' | 'image' | 'audio' | 'video' | 'file'>;
    output: Array<'text' | 'image' | 'audio' | 'video' | 'file' | 'json'>;
  };
  contextWindow: string;
  maxOutputTokens?: string;
  pricing: Pricing;
  speedCategory: 'Fast' | 'Balanced' | 'Deliberate';
  toolSupport?: {
    functionCalling?: boolean;
    structuredOutput?: boolean;
    webSearch?: boolean;
    remoteMcp?: boolean;
    codeExecution?: boolean;
  };
  overallScore: number;
  scores: ScoreBlock;
  bestFor: string[];
  bestUseCases: string[];
  worksWith: string[];
  tags: string[];
  strengths: LocalizedText[];
  caveats: LocalizedText[];
  sourceRefs: SourceRef[];
  updatedAt: string;
  lastVerifiedAt: string;
};

export type SkillCategoryId =
  | 'agent-frameworks'
  | 'workflow-automation'
  | 'browser-web'
  | 'research-retrieval'
  | 'memory-knowledge'
  | 'coding-devtools'
  | 'security-secrets'
  | 'execution-sandboxes'
  | 'data-extraction';

export type SkillCatalogTier = 'curated' | 'registry-validated' | 'registry-listed';

export type SkillArtifactKind = 'skill' | 'mcp-server' | 'connector' | 'workflow' | 'tool-wrapper';

export type Skill = {
  id: string;
  slug: string;
  status: 'active' | 'beta' | 'deprecated';
  displayName: string;
  shortName?: string;
  name: string;
  providerId?: ProviderId;
  categoryId: SkillCategoryId;
  categoryLabel: LocalizedText;
  category: string;
  subCategory?: string;
  skillType: 'mcp' | 'api' | 'connector' | 'browser' | 'workflow' | 'coding' | 'memory' | 'search' | 'security' | 'extraction';
  catalogTier: SkillCatalogTier;
  artifactKind: SkillArtifactKind;
  summary: LocalizedText;
  description: LocalizedText;
  officialUrl?: string;
  docsUrl?: string;
  repoUrl?: string;
  registryUrl?: string;
  preferredSourceUrl: string;
  officialSourceLabel: string;
  logo?: ProviderLogo;
  deployment: 'local' | 'hosted' | 'hybrid';
  installMethod: 'github' | 'registry' | 'npm' | 'pip' | 'manual' | 'hosted' | 'api';
  supportedHosts: string[];
  supportedProviderIds: ProviderId[];
  supportedModels?: string[];
  capabilities: string[];
  auth: {
    type: 'none' | 'api-key' | 'oauth' | 'local-config' | 'custom';
    notes?: string;
  };
  permissionProfile?: {
    level: 'low' | 'medium' | 'high';
    notes?: string;
  };
  installDifficulty: 'Easy' | 'Moderate' | 'Advanced';
  setupDifficulty: 'easy' | 'moderate' | 'advanced';
  utilityScore: number;
  compatibilityScore: number;
  reliabilityScore: number;
  docsScore: number;
  adoptionScore: number;
  safetyMaintenanceScore: number;
  easeOfSetupScore?: number;
  overallScore: number;
  bestFor: string[];
  bestUseCases: string[];
  worksWith: string[];
  tags: string[];
  strengths: LocalizedText[];
  caveats: LocalizedText[];
  sourceRefs: SourceRef[];
  updatedAt: string;
  lastVerifiedAt: string;
};

export type UseCase = {
  id: string;
  slug: string;
  displayName: string;
  title: LocalizedText;
  strapline: LocalizedText;
  summary: LocalizedText;
  userIntent: LocalizedText;
  evaluationLens: LocalizedText[];
  keySelectionCriteria: LocalizedText[];
  recommendedModels: string[];
  recommendedModelSlugs: string[];
  recommendedSkills: string[];
  recommendedSkillSlugs: string[];
  sourceRefs: SourceRef[];
  updatedAt: string;
  lastVerifiedAt: string;
};
