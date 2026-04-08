/**
 * error-tracker.test.js - O2O 组卷映射引擎测试
 *
 * 测试覆盖：
 * - generateExercises 各错误类型映射
 * - 拼写错误 → 首字母填空
 * - 语法错误 → 单项选择
 * - 结构错误 → 情景写作
 * - 语音错误 → 划线发音
 * - 空输入处理
 * - 去重逻辑
 * - generatePDFData 结构
 */

const {
  ErrorCategory,
  QuestionTemplate,
  generateExercises,
  generatePDFData,
  SPELLING_TEMPLATES,
  GRAMMAR_TEMPLATES,
  WRITING_TEMPLATES,
  PHONICS_TEMPLATES
} = require('../error-tracker');

// ============================================================
// 1. Enums
// ============================================================
describe('ErrorCategory enum', () => {
  test('has all four categories', () => {
    expect(ErrorCategory.SPELLING).toBe('spelling');
    expect(ErrorCategory.GRAMMAR).toBe('grammar');
    expect(ErrorCategory.STRUCTURE).toBe('structure');
    expect(ErrorCategory.PHONICS).toBe('phonics');
  });
});

describe('QuestionTemplate enum', () => {
  test('has all four template types', () => {
    expect(QuestionTemplate.FILL_IN_BLANK).toBe('fill_in_blank');
    expect(QuestionTemplate.MULTIPLE_CHOICE).toBe('multiple_choice');
    expect(QuestionTemplate.WRITING).toBe('writing');
    expect(QuestionTemplate.PRONUNCIATION).toBe('pronunciation');
  });
});

// ============================================================
// 2. Template data integrity
// ============================================================
describe('Template data integrity', () => {
  test('SPELLING_TEMPLATES all have pattern, question, answer', () => {
    for (const t of SPELLING_TEMPLATES) {
      expect(t).toHaveProperty('pattern');
      expect(t).toHaveProperty('question');
      expect(t).toHaveProperty('answer');
      expect(typeof t.question).toBe('string');
      expect(t.question.length).toBeGreaterThan(0);
    }
  });

  test('GRAMMAR_TEMPLATES has be_verb and will_ing keys', () => {
    expect(GRAMMAR_TEMPLATES.be_verb).toBeDefined();
    expect(GRAMMAR_TEMPLATES.will_ing).toBeDefined();
    expect(GRAMMAR_TEMPLATES.be_verb.length).toBeGreaterThan(0);
    expect(GRAMMAR_TEMPLATES.will_ing.length).toBeGreaterThan(0);
  });

  test('GRAMMAR_TEMPLATES entries have question, options, answer', () => {
    for (const [key, templates] of Object.entries(GRAMMAR_TEMPLATES)) {
      for (const t of templates) {
        expect(t).toHaveProperty('question');
        expect(t).toHaveProperty('options');
        expect(t).toHaveProperty('answer');
        expect(Array.isArray(t.options)).toBe(true);
        expect(t.options).toContain(t.answer);
      }
    }
  });

  test('WRITING_TEMPLATES have title and template array', () => {
    for (const t of WRITING_TEMPLATES) {
      expect(t).toHaveProperty('title');
      expect(t).toHaveProperty('template');
      expect(Array.isArray(t.template)).toBe(true);
      expect(t.template.length).toBeGreaterThan(0);
    }
  });

  test('PHONICS_TEMPLATES have options and answer', () => {
    for (const t of PHONICS_TEMPLATES) {
      expect(t).toHaveProperty('options');
      expect(t).toHaveProperty('answer');
      expect(Array.isArray(t.options)).toBe(true);
      expect(t.options.length).toBeGreaterThanOrEqual(4);
    }
  });
});

// ============================================================
// 3. generateExercises - empty / null input
// ============================================================
describe('generateExercises - empty input', () => {
  test('returns empty arrays for null errorLog', () => {
    const result = generateExercises(null);
    expect(result.fillInBlank).toEqual([]);
    expect(result.multipleChoice).toEqual([]);
    expect(result.writing).toEqual([]);
    expect(result.pronunciation).toEqual([]);
  });

  test('returns empty arrays for empty errorLog', () => {
    const result = generateExercises([]);
    expect(result.fillInBlank).toEqual([]);
    expect(result.multipleChoice).toEqual([]);
    expect(result.writing).toEqual([]);
    expect(result.pronunciation).toEqual([]);
  });
});

