/**
 * collision.test.js - 搭搭乐核心碰撞引擎测试
 *
 * 测试覆盖：
 * - Be动词强绑定约束
 * - will + 动词原形约束
 * - be going to + 动词原形约束
 * - Use...to... 祈使句约束
 * - 基本语序约束
 * - 完整句子验证
 * - 得分计算
 */

const {
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
  validateBeGoingToBeVerb,
  validateUseToStructure,
  calculateScore
} = require('../collision');

// ============================================================
// Helper: 创建积木对象
// ============================================================
function makeBlock(word, type, opts = {}) {
  return { id: `test_${Date.now()}_${Math.random()}`, word, type, color: BlockColor[type] || '#ccc', ...opts };
}

const subjectI = () => makeBlock('I', BlockType.SUBJECT);
const subjectWe = () => makeBlock('We', BlockType.SUBJECT);
const subjectHe = () => makeBlock('He', BlockType.SUBJECT);
const subjectBen = () => makeBlock('Ben', BlockType.SUBJECT);
const subjectMyFamily = () => makeBlock('My family', BlockType.SUBJECT);
const subjectThey = () => makeBlock('They', BlockType.SUBJECT);

const tenseWill = () => makeBlock('will', BlockType.TENSE);
const tenseAm = () => makeBlock('am', BlockType.TENSE);
const tenseIs = () => makeBlock('is', BlockType.TENSE);
const tenseAre = () => makeBlock('are', BlockType.TENSE);
const tenseGoingTo = () => makeBlock('going to', BlockType.TENSE, { tenseGroup: 'be_going_to' });

const verbBare = (word = 'travel to Beijing') => makeBlock(word, BlockType.VERB, { verbForm: VerbForm.BARE });
const verbGerund = (word = 'swimming') => makeBlock(word, BlockType.VERB, { verbForm: VerbForm.GERUND });
const verbPast = (word = 'went') => makeBlock(word, BlockType.VERB, { verbForm: VerbForm.PAST });
const verbNoun = (word = 'a pencil') => makeBlock(word, BlockType.VERB, { verbForm: VerbForm.NOUN });

const timeBlock = (word = 'this Saturday') => makeBlock(word, BlockType.TIME);
const seqBlock = (word = 'First,') => makeBlock(word, BlockType.SEQUENCE);

