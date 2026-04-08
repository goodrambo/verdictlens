import { ProviderMetadata } from '@/lib/types';

export const providers: ProviderMetadata[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    shortName: 'OpenAI',
    officialUrl: 'https://openai.com/',
    logoPath: '/brand/providers/openai.svg',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    shortName: 'Anthropic',
    officialUrl: 'https://www.anthropic.com/',
    logoPath: '/brand/providers/anthropic.svg',
  },
  {
    id: 'google',
    name: 'Google',
    shortName: 'Google',
    officialUrl: 'https://ai.google.dev/',
    logoPath: '/brand/providers/google.svg',
  },
  {
    id: 'xai',
    name: 'xAI',
    shortName: 'xAI',
    officialUrl: 'https://x.ai/',
    logoPath: '/brand/providers/xai.svg',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    shortName: 'DeepSeek',
    officialUrl: 'https://www.deepseek.com/',
    logoPath: '/brand/providers/deepseek.svg',
  },
  {
    id: 'meta',
    name: 'Meta',
    shortName: 'Meta',
    officialUrl: 'https://ai.meta.com/',
    logoPath: '/brand/providers/meta.svg',
  },
  {
    id: 'alibaba-cloud',
    name: 'Alibaba Cloud',
    shortName: 'Alibaba',
    officialUrl: 'https://www.alibabacloud.com/',
    logoPath: '/brand/providers/alibaba-cloud.svg',
  },
  {
    id: 'mistral',
    name: 'Mistral',
    shortName: 'Mistral',
    officialUrl: 'https://mistral.ai/',
    logoPath: '/brand/providers/mistral.svg',
  },
  {
    id: 'cohere',
    name: 'Cohere',
    shortName: 'Cohere',
    officialUrl: 'https://cohere.com/',
    logoPath: '/brand/providers/cohere.svg',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    shortName: 'Perplexity',
    officialUrl: 'https://www.perplexity.ai/',
    logoPath: '/brand/providers/perplexity.svg',
  },
  {
    id: 'any',
    name: 'Any provider',
    shortName: 'Any',
    officialUrl: 'https://modelcontextprotocol.io/',
    logoPath: '/brand/providers/any.svg',
  },
  {
    id: 'local',
    name: 'Local runtime',
    shortName: 'Local',
    officialUrl: 'https://github.com/openai/whisper',
    logoPath: '/brand/providers/local.svg',
  },
];

export const providerMap = Object.fromEntries(providers.map((provider) => [provider.id, provider])) as Record<string, ProviderMetadata>;