// ============================================================
// 4. generateExercises - Mapping A: Spelling → Fill in blank
// ============================================================
describe('generateExercises - Mapping A: Spelling', () => {
  test('spelling error with matching word generates fill-in-blank', () => {
    const errorLog = [{
      type: ErrorCategory.SPELLING,
      subType: 'misspell',
      detail: { word: 'travel' }
    }];
    const result = generateExercises(errorLog);
    expect(result.fillInBlank.length).toBeGreaterThan(0);
    expect(result.fillInBlank[0].type).toBe(QuestionTemplate.FILL_IN_BLANK);
    expect(result.fillInBlank[0].answer).toBe('travel');
  });

  test('spelling error for "climb" generates fill-in-blank', () => {
    const errorLog = [{
      type: ErrorCategory.SPELLING,
      subType: 'misspell',
      detail: { word: 'climb' }
    }];
    const result = generateExercises(errorLog);
    expect(result.fillInBlank.length).toBeGreaterThan(0);
    expect(result.fillInBlank[0].answer).toBe('climb');
  });

  test('spelling error for "museum" generates fill-in-blank', () => {
    const errorLog = [{
      type: ErrorCategory.SPELLING,
      subType: 'misspell',
      detail: { word: 'museum' }
    }];
    const result = generateExercises(errorLog);
    expect(result.fillInBlank.length).toBeGreaterThan(0);
    expect(result.fillInBlank[0].answer).toBe('museum');
  });

  test('spelling error with no matching template produces nothing', () => {
    const errorLog = [{
      type: ErrorCategory.SPELLING,
      subType: 'misspell',
      detail: { word: 'xyznonexistent' }
    }];
    const result = generateExercises(errorLog);
    expect(result.fillInBlank).toHaveLength(0);
  });

  test('spelling error without detail produces nothing', () => {
    const errorLog = [{
      type: ErrorCategory.SPELLING,
      subType: 'misspell'
    }];
    const result = generateExercises(errorLog);
    expect(result.fillInBlank).toHaveLength(0);
  });
});

// ============================================================
// 5. generateExercises - Mapping B: Grammar → Multiple choice
// ============================================================
describe('generateExercises - Mapping B: Grammar', () => {
  test('be_verb error generates multiple choice question', () => {
    const errorLog = [{
      type: ErrorCategory.GRAMMAR,
      subType: 'be_verb',
      detail: { subject: 'I', attempted: 'are', correct: 'am' }
    }];
    const result = generateExercises(errorLog);
    expect(result.multipleChoice.length).toBeGreaterThan(0);
    expect(result.multipleChoice[0].type).toBe(QuestionTemplate.MULTIPLE_CHOICE);
    expect(result.multipleChoice[0].options).toBeDefined();
    expect(result.multipleChoice[0].answer).toBeDefined();
  });

  test('will_ing error generates multiple choice question', () => {
    const errorLog = [{
      type: ErrorCategory.GRAMMAR,
      subType: 'will_ing',
      detail: { attempted: 'swimming' }
    }];
    const result = generateExercises(errorLog);
    expect(result.multipleChoice.length).toBeGreaterThan(0);
    expect(result.multipleChoice[0].type).toBe(QuestionTemplate.MULTIPLE_CHOICE);
  });

  test('be_going_to_noun error generates multiple choice', () => {
    const errorLog = [{
      type: ErrorCategory.GRAMMAR,
      subType: 'be_going_to_noun',
      detail: { attempted: 'mountain climbing' }
    }];
    const result = generateExercises(errorLog);
    expect(result.multipleChoice.length).toBeGreaterThan(0);
  });

  test('be_going_to_wrong_form error generates multiple choice', () => {
    const errorLog = [{
      type: ErrorCategory.GRAMMAR,
      subType: 'be_going_to_wrong_form',
      detail: { attempted: 'travelling' }
    }];
    const result = generateExercises(errorLog);
    expect(result.multipleChoice.length).toBeGreaterThan(0);
  });

  test('unknown grammar subType produces nothing', () => {
    const errorLog = [{
      type: ErrorCategory.GRAMMAR,
      subType: 'unknown_subtype',
      detail: {}
    }];
    const result = generateExercises(errorLog);
    expect(result.multipleChoice).toHaveLength(0);
  });
});

