/**
 * collision.js - 搭搭乐核心物理引擎规则矩阵
 *
 * 实现积木碰撞校验算法：
 * 1. Be动词强绑定约束（I→am, He/She/It→is, We/You/They→are）
 * 2. 一般将来时结构约束（will + 动词原形，be going to + 动词原形）
 * 3. 祈使句工具结构约束（Use...to...）
 * 4. 紫色连接词顺序约束
 */

// 积木类型枚举
const BlockType = {
  SUBJECT: 'subject',       // 🟦 蓝色 - 主语
  TENSE: 'tense',           // 🟥 红色 - 时态核心
  VERB: 'verb',             // 🟩 绿色 - 动词短语
  TIME: 'time',             // 🟨 黄色 - 时间状语
  SEQUENCE: 'sequence'      // 🟣 紫色 - 顺序连接词
};

// 积木颜色映射
const BlockColor = {
  [BlockType.SUBJECT]: '#4A90D9',
  [BlockType.TENSE]: '#E74C3C',
  [BlockType.VERB]: '#27AE60',
  [BlockType.TIME]: '#F39C12',
  [BlockType.SEQUENCE]: '#9B59B6'
};

// 动词形式类型
const VerbForm = {
  BARE: 'bare',           // 动词原形 (go, travel, visit)
  GERUND: 'gerund',       // 动名词/进行时 (going, swimming)
  PAST: 'past',           // 过去式 (went, traveled)
  NOUN: 'noun'            // 名词 (a pencil, scissors)
};

// Be动词主语匹配规则
const BE_VERB_RULES = {
  'I': ['am'],
  'He': ['is'],
  'She': ['is'],
  'It': ['is'],
  'Ben': ['is'],
  'Aki': ['is'],
  'My father': ['is'],
  'My mother': ['is'],
  'We': ['are'],
  'You': ['are'],
  'They': ['are'],
  'My family': ['are'],
  'Ben and I': ['are'],
  'My parents': ['are']
};

// will 后接受的词形
const WILL_ACCEPTS = [VerbForm.BARE];

// be going to 后接受的词形
const BE_GOING_TO_ACCEPTS = [VerbForm.BARE];

/**
 * 碰撞检测结果
 * @typedef {Object} CollisionResult
 * @property {boolean} accepted - 是否接受吸附
 * @property {string} message - 提示消息（中英双语）
 * @property {string} errorType - 错误类型（用于 O2O 映射）
 * @property {string} errorSubType - 错误子类型
 * @property {string} hint - 正确答案提示
 */

/**
 * 检测两个积木是否可以吸附
 * @param {Object} existingBlock - 已在句子中的积木
 * @param {Object} newBlock - 正在拖入的积木
 * @param {Array} currentSentence - 当前句子中的积木序列
 * @param {number} insertIndex - 插入位置
 * @returns {CollisionResult}
 */
function checkCollision(existingBlock, newBlock, currentSentence, insertIndex) {
  // 规则1: Be动词强绑定约束
  const beVerbResult = checkBeVerbBinding(currentSentence, newBlock, insertIndex);
  if (beVerbResult && !beVerbResult.accepted) {
    return beVerbResult;
  }

  // 规则2: will + 动词原形约束
  const willResult = checkWillConstraint(currentSentence, newBlock, insertIndex);
  if (willResult && !willResult.accepted) {
    return willResult;
  }

  // 规则3: be going to + 动词原形约束
  const beGoingToResult = checkBeGoingToConstraint(currentSentence, newBlock, insertIndex);
  if (beGoingToResult && !beGoingToResult.accepted) {
    return beGoingToResult;
  }

  // 规则4: Use...to... 祈使句约束
  const useToResult = checkUseToConstraint(currentSentence, newBlock, insertIndex);
  if (useToResult && !useToResult.accepted) {
    return useToResult;
  }

  // 规则5: 基本语序约束（主语在时态前，时态在动词前等）
  const orderResult = checkBasicOrder(currentSentence, newBlock, insertIndex);
  if (orderResult && !orderResult.accepted) {
    return orderResult;
  }

  // 如果语序检查返回了提示消息（accepted 但有 tip），传递该消息
  if (orderResult && orderResult.accepted && orderResult.message) {
    return orderResult;
  }

  return { accepted: true, message: '' };
}

