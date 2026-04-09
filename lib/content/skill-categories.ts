import { LocalizedText } from '@/lib/types';

export const skillCategoryMeta = {
  'agent-frameworks': {
    label: { en: 'Agent frameworks', 'zh-TW': 'Agent 框架' },
    description: { en: 'Orchestration, graph runtimes, and agent SDKs.', 'zh-TW': '編排、graph runtime 與 agent SDK。' },
  },
  'workflow-automation': {
    label: { en: 'Workflow automation', 'zh-TW': '工作流自動化' },
    description: { en: 'Triggers, automations, and multi-step orchestration.', 'zh-TW': '觸發器、自動化與多步驟流程編排。' },
  },
  'browser-web': {
    label: { en: 'Browser & web interaction', 'zh-TW': '瀏覽器與網頁互動' },
    description: { en: 'Browser control, scraping, and web execution.', 'zh-TW': '瀏覽器控制、抓取與網頁執行。' },
  },
  'research-retrieval': {
    label: { en: 'Research & retrieval', 'zh-TW': '研究與檢索' },
    description: { en: 'Search, crawling, retrieval, and grounded answers.', 'zh-TW': '搜尋、抓取、檢索與有根據的回答。' },
  },
  'memory-knowledge': {
    label: { en: 'Memory & knowledge', 'zh-TW': '記憶與知識層' },
    description: { en: 'Long-term memory, vector stores, and knowledge layers.', 'zh-TW': '長期記憶、向量資料庫與知識層。' },
  },
  'coding-devtools': {
    label: { en: 'Coding & devtools', 'zh-TW': 'Coding 與開發工具' },
    description: { en: 'Code generation, local development, and engineering workflows.', 'zh-TW': '程式生成、本地開發與工程工作流。' },
  },
  'security-secrets': {
    label: { en: 'Security & secrets', 'zh-TW': '安全與密鑰管理' },
    description: { en: 'Identity, secrets, and access-control layers.', 'zh-TW': '身份、密鑰與權限控制層。' },
  },
  'execution-sandboxes': {
    label: { en: 'Execution & sandboxes', 'zh-TW': '執行環境與沙盒' },
    description: { en: 'Hosted runtimes, code execution, and isolated environments.', 'zh-TW': '託管 runtime、程式執行與隔離環境。' },
  },
  'data-extraction': {
    label: { en: 'Data extraction', 'zh-TW': '資料擷取' },
    description: { en: 'Parsing, OCR, transcription, and extraction utilities.', 'zh-TW': '解析、OCR、轉錄與擷取工具。' },
  },
} as const satisfies Record<string, { label: LocalizedText; description: LocalizedText }>;

export type SkillCategoryId = keyof typeof skillCategoryMeta;

export function getSkillCategory(categoryId: SkillCategoryId) {
  return skillCategoryMeta[categoryId];
}
