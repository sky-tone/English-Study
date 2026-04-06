/**
 * mock-data.js - Module 2 Travel Plan 模拟数据
 *
 * Phase 1 MVP 使用写死数据，包含：
 * - NPC 情景对话
 * - 词汇背包数据
 * - 积木库（按颜色/类型分类）
 * - 关卡任务配置
 */

const { BlockType, VerbForm } = require('./collision');

// ============================================================
// NPC 角色定义
// ============================================================
const NPC_CHARACTERS = {
  aki: {
    id: 'aki',
    name: 'Aki',
    avatar: '/images/aki.png',
    description: '来自外太空的小伙伴',
    greeting: 'Hello! I\'m Aki from Planet Zeta! 🛸'
  },
  ben: {
    id: 'ben',
    name: 'Ben',
    avatar: '/images/ben.png',
    description: 'Aki 的好朋友',
    greeting: 'Hi there! I\'m Ben! 👋'
  }
};

// ============================================================
// 积木数据库 - Module 2 Travel Plan
// ============================================================

// 🟦 蓝色积木 - 主语
const SUBJECT_BLOCKS = [
  { id: 's1', word: 'I', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 's2', word: 'We', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 's3', word: 'Ben', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 's4', word: 'My family', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 's5', word: 'He', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 's6', word: 'She', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 's7', word: 'They', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 's8', word: 'My parents', type: BlockType.SUBJECT, color: '#4A90D9' }
];

// 🟥 红色积木 - 时态核心
const TENSE_BLOCKS = [
  { id: 't1', word: 'will', type: BlockType.TENSE, color: '#E74C3C', accepts: [VerbForm.BARE] },
  { id: 't2', word: 'am', type: BlockType.TENSE, color: '#E74C3C', forSubjects: ['I'] },
  { id: 't3', word: 'is', type: BlockType.TENSE, color: '#E74C3C', forSubjects: ['He', 'She', 'It', 'Ben', 'Aki'] },
  { id: 't4', word: 'are', type: BlockType.TENSE, color: '#E74C3C', forSubjects: ['We', 'You', 'They', 'My family', 'My parents', 'Ben and I'] },
  { id: 't5', word: 'going to', type: BlockType.TENSE, color: '#E74C3C', tenseGroup: 'be_going_to', accepts: [VerbForm.BARE] }
];

