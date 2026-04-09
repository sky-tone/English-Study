/**
 * grammar-checker.test.js - 增强语法校验工具测试
 */

// Mock wx global
global.wx = {
  getStorageSync: jest.fn(() => null),
  setStorageSync: jest.fn(),
  request: jest.fn()
};

const {
  checkGrammarLocal,
  checkGrammarOnline,
  checkSubjectVerbAgreement,
  checkFutureTenseConsistency,
  checkSequenceWordUsage,
  THIRD_PERSON_SINGULAR,
  FUTURE_TIME_INDICATORS
} = require('../grammar-checker');

// Helper to create blocks
function makeBlock(word, type, extra = {}) {
  return { word, type, id: `test_${word}`, color: '#000', ...extra };
}

describe('Constants', () => {
  test('THIRD_PERSON_SINGULAR contains expected subjects', () => {
    expect(THIRD_PERSON_SINGULAR).toContain('he');
    expect(THIRD_PERSON_SINGULAR).toContain('she');
    expect(THIRD_PERSON_SINGULAR).toContain('ben');
  });

  test('FUTURE_TIME_INDICATORS contains common future time words', () => {
    expect(FUTURE_TIME_INDICATORS).toContain('tomorrow');
    expect(FUTURE_TIME_INDICATORS).toContain('next week');
    expect(FUTURE_TIME_INDICATORS).toContain('this saturday');
  });
});

describe('checkGrammarLocal', () => {
  test('returns empty results for empty input', () => {
    const result = checkGrammarLocal('', []);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
    expect(result.suggestions).toHaveLength(0);
  });

  test('returns empty results for null input', () => {
    const result = checkGrammarLocal(null, null);
    expect(result.errors).toHaveLength(0);
  });

  test('detects "Ben take a bus tomorrow" as error (missing tense)', () => {
    const blocks = [
      makeBlock('Then,', 'sequence'),
      makeBlock('Ben', 'subject'),
      makeBlock('take a bus', 'verb', { verbForm: 'bare' }),
      makeBlock('tomorrow', 'time')
    ];
    const result = checkGrammarLocal('Then, Ben take a bus tomorrow', blocks);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('accepts valid sentence with will', () => {
    const blocks = [
      makeBlock('Ben', 'subject'),
      makeBlock('will', 'tense'),
      makeBlock('take a bus', 'verb', { verbForm: 'bare' }),
      makeBlock('tomorrow', 'time')
    ];
    const result = checkGrammarLocal('Ben will take a bus tomorrow', blocks);
    expect(result.errors).toHaveLength(0);
  });

  test('accepts valid imperative sentence', () => {
    const blocks = [
      makeBlock("Don't", 'imperative'),
      makeBlock('run', 'verb', { verbForm: 'bare' }),
      makeBlock('in the street', 'object')
    ];
    const result = checkGrammarLocal("Don't run in the street", blocks);
    expect(result.errors).toHaveLength(0);
  });
});

describe('checkSubjectVerbAgreement', () => {
  test('third person subject without tense produces error', () => {
    const blocks = [
      makeBlock('Ben', 'subject'),
      makeBlock('take a bus', 'verb', { verbForm: 'bare' })
    ];
    const result = checkSubjectVerbAgreement(blocks);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Ben');
  });

  test('first person subject without tense produces error', () => {
    const blocks = [
      makeBlock('I', 'subject'),
      makeBlock('travel to Beijing', 'verb', { verbForm: 'bare' })
    ];
    const result = checkSubjectVerbAgreement(blocks);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('subject with tense produces no error', () => {
    const blocks = [
      makeBlock('Ben', 'subject'),
      makeBlock('will', 'tense'),
      makeBlock('take a bus', 'verb', { verbForm: 'bare' })
    ];
    const result = checkSubjectVerbAgreement(blocks);
    expect(result.errors).toHaveLength(0);
  });

  test('imperative sentence produces no error', () => {
    const blocks = [
      makeBlock("Don't", 'imperative'),
      makeBlock('run', 'verb', { verbForm: 'bare' })
    ];
    const result = checkSubjectVerbAgreement(blocks);
    expect(result.errors).toHaveLength(0);
  });

  test('no subject produces no error', () => {
    const blocks = [
      makeBlock('run', 'verb', { verbForm: 'bare' })
    ];
    const result = checkSubjectVerbAgreement(blocks);
    expect(result.errors).toHaveLength(0);
  });
});

describe('checkFutureTenseConsistency', () => {
  test('future time word without tense produces error', () => {
    const blocks = [
      makeBlock('Ben', 'subject'),
      makeBlock('take a bus', 'verb', { verbForm: 'bare' }),
      makeBlock('tomorrow', 'time')
    ];
    const result = checkFutureTenseConsistency(blocks);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('tomorrow');
  });

  test('future time word with will produces no error', () => {
    const blocks = [
      makeBlock('Ben', 'subject'),
      makeBlock('will', 'tense'),
      makeBlock('take a bus', 'verb', { verbForm: 'bare' }),
      makeBlock('tomorrow', 'time')
    ];
    const result = checkFutureTenseConsistency(blocks);
    expect(result.errors).toHaveLength(0);
  });

  test('future time word with going to produces no error', () => {
    const blocks = [
      makeBlock('Ben', 'subject'),
      makeBlock('is', 'tense'),
      makeBlock('going to', 'tense', { tenseGroup: 'be_going_to' }),
      makeBlock('take a bus', 'verb', { verbForm: 'bare' }),
      makeBlock('next week', 'time')
    ];
    const result = checkFutureTenseConsistency(blocks);
    expect(result.errors).toHaveLength(0);
  });

  test('no time word produces no error', () => {
    const blocks = [
      makeBlock('Ben', 'subject'),
      makeBlock('take a bus', 'verb', { verbForm: 'bare' })
    ];
    const result = checkFutureTenseConsistency(blocks);
    expect(result.errors).toHaveLength(0);
  });

  test('imperative with future time word produces no error', () => {
    const blocks = [
      makeBlock("Don't", 'imperative'),
      makeBlock('run', 'verb', { verbForm: 'bare' }),
      makeBlock('tomorrow', 'time')
    ];
    const result = checkFutureTenseConsistency(blocks);
    expect(result.errors).toHaveLength(0);
  });
});

describe('checkSequenceWordUsage', () => {
  test('sequence word without subject after it produces warning', () => {
    const blocks = [
      makeBlock('Then,', 'sequence'),
      makeBlock('take a bus', 'verb', { verbForm: 'bare' })
    ];
    const result = checkSequenceWordUsage(blocks);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  test('sequence word with subject after it produces no warning about subject', () => {
    const blocks = [
      makeBlock('Then,', 'sequence'),
      makeBlock('Ben', 'subject'),
      makeBlock('will', 'tense'),
      makeBlock('take a bus', 'verb', { verbForm: 'bare' })
    ];
    const result = checkSequenceWordUsage(blocks);
    const subjectWarnings = result.warnings.filter(w => w.includes('主语'));
    expect(subjectWarnings).toHaveLength(0);
  });

  test('no sequence word produces no warnings', () => {
    const blocks = [
      makeBlock('Ben', 'subject'),
      makeBlock('will', 'tense'),
      makeBlock('take a bus', 'verb', { verbForm: 'bare' })
    ];
    const result = checkSequenceWordUsage(blocks);
    expect(result.warnings).toHaveLength(0);
  });
});

describe('checkGrammarOnline', () => {
  test('returns unavailable status in Phase 1', async () => {
    const result = await checkGrammarOnline('Test sentence');
    expect(result.available).toBe(false);
    expect(result.errors).toHaveLength(0);
  });
});