// ============================================================
// 1. BlockType & BlockColor enums
// ============================================================
describe('BlockType & BlockColor enums', () => {
  test('BlockType has all five types', () => {
    expect(BlockType.SUBJECT).toBe('subject');
    expect(BlockType.TENSE).toBe('tense');
    expect(BlockType.VERB).toBe('verb');
    expect(BlockType.TIME).toBe('time');
    expect(BlockType.SEQUENCE).toBe('sequence');
  });

  test('BlockColor maps every type to a hex color', () => {
    for (const type of Object.values(BlockType)) {
      expect(BlockColor[type]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

// ============================================================
// 2. VerbForm enum
// ============================================================
describe('VerbForm enum', () => {
  test('has bare, gerund, past, noun', () => {
    expect(VerbForm.BARE).toBe('bare');
    expect(VerbForm.GERUND).toBe('gerund');
    expect(VerbForm.PAST).toBe('past');
    expect(VerbForm.NOUN).toBe('noun');
  });
});

// ============================================================
// 3. BE_VERB_RULES
// ============================================================
describe('BE_VERB_RULES', () => {
  test('I -> am', () => {
    expect(BE_VERB_RULES['I']).toEqual(['am']);
  });

  test('He/She/It/Ben/Aki -> is', () => {
    for (const subj of ['He', 'She', 'It', 'Ben', 'Aki']) {
      expect(BE_VERB_RULES[subj]).toEqual(['is']);
    }
  });

  test('We/You/They/My family -> are', () => {
    for (const subj of ['We', 'You', 'They', 'My family']) {
      expect(BE_VERB_RULES[subj]).toEqual(['are']);
    }
  });
});

// ============================================================
// 4. checkBeVerbBinding
// ============================================================
describe('checkBeVerbBinding', () => {
  test('I + am → accepted', () => {
    const sentence = [subjectI()];
    const result = checkBeVerbBinding(sentence, tenseAm(), 1);
    expect(result.accepted).toBe(true);
  });

  test('I + are → rejected with correct hint', () => {
    const sentence = [subjectI()];
    const result = checkBeVerbBinding(sentence, tenseAre(), 1);
    expect(result.accepted).toBe(false);
    expect(result.errorType).toBe('grammar');
    expect(result.errorSubType).toBe('be_verb');
    expect(result.message).toContain('am');
    expect(result.detail.correct).toBe('am');
  });

  test('I + is → rejected', () => {
    const sentence = [subjectI()];
    const result = checkBeVerbBinding(sentence, tenseIs(), 1);
    expect(result.accepted).toBe(false);
  });

  test('He + is → accepted', () => {
    const sentence = [subjectHe()];
    const result = checkBeVerbBinding(sentence, tenseIs(), 1);
    expect(result.accepted).toBe(true);
  });

  test('He + am → rejected', () => {
    const sentence = [subjectHe()];
    const result = checkBeVerbBinding(sentence, tenseAm(), 1);
    expect(result.accepted).toBe(false);
    expect(result.detail.correct).toBe('is');
  });

  test('We + are → accepted', () => {
    const sentence = [subjectWe()];
    const result = checkBeVerbBinding(sentence, tenseAre(), 1);
    expect(result.accepted).toBe(true);
  });

  test('We + is → rejected', () => {
    const sentence = [subjectWe()];
    const result = checkBeVerbBinding(sentence, tenseIs(), 1);
    expect(result.accepted).toBe(false);
    expect(result.detail.correct).toBe('are');
  });

  test('Ben + is → accepted', () => {
    const sentence = [subjectBen()];
    const result = checkBeVerbBinding(sentence, tenseIs(), 1);
    expect(result.accepted).toBe(true);
  });

  test('My family + are → accepted', () => {
    const sentence = [subjectMyFamily()];
    const result = checkBeVerbBinding(sentence, tenseAre(), 1);
    expect(result.accepted).toBe(true);
  });

  test('They + are → accepted', () => {
    const sentence = [subjectThey()];
    const result = checkBeVerbBinding(sentence, tenseAre(), 1);
    expect(result.accepted).toBe(true);
  });

  test('returns null if newBlock is not a tense block', () => {
    const sentence = [subjectI()];
    const result = checkBeVerbBinding(sentence, verbBare(), 1);
    expect(result).toBeNull();
  });

  test('returns null if tense is not a be-verb (e.g., will)', () => {
    const sentence = [subjectI()];
    const result = checkBeVerbBinding(sentence, tenseWill(), 1);
    expect(result).toBeNull();
  });

  test('returns null when there is no subject in sentence', () => {
    const sentence = [];
    const result = checkBeVerbBinding(sentence, tenseAm(), 0);
    expect(result).toBeNull();
  });
});

// ============================================================
// 5. checkWillConstraint
// ============================================================
describe('checkWillConstraint', () => {
  test('will + bare verb → accepted', () => {
    const sentence = [subjectI(), tenseWill()];
    const result = checkWillConstraint(sentence, verbBare(), 2);
    expect(result.accepted).toBe(true);
  });

  test('will + gerund → rejected', () => {
    const sentence = [subjectI(), tenseWill()];
    const result = checkWillConstraint(sentence, verbGerund('swimming'), 2);
    expect(result.accepted).toBe(false);
    expect(result.errorType).toBe('grammar');
    expect(result.errorSubType).toBe('will_ing');
    expect(result.message).toContain('动词原形');
  });

  test('will + past tense → rejected', () => {
    const sentence = [subjectI(), tenseWill()];
    const result = checkWillConstraint(sentence, verbPast('went'), 2);
    expect(result.accepted).toBe(false);
    expect(result.errorSubType).toBe('will_ing');
  });

  test('returns null if no will in sentence', () => {
    const sentence = [subjectI(), tenseAm()];
    const result = checkWillConstraint(sentence, verbBare(), 2);
    expect(result).toBeNull();
  });

  test('returns null if not inserting right after will', () => {
    const sentence = [subjectI(), tenseWill(), verbBare()];
    const result = checkWillConstraint(sentence, verbGerund(), 3);
    expect(result).toBeNull();
  });

  test('returns null if new block is not a verb', () => {
    const sentence = [subjectI(), tenseWill()];
    const result = checkWillConstraint(sentence, timeBlock(), 2);
    expect(result).toBeNull();
  });

  test('will + verb with no verbForm set → accepted (no constraint violation)', () => {
    const sentence = [subjectI(), tenseWill()];
    const noFormVerb = makeBlock('explore', BlockType.VERB);
    const result = checkWillConstraint(sentence, noFormVerb, 2);
    expect(result.accepted).toBe(true);
  });
});

// ============================================================
// 6. checkBeGoingToConstraint
// ============================================================
describe('checkBeGoingToConstraint', () => {
  test('going to + bare verb → accepted', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo()];
    const result = checkBeGoingToConstraint(sentence, verbBare(), 3);
    expect(result.accepted).toBe(true);
  });

  test('going to + noun → rejected (be_going_to_noun)', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo()];
    const result = checkBeGoingToConstraint(sentence, verbNoun('mountain climbing'), 3);
    expect(result.accepted).toBe(false);
    expect(result.errorSubType).toBe('be_going_to_noun');
  });

  test('going to + gerund → rejected (be_going_to_wrong_form)', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo()];
    const result = checkBeGoingToConstraint(sentence, verbGerund('travelling'), 3);
    expect(result.accepted).toBe(false);
    expect(result.errorSubType).toBe('be_going_to_wrong_form');
  });

  test('going to + past → rejected (be_going_to_wrong_form)', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo()];
    const result = checkBeGoingToConstraint(sentence, verbPast(), 3);
    expect(result.accepted).toBe(false);
    expect(result.errorSubType).toBe('be_going_to_wrong_form');
  });

  test('returns null if no "going to" in sentence', () => {
    const sentence = [subjectI(), tenseWill()];
    const result = checkBeGoingToConstraint(sentence, verbGerund(), 2);
    expect(result).toBeNull();
  });

  test('returns null if not inserting right after "going to"', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo(), verbBare()];
    const result = checkBeGoingToConstraint(sentence, verbGerund(), 4);
    expect(result).toBeNull();
  });

  test('returns null if new block is not a verb', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo()];
    const result = checkBeGoingToConstraint(sentence, timeBlock(), 3);
    expect(result).toBeNull();
  });
});

