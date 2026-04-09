/**
 * error-tracker.js - 错题追踪与 O2O 组卷映射引擎
 *
 * 监听学生拼装错误并映射到对应题型模板：
 * Mapping A: 词汇拼写错误 -> 首字母填空题型
 * Mapping B: 语法与时态错误 -> 单项选择题型
 * Mapping C: 语序/结构错误 -> 情景写作大题
 * Mapping D: 语音辨析错误 -> 划线发音题型
 */

// 错误类型枚举
const ErrorCategory = {
  SPELLING: 'spelling',
  GRAMMAR: 'grammar',
  STRUCTURE: 'structure',
  PHONICS: 'phonics'
};

// 题型模板枚举
const QuestionTemplate = {
  FILL_IN_BLANK: 'fill_in_blank',        // 首字母填空
  MULTIPLE_CHOICE: 'multiple_choice',      // 单项选择
  WRITING: 'writing',                      // 情景写作
  PRONUNCIATION: 'pronunciation'           // 划线发音
};

// Mapping A: 拼写错误 -> 首字母填空
const SPELLING_TEMPLATES = [
  {
    pattern: 'climb',
    question: 'We will go to c______ the Baiyun Mountain.',
    answer: 'climb',
    hint: '根据首字母提示填空'
  },
  {
    pattern: 'travel',
    question: 'My family will t______ to Hainan this summer.',
    answer: 'travel',
    hint: '根据首字母提示填空'
  },
  {
    pattern: 'museum',
    question: 'We are going to visit the m______.',
    answer: 'museum',
    hint: '根据首字母提示填空'
  },
  {
    pattern: 'autumn',
    question: 'In a______, we can see beautiful leaves.',
    answer: 'autumn',
    hint: '根据首字母提示填空'
  },
  {
    pattern: 'picnic',
    question: 'Let\'s go for a p______ this Saturday.',
    answer: 'picnic',
    hint: '根据首字母提示填空'
  },
  {
    pattern: 'visit',
    question: 'I will v______ the Great Wall next week.',
    answer: 'visit',
    hint: '根据首字母提示填空'
  },
  {
    pattern: 'swim',
    question: 'Ben likes to s______ in the pool.',
    answer: 'swim',
    hint: '根据首字母提示填空'
  },
  // Module 5 Safety 拼写模板
  {
    pattern: 'dangerous',
    question: 'Don\'t run in the street. It\'s d______.',
    answer: 'dangerous',
    hint: '根据首字母提示填空'
  },
  {
    pattern: 'careful',
    question: 'Be c______ when you cross the road.',
    answer: 'careful',
    hint: '根据首字母提示填空'
  },
  {
    pattern: 'cross',
    question: 'Don\'t c______ the road when the traffic light is red.',
    answer: 'cross',
    hint: '根据首字母提示填空'
  },
  {
    pattern: 'touch',
    question: 'Don\'t t______ the hot water.',
    answer: 'touch',
    hint: '根据首字母提示填空'
  },
  {
    pattern: 'feed',
    question: 'Don\'t f______ the animals at the zoo.',
    answer: 'feed',
    hint: '根据首字母提示填空'
  }
];

