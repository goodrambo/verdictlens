import { UseCase } from '@/lib/types';

const updatedAt = '2026-04-08T14:40:00+08:00';

export const useCases: UseCase[] = [
  {
    slug: 'coding',
    title: {
      en: 'Coding copilots & repo execution',
      'zh-TW': 'Coding 助理與 repo 執行',
    },
    strapline: {
      en: 'When shipping dependable code matters more than surface-level polish.',
      'zh-TW': '當重點是交付可靠可用的程式，而不是只看表面效果。',
    },
    summary: {
      en: 'Prioritize reliability, diff quality, tool-calling control, and the ability to maintain focus across multi-file edits.',
      'zh-TW': '重點放在可靠性、diff 品質、工具呼叫控制，以及跨多檔案編修時的持續專注能力。',
    },
    evaluationLens: [
      { en: 'Code-edit precision and rollback safety', 'zh-TW': '程式修改精準度與可回退性' },
      { en: 'Tool ergonomics in real repositories', 'zh-TW': '在真實 repo 內的工具操作體驗' },
      { en: 'Latency under iterative fix-build-test loops', 'zh-TW': '在反覆修正/建置/測試循環中的延遲表現' },
    ],
    recommendedModels: ['gpt-5-4-pro', 'claude-3-7-sonnet', 'deepseek-r1'],
    recommendedSkills: ['codex-cli', 'claude-code', 'playwright', 'e2b-sandbox'],
    updatedAt,
  },
  {
    slug: 'research',
    title: {
      en: 'Research synthesis & analyst workflows',
      'zh-TW': '研究整合與分析師工作流',
    },
    strapline: {
      en: 'For evidence gathering, market scans, and long-context synthesis.',
      'zh-TW': '適合做證據蒐集、市場掃描與長上下文整合。',
    },
    summary: {
      en: 'Prioritize source grounding, multilingual reading, long-context reasoning, and a retrieval stack that stays inspectable.',
      'zh-TW': '重視來源根據、多語閱讀、長上下文推理，以及可檢視的檢索架構。',
    },
    evaluationLens: [
      { en: 'Source visibility and evidence traceability', 'zh-TW': '來源可見性與證據可追溯性' },
      { en: 'Large-document comprehension quality', 'zh-TW': '大型文件理解品質' },
      { en: 'How well the stack supports repeatable analyst workflows', 'zh-TW': '是否支援可重複執行的分析流程' },
    ],
    recommendedModels: ['gemini-2-5-pro', 'claude-3-7-sonnet', 'perplexity-sonar-reasoning-pro'],
    recommendedSkills: ['serpapi', 'weaviate', 'openai-whisper', 'obsidian-memory-vault'],
    updatedAt,
  },
  {
    slug: 'agent-automation',
    title: {
      en: 'Agent automation & operations',
      'zh-TW': 'Agent 自動化與營運流程',
    },
    strapline: {
      en: 'For teams that need models to trigger, coordinate, and complete operational work.',
      'zh-TW': '適合需要讓模型實際觸發、協調並完成營運工作的團隊。',
    },
    summary: {
      en: 'Prioritize tool reliability, composability, secret handling, and robust state management across long-running flows.',
      'zh-TW': '重視工具可靠性、可組合性、憑證安全，以及長流程中的狀態管理能力。',
    },
    evaluationLens: [
      { en: 'Can the model survive tool-rich workflows?', 'zh-TW': '模型能否撐住工具密集型流程？' },
      { en: 'Are the surrounding skills secure and auditable?', 'zh-TW': '周邊技能是否安全且可稽核？' },
      { en: 'Is the workflow resilient under retries and branching?', 'zh-TW': '面對重試與分支時，流程是否足夠韌性？' },
    ],
    recommendedModels: ['gpt-5-mini', 'gpt-5-4-pro', 'gemini-2-5-flash'],
    recommendedSkills: ['langgraph', 'n8n', '1password-cli', 'mcp-toolbox'],
    updatedAt,
  },
];