// ============================================================
// 7. checkUseToConstraint
// ============================================================
describe('checkUseToConstraint', () => {
  const useBlock = () => makeBlock('Use', BlockType.VERB, { verbForm: VerbForm.BARE });
  const toBlock = () => makeBlock('to', BlockType.VERB, { verbForm: VerbForm.BARE });

  test('Use + noun tool → no rejection (allowed)', () => {
    const sentence = [useBlock()];
    const result = checkUseToConstraint(sentence, verbNoun('a pencil'), 1);
    expect(result).toBeNull(); // null means no constraint triggered
  });

  test('Use + non-noun → rejected', () => {
    const sentence = [useBlock()];
    const result = checkUseToConstraint(sentence, verbBare('draw'), 1);
    expect(result.accepted).toBe(false);
    expect(result.errorType).toBe('structure');
    expect(result.errorSubType).toBe('use_to_tool');
  });

  test('"to" + verb → no rejection', () => {
    const to = toBlock();
    const sentence = [useBlock(), verbNoun('scissors'), to];
    const result = checkUseToConstraint(sentence, verbBare('cut'), 3);
    // No constraint violation since verb follows 'to'
    expect(result).toBeNull();
  });

  test('"to" + non-verb → rejected', () => {
    const to = toBlock();
    const sentence = [useBlock(), verbNoun('scissors'), to];
    const result = checkUseToConstraint(sentence, timeBlock(), 3);
    expect(result.accepted).toBe(false);
    expect(result.errorSubType).toBe('use_to_verb');
  });

  test('returns null if no Use block in sentence', () => {
    const sentence = [subjectI(), tenseWill()];
    const result = checkUseToConstraint(sentence, verbBare(), 2);
    expect(result).toBeNull();
  });
});

