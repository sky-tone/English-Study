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
  },
  mrs_webb: {
    id: 'mrs_webb',
    name: 'Mrs Webb',
    avatar: '/images/mrs_webb.png',
    description: 'Ben 的妈妈',
    greeting: 'Be careful in the kitchen, children! 🍳'
  }
};

// ============================================================
// 积木数据库 - Module 1 Seasons
// ============================================================

// 🟦 蓝色积木 - 主语 (Module 1)
const SEASON_SUBJECT_BLOCKS = [
  { id: 'ss1', word: 'It', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 'ss2', word: 'I', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 'ss3', word: 'We', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 'ss4', word: 'The weather', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 'ss5', word: 'Spring', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 'ss6', word: 'Summer', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 'ss7', word: 'Autumn', type: BlockType.SUBJECT, color: '#4A90D9' },
  { id: 'ss8', word: 'Winter', type: BlockType.SUBJECT, color: '#4A90D9' }
];

// 🟥 红色积木 - 时态 (Module 1)
const SEASON_TENSE_BLOCKS = [
  { id: 'st1', word: 'is', type: BlockType.TENSE, color: '#E74C3C', forSubjects: ['It', 'The weather', 'Spring', 'Summer', 'Autumn', 'Winter'] },
  { id: 'st2', word: 'can', type: BlockType.TENSE, color: '#E74C3C', accepts: [VerbForm.BARE] },
  { id: 'st3', word: 'like', type: BlockType.TENSE, color: '#E74C3C', forSubjects: ['I', 'We'] },
  { id: 'st4', word: 'likes', type: BlockType.TENSE, color: '#E74C3C', forSubjects: ['He', 'She', 'Ben'], isDistractor: true }
];