// ============================================================
// 6. generateExercises - Mapping C: Structure → Writing
// ============================================================
describe('generateExercises - Mapping C: Structure', () => {
  test('missing_sequence error generates writing exercise', () => {
    const errorLog = [{
      type: ErrorCategory.STRUCTURE,
      subType: 'missing_sequence',
      detail: { sentences: ['We will travel.'] }
    }];
    const result = generateExercises(errorLog);
    expect(result.writing.length).toBeGreaterThan(0);
    expect(result.writing[0].type).toBe(QuestionTemplate.WRITING);
    expect(result.writing[0].title).toBe('My Travel Plan');
  });

  test('logic_disorder error generates writing exercise', () => {
    const errorLog = [{
      type: ErrorCategory.STRUCTURE,
      subType: 'logic_disorder',
      detail: {}
    }];
    const result = generateExercises(errorLog);
    expect(result.writing.length).toBeGreaterThan(0);
  });

  test('other structure subTypes do not generate writing', () => {
    const errorLog = [{
      type: ErrorCategory.STRUCTURE,
      subType: 'use_to_tool',
      detail: {}
    }];
    const result = generateExercises(errorLog);
    expect(result.writing).toHaveLength(0);
  });
});

// ============================================================
// 7. generateExercises - Mapping D: Phonics → Pronunciation
// ============================================================
describe('generateExercises - Mapping D: Phonics', () => {
  test('phonics error generates pronunciation exercise', () => {
    const errorLog = [{
      type: ErrorCategory.PHONICS,
      subType: 'vowel_sound',
      detail: {}
    }];
    const result = generateExercises(errorLog);
    expect(result.pronunciation.length).toBeGreaterThan(0);
    expect(result.pronunciation[0].type).toBe(QuestionTemplate.PRONUNCIATION);
    expect(result.pronunciation[0].options).toBeDefined();
  });
});

// ============================================================
// 8. generateExercises - Deduplication
// ============================================================
describe('generateExercises - Deduplication', () => {
  test('duplicate spelling errors with same word produce only one fill-in-blank', () => {
    const errorLog = [
      { type: ErrorCategory.SPELLING, subType: 'misspell', detail: { word: 'travel' } },
      { type: ErrorCategory.SPELLING, subType: 'misspell', detail: { word: 'travel' } },
      { type: ErrorCategory.SPELLING, subType: 'misspell', detail: { word: 'travel' } }
    ];
    const result = generateExercises(errorLog);
    expect(result.fillInBlank.length).toBe(1);
  });

  test('different spelling errors produce different fill-in-blanks', () => {
    const errorLog = [
      { type: ErrorCategory.SPELLING, subType: 'misspell', detail: { word: 'travel' } },
      { type: ErrorCategory.SPELLING, subType: 'misspell', detail: { word: 'museum' } }
    ];
    const result = generateExercises(errorLog);
    expect(result.fillInBlank.length).toBe(2);
  });
});

// ============================================================
// 9. generateExercises - Mixed errors
// ============================================================
describe('generateExercises - Mixed errors', () => {
  test('mixed error types populate all exercise categories', () => {
    const errorLog = [
      { type: ErrorCategory.SPELLING, subType: 'misspell', detail: { word: 'travel' } },
      { type: ErrorCategory.GRAMMAR, subType: 'be_verb', detail: { subject: 'I', attempted: 'are' } },
      { type: ErrorCategory.STRUCTURE, subType: 'missing_sequence', detail: {} },
      { type: ErrorCategory.PHONICS, subType: 'vowel', detail: {} }
    ];
    const result = generateExercises(errorLog);
    expect(result.fillInBlank.length).toBeGreaterThan(0);
    expect(result.multipleChoice.length).toBeGreaterThan(0);
    expect(result.writing.length).toBeGreaterThan(0);
    expect(result.pronunciation.length).toBeGreaterThan(0);
  });
});