// 🟩 绿色积木 - 动词原形短语
const VERB_BLOCKS = [
  { id: 'v1', word: 'travel to Beijing', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'v2', word: 'go mountain climbing', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'v3', word: 'visit the Great Wall', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'v4', word: 'go for a picnic', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'v5', word: 'travel to Hainan', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'v6', word: 'swim in the pool', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'v7', word: 'take a plane', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'v8', word: 'take a bus', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'v9', word: 'visit the museum', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'v10', word: 'eat local food', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  // 干扰项 - 错误形式
  { id: 'v_wrong1', word: 'swimming', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.GERUND, isDistractor: true },
  { id: 'v_wrong2', word: 'went', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.PAST, isDistractor: true },
  { id: 'v_wrong3', word: 'travelling', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.GERUND, isDistractor: true },
  // Module 5 - 名词工具 (用于 Use...to... 句型)
  { id: 'v_tool1', word: 'a pencil', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.NOUN },
  { id: 'v_tool2', word: 'scissors', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.NOUN },
  { id: 'v_tool3', word: 'draw', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'v_tool4', word: 'cut', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE }
];

// 🟨 黄色积木 - 时间状语
const TIME_BLOCKS = [
  { id: 'tm1', word: 'this Saturday', type: BlockType.TIME, color: '#F39C12' },
  { id: 'tm2', word: 'next week', type: BlockType.TIME, color: '#F39C12' },
  { id: 'tm3', word: 'early in the morning', type: BlockType.TIME, color: '#F39C12' },
  { id: 'tm4', word: 'this summer holiday', type: BlockType.TIME, color: '#F39C12' },
  { id: 'tm5', word: 'next Monday', type: BlockType.TIME, color: '#F39C12' },
  { id: 'tm6', word: 'tomorrow', type: BlockType.TIME, color: '#F39C12' },
  { id: 'tm7', word: 'in the afternoon', type: BlockType.TIME, color: '#F39C12' }
];

// 🟣 紫色积木 - 顺序连接词
const SEQUENCE_BLOCKS = [
  { id: 'sq1', word: 'First,', type: BlockType.SEQUENCE, color: '#9B59B6', order: 1 },
  { id: 'sq2', word: 'Next,', type: BlockType.SEQUENCE, color: '#9B59B6', order: 2 },
  { id: 'sq3', word: 'Then,', type: BlockType.SEQUENCE, color: '#9B59B6', order: 3 },
  { id: 'sq4', word: 'Finally,', type: BlockType.SEQUENCE, color: '#9B59B6', order: 4 },
  { id: 'sq5', word: 'On the first day,', type: BlockType.SEQUENCE, color: '#9B59B6', order: 1 },
  { id: 'sq6', word: 'On the second day,', type: BlockType.SEQUENCE, color: '#9B59B6', order: 2 },
  { id: 'sq7', word: 'On the last day,', type: BlockType.SEQUENCE, color: '#9B59B6', order: 3 }
];

// ============================================================
// 关卡配置 - Module 2 Travel Plan
// ============================================================
const LEVELS = [
  {
    id: 'level_1',
    module: 'Module 2',
    title: 'Travel Plan - Level 1',
    subtitle: '帮 Aki 制定一个简单的旅行计划',
    difficulty: 1,
    npc: 'aki',
    trigger: {
      character: 'aki',
      message: 'I want to travel in China, can you make a plan for me? 🗺️',
      subMessage: '帮我用一个句子描述你的旅行计划吧！'
    },
    objectives: [
      '使用 will 或 be going to 造一个句子',
      '正确搭配主语和 Be 动词'
    ],
    requiredTypes: [BlockType.SUBJECT, BlockType.TENSE, BlockType.VERB],
    availableBlocks: {
      subjects: ['s1', 's2', 's3'],
      tenses: ['t1', 't2', 't3', 't4', 't5'],
      verbs: ['v1', 'v2', 'v3', 'v4', 'v5', 'v_wrong1', 'v_wrong2'],
      times: ['tm1', 'tm2', 'tm4'],
      sequences: []
    },
    // 参考答案
    sampleAnswers: [
      ['I', 'will', 'travel to Beijing', 'this Saturday'],
      ['I', 'am', 'going to', 'visit the Great Wall', 'next week'],
      ['We', 'will', 'go mountain climbing', 'this summer holiday'],
      ['My family', 'are', 'going to', 'travel to Hainan']
    ],
    maxScore: 100,
    passScore: 60
  },
  {
    id: 'level_2',
    module: 'Module 2',
    title: 'Travel Plan - Level 2',
    subtitle: '写一个完整的旅行计划（至少3句话）',
    difficulty: 2,
    npc: 'aki',
    trigger: {
      character: 'aki',
      message: 'Wow, that was great! Now can you write a complete travel plan with at least 3 sentences? Use sequence words! ✨',
      subMessage: '用连接词写出完整的旅行计划吧！'
    },
    objectives: [
      '写出至少3个句子',
      '使用紫色连接词（First, Next, Then, Finally）',
      '使用不同的动词短语'
    ],
    requiredTypes: [BlockType.SUBJECT, BlockType.TENSE, BlockType.VERB, BlockType.SEQUENCE],
    availableBlocks: {
      subjects: ['s1', 's2', 's3', 's4', 's5'],
      tenses: ['t1', 't2', 't3', 't4', 't5'],
      verbs: ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10', 'v_wrong1', 'v_wrong2', 'v_wrong3'],
      times: ['tm1', 'tm2', 'tm3', 'tm4', 'tm5', 'tm6', 'tm7'],
      sequences: ['sq1', 'sq2', 'sq3', 'sq4', 'sq5', 'sq6', 'sq7']
    },
    sampleAnswers: [
      ['First,', 'we', 'will', 'take a plane', 'to Beijing'],
      ['Next,', 'we', 'are', 'going to', 'visit the Great Wall'],
      ['Then,', 'we', 'will', 'eat local food'],
      ['Finally,', 'we', 'will', 'go mountain climbing']
    ],
    maxScore: 100,
    passScore: 70,
    minSentences: 3
  },
  {
    id: 'level_3',
    module: 'Module 5',
    title: 'Use...to... - Level 3',
    subtitle: '学习祈使句 Use...to... 的用法',
    difficulty: 2,
    npc: 'ben',
    trigger: {
      character: 'ben',
      message: 'I need to make something for art class. Can you tell me what tools to use? 🎨',
      subMessage: '用 Use...to... 句型帮 Ben 描述如何使用工具吧！'
    },
    objectives: [
      '使用 Use...to... 句型',
      '正确搭配工具名词和动作动词'
    ],
    requiredTypes: [BlockType.VERB],
    availableBlocks: {
      subjects: [],
      tenses: [],
      verbs: ['v_tool1', 'v_tool2', 'v_tool3', 'v_tool4'],
      times: [],
      sequences: []
    },
    sampleAnswers: [
      ['Use', 'a pencil', 'to', 'draw'],
      ['Use', 'scissors', 'to', 'cut']
    ],
    maxScore: 100,
    passScore: 60
  }
];

// ============================================================
// 词汇背包 - 本周必背清单
// ============================================================
const VOCABULARY_BACKPACK = {
  module_2: {
    title: 'Module 2 - Travel Plan',
    words: [
      { word: 'travel', chinese: '旅行', phonetic: '/ˈtrævl/' },
      { word: 'mountain climbing', chinese: '爬山', phonetic: '/ˈmaʊntɪn ˈklaɪmɪŋ/' },
      { word: 'picnic', chinese: '野餐', phonetic: '/ˈpɪknɪk/' },
      { word: 'visit', chinese: '参观', phonetic: '/ˈvɪzɪt/' },
      { word: 'museum', chinese: '博物馆', phonetic: '/mjuːˈziːəm/' },
      { word: 'the Great Wall', chinese: '长城', phonetic: '' },
      { word: 'Hainan', chinese: '海南', phonetic: '' },
      { word: 'Beijing', chinese: '北京', phonetic: '' },
      { word: 'swim', chinese: '游泳', phonetic: '/swɪm/' },
      { word: 'autumn', chinese: '秋天', phonetic: '/ˈɔːtəm/' },
      { word: 'will', chinese: '将要', phonetic: '/wɪl/' },
      { word: 'going to', chinese: '将要（计划）', phonetic: '' },
      { word: 'first', chinese: '首先', phonetic: '/fɜːst/' },
      { word: 'next', chinese: '接下来', phonetic: '/nekst/' },
      { word: 'then', chinese: '然后', phonetic: '/ðen/' },
      { word: 'finally', chinese: '最后', phonetic: '/ˈfaɪnəli/' }
    ]
  }
};

/**
 * 根据关卡配置获取可用积木
 * @param {string} levelId - 关卡ID
 * @returns {Object} 分类积木对象
 */
function getBlocksForLevel(levelId) {
  const level = LEVELS.find(l => l.id === levelId);
  if (!level) return null;

  const allBlocks = {
    subjects: SUBJECT_BLOCKS,
    tenses: TENSE_BLOCKS,
    verbs: VERB_BLOCKS,
    times: TIME_BLOCKS,
    sequences: SEQUENCE_BLOCKS
  };

  const result = {};

  for (const [category, ids] of Object.entries(level.availableBlocks)) {
    result[category] = allBlocks[category].filter(b => ids.includes(b.id));
  }

  return result;
}

/**
 * 获取所有积木（通过 ID 查找）
 * @param {string} blockId - 积木 ID
 * @returns {Object|null} 积木对象
 */
function getBlockById(blockId) {
  const allBlocks = [
    ...SUBJECT_BLOCKS,
    ...TENSE_BLOCKS,
    ...VERB_BLOCKS,
    ...TIME_BLOCKS,
    ...SEQUENCE_BLOCKS
  ];
  return allBlocks.find(b => b.id === blockId) || null;
}

module.exports = {
  NPC_CHARACTERS,
  SUBJECT_BLOCKS,
  TENSE_BLOCKS,
  VERB_BLOCKS,
  TIME_BLOCKS,
  SEQUENCE_BLOCKS,
  LEVELS,
  VOCABULARY_BACKPACK,
  getBlocksForLevel,
  getBlockById
};
