/**
 * grammar-checker.js - 增强语法校验工具
 *
 * 提供超越积木碰撞引擎的语法检查能力：
 * 1. 本地规则检查（离线可用）- 检查常见语法模式
 * 2. 联网语法检查接口（Phase 2 接入在线 API）
 *
 * 示例：检测 "Then, Ben take a bus tomorrow" 中的语法错误
 * - 主语 Ben 为第三人称单数，但缺少时态标记
 * - 有时间状语 tomorrow 却没有将来时结构
 */

// ============================================================
// 第三人称单数主语列表
// ============================================================
const THIRD_PERSON_SINGULAR = [
  'he', 'she', 'it', 'ben', 'aki', 'mrs webb',
  'my father', 'my mother', 'the boy', 'the girl'
];

// 第一人称单数
const FIRST_PERSON_SINGULAR = ['i'];

// 复数主语
const PLURAL_SUBJECTS = [
  'we', 'you', 'they', 'my family', 'my parents', 'ben and i'
];

// 将来时间状语关键词
const FUTURE_TIME_INDICATORS = [
  'tomorrow', 'next week', 'next monday', 'next month',
  'this saturday', 'this summer holiday', 'this weekend',
  'in the future', 'soon', 'later'
];

/**
 * 本地语法规则检查
 * 对完成的句子文本进行语法分析
 *
 * @param {string} sentenceText - 拼装完成的句子文本
 * @param {Array} blocks - 积木序列（带类型信息）
 * @returns {Object} { errors: string[], warnings: string[], suggestions: string[] }
 */
function checkGrammarLocal(sentenceText, blocks) {
  const errors = [];
  const warnings = [];
  const suggestions = [];

  if (!sentenceText || !blocks || blocks.length === 0) {
    return { errors, warnings, suggestions };
  }

  const text = sentenceText.toLowerCase().replace(/\.$/, '').trim();

  // 规则1: 检查主语+裸动词（缺少时态标记）
  const subjectVerbCheck = checkSubjectVerbAgreement(blocks);
  errors.push(...subjectVerbCheck.errors);
  warnings.push(...subjectVerbCheck.warnings);

  // 规则2: 检查将来时间词配合
  const futureCheck = checkFutureTenseConsistency(blocks);
  errors.push(...futureCheck.errors);

  // 规则3: 检查连接词使用
  const sequenceCheck = checkSequenceWordUsage(blocks);
  warnings.push(...sequenceCheck.warnings);
  suggestions.push(...sequenceCheck.suggestions);

  return { errors, warnings, suggestions };
}

/**
 * 规则1: 主语-动词一致性检查
 * 检测如 "Ben take a bus" 这类缺少时态标记的错误
 */
function checkSubjectVerbAgreement(blocks) {
  const errors = [];
  const warnings = [];

  const subjectBlock = blocks.find(b => b.type === 'subject');
  if (!subjectBlock) return { errors, warnings };

  const hasTense = blocks.some(b => b.type === 'tense');
  const isImperative = blocks[0] && blocks[0].type === 'imperative';

  if (hasTense || isImperative) return { errors, warnings };

  // 主语后面直接跟动词原形，没有时态标记
  const verbBlock = blocks.find(b => b.type === 'verb');
  if (!verbBlock) return { errors, warnings };

  const subject = subjectBlock.word.toLowerCase();
  const isThirdPerson = THIRD_PERSON_SINGULAR.includes(subject);

  if (isThirdPerson && verbBlock.verbForm === 'bare') {
    errors.push(
      `"${subjectBlock.word}" 是第三人称单数，需要加时态标记（will / is going to）！\n` +
      `"${subjectBlock.word} ${verbBlock.word}" is missing a tense marker.`
    );
  } else if (verbBlock.verbForm === 'bare') {
    errors.push(
      `"${subjectBlock.word}" 后面的动词缺少时态标记，请加上 will 或 be going to！\n` +
      `Add "will" or "be going to" before "${verbBlock.word}".`
    );
  }

  return { errors, warnings };
}

/**
 * 规则2: 将来时间一致性检查
 * 有 tomorrow/next week 等时间词但没有将来时结构
 */
function checkFutureTenseConsistency(blocks) {
  const errors = [];

  const timeBlock = blocks.find(b => b.type === 'time');
  if (!timeBlock) return { errors };

  const timeLower = timeBlock.word.toLowerCase();
  const isFutureTime = FUTURE_TIME_INDICATORS.some(ft => timeLower.includes(ft));

  if (!isFutureTime) return { errors };

  // 检查是否有将来时结构
  const hasWill = blocks.some(b => b.type === 'tense' && b.word.toLowerCase() === 'will');
  const hasGoingTo = blocks.some(b =>
    (b.word && b.word.toLowerCase() === 'going to') || b.tenseGroup === 'be_going_to'
  );

  if (!hasWill && !hasGoingTo) {
    const isImperative = blocks[0] && blocks[0].type === 'imperative';
    if (!isImperative) {
      errors.push(
        `时间状语 "${timeBlock.word}" 表示将来，句子需要使用将来时（will 或 be going to）！`
      );
    }
  }

  return { errors };
}

/**
 * 规则3: 连接词使用建议
 */
function checkSequenceWordUsage(blocks) {
  const warnings = [];
  const suggestions = [];

  const sequenceBlock = blocks.find(b => b.type === 'sequence');
  if (sequenceBlock) {
    // 连接词后面应该有完整的句子结构
    const afterSequence = blocks.slice(blocks.indexOf(sequenceBlock) + 1);
    const hasSubject = afterSequence.some(b => b.type === 'subject');
    const hasTense = afterSequence.some(b => b.type === 'tense');

    if (!hasSubject && !afterSequence.some(b => b.type === 'imperative')) {
      warnings.push(`连接词 "${sequenceBlock.word}" 后面需要有主语`);
    }
    if (!hasTense && hasSubject) {
      warnings.push(`连接词 "${sequenceBlock.word}" 后面的句子需要有时态标记`);
    }
  }

  return { warnings, suggestions };
}

/**
 * 联网语法检查（Phase 2）
 * 调用在线语法检查 API 进行更精准的校验
 *
 * @param {string} sentenceText - 句子文本
 * @returns {Promise<Object>} 检查结果
 */
function checkGrammarOnline(sentenceText) {
  // Phase 2: 接入在线语法检查 API（如 LanguageTool API）
  // 当前返回本地检查结果的 Promise 包装
  return new Promise((resolve) => {
    // Phase 2 将替换为：
    // wx.request({
    //   url: 'https://api.languagetool.org/v2/check',
    //   method: 'POST',
    //   data: { text: sentenceText, language: 'en-US' },
    //   success: (res) => resolve(parseApiResponse(res.data)),
    //   fail: () => resolve({ available: false, errors: [] })
    // });

    resolve({
      available: false,
      message: '联网语法检查将在 Phase 2 中开放',
      errors: []
    });
  });
}

module.exports = {
  checkGrammarLocal,
  checkGrammarOnline,
  checkSubjectVerbAgreement,
  checkFutureTenseConsistency,
  checkSequenceWordUsage,
  THIRD_PERSON_SINGULAR,
  FIRST_PERSON_SINGULAR,
  PLURAL_SUBJECTS,
  FUTURE_TIME_INDICATORS
};