/**
 * 规则1: Be动词强绑定约束
 * 当 [Subject: I] 靠近 [Tense: are/is] 时拒绝，只接受 [Tense: am]
 */
function checkBeVerbBinding(sentence, newBlock, insertIndex) {
  if (newBlock.type !== BlockType.TENSE) return null;

  const beVerbs = ['am', 'is', 'are'];
  const newWord = newBlock.word.toLowerCase();

  if (!beVerbs.includes(newWord)) return null;

  // 查找当前句子中的主语
  const subjectBlock = sentence.find(b => b.type === BlockType.SUBJECT);
  if (!subjectBlock) return null;

  const subjectWord = subjectBlock.word;
  const allowedBeVerbs = BE_VERB_RULES[subjectWord];

  if (!allowedBeVerbs) return null;

  if (!allowedBeVerbs.includes(newWord)) {
    const correctVerb = allowedBeVerbs[0];
    return {
      accepted: false,
      message: `"${subjectWord}" 的好帮手是 "${correctVerb}"！\n"${subjectWord}" goes with "${correctVerb}"!`,
      errorType: 'grammar',
      errorSubType: 'be_verb',
      hint: `${subjectWord} ${correctVerb}`,
      detail: {
        subject: subjectWord,
        attempted: newWord,
        correct: correctVerb
      }
    };
  }

  return { accepted: true, message: '' };
}

/**
 * 规则2: will 右侧只接受动词原形
 */
function checkWillConstraint(sentence, newBlock, insertIndex) {
  if (newBlock.type !== BlockType.VERB) return null;

  // 查找 will 积木
  const willBlock = sentence.find(b => b.type === BlockType.TENSE && b.word.toLowerCase() === 'will');
  if (!willBlock) return null;

  // 检查新积木是否紧跟在 will 后面
  const willIndex = sentence.indexOf(willBlock);
  if (insertIndex !== willIndex + 1) return null;

  if (newBlock.verbForm && !WILL_ACCEPTS.includes(newBlock.verbForm)) {
    return {
      accepted: false,
      message: `"will" 后面要跟动词原形哦！不能用 "${newBlock.word}"。\nAfter "will", use the base form of the verb!`,
      errorType: 'grammar',
      errorSubType: 'will_ing',
      hint: `will + 动词原形 (e.g., will travel)`,
      detail: {
        attempted: newBlock.word,
        verbForm: newBlock.verbForm
      }
    };
  }

  return { accepted: true, message: '' };
}

/**
 * 规则3: be going to 后只接受动词原形
 */
function checkBeGoingToConstraint(sentence, newBlock, insertIndex) {
  if (newBlock.type !== BlockType.VERB) return null;

  // 查找 "going to" 序列
  const goingToIndex = findGoingToIndex(sentence);
  if (goingToIndex === -1) return null;

  // 检查新积木是否紧跟在 "going to" 后面
  if (insertIndex !== goingToIndex + 1) return null;

  // 检查是否是名词块（不是动词原形）
  if (newBlock.verbForm === VerbForm.NOUN) {
    return {
      accepted: false,
      message: `"be going to" 后面要跟动词原形哦！\nAfter "be going to", use the base form of the verb!`,
      errorType: 'grammar',
      errorSubType: 'be_going_to_noun',
      hint: `be going to + 动词原形 (e.g., am going to travel)`,
      detail: {
        attempted: newBlock.word,
        verbForm: newBlock.verbForm
      }
    };
  }

  if (newBlock.verbForm && !BE_GOING_TO_ACCEPTS.includes(newBlock.verbForm)) {
    return {
      accepted: false,
      message: `"be going to" 后面要跟动词原形哦！不能用 "${newBlock.word}"。\nAfter "be going to", use the base form!`,
      errorType: 'grammar',
      errorSubType: 'be_going_to_wrong_form',
      hint: `be going to + 动词原形`,
      detail: {
        attempted: newBlock.word,
        verbForm: newBlock.verbForm
      }
    };
  }

  return { accepted: true, message: '' };
}

/**
 * 规则4: Use...to... 祈使句结构约束
 * Use 后限定名词工具，to 后限定动词
 */