// 🟩 绿色积木 - 动词/形容词 (Module 1)
const SEASON_VERB_BLOCKS = [
  { id: 'sv_s1', word: 'warm', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv_s2', word: 'hot', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv_s3', word: 'cool', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv_s4', word: 'cold', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv_s5', word: 'go swimming', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv_s6', word: 'fly kites', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv_s7', word: 'make a snowman', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv_s8', word: 'pick flowers', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  // 干扰项
  { id: 'sv_s_wrong1', word: 'swimming', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.GERUND, isDistractor: true }
];

// 🟨 黄色积木 - 时间/季节状语 (Module 1)
const SEASON_TIME_BLOCKS = [
  { id: 'stm1', word: 'in spring', type: BlockType.TIME, color: '#F39C12' },
  { id: 'stm2', word: 'in summer', type: BlockType.TIME, color: '#F39C12' },
  { id: 'stm3', word: 'in autumn', type: BlockType.TIME, color: '#F39C12' },
  { id: 'stm4', word: 'in winter', type: BlockType.TIME, color: '#F39C12' },
  { id: 'stm5', word: 'in Guangzhou', type: BlockType.TIME, color: '#F39C12' }
];

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
// 积木数据库 - Module 5 Safety (祈使句)
// ============================================================

// 🟥 红色积木 - 祈使句指令引擎（句首大写）
const IMPERATIVE_BLOCKS = [
  { id: 'imp1', word: "Don't", type: BlockType.IMPERATIVE, color: '#E74C3C' },
  { id: 'imp2', word: 'Do', type: BlockType.IMPERATIVE, color: '#E74C3C' },
  { id: 'imp3', word: 'Be', type: BlockType.IMPERATIVE, color: '#E74C3C' },
  { id: 'imp4', word: 'You must', type: BlockType.IMPERATIVE, color: '#E74C3C' }
];

// 🟩 绿色积木 - 核心危险动作（动词原形）- Module 5
const SAFETY_VERB_BLOCKS = [
  { id: 'sv1', word: 'run', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv2', word: 'walk', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv3', word: 'touch', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv4', word: 'cross', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv5', word: 'climb', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv6', word: 'feed', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv7', word: 'play', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  { id: 'sv8', word: 'enter', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.BARE },
  // 干扰项 - 错误形式（非原形）
  { id: 'sv_wrong1', word: 'crossing', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.GERUND, isDistractor: true },
  { id: 'sv_wrong2', word: 'runs', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.THIRD_PERSON, isDistractor: true },
  { id: 'sv_wrong3', word: 'climbing', type: BlockType.VERB, color: '#27AE60', verbForm: VerbForm.GERUND, isDistractor: true }
];

// 🟨 黄色积木 - 危险物品/地点
const OBJECT_BLOCKS = [
  { id: 'ob1', word: 'near the hot water', type: BlockType.OBJECT, color: '#F39C12' },
  { id: 'ob2', word: 'a fan', type: BlockType.OBJECT, color: '#F39C12' },
  { id: 'ob3', word: 'the animals', type: BlockType.OBJECT, color: '#F39C12' },
  { id: 'ob4', word: 'tall trees', type: BlockType.OBJECT, color: '#F39C12' },
  { id: 'ob5', word: 'on the stairs', type: BlockType.OBJECT, color: '#F39C12' },
  { id: 'ob6', word: 'the road', type: BlockType.OBJECT, color: '#F39C12' },
  { id: 'ob7', word: 'in the street', type: BlockType.OBJECT, color: '#F39C12' },
  { id: 'ob8', word: 'the knife', type: BlockType.OBJECT, color: '#F39C12' }
];

// 🟣 紫色积木 - 条件/状态后缀
const ADJECTIVE_BLOCKS = [
  { id: 'adj1', word: 'careful', type: BlockType.ADJECTIVE, color: '#9B59B6' },
  { id: 'adj2', word: 'when the traffic light is red', type: BlockType.ADJECTIVE, color: '#9B59B6' },
  { id: 'adj3', word: 'quiet', type: BlockType.ADJECTIVE, color: '#9B59B6' },
  { id: 'adj4', word: 'safe', type: BlockType.ADJECTIVE, color: '#9B59B6' }
];

// ============================================================
// 关卡配置 - Module 2 Travel Plan
// ============================================================
const LEVELS = [
  // ============================================================
  // Module 1 Seasons - 季节与天气关卡
  // ============================================================
  {
    id: 'level_m1_1',
    module: 'Module 1',
    title: 'Seasons - Level 1',
    subtitle: '认识四季，描述天气',
    difficulty: 1,
    npc: 'aki',
    trigger: {
      character: 'aki',
      message: 'Wow, your planet has 4 seasons! Tell me about the weather! 🌤️',
      subMessage: '用积木描述不同季节的天气吧！'
    },
    objectives: [
      '用 It is + 形容词 描述天气',
      '搭配季节时间状语'
    ],
    requiredTypes: [BlockType.SUBJECT, BlockType.TENSE, BlockType.VERB],
    availableBlocks: {
      subjects: ['ss1', 'ss4', 'ss5', 'ss6', 'ss7', 'ss8'],
      tenses: ['st1'],
      verbs: ['sv_s1', 'sv_s2', 'sv_s3', 'sv_s4'],
      times: ['stm1', 'stm2', 'stm3', 'stm4', 'stm5'],
      sequences: [],
      imperatives: [],
      objects: [],
      adjectives: []
    },
    sampleAnswers: [
      ['It', 'is', 'warm', 'in spring'],
      ['It', 'is', 'hot', 'in summer'],
      ['It', 'is', 'cool', 'in autumn'],
      ['It', 'is', 'cold', 'in winter']
    ],
    maxScore: 100,
    passScore: 60
  },
  {
    id: 'level_m1_2',
    module: 'Module 1',
    title: 'Seasons Fun - Level 2',
    subtitle: '说说你最喜欢的季节活动',
    difficulty: 1,
    npc: 'ben',
    trigger: {
      character: 'ben',
      message: 'I love playing in the snow! What can you do in different seasons? ☃️',
      subMessage: '描述不同季节可以做什么活动吧！'
    },
    objectives: [
      '用 I/We can + 动词原形 描述活动',
      '搭配不同的季节时间状语'
    ],
    requiredTypes: [BlockType.SUBJECT, BlockType.TENSE, BlockType.VERB],
    availableBlocks: {
      subjects: ['ss2', 'ss3'],
      tenses: ['st2'],
      verbs: ['sv_s5', 'sv_s6', 'sv_s7', 'sv_s8', 'sv_s_wrong1'],
      times: ['stm1', 'stm2', 'stm3', 'stm4'],
      sequences: [],
      imperatives: [],
      objects: [],
      adjectives: []
    },
    sampleAnswers: [
      ['I', 'can', 'go swimming', 'in summer'],
      ['We', 'can', 'fly kites', 'in spring'],
      ['I', 'can', 'make a snowman', 'in winter'],
      ['We', 'can', 'pick flowers', 'in autumn']
    ],
    maxScore: 100,
    passScore: 60
  },
  // ============================================================
  // Module 2 Travel Plan - 旅行计划关卡
  // ============================================================
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
      sequences: [],
      imperatives: [],
      objects: [],
      adjectives: []
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
      sequences: ['sq1', 'sq2', 'sq3', 'sq4', 'sq5', 'sq6', 'sq7'],
      imperatives: [],
      objects: [],
      adjectives: []
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
      sequences: [],
      imperatives: [],
      objects: [],
      adjectives: []
    },
    sampleAnswers: [
      ['Use', 'a pencil', 'to', 'draw'],
      ['Use', 'scissors', 'to', 'cut']
    ],
    maxScore: 100,
    passScore: 60
  },
  // ============================================================
  // Module 5 Safety - 祈使句关卡
  // ============================================================
  {
    id: 'level_4',
    module: 'Module 5',
    title: 'Kitchen Safety - Level 4',
    subtitle: '🔥 Mrs Webb 的厨房危机！阻止 Ben 的危险行为',
    difficulty: 1,
    npc: 'mrs_webb',
    scenario: 'kitchen',
    trigger: {
      character: 'mrs_webb',
      message: '🔥 Ben is in the kitchen with a sharp knife and hot water! Help me stop him! 🚨',
      subMessage: '快用安全指令阻止 Ben 的危险动作！'
    },
    objectives: [
      '使用 Don\'t 造一个安全警告句',
      '正确搭配动词原形和危险物品'
    ],
    requiredTypes: [BlockType.IMPERATIVE, BlockType.VERB],
    availableBlocks: {
      subjects: [],
      tenses: [],
      verbs: ['sv1', 'sv2', 'sv3', 'sv_wrong1'],
      times: [],
      sequences: [],
      imperatives: ['imp1', 'imp3'],
      objects: ['ob1', 'ob5', 'ob8'],
      adjectives: ['adj1']
    },
    sampleAnswers: [
      ["Don't", 'run', 'near the hot water'],
      ["Don't", 'touch', 'the knife'],
      ['Be', 'careful']
    ],
    maxScore: 100,
    passScore: 60
  },
  {
    id: 'level_5',
    module: 'Module 5',
    title: 'Zoo Safety - Level 5',
    subtitle: '🐒 外星人 Aki 大闹动物园！',
    difficulty: 2,
    npc: 'aki',
    scenario: 'zoo',
    trigger: {
      character: 'aki',
      message: '🐒 Look at those monkeys! I want to feed them! Let me climb over the fence! 🍌',
      subMessage: '快对 Aki 大喊警告，阻止他的危险行为！'
    },
    objectives: [
      '使用 Don\'t 或 Do not 拼装警告标语',
      '识别并纠正逻辑冲突句子'
    ],
    requiredTypes: [BlockType.IMPERATIVE, BlockType.VERB],
    availableBlocks: {
      subjects: [],
      tenses: [],
      verbs: ['sv5', 'sv6', 'sv8', 'sv_wrong3'],
      times: [],
      sequences: [],
      imperatives: ['imp1', 'imp2', 'imp4'],
      objects: ['ob3', 'ob4'],
      adjectives: ['adj1', 'adj3']
    },
    sampleAnswers: [
      ["Don't", 'feed', 'the animals'],
      ["Don't", 'climb', 'tall trees'],
      ["Don't", 'enter']
    ],
    maxScore: 100,
    passScore: 70
  },
  {
    id: 'level_6',
    module: 'Module 5',
    title: 'Street Safety - Level 6',
    subtitle: '🚦 街头生存指南！制定交通规则',
    difficulty: 2,
    npc: 'ben',
    scenario: 'street',
    trigger: {
      character: 'ben',
      message: '🚦 A boy is trying to cross the road when the light is red! Someone is playing football in the street! 🏈',
      subMessage: '快制定交通安全规则！'
    },
    objectives: [
      '使用 Don\'t 制定至少2条交通规则',
      '使用 Be careful 搭配条件状语'
    ],
    requiredTypes: [BlockType.IMPERATIVE, BlockType.VERB],
    availableBlocks: {
      subjects: [],
      tenses: [],
      verbs: ['sv1', 'sv2', 'sv4', 'sv7', 'sv_wrong1', 'sv_wrong2'],
      times: [],
      sequences: [],
      imperatives: ['imp1', 'imp2', 'imp3', 'imp4'],
      objects: ['ob6', 'ob7'],
      adjectives: ['adj1', 'adj2', 'adj4']
    },
    sampleAnswers: [
      ["Don't", 'cross', 'the road', 'when the traffic light is red'],
      ["Don't", 'play', 'in the street'],
      ['Be', 'careful'],
      ["Don't", 'run', 'in the street']
    ],
    maxScore: 100,
    passScore: 70,
    minSentences: 2
  }
];

