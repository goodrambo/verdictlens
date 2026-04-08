import { Provider } from '@/lib/types';
import { defineProvider } from './factories';

const updatedAt = '2026-04-09T04:20:00+08:00';

export const providers: Provider[] = [
  defineProvider({ id: 'openai', name: 'OpenAI', shortName: 'OpenAI', kind: 'model-vendor', officialUrl: 'https://openai.com/', docsUrl: 'https://platform.openai.com/docs', logoPath: '/brand/providers/openai.svg', updatedAt }),
  defineProvider({ id: 'anthropic', name: 'Anthropic', shortName: 'Anthropic', kind: 'model-vendor', officialUrl: 'https://www.anthropic.com/', docsUrl: 'https://docs.anthropic.com/', logoPath: '/brand/providers/anthropic.svg', updatedAt }),
  defineProvider({ id: 'google', name: 'Google', shortName: 'Google', kind: 'model-vendor', officialUrl: 'https://ai.google.dev/', docsUrl: 'https://ai.google.dev/gemini-api/docs', logoPath: '/brand/providers/google.svg', updatedAt }),
  defineProvider({ id: 'xai', name: 'xAI', shortName: 'xAI', kind: 'model-vendor', officialUrl: 'https://x.ai/', docsUrl: 'https://docs.x.ai/', logoPath: '/brand/providers/xai.svg', updatedAt }),
  defineProvider({ id: 'deepseek', name: 'DeepSeek', shortName: 'DeepSeek', kind: 'model-vendor', officialUrl: 'https://www.deepseek.com/', docsUrl: 'https://api-docs.deepseek.com/', logoPath: '/brand/providers/deepseek.svg', updatedAt }),
  defineProvider({ id: 'meta', name: 'Meta', shortName: 'Meta', kind: 'open-source', officialUrl: 'https://ai.meta.com/', docsUrl: 'https://ai.meta.com/llama/', logoPath: '/brand/providers/meta.svg', updatedAt }),
  defineProvider({ id: 'alibaba-cloud', name: 'Alibaba Cloud', shortName: 'Alibaba', kind: 'model-vendor', officialUrl: 'https://www.alibabacloud.com/', docsUrl: 'https://www.alibabacloud.com/help/en/model-studio/', logoPath: '/brand/providers/alibaba-cloud.svg', updatedAt }),
  defineProvider({ id: 'mistral', name: 'Mistral', shortName: 'Mistral', kind: 'model-vendor', officialUrl: 'https://mistral.ai/', docsUrl: 'https://docs.mistral.ai/', logoPath: '/brand/providers/mistral.svg', updatedAt }),
  defineProvider({ id: 'cohere', name: 'Cohere', shortName: 'Cohere', kind: 'model-vendor', officialUrl: 'https://cohere.com/', docsUrl: 'https://docs.cohere.com/', logoPath: '/brand/providers/cohere.svg', updatedAt }),
  defineProvider({ id: 'perplexity', name: 'Perplexity', shortName: 'Perplexity', kind: 'model-vendor', officialUrl: 'https://www.perplexity.ai/', docsUrl: 'https://docs.perplexity.ai/', logoPath: '/brand/providers/perplexity.svg', updatedAt }),
  defineProvider({ id: 'any', name: 'Any provider', shortName: 'Any', kind: 'framework', officialUrl: 'https://modelcontextprotocol.io/', docsUrl: 'https://modelcontextprotocol.io/introduction', logoPath: '/brand/providers/any.svg', updatedAt }),
  defineProvider({ id: 'local', name: 'Local runtime', shortName: 'Local', kind: 'open-source', officialUrl: 'https://github.com/openai/whisper', docsUrl: 'https://github.com/openai/whisper', logoPath: '/brand/providers/local.svg', updatedAt }),
];

export const providerMap = Object.fromEntries(providers.map((provider) => [provider.id, provider])) as Record<string, Provider>;