function checkUseToConstraint(sentence, newBlock, insertIndex) {
  const useBlock = sentence.find(b => b.word.toLowerCase() === 'use' && b.type === BlockType.VERB);
  if (!useBlock) return null;

  const useIndex = sentence.indexOf(useBlock);

  // "Use" 后面必须跟名词工具
  if (insertIndex === useIndex + 1 && newBlock.verbForm !== VerbForm.NOUN) {
    return {
      accepted: false,
      message: `"Use" 后面要跟工具名称哦！\nAfter "Use", put the tool name!`,
      errorType: 'structure',
      errorSubType: 'use_to_tool',
      hint: `Use + 工具 + to + 动词 (e.g., Use a pencil to draw)`,
      detail: {
        attempted: newBlock.word
      }
    };
  }

  // "to" 后面必须跟动词
  const toBlock = sentence.find(b => b.word.toLowerCase() === 'to');
  if (toBlock) {
    const toIndex = sentence.indexOf(toBlock);
    if (insertIndex === toIndex + 1 && newBlock.type !== BlockType.VERB) {
      return {
        accepted: false,
        message: `"to" 后面要跟动作哦！\nAfter "to", use an action verb!`,
        errorType: 'structure',
        errorSubType: 'use_to_verb',
        hint: `Use + 工具 + to + 动词`,
        detail: {
          attempted: newBlock.word
        }
      };
    }
  }

  return null;
}

/**
 * 规则5: 基本语序约束
 */
function checkBasicOrder(sentence, newBlock, insertIndex) {
  // 时间状语通常放在句末
  // 紫色连接词通常放在句首
  if (newBlock.type === BlockType.SEQUENCE && insertIndex !== 0 && sentence.length > 0) {
    // 允许但给出提示
    return {
      accepted: true,
      message: `💡 小提示：连接词通常放在句子开头哦！\nTip: Sequence words usually go at the beginning!`
    };
  }

  return null;
}

/**
 * 查找 "going to" 在句子中的位置
 */
function findGoingToIndex(sentence) {
  for (let i = 0; i < sentence.length; i++) {
    if (sentence[i].word.toLowerCase() === 'going to' ||
        sentence[i].tenseGroup === 'be_going_to') {
      return i;
    }
  }
  return -1;
}

/**
 * 验证完整句子结构
 * @param {Array} sentence - 当前句子中的所有积木
 * @returns {Object} 验证结果
 */
function validateSentence(sentence) {
  const errors = [];
  const warnings = [];

  if (sentence.length === 0) {
    return { valid: false, errors: ['句子为空'], warnings: [] };
  }

  // 检查是否有主语
  const hasSubject = sentence.some(b => b.type === BlockType.SUBJECT);
  if (!hasSubject) {
    // 祈使句除外
    const isImperative = sentence[0] && sentence[0].word.toLowerCase() === 'use';
    if (!isImperative) {
      errors.push('句子缺少主语（蓝色积木）');
    }
  }

  // 检查是否有动词
  const hasVerb = sentence.some(b => b.type === BlockType.VERB);
  if (!hasVerb) {
    errors.push('句子缺少动词（绿色积木）');
  }

  // 检查是否有时态词（非祈使句）
  const hasTense = sentence.some(b => b.type === BlockType.TENSE);
  const isImperative = sentence[0] && sentence[0].word.toLowerCase() === 'use';
  if (!hasTense && hasSubject && !isImperative) {
    warnings.push('句子可能缺少时态词（红色积木）');
  }

  // ---- 语法规则校验 ----

  // 规则G1: Be动词主语一致性
  const beVerbErrors = validateBeVerbAgreement(sentence);
  errors.push(...beVerbErrors);

  // 规则G2: will + 动词原形
  const willErrors = validateWillVerbForm(sentence);
  errors.push(...willErrors);

  // 规则G3: be going to + 动词原形
  const beGoingToErrors = validateBeGoingToVerbForm(sentence);
  errors.push(...beGoingToErrors);

  // 规则G4: Use...to... 结构完整性
  const useToErrors = validateUseToStructure(sentence);
  errors.push(...useToErrors);

  // 检查连贯写作中是否使用了连接词
  const hasSequence = sentence.some(b => b.type === BlockType.SEQUENCE);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    hasSequence,
    score: calculateScore(sentence, errors, warnings)
  };
}

/**
 * 规则G1: 验证Be动词与主语一致性
 * 例如: "I is" → 错误, "I am" → 正确
 */