// ============================================================
// 10. generatePDFData
// ============================================================
describe('generatePDFData', () => {
  test('returns correct structure with header, sections, footer', () => {
    const errorLog = [
      { type: ErrorCategory.GRAMMAR, subType: 'be_verb', detail: { subject: 'I' } }
    ];
    const studentInfo = { name: '小明', className: '五年级(3)班' };
    const pdf = generatePDFData(errorLog, studentInfo);

    // Header
    expect(pdf.header).toBeDefined();
    expect(pdf.header.schoolName).toBe('广州理工实验学校');
    expect(pdf.header.title).toContain('五年级');
    expect(pdf.header.studentName).toBe('小明');
    expect(pdf.header.className).toBe('五年级(3)班');
    expect(pdf.header.date).toBeDefined();

    // Sections
    expect(pdf.sections).toBeDefined();
    expect(Array.isArray(pdf.sections)).toBe(true);
    expect(pdf.sections.length).toBe(4);

    // Section types
    const sectionTypes = pdf.sections.map(s => s.type);
    expect(sectionTypes).toContain('fill_in_blank');
    expect(sectionTypes).toContain('multiple_choice');
    expect(sectionTypes).toContain('pronunciation');
    expect(sectionTypes).toContain('writing');

    // Footer
    expect(pdf.footer).toBeDefined();
    expect(pdf.footer.note).toContain('搭搭乐');
  });

  test('uses defaults for missing student info', () => {
    const pdf = generatePDFData([], {});
    expect(pdf.header.studentName).toBe('___________');
    expect(pdf.header.className).toBe('___________');
  });

  test('empty error log produces sections with empty items', () => {
    const pdf = generatePDFData([], { name: 'Test' });
    for (const section of pdf.sections) {
      expect(section.items).toHaveLength(0);
    }
  });

  test('grammar error populates multiple_choice section', () => {
    const errorLog = [
      { type: ErrorCategory.GRAMMAR, subType: 'be_verb', detail: { subject: 'I' } }
    ];
    const pdf = generatePDFData(errorLog, { name: '小红' });
    const mcSection = pdf.sections.find(s => s.type === 'multiple_choice');
    expect(mcSection.items.length).toBeGreaterThan(0);
    expect(mcSection.totalScore).toBeGreaterThan(0);
  });

  test('spelling error populates fill_in_blank section', () => {
    const errorLog = [
      { type: ErrorCategory.SPELLING, subType: 'misspell', detail: { word: 'swim' } }
    ];
    const pdf = generatePDFData(errorLog, { name: '小刚' });
    const fibSection = pdf.sections.find(s => s.type === 'fill_in_blank');
    expect(fibSection.items.length).toBeGreaterThan(0);
  });

  test('section totalScore is computed correctly', () => {
    const errorLog = [
      { type: ErrorCategory.SPELLING, subType: 'misspell', detail: { word: 'travel' } },
      { type: ErrorCategory.SPELLING, subType: 'misspell', detail: { word: 'museum' } }
    ];
    const pdf = generatePDFData(errorLog, {});
    const fibSection = pdf.sections.find(s => s.type === 'fill_in_blank');
    // Each fill_in_blank item = 2 points
    expect(fibSection.totalScore).toBe(fibSection.items.length * 2);
  });

  test('writing section totalScore is 10 when items exist', () => {
    const errorLog = [
      { type: ErrorCategory.STRUCTURE, subType: 'missing_sequence', detail: {} }
    ];
    const pdf = generatePDFData(errorLog, {});
    const writingSection = pdf.sections.find(s => s.type === 'writing');
    expect(writingSection.totalScore).toBe(10);
  });

  test('writing section totalScore is 0 when no items', () => {
    const errorLog = [];
    const pdf = generatePDFData(errorLog, {});
    const writingSection = pdf.sections.find(s => s.type === 'writing');
    expect(writingSection.totalScore).toBe(0);
  });
});

// ============================================================
// Module 5 Safety - O2O Template Tests
// ============================================================
describe('Module 5 Safety - Grammar Templates', () => {
  test('GRAMMAR_TEMPLATES has imperative_verb_form key', () => {
    expect(GRAMMAR_TEMPLATES.imperative_verb_form).toBeDefined();
    expect(GRAMMAR_TEMPLATES.imperative_verb_form.length).toBeGreaterThan(0);
  });

  test('imperative_verb_form templates have correct structure', () => {
    for (const t of GRAMMAR_TEMPLATES.imperative_verb_form) {
      expect(t).toHaveProperty('question');
      expect(t).toHaveProperty('options');
      expect(t).toHaveProperty('answer');
      expect(Array.isArray(t.options)).toBe(true);
      expect(t.options).toContain(t.answer);
    }
  });

  test('GRAMMAR_TEMPLATES has imperative_be_adjective key', () => {
    expect(GRAMMAR_TEMPLATES.imperative_be_adjective).toBeDefined();
    expect(GRAMMAR_TEMPLATES.imperative_be_adjective.length).toBeGreaterThan(0);
  });

  test('imperative_be_adjective templates have correct structure', () => {
    for (const t of GRAMMAR_TEMPLATES.imperative_be_adjective) {
      expect(t).toHaveProperty('question');
      expect(t).toHaveProperty('options');
      expect(t).toHaveProperty('answer');
      expect(t.options).toContain(t.answer);
    }
  });
});