// Mapping B: 语法错误 -> 单项选择
const GRAMMAR_TEMPLATES = {
  be_verb: [
    {
      question: 'I ______ going to go mountain climbing this Saturday.',
      options: ['am', 'are', 'is'],
      answer: 'am',
      explanation: '"I" 要搭配 "am"'
    },
    {
      question: 'We ______ going to travel to Sanya.',
      options: ['am', 'are', 'is'],
      answer: 'are',
      explanation: '"We" 要搭配 "are"'
    },
    {
      question: 'Ben ______ going to visit the museum.',
      options: ['am', 'are', 'is'],
      answer: 'is',
      explanation: '人名 "Ben" 是第三人称单数，要搭配 "is"'
    }
  ],
  will_ing: [
    {
      question: 'We will ______ to Sanya next week.',
      options: ['travel', 'travelling', 'travelled'],
      answer: 'travel',
      explanation: '"will" 后面跟动词原形'
    },
    {
      question: 'I will ______ mountain climbing this Saturday.',
      options: ['go', 'going', 'went'],
      answer: 'go',
      explanation: '"will" 后面跟动词原形'
    },
    {
      question: 'They will ______ in the pool tomorrow.',
      options: ['swim', 'swimming', 'swam'],
      answer: 'swim',
      explanation: '"will" 后面跟动词原形'
    }
  ],
  be_going_to_noun: [
    {
      question: 'I am going to ______ the Great Wall.',
      options: ['visit', 'visiting', 'visited'],
      answer: 'visit',
      explanation: '"be going to" 后面跟动词原形'
    }
  ],
  be_going_to_wrong_form: [
    {
      question: 'She is going to ______ to Beijing.',
      options: ['travel', 'travelling', 'travels'],
      answer: 'travel',
      explanation: '"be going to" 后面跟动词原形'
    }
  ],
  imperative_verb_form: [
    {
      question: "Don't ______ in the street. It's dangerous.",
      options: ['run', 'running', 'runs'],
      answer: 'run',
      explanation: '"Don\'t" 后面跟动词原形'
    },
    {
      question: "Don't ______ the road when the traffic light is red.",
      options: ['cross', 'crossing', 'crosses'],
      answer: 'cross',
      explanation: '"Don\'t" 后面跟动词原形'
    },
    {
      question: "Don't ______ the animals at the zoo.",
      options: ['feed', 'feeding', 'feeds'],
      answer: 'feed',
      explanation: '"Don\'t" 后面跟动词原形'
    }
  ],
  imperative_be_adjective: [
    {
      question: "______ careful on the stairs.",
      options: ['Be', 'Do', 'Are'],
      answer: 'Be',
      explanation: '"Be" + 形容词，表达安全提醒'
    },
    {
      question: "Be ______ when you cross the road.",
      options: ['careful', 'run', 'cross'],
      answer: 'careful',
      explanation: '"Be" 后面跟形容词'
    }
  ]
};

// Mapping C: 结构错误 -> 情景写作
const WRITING_TEMPLATES = [
  {
    title: 'My Travel Plan',
    instruction: '根据提示写一篇不少于5句话的短文',
    prompt: 'Write about your travel plan. Use the following structure:',
    template: [
      '_______________________ (开头句：介绍目的地)',
      'We will go there by _______________________ (交通工具)',
      'On the first day, we are going to _______________________ (第一天活动)',
      'On the second day, we will _______________________ (第二天活动)',
      '_______________________ (结束句：表达期待)'
    ],
    startingSentence: 'My family and I are going to travel to _______ this summer holiday.'
  },
  {
    title: 'Safety Rules for Our Classroom',
    instruction: '制定5条保持课室安全的规则',
    prompt: 'Make 5 rules to keep your classroom safe. Use imperatives (Don\'t..., Be...):',
    module: 'Module 5',
    template: [
      "1. Don't r_______ on the stairs.",
      "2. Don't c_______ the desks.",
      "3. Be c_______ with scissors.",
      "4. Don't t_______ the fan.",
      "5. Don't p_______ in the classroom."
    ],
    startingSentence: "Here are some safety rules for our classroom:"
  }
];

// Mapping D: 语音辨析 -> 划线发音题
const PHONICS_TEMPLATES = [
  {
    instruction: '找出划线部分读音与其他三个不同的单词',
    options: [
      { word: 'ask', underline: 'a', phonetic: '/ɑː/' },
      { word: 'past', underline: 'a', phonetic: '/ɑː/' },
      { word: 'classmate', underline: 'a', phonetic: '/ɑː/' },
      { word: 'gate', underline: 'a', phonetic: '/eɪ/' }
    ],
    answer: 'gate',
    explanation: 'gate 中的 a 发 /eɪ/，其他三个发 /ɑː/'
  },
  {
    instruction: '找出划线部分读音与其他三个不同的单词',
    options: [
      { word: 'swim', underline: 'i', phonetic: '/ɪ/' },
      { word: 'visit', underline: 'i', phonetic: '/ɪ/' },
      { word: 'climb', underline: 'i', phonetic: '/aɪ/' },
      { word: 'picnic', underline: 'i', phonetic: '/ɪ/' }
    ],
    answer: 'climb',
    explanation: 'climb 中的 i 发 /aɪ/，其他三个发 /ɪ/'
  }
];