function validateBeVerbAgreement(sentence) {
  const errors = [];
  const beVerbs = ['am', 'is', 'are'];

  const subjectBlock = sentence.find(b => b.type === BlockType.SUBJECT);
  if (!subjectBlock) return errors;

  const beVerbBlocks = sentence.filter(b =>
    b.type === BlockType.TENSE && beVerbs.includes(b.word.toLowerCase())
  );

  for (const beBlock of beVerbBlocks) {
    const allowed = BE_VERB_RULES[subjectBlock.word];
    if (allowed && !allowed.includes(beBlock.word.toLowerCase())) {
      const correct = allowed[0];
      errors.push(`"${subjectBlock.word}" 要搭配 "${correct}"，不能用 "${beBlock.word}"`);
    }
  }

  return errors;
}

/**
 * 规则G2: 验证 will 后面必须跟动词原形
 * 例如: "will swimming" → 错误, "will travel" → 正确
 */
function validateWillVerbForm(sentence) {
  const errors = [];

  for (let i = 0; i < sentence.length; i++) {
    if (sentence[i].type === BlockType.TENSE && sentence[i].word.toLowerCase() === 'will') {
      const nextBlock = sentence[i + 1];
      if (nextBlock && nextBlock.type === BlockType.VERB &&
          nextBlock.verbForm && !WILL_ACCEPTS.includes(nextBlock.verbForm)) {
        errors.push(`"will" 后面要跟动词原形，不能用 "${nextBlock.word}"`);
      }
    }
  }

  return errors;
}

/**
 * 规则G3: 验证 be going to 后面必须跟动词原形
 * 例如: "am going to swimming" → 错误, "am going to travel" → 正确
 */
function validateBeGoingToVerbForm(sentence) {
  const errors = [];

  for (let i = 0; i < sentence.length; i++) {
    if (sentence[i].word.toLowerCase() === 'going to' ||
        sentence[i].tenseGroup === 'be_going_to') {
      const nextBlock = sentence[i + 1];
      if (nextBlock && nextBlock.type === BlockType.VERB &&
          nextBlock.verbForm && !BE_GOING_TO_ACCEPTS.includes(nextBlock.verbForm)) {
        errors.push(`"be going to" 后面要跟动词原形，不能用 "${nextBlock.word}"`);
      }
    }
  }

  return errors;
}

/**
 * 规则G4: 验证 Use...to... 结构完整性
 * Use 后面应跟名词工具，to 后面应跟动词
 */
function validateUseToStructure(sentence) {
  const errors = [];

  const useIndex = sentence.findIndex(b =>
    b.word.toLowerCase() === 'use' && b.type === BlockType.VERB
  );
  if (useIndex === -1) return errors;

  // Use 后面必须是名词工具（名词工具在数据模型中类型为 VERB，verbForm 为 NOUN）
  const afterUse = sentence[useIndex + 1];
  if (afterUse && afterUse.type === BlockType.VERB && afterUse.verbForm !== VerbForm.NOUN) {
    errors.push('"Use" 后面要跟工具名称（名词）');
  }

  // to 后面必须是动词
  const toIndex = sentence.findIndex(b => b.word.toLowerCase() === 'to');
  if (toIndex !== -1) {
    const afterTo = sentence[toIndex + 1];
    if (afterTo && afterTo.type !== BlockType.VERB) {
      errors.push('"to" 后面要跟动作动词');
    }
  }

  return errors;
}

/**
 * 计算得分
 */
function calculateScore(sentence, errors, warnings) {
  let score = 100;
  score -= errors.length * 20;
  score -= warnings.length * 5;

  // 使用连接词加分
  const sequenceBlocks = sentence.filter(b => b.type === BlockType.SEQUENCE);
  score += sequenceBlocks.length * 5;

  return Math.max(0, Math.min(100, score));
}

module.exports = {
  BlockType,
  BlockColor,
  VerbForm,
  BE_VERB_RULES,
  checkCollision,
  checkBeVerbBinding,
  checkWillConstraint,
  checkBeGoingToConstraint,
  checkUseToConstraint,
  validateSentence,
  validateBeVerbAgreement,
  validateWillVerbForm,
  validateBeGoingToVerbForm,
  validateUseToStructure,
  calculateScore
};