// ============================================================
// 8. checkCollision (integration)
// ============================================================
describe('checkCollision (integration)', () => {
  test('valid: I + will + travel → all accepted', () => {
    let sentence = [];

    // Add subject I
    const s = subjectI();
    sentence.push(s);

    // Add will
    const w = tenseWill();
    const r1 = checkCollision(null, w, sentence, 1);
    expect(r1.accepted).toBe(true);
    sentence.push(w);

    // Add bare verb
    const v = verbBare();
    const r2 = checkCollision(null, v, sentence, 2);
    expect(r2.accepted).toBe(true);
  });

  test('invalid: I + are → be-verb rejection fires', () => {
    const sentence = [subjectI()];
    const result = checkCollision(null, tenseAre(), sentence, 1);
    expect(result.accepted).toBe(false);
    expect(result.errorSubType).toBe('be_verb');
  });

  test('invalid: will + swimming → will constraint fires', () => {
    const sentence = [subjectI(), tenseWill()];
    const result = checkCollision(null, verbGerund('swimming'), sentence, 2);
    expect(result.accepted).toBe(false);
    expect(result.errorSubType).toBe('will_ing');
  });

  test('valid: I + am + going to + travel → all accepted', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo()];
    const result = checkCollision(null, verbBare('visit the Great Wall'), sentence, 3);
    expect(result.accepted).toBe(true);
  });

  test('sequence word not at index 0 → accepted with tip message', () => {
    const sentence = [subjectI(), tenseWill(), verbBare()];
    const result = checkCollision(null, seqBlock('First,'), sentence, 3);
    expect(result.accepted).toBe(true);
    expect(result.message).toContain('连接词');
  });

  test('sequence word at index 0 of empty sentence → accepted without tip', () => {
    const sentence = [];
    const result = checkCollision(null, seqBlock('First,'), sentence, 0);
    expect(result.accepted).toBe(true);
  });
});