/**
 * 根据错误记录生成对应题目
 * @param {Array} errorLog - 错误记录列表
 * @returns {Object} 按题型分类的题目集合
 */
function generateExercises(errorLog) {
  const exercises = {
    fillInBlank: [],
    multipleChoice: [],
    writing: [],
    pronunciation: []
  };

  if (!errorLog || errorLog.length === 0) {
    return exercises;
  }

  for (const error of errorLog) {
    switch (error.type) {
      case ErrorCategory.SPELLING:
        addSpellingExercise(exercises, error);
        break;
      case ErrorCategory.GRAMMAR:
        addGrammarExercise(exercises, error);
        break;
      case ErrorCategory.STRUCTURE:
        addStructureExercise(exercises, error);
        break;
      case ErrorCategory.PHONICS:
        addPhonicsExercise(exercises, error);
        break;
    }
  }

  // 去重
  exercises.fillInBlank = deduplicateByQuestion(exercises.fillInBlank);
  exercises.multipleChoice = deduplicateByQuestion(exercises.multipleChoice);

  return exercises;
}

function addSpellingExercise(exercises, error) {
  const template = SPELLING_TEMPLATES.find(t =>
    error.detail && error.detail.word &&
    error.detail.word.toLowerCase().includes(t.pattern)
  );
  if (template) {
    exercises.fillInBlank.push({
      ...template,
      type: QuestionTemplate.FILL_IN_BLANK,
      source: error
    });
  }
}

function addGrammarExercise(exercises, error) {
  const subType = error.subType;
  const templates = GRAMMAR_TEMPLATES[subType];
  if (templates && templates.length > 0) {
    // 随机选一道相关题
    const randomIndex = Math.floor(Math.random() * templates.length);
    exercises.multipleChoice.push({
      ...templates[randomIndex],
      type: QuestionTemplate.MULTIPLE_CHOICE,
      source: error
    });
  }
}

function addStructureExercise(exercises, error) {
  if (error.subType === 'missing_sequence' || error.subType === 'logic_disorder') {
    exercises.writing.push({
      ...WRITING_TEMPLATES[0],
      type: QuestionTemplate.WRITING,
      source: error
    });
  }
  if (error.subType === 'safety_rules_complete' || error.subType === 'safety_logic_conflict') {
    // Module 5 Safety: 制定安全守则
    const safetyTemplate = WRITING_TEMPLATES.find(t => t.module === 'Module 5');
    if (safetyTemplate) {
      exercises.writing.push({
        ...safetyTemplate,
        type: QuestionTemplate.WRITING,
        source: error
      });
    }
  }
}

function addPhonicsExercise(exercises, error) {
  if (PHONICS_TEMPLATES.length > 0) {
    const randomIndex = Math.floor(Math.random() * PHONICS_TEMPLATES.length);
    exercises.pronunciation.push({
      ...PHONICS_TEMPLATES[randomIndex],
      type: QuestionTemplate.PRONUNCIATION,
      source: error
    });
  }
}

