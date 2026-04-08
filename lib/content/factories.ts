import { Model, Pricing, Provider, ProviderId, ScoreBlock, Skill, SourceKind, SourceRef, UseCase, LocalizedText } from '@/lib/types';

type SharedSourceInput = Omit<SourceRef, 'fetchedAt'> & { fetchedAt?: string };

export function sourceRef(input: SharedSourceInput): SourceRef {
  return {
    ...input,
    fetchedAt: input.fetchedAt ?? new Date().toISOString(),
  };
}

export function officialSource(label: string, url: string, kind: SourceKind, fetchedAt: string, fieldPaths?: string[]): SourceRef {
  return sourceRef({
    id: `${kind}:${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    label,
    url,
    kind,
    trustTier: 5,
    fetchedAt,
    fieldPaths,
  });
}

export function manualReviewSource(label: string, fetchedAt: string, fieldPaths?: string[], notes?: string): SourceRef {
  return sourceRef({
    id: `manual-review:${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    label,
    url: 'https://verdictlens.local/manual-review',
    kind: 'manual-review',
    trustTier: 3,
    fetchedAt,
    fieldPaths,
    notes,
  });
}

type ProviderSeed = {
  id: ProviderId;
  slug?: string;
  name: string;
  shortName: string;
  kind: Provider['kind'];
  officialUrl: string;
  docsUrl?: string;
  logoPath: string;
  updatedAt: string;
  lastVerifiedAt?: string;
  sourceRefs?: SourceRef[];
};

export function defineProvider(seed: ProviderSeed): Provider {
  return {
    ...seed,
    slug: seed.slug ?? seed.id,
    logoPath: seed.logoPath,
    logo: {
      type: seed.logoPath.endsWith('.png') ? 'png' : 'svg',
      path: seed.logoPath,
      alt: `${seed.name} logo`,
    },
    sourceRefs:
      seed.sourceRefs ??
      [
        officialSource(`${seed.name} official`, seed.officialUrl, 'official-site', seed.lastVerifiedAt ?? seed.updatedAt, ['officialUrl']),
        ...(seed.docsUrl ? [officialSource(`${seed.name} docs`, seed.docsUrl, 'official-docs', seed.lastVerifiedAt ?? seed.updatedAt, ['docsUrl'])] : []),
      ],
    lastVerifiedAt: seed.lastVerifiedAt ?? seed.updatedAt,
  };
}

type ModelSeed = {
  slug: string;
  name: string;
  providerId: ProviderId;
  officialUrl: string;
  description: LocalizedText;
  modalities: string[];
  contextWindow: string;
  pricing: Pricing;
  speedCategory: Model['speedCategory'];
  overallScore: number;
  scores: ScoreBlock;
  bestUseCases: string[];
  tags: string[];
  strengths: LocalizedText[];
  caveats: LocalizedText[];
  updatedAt: string;
  status?: Model['status'];
  shortName?: string;
  family?: string;
  docsUrl?: string;
  pricingUrl?: string;
  modalityProfile?: Model['modalityProfile'];
  maxOutputTokens?: string;
  toolSupport?: Model['toolSupport'];
  worksWith?: string[];
  sourceRefs?: SourceRef[];
  lastVerifiedAt?: string;
};

export function defineModel(seed: ModelSeed): Model {
  const lastVerifiedAt = seed.lastVerifiedAt ?? seed.updatedAt;

  return {
    ...seed,
    id: `model:${seed.slug}`,
    status: seed.status ?? 'active',
    displayName: seed.name,
    summary: seed.description,
    bestFor: seed.bestUseCases,
    worksWith: seed.worksWith ?? [],
    sourceRefs:
      seed.sourceRefs ??
      [
        officialSource(`${seed.name} official`, seed.officialUrl, 'official-site', lastVerifiedAt, ['officialUrl']),
        ...(seed.docsUrl ? [officialSource(`${seed.name} docs`, seed.docsUrl, 'official-docs', lastVerifiedAt, ['docsUrl'])] : []),
        ...(seed.pricingUrl ? [officialSource(`${seed.name} pricing`, seed.pricingUrl, 'pricing-page', lastVerifiedAt, ['pricing'])] : []),
        manualReviewSource(`${seed.name} VerdictLens review`, lastVerifiedAt, ['bestFor', 'worksWith', 'strengths', 'caveats']),
      ],
    lastVerifiedAt,
  };
}

type SkillSeed = {
  slug: string;
  name: string;
  category: string;
  skillType: Skill['skillType'];
  officialUrl?: string;
  docsUrl?: string;
  repoUrl?: string;
  registryUrl?: string;
  preferredSourceUrl?: string;
  officialSourceLabel: string;
  description: LocalizedText;
  supportedProviderIds: ProviderId[];
  installDifficulty: Skill['installDifficulty'];
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
  status?: Skill['status'];
  shortName?: string;
  providerId?: ProviderId;
  deployment?: Skill['deployment'];
  installMethod?: Skill['installMethod'];
  supportedHosts?: string[];
  supportedModels?: string[];
  capabilities?: string[];
  auth?: Skill['auth'];
  permissionProfile?: Skill['permissionProfile'];
  worksWith?: string[];
  sourceRefs?: SourceRef[];
  lastVerifiedAt?: string;
};

export function defineSkill(seed: SkillSeed): Skill {
  const lastVerifiedAt = seed.lastVerifiedAt ?? seed.updatedAt;
  const preferredSourceUrl = seed.preferredSourceUrl ?? seed.docsUrl ?? seed.repoUrl ?? seed.registryUrl ?? seed.officialUrl ?? '';

  return {
    ...seed,
    id: `skill:${seed.slug}`,
    status: seed.status ?? 'active',
    displayName: seed.name,
    summary: seed.description,
    preferredSourceUrl,
    deployment: seed.deployment ?? 'hybrid',
    installMethod: seed.installMethod ?? 'manual',
    supportedHosts: seed.supportedHosts ?? ['CLI', 'API'],
    capabilities: seed.capabilities ?? [],
    auth: seed.auth ?? { type: 'none' },
    setupDifficulty: seed.installDifficulty === 'Easy' ? 'easy' : seed.installDifficulty === 'Moderate' ? 'moderate' : 'advanced',
    bestFor: seed.bestUseCases,
    worksWith: seed.worksWith ?? [],
    sourceRefs:
      seed.sourceRefs ??
      [
        ...(seed.docsUrl ? [officialSource(`${seed.name} docs`, seed.docsUrl, 'official-docs', lastVerifiedAt, ['docsUrl'])] : []),
        ...(seed.repoUrl ? [officialSource(`${seed.name} repo`, seed.repoUrl, 'github', lastVerifiedAt, ['repoUrl'])] : []),
        ...(seed.registryUrl ? [officialSource(`${seed.name} registry`, seed.registryUrl, 'official-registry', lastVerifiedAt, ['registryUrl'])] : []),
        ...(seed.officialUrl && seed.officialUrl !== seed.docsUrl && seed.officialUrl !== seed.repoUrl && seed.officialUrl !== seed.registryUrl
          ? [officialSource(`${seed.name} official`, seed.officialUrl, 'official-site', lastVerifiedAt, ['officialUrl'])]
          : []),
        manualReviewSource(`${seed.name} VerdictLens review`, lastVerifiedAt, ['bestFor', 'worksWith', 'capabilities', 'permissionProfile']),
      ],
    lastVerifiedAt,
  };
}

type UseCaseSeed = {
  slug: string;
  title: LocalizedText;
  strapline: LocalizedText;
  summary: LocalizedText;
  evaluationLens: LocalizedText[];
  recommendedModels: string[];
  recommendedSkills: string[];
  updatedAt: string;
  sourceRefs?: SourceRef[];
  lastVerifiedAt?: string;
};

export function defineUseCase(seed: UseCaseSeed): UseCase {
  const lastVerifiedAt = seed.lastVerifiedAt ?? seed.updatedAt;

  return {
    ...seed,
    id: `use-case:${seed.slug}`,
    displayName: seed.title.en,
    userIntent: seed.strapline,
    keySelectionCriteria: seed.evaluationLens,
    recommendedModelSlugs: seed.recommendedModels,
    recommendedSkillSlugs: seed.recommendedSkills,
    sourceRefs:
      seed.sourceRefs ?? [manualReviewSource(`${seed.title.en} VerdictLens review`, lastVerifiedAt, ['recommendedModels', 'recommendedSkills', 'evaluationLens'])],
    lastVerifiedAt,
  };
}