// ============================================================
// 9. validateSentence
// ============================================================
describe('validateSentence', () => {
  test('empty sentence is invalid', () => {
    const result = validateSentence([]);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('句子为空');
  });

  test('sentence with subject + tense + verb is valid', () => {
    const sentence = [subjectI(), tenseWill(), verbBare()];
    const result = validateSentence(sentence);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('sentence without subject reports error (non-imperative)', () => {
    const sentence = [tenseWill(), verbBare()];
    const result = validateSentence(sentence);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('主语'))).toBe(true);
  });

  test('sentence without verb reports error', () => {
    const sentence = [subjectI(), tenseWill()];
    const result = validateSentence(sentence);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('动词'))).toBe(true);
  });

  test('sentence with subject + verb but no tense → valid with warning', () => {
    const sentence = [subjectI(), verbBare()];
    const result = validateSentence(sentence);
    expect(result.valid).toBe(true);
    expect(result.warnings.some(w => w.includes('时态'))).toBe(true);
  });

  test('imperative sentence (Use...) does not require subject', () => {
    const sentence = [
      makeBlock('Use', BlockType.VERB, { verbForm: VerbForm.BARE }),
      verbNoun('a pencil')
    ];
    // 'Use' as first word makes it imperative — no subject error
    const result = validateSentence(sentence);
    // Should not have subject error
    expect(result.errors.some(e => e.includes('主语'))).toBe(false);
  });

  test('hasSequence is true when sequence blocks are present', () => {
    const sentence = [seqBlock(), subjectI(), tenseWill(), verbBare()];
    const result = validateSentence(sentence);
    expect(result.hasSequence).toBe(true);
  });

  test('hasSequence is false when no sequence blocks', () => {
    const sentence = [subjectI(), tenseWill(), verbBare()];
    const result = validateSentence(sentence);
    expect(result.hasSequence).toBe(false);
  });

  // ---- Grammar validation on submit ----

  test('I + is → invalid (be-verb agreement error)', () => {
    const sentence = [subjectI(), tenseIs(), tenseGoingTo(), verbBare()];
    const result = validateSentence(sentence);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('am'))).toBe(true);
  });

  test('He + are → invalid (be-verb agreement error)', () => {
    const sentence = [subjectHe(), tenseAre(), tenseGoingTo(), verbBare()];
    const result = validateSentence(sentence);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('is'))).toBe(true);
  });

  test('I + am → valid (correct be-verb)', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo(), verbBare()];
    const result = validateSentence(sentence);
    expect(result.valid).toBe(true);
  });

  test('will + gerund → invalid on submit', () => {
    const sentence = [subjectI(), tenseWill(), verbGerund('swimming')];
    const result = validateSentence(sentence);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('will') && e.includes('动词原形'))).toBe(true);
  });

  test('will + past → invalid on submit', () => {
    const sentence = [subjectI(), tenseWill(), verbPast('went')];
    const result = validateSentence(sentence);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('will'))).toBe(true);
  });

  test('be going to + gerund → invalid on submit', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo(), verbGerund('travelling')];
    const result = validateSentence(sentence);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('be going to') && e.includes('动词原形'))).toBe(true);
  });

  test('be going to + bare verb → valid on submit', () => {
    const sentence = [subjectWe(), tenseAre(), tenseGoingTo(), verbBare('visit the Great Wall')];
    const result = validateSentence(sentence);
    expect(result.valid).toBe(true);
  });

  test('I + going to + visit (missing be-verb) → invalid on submit', () => {
    const sentence = [subjectI(), tenseGoingTo(), verbBare('visit the Great Wall'), timeBlock('this Saturday')];
    const result = validateSentence(sentence);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('am'))).toBe(true);
    expect(result.score).toBeLessThan(100);
  });

  test('He + going to + visit (missing be-verb) → invalid on submit', () => {
    const sentence = [subjectHe(), tenseGoingTo(), verbBare('visit the Great Wall')];
    const result = validateSentence(sentence);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('is'))).toBe(true);
  });
});

// ============================================================
// 10. validateBeVerbAgreement
// ============================================================
describe('validateBeVerbAgreement', () => {
  test('I + am → no errors', () => {
    const sentence = [subjectI(), tenseAm()];
    expect(validateBeVerbAgreement(sentence)).toHaveLength(0);
  });

  test('I + is → error mentioning "am"', () => {
    const sentence = [subjectI(), tenseIs()];
    const errors = validateBeVerbAgreement(sentence);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('am');
  });

  test('He + are → error mentioning "is"', () => {
    const sentence = [subjectHe(), tenseAre()];
    const errors = validateBeVerbAgreement(sentence);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('is');
  });

  test('We + are → no errors', () => {
    const sentence = [subjectWe(), tenseAre()];
    expect(validateBeVerbAgreement(sentence)).toHaveLength(0);
  });

  test('no subject → no errors', () => {
    const sentence = [tenseAm()];
    expect(validateBeVerbAgreement(sentence)).toHaveLength(0);
  });

  test('no be-verb (will only) → no errors', () => {
    const sentence = [subjectI(), tenseWill()];
    expect(validateBeVerbAgreement(sentence)).toHaveLength(0);
  });

  test('Ben + is → no errors', () => {
    const sentence = [subjectBen(), tenseIs()];
    expect(validateBeVerbAgreement(sentence)).toHaveLength(0);
  });

  test('My family + is → error mentioning "are"', () => {
    const sentence = [subjectMyFamily(), tenseIs()];
    const errors = validateBeVerbAgreement(sentence);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('are');
  });
});