// ============================================================
// 词汇背包 - 本周必背清单
// ============================================================
const VOCABULARY_BACKPACK = {
  module_1: {
    title: 'Module 1 - Seasons',
    words: [
      { word: 'spring', chinese: '春天', phonetic: '/sprɪŋ/' },
      { word: 'summer', chinese: '夏天', phonetic: '/ˈsʌmə/' },
      { word: 'autumn', chinese: '秋天', phonetic: '/ˈɔːtəm/' },
      { word: 'winter', chinese: '冬天', phonetic: '/ˈwɪntə/' },
      { word: 'warm', chinese: '温暖的', phonetic: '/wɔːm/' },
      { word: 'hot', chinese: '炎热的', phonetic: '/hɒt/' },
      { word: 'cool', chinese: '凉爽的', phonetic: '/kuːl/' },
      { word: 'cold', chinese: '寒冷的', phonetic: '/kəʊld/' },
      { word: 'weather', chinese: '天气', phonetic: '/ˈweðə/' },
      { word: 'season', chinese: '季节', phonetic: '/ˈsiːzn/' },
      { word: 'fly kites', chinese: '放风筝', phonetic: '' },
      { word: 'go swimming', chinese: '去游泳', phonetic: '' },
      { word: 'make a snowman', chinese: '堆雪人', phonetic: '' },
      { word: 'pick flowers', chinese: '摘花', phonetic: '' }
    ]
  },
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
  },
  module_5: {
    title: 'Module 5 - Safety',
    words: [
      { word: 'dangerous', chinese: '危险的', phonetic: '/ˈdeɪndʒərəs/' },
      { word: 'careful', chinese: '小心的', phonetic: '/ˈkeəfl/' },
      { word: 'safe', chinese: '安全的', phonetic: '/seɪf/' },
      { word: 'knife', chinese: '刀', phonetic: '/naɪf/' },
      { word: 'sharp', chinese: '锋利的', phonetic: '/ʃɑːp/' },
      { word: 'hot water', chinese: '热水', phonetic: '' },
      { word: 'cross', chinese: '穿越', phonetic: '/krɒs/' },
      { word: 'traffic light', chinese: '交通灯', phonetic: '/ˈtræfɪk laɪt/' },
      { word: 'feed', chinese: '喂', phonetic: '/fiːd/' },
      { word: 'climb', chinese: '攀爬', phonetic: '/klaɪm/' },
      { word: 'touch', chinese: '触摸', phonetic: '/tʌtʃ/' },
      { word: 'enter', chinese: '进入', phonetic: '/ˈentə/' },
      { word: 'stairs', chinese: '楼梯', phonetic: '/steəz/' },
      { word: 'fan', chinese: '风扇', phonetic: '/fæn/' },
      { word: 'street', chinese: '街道', phonetic: '/striːt/' },
      { word: 'road', chinese: '马路', phonetic: '/rəʊd/' }
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
    subjects: [...SEASON_SUBJECT_BLOCKS, ...SUBJECT_BLOCKS],
    tenses: [...SEASON_TENSE_BLOCKS, ...TENSE_BLOCKS],
    verbs: [...SEASON_VERB_BLOCKS, ...VERB_BLOCKS, ...SAFETY_VERB_BLOCKS],
    times: [...SEASON_TIME_BLOCKS, ...TIME_BLOCKS],
    sequences: SEQUENCE_BLOCKS,
    imperatives: IMPERATIVE_BLOCKS,
    objects: OBJECT_BLOCKS,
    adjectives: ADJECTIVE_BLOCKS
  };

  const result = {};

  for (const [category, ids] of Object.entries(level.availableBlocks)) {
    if (allBlocks[category]) {
      result[category] = allBlocks[category].filter(b => ids.includes(b.id));
    }
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
    ...SEASON_SUBJECT_BLOCKS,
    ...SEASON_TENSE_BLOCKS,
    ...SEASON_VERB_BLOCKS,
    ...SEASON_TIME_BLOCKS,
    ...SUBJECT_BLOCKS,
    ...TENSE_BLOCKS,
    ...VERB_BLOCKS,
    ...TIME_BLOCKS,
    ...SEQUENCE_BLOCKS,
    ...IMPERATIVE_BLOCKS,
    ...SAFETY_VERB_BLOCKS,
    ...OBJECT_BLOCKS,
    ...ADJECTIVE_BLOCKS
  ];
  return allBlocks.find(b => b.id === blockId) || null;
}

module.exports = {
  NPC_CHARACTERS,
  SEASON_SUBJECT_BLOCKS,
  SEASON_TENSE_BLOCKS,
  SEASON_VERB_BLOCKS,
  SEASON_TIME_BLOCKS,
  SUBJECT_BLOCKS,
  TENSE_BLOCKS,
  VERB_BLOCKS,
  TIME_BLOCKS,
  SEQUENCE_BLOCKS,
  IMPERATIVE_BLOCKS,
  SAFETY_VERB_BLOCKS,
  OBJECT_BLOCKS,
  ADJECTIVE_BLOCKS,
  LEVELS,
  VOCABULARY_BACKPACK,
  getBlocksForLevel,
  getBlockById
};