describe('Module 5 Safety - Spelling Templates', () => {
  test('includes safety-related spelling templates', () => {
    const patterns = SPELLING_TEMPLATES.map(t => t.pattern);
    expect(patterns).toContain('dangerous');
    expect(patterns).toContain('careful');
    expect(patterns).toContain('cross');
    expect(patterns).toContain('touch');
    expect(patterns).toContain('feed');
  });

  test('safety spelling templates have questions with Don\'t context', () => {
    const safetyTemplates = SPELLING_TEMPLATES.filter(t =>
      ['dangerous', 'careful', 'cross', 'touch', 'feed'].includes(t.pattern)
    );
    for (const t of safetyTemplates) {
      expect(t.question.length).toBeGreaterThan(0);
      expect(t.answer.length).toBeGreaterThan(0);
    }
  });
});

describe('Module 5 Safety - Writing Templates', () => {
  test('has safety rules writing template', () => {
    const safetyTemplate = WRITING_TEMPLATES.find(t => t.module === 'Module 5');
    expect(safetyTemplate).toBeDefined();
    expect(safetyTemplate.title).toContain('Safety');
    expect(safetyTemplate.template.length).toBeGreaterThanOrEqual(5);
  });
});

describe('Module 5 - generateExercises imperative errors', () => {
  test('imperative_verb_form error generates multiple choice', () => {
    const errorLog = [{
      type: ErrorCategory.GRAMMAR,
      subType: 'imperative_verb_form',
      detail: { imperative: "Don't", attempted: 'crossing' }
    }];
    const result = generateExercises(errorLog);
    expect(result.multipleChoice.length).toBeGreaterThan(0);
    expect(result.multipleChoice[0].type).toBe(QuestionTemplate.MULTIPLE_CHOICE);
  });

  test('imperative_be_adjective error generates multiple choice', () => {
    const errorLog = [{
      type: ErrorCategory.GRAMMAR,
      subType: 'imperative_be_adjective',
      detail: { attempted: 'walk' }
    }];
    const result = generateExercises(errorLog);
    expect(result.multipleChoice.length).toBeGreaterThan(0);
  });

  test('safety spelling error for "dangerous" generates fill-in-blank', () => {
    const errorLog = [{
      type: ErrorCategory.SPELLING,
      subType: 'misspell',
      detail: { word: 'dangerous' }
    }];
    const result = generateExercises(errorLog);
    expect(result.fillInBlank.length).toBeGreaterThan(0);
    expect(result.fillInBlank[0].answer).toBe('dangerous');
  });

  test('safety spelling error for "careful" generates fill-in-blank', () => {
    const errorLog = [{
      type: ErrorCategory.SPELLING,
      subType: 'misspell',
      detail: { word: 'careful' }
    }];
    const result = generateExercises(errorLog);
    expect(result.fillInBlank.length).toBeGreaterThan(0);
    expect(result.fillInBlank[0].answer).toBe('careful');
  });

  test('safety_logic_conflict generates safety rules writing', () => {
    const errorLog = [{
      type: ErrorCategory.STRUCTURE,
      subType: 'safety_logic_conflict',
      detail: { verb: 'feed', object: 'the animals' }
    }];
    const result = generateExercises(errorLog);
    expect(result.writing.length).toBeGreaterThan(0);
    expect(result.writing[0].title).toContain('Safety');
  });

  test('safety_rules_complete generates safety writing', () => {
    const errorLog = [{
      type: ErrorCategory.STRUCTURE,
      subType: 'safety_rules_complete',
      detail: {}
    }];
    const result = generateExercises(errorLog);
    expect(result.writing.length).toBeGreaterThan(0);
    expect(result.writing[0].module).toBe('Module 5');
  });
});