// ============================================================
// 11. validateWillVerbForm
// ============================================================
describe('validateWillVerbForm', () => {
  test('will + bare verb → no errors', () => {
    const sentence = [subjectI(), tenseWill(), verbBare()];
    expect(validateWillVerbForm(sentence)).toHaveLength(0);
  });

  test('will + gerund → error', () => {
    const sentence = [subjectI(), tenseWill(), verbGerund('swimming')];
    const errors = validateWillVerbForm(sentence);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('will');
    expect(errors[0]).toContain('swimming');
  });

  test('will + past → error', () => {
    const sentence = [subjectI(), tenseWill(), verbPast('went')];
    const errors = validateWillVerbForm(sentence);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('went');
  });

  test('will + verb with no verbForm → no errors', () => {
    const sentence = [subjectI(), tenseWill(), makeBlock('explore', BlockType.VERB)];
    expect(validateWillVerbForm(sentence)).toHaveLength(0);
  });

  test('no will in sentence → no errors', () => {
    const sentence = [subjectI(), tenseAm(), verbBare()];
    expect(validateWillVerbForm(sentence)).toHaveLength(0);
  });

  test('will not followed by verb → no errors', () => {
    const sentence = [subjectI(), tenseWill(), timeBlock()];
    expect(validateWillVerbForm(sentence)).toHaveLength(0);
  });
});

// ============================================================
// 12. validateBeGoingToVerbForm
// ============================================================
describe('validateBeGoingToVerbForm', () => {
  test('going to + bare verb → no errors', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo(), verbBare()];
    expect(validateBeGoingToVerbForm(sentence)).toHaveLength(0);
  });

  test('going to + gerund → error', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo(), verbGerund('travelling')];
    const errors = validateBeGoingToVerbForm(sentence);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('be going to');
    expect(errors[0]).toContain('travelling');
  });

  test('going to + past → error', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo(), verbPast('went')];
    const errors = validateBeGoingToVerbForm(sentence);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('went');
  });

  test('going to + noun → error', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo(), verbNoun('a pencil')];
    const errors = validateBeGoingToVerbForm(sentence);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('a pencil');
  });

  test('no going to in sentence → no errors', () => {
    const sentence = [subjectI(), tenseWill(), verbBare()];
    expect(validateBeGoingToVerbForm(sentence)).toHaveLength(0);
  });

  test('going to not followed by verb → no errors', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo(), timeBlock()];
    expect(validateBeGoingToVerbForm(sentence)).toHaveLength(0);
  });
});