function deduplicateByQuestion(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = item.question || item.title || JSON.stringify(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * 生成 PDF 数据结构（供 Phase 3 PDF 渲染引擎使用）
 * @param {Array} errorLog - 错误记录
 * @param {Object} studentInfo - 学生信息
 * @returns {Object} PDF 数据
 */
function generatePDFData(errorLog, studentInfo) {
  const exercises = generateExercises(errorLog);

  return {
    header: {
      schoolName: '广州理工实验学校',
      title: '五年级英语周小结 巩固测试卷',
      studentName: studentInfo.name || '___________',
      className: studentInfo.className || '___________',
      date: new Date().toLocaleDateString('zh-CN'),
      generatedBy: '搭搭乐智能组卷系统'
    },
    sections: [
      {
        title: '一、根据首字母提示填空',
        type: 'fill_in_blank',
        items: exercises.fillInBlank,
        totalScore: exercises.fillInBlank.length * 2
      },
      {
        title: '二、单项选择',
        type: 'multiple_choice',
        items: exercises.multipleChoice,
        totalScore: exercises.multipleChoice.length * 2
      },
      {
        title: '三、找出划线部分读音不同的单词',
        type: 'pronunciation',
        items: exercises.pronunciation,
        totalScore: exercises.pronunciation.length * 2
      },
      {
        title: '四、情景写作',
        type: 'writing',
        items: exercises.writing,
        totalScore: exercises.writing.length > 0 ? 10 : 0
      }
    ],
    totalScore: 0, // 将在渲染时计算
    footer: {
      note: '本试卷由"搭搭乐"智能系统基于学生个人薄弱点自动生成',
      printDate: new Date().toLocaleDateString('zh-CN')
    }
  };
}

/**
 * 从错题卡片数据（MISTAKE_CARDS）生成备选习题
 * 当 errorLog 为空或无法匹配模板时，作为兜底数据源
 *
 * @param {Array} mistakeCards - MISTAKE_CARDS 数据
 * @returns {Object} 按题型分类的题目集合
 */
function generateFallbackExercises(mistakeCards) {
  const exercises = {
    fillInBlank: [],
    multipleChoice: [],
    writing: [],
    pronunciation: []
  };

  if (!mistakeCards || !Array.isArray(mistakeCards) || mistakeCards.length === 0) {
    return exercises;
  }

  for (const card of mistakeCards) {
    if (card.category === 'grammar' || card.category === 'structure') {
      // 语法/句法错题 → 生成单选题
      const grammarKeys = Object.keys(GRAMMAR_TEMPLATES);
      for (const key of grammarKeys) {
        const templates = GRAMMAR_TEMPLATES[key];
        if (templates && templates.length > 0) {
          exercises.multipleChoice.push({
            ...templates[0],
            type: QuestionTemplate.MULTIPLE_CHOICE,
            source: { type: card.category, context: card.title }
          });
          break; // 每张卡片最多生成一道
        }
      }
      // 也添加写作题
      if (WRITING_TEMPLATES.length > 0) {
        exercises.writing.push({
          ...WRITING_TEMPLATES[0],
          type: QuestionTemplate.WRITING,
          source: { type: card.category, context: card.title }
        });
      }
    }

    if (card.category === 'spelling' && card.spellingErrors) {
      // 拼写错题 → 生成首字母填空
      for (const se of card.spellingErrors) {
        const template = SPELLING_TEMPLATES.find(t => t.pattern === se.correct);
        if (template) {
          exercises.fillInBlank.push({
            ...template,
            type: QuestionTemplate.FILL_IN_BLANK,
            source: { type: 'spelling', context: `${se.correct} → ${se.wrong}` }
          });
        }
      }
    }
  }

  // 始终加一道发音题
  if (PHONICS_TEMPLATES.length > 0) {
    exercises.pronunciation.push({
      ...PHONICS_TEMPLATES[0],
      type: QuestionTemplate.PRONUNCIATION,
      source: { type: 'phonics', context: 'fallback' }
    });
  }

  // 去重
  exercises.fillInBlank = deduplicateByQuestion(exercises.fillInBlank);
  exercises.multipleChoice = deduplicateByQuestion(exercises.multipleChoice);

  return exercises;
}

module.exports = {
  ErrorCategory,
  QuestionTemplate,
  generateExercises,
  generateFallbackExercises,
  generatePDFData,
  SPELLING_TEMPLATES,
  GRAMMAR_TEMPLATES,
  WRITING_TEMPLATES,
  PHONICS_TEMPLATES
};