// ============================================================
// 12b. validateBeGoingToBeVerb
// ============================================================
describe('validateBeGoingToBeVerb', () => {
  test('I + am + going to → no errors', () => {
    const sentence = [subjectI(), tenseAm(), tenseGoingTo(), verbBare()];
    expect(validateBeGoingToBeVerb(sentence)).toHaveLength(0);
  });

  test('We + are + going to → no errors', () => {
    const sentence = [subjectWe(), tenseAre(), tenseGoingTo(), verbBare()];
    expect(validateBeGoingToBeVerb(sentence)).toHaveLength(0);
  });

  test('He + is + going to → no errors', () => {
    const sentence = [subjectHe(), tenseIs(), tenseGoingTo(), verbBare()];
    expect(validateBeGoingToBeVerb(sentence)).toHaveLength(0);
  });

  test('I + going to (missing am) → error', () => {
    const sentence = [subjectI(), tenseGoingTo(), verbBare()];
    const errors = validateBeGoingToBeVerb(sentence);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('am');
  });

  test('He + going to (missing is) → error', () => {
    const sentence = [subjectHe(), tenseGoingTo(), verbBare()];
    const errors = validateBeGoingToBeVerb(sentence);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('is');
  });

  test('We + going to (missing are) → error', () => {
    const sentence = [subjectWe(), tenseGoingTo(), verbBare()];
    const errors = validateBeGoingToBeVerb(sentence);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('are');
  });

  test('no going to in sentence → no errors', () => {
    const sentence = [subjectI(), tenseWill(), verbBare()];
    expect(validateBeGoingToBeVerb(sentence)).toHaveLength(0);
  });

  test('going to at start of sentence (no prev block) → error', () => {
    const sentence = [tenseGoingTo(), verbBare()];
    const errors = validateBeGoingToBeVerb(sentence);
    expect(errors.length).toBe(1);
  });
});

// ============================================================
// 13. validateUseToStructure
// ============================================================
describe('validateUseToStructure', () => {
  const useBlock = () => makeBlock('Use', BlockType.VERB, { verbForm: VerbForm.BARE });
  const toBlock = () => makeBlock('to', BlockType.VERB, { verbForm: VerbForm.BARE });

  test('Use + noun + to + verb → no errors', () => {
    const sentence = [useBlock(), verbNoun('a pencil'), toBlock(), verbBare('draw')];
    expect(validateUseToStructure(sentence)).toHaveLength(0);
  });

  test('Use + bare verb → error (should be noun)', () => {
    const sentence = [useBlock(), verbBare('draw')];
    const errors = validateUseToStructure(sentence);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('工具');
  });

  test('no Use block → no errors', () => {
    const sentence = [subjectI(), tenseWill(), verbBare()];
    expect(validateUseToStructure(sentence)).toHaveLength(0);
  });

  test('"to" + non-verb → error', () => {
    const sentence = [useBlock(), verbNoun('scissors'), toBlock(), timeBlock()];
    const errors = validateUseToStructure(sentence);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('to');
  });
});

// ============================================================
// 14. calculateScore
// ============================================================
describe('calculateScore', () => {
  test('perfect sentence → 100', () => {
    const sentence = [subjectI(), tenseWill(), verbBare()];
    const score = calculateScore(sentence, [], []);
    expect(score).toBe(100);
  });

  test('each error deducts 20 points', () => {
    const sentence = [subjectI()];
    const score = calculateScore(sentence, ['err1', 'err2'], []);
    expect(score).toBe(60);
  });

  test('each warning deducts 5 points', () => {
    const sentence = [subjectI()];
    const score = calculateScore(sentence, [], ['warn1']);
    expect(score).toBe(95);
  });

  test('sequence blocks add 5 points each', () => {
    const sentence = [seqBlock(), subjectI(), tenseWill(), verbBare()];
    const score = calculateScore(sentence, [], []);
    expect(score).toBe(100); // capped at 100
  });

  test('score never goes below 0', () => {
    const sentence = [subjectI()];
    const score = calculateScore(sentence, ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'], []);
    expect(score).toBe(0);
  });

  test('score never exceeds 100', () => {
    const sentence = [
      seqBlock('First,'), seqBlock('Next,'), seqBlock('Then,'),
      subjectI(), tenseWill(), verbBare()
    ];
    const score = calculateScore(sentence, [], []);
    expect(score).toBe(100);
  });

  test('errors + warnings + sequence combined correctly', () => {
    const sentence = [seqBlock(), subjectI()];
    // 100 - 20 (1 error) - 5 (1 warning) + 5 (1 sequence) = 80
    const score = calculateScore(sentence, ['err'], ['warn']);
    expect(score).toBe(80);
  });
});
