/**
 * mistake-archive-data.test.js - 错题档案库数据模块测试
 */
const {
  SeverityLevel,
  STUDENT_PROFILE,
  MISTAKE_CARDS,
  EXAM_PREVIEW,
  VIP_PRICING,
  generateAlertData,
  generateDynamicAlert,
  getMistakeArchiveData
} = require('../mistake-archive-data');

describe('mistake-archive-data', () => {

  // ============================================================
  // SeverityLevel 枚举
  // ============================================================
  describe('SeverityLevel', () => {
    it('defines fatal severity', () => {
      expect(SeverityLevel.FATAL).toBe('fatal');
    });

    it('defines high severity', () => {
      expect(SeverityLevel.HIGH).toBe('high');
    });

    it('defines medium severity', () => {
      expect(SeverityLevel.MEDIUM).toBe('medium');
    });
  });

  // ============================================================
  // STUDENT_PROFILE
  // ============================================================
  describe('STUDENT_PROFILE', () => {
    it('has required fields', () => {
      expect(STUDENT_PROFILE).toHaveProperty('name');
      expect(STUDENT_PROFILE).toHaveProperty('grade');
      expect(STUDENT_PROFILE).toHaveProperty('week');
      expect(STUDENT_PROFILE).toHaveProperty('school');
      expect(STUDENT_PROFILE).toHaveProperty('className');
    });

    it('contains default student name', () => {
      expect(STUDENT_PROFILE.name).toBe('白浩辰');
    });

    it('has a valid week number', () => {
      expect(typeof STUDENT_PROFILE.week).toBe('number');
      expect(STUDENT_PROFILE.week).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // MISTAKE_CARDS
  // ============================================================
  describe('MISTAKE_CARDS', () => {
    it('contains exactly 3 cards', () => {
      expect(MISTAKE_CARDS).toHaveLength(3);
    });

    it('each card has required fields', () => {
      const requiredFields = [
        'id', 'title', 'severity', 'severityLabel',
        'category', 'categoryLabel', 'color',
        'scene', 'diagnosis', 'examImpact'
      ];
      MISTAKE_CARDS.forEach(card => {
        requiredFields.forEach(field => {
          expect(card).toHaveProperty(field);
        });
      });
    });

    it('each card has a unique id', () => {
      const ids = MISTAKE_CARDS.map(c => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('card 1 is a grammar/fatal error about tense', () => {
      const card = MISTAKE_CARDS[0];
      expect(card.category).toBe('grammar');
      expect(card.severity).toBe(SeverityLevel.FATAL);
      expect(card.scene.blocks.length).toBeGreaterThan(0);
    });

    it('card 2 is a spelling error with spellingErrors array', () => {
      const card = MISTAKE_CARDS[1];
      expect(card.category).toBe('spelling');
      expect(card.severity).toBe(SeverityLevel.HIGH);
      expect(card.spellingErrors).toBeDefined();
      expect(card.spellingErrors.length).toBeGreaterThan(0);
    });

    it('each spelling error has correct, wrong, and highlight fields', () => {
      const card = MISTAKE_CARDS[1];
      card.spellingErrors.forEach(err => {
        expect(err).toHaveProperty('correct');
        expect(err).toHaveProperty('wrong');
        expect(err).toHaveProperty('highlight');
        expect(err.correct).not.toBe(err.wrong);
      });
    });

    it('card 3 is a structure error', () => {
      const card = MISTAKE_CARDS[2];
      expect(card.category).toBe('structure');
      expect(card.severity).toBe(SeverityLevel.MEDIUM);
    });

    it('cards with blocks mark wrong blocks correctly', () => {
      const cardsWithBlocks = MISTAKE_CARDS.filter(c => c.scene.blocks.length > 0);
      expect(cardsWithBlocks.length).toBeGreaterThan(0);
      cardsWithBlocks.forEach(card => {
        const wrongBlocks = card.scene.blocks.filter(b => b.isWrong);
        expect(wrongBlocks.length).toBeGreaterThan(0);
      });
    });

    it('each block has word, color, and type properties', () => {
      MISTAKE_CARDS.forEach(card => {
        card.scene.blocks.forEach(block => {
          expect(block).toHaveProperty('word');
          expect(block).toHaveProperty('color');
          expect(block).toHaveProperty('type');
        });
      });
    });

    it('severity values are valid enum values', () => {
      const validSeverities = Object.values(SeverityLevel);
      MISTAKE_CARDS.forEach(card => {
        expect(validSeverities).toContain(card.severity);
      });
    });
  });

  // ============================================================
  // EXAM_PREVIEW
  // ============================================================
  describe('EXAM_PREVIEW', () => {
    it('has a title', () => {
      expect(EXAM_PREVIEW.title).toBeTruthy();
      expect(typeof EXAM_PREVIEW.title).toBe('string');
    });

    it('has preview questions', () => {
      expect(EXAM_PREVIEW.previewQuestions).toBeDefined();
      expect(EXAM_PREVIEW.previewQuestions.length).toBeGreaterThan(0);
    });

    it('each preview question has required fields', () => {
      EXAM_PREVIEW.previewQuestions.forEach(q => {
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('type');
        expect(q).toHaveProperty('targetWeakness');
        expect(q).toHaveProperty('question');
        expect(q).toHaveProperty('visible');
      });
    });

    it('has selling points', () => {
      expect(EXAM_PREVIEW.sellingPoints).toBeDefined();
      expect(EXAM_PREVIEW.sellingPoints.length).toBeGreaterThanOrEqual(3);
    });

    it('has bonus content description', () => {
      expect(EXAM_PREVIEW.bonusContent).toBeTruthy();
    });

    it('preview questions have unique ids', () => {
      const ids = EXAM_PREVIEW.previewQuestions.map(q => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  // ============================================================
  // VIP_PRICING
  // ============================================================
  describe('VIP_PRICING', () => {
    it('has monthly price', () => {
      expect(VIP_PRICING.monthlyPrice).toBeDefined();
      expect(typeof VIP_PRICING.monthlyPrice).toBe('number');
      expect(VIP_PRICING.monthlyPrice).toBeGreaterThan(0);
    });

    it('has CTA text', () => {
      expect(VIP_PRICING.ctaText).toBeTruthy();
    });

    it('has price text for display', () => {
      expect(VIP_PRICING.ctaPriceText).toBeTruthy();
    });

    it('monthly price is less than original price', () => {
      expect(VIP_PRICING.monthlyPrice).toBeLessThan(VIP_PRICING.originalPrice);
    });
  });

  // ============================================================
  // generateAlertData
  // ============================================================
  describe('generateAlertData', () => {
    it('returns default alert with no options', () => {
      const alert = generateAlertData();
      expect(alert.studentName).toBe(STUDENT_PROFILE.name);
      expect(alert.week).toBe(STUDENT_PROFILE.week);
      expect(alert.grammarIssues).toBe(3);
      expect(alert.spellingIssues).toBe(4);
    });

    it('calculates totalIssues correctly', () => {
      const alert = generateAlertData({ grammarIssues: 5, spellingIssues: 3 });
      expect(alert.totalIssues).toBe(8);
    });

    it('includes alert message with issue counts', () => {
      const alert = generateAlertData({ grammarIssues: 2, spellingIssues: 6 });
      expect(alert.alertMessage).toContain('2');
      expect(alert.alertMessage).toContain('6');
    });

    it('includes suggestion referencing the exam target', () => {
      const alert = generateAlertData({ examTarget: 'Module 5 周小结' });
      expect(alert.suggestion).toContain('Module 5 周小结');
    });

    it('accepts custom student name', () => {
      const alert = generateAlertData({ studentName: '李小红' });
      expect(alert.studentName).toBe('李小红');
    });

    it('accepts custom week number', () => {
      const alert = generateAlertData({ week: 10 });
      expect(alert.week).toBe(10);
    });

    it('handles zero issues', () => {
      const alert = generateAlertData({ grammarIssues: 0, spellingIssues: 0 });
      expect(alert.totalIssues).toBe(0);
      expect(alert.alertMessage).toContain('0');
    });

    it('returns all required alert properties', () => {
      const alert = generateAlertData();
      expect(alert).toHaveProperty('studentName');
      expect(alert).toHaveProperty('week');
      expect(alert).toHaveProperty('grade');
      expect(alert).toHaveProperty('grammarIssues');
      expect(alert).toHaveProperty('spellingIssues');
      expect(alert).toHaveProperty('totalIssues');
      expect(alert).toHaveProperty('examTarget');
      expect(alert).toHaveProperty('alertMessage');
      expect(alert).toHaveProperty('suggestion');
    });
  });

  // ============================================================
  // generateDynamicAlert
  // ============================================================
  describe('generateDynamicAlert', () => {
    it('returns zero-issue alert for null errorLog', () => {
      const alert = generateDynamicAlert(null);
      expect(alert.grammarIssues).toBe(0);
      expect(alert.spellingIssues).toBe(0);
    });

    it('returns zero-issue alert for empty array', () => {
      const alert = generateDynamicAlert([]);
      expect(alert.grammarIssues).toBe(0);
      expect(alert.spellingIssues).toBe(0);
    });

    it('returns zero-issue alert for non-array input', () => {
      const alert = generateDynamicAlert('invalid');
      expect(alert.grammarIssues).toBe(0);
      expect(alert.spellingIssues).toBe(0);
    });

    it('counts grammar and structure errors together', () => {
      const errorLog = [
        { type: 'grammar' },
        { type: 'structure' },
        { type: 'grammar' }
      ];
      const alert = generateDynamicAlert(errorLog);
      expect(alert.grammarIssues).toBe(3);
    });

    it('counts spelling errors', () => {
      const errorLog = [
        { type: 'spelling' },
        { type: 'spelling' }
      ];
      const alert = generateDynamicAlert(errorLog);
      expect(alert.spellingIssues).toBe(2);
    });

    it('handles mixed error types', () => {
      const errorLog = [
        { type: 'grammar' },
        { type: 'spelling' },
        { type: 'phonics' },
        { type: 'structure' }
      ];
      const alert = generateDynamicAlert(errorLog);
      expect(alert.grammarIssues).toBe(2);
      expect(alert.spellingIssues).toBe(1);
      expect(alert.totalIssues).toBe(3);
    });

    it('ignores unknown error types', () => {
      const errorLog = [
        { type: 'unknown_type' },
        { type: 'grammar' }
      ];
      const alert = generateDynamicAlert(errorLog);
      expect(alert.grammarIssues).toBe(1);
      expect(alert.spellingIssues).toBe(0);
    });
  });

  // ============================================================
  // getMistakeArchiveData
  // ============================================================
  describe('getMistakeArchiveData', () => {
    it('returns complete page data structure', () => {
      const data = getMistakeArchiveData();
      expect(data).toHaveProperty('alert');
      expect(data).toHaveProperty('student');
      expect(data).toHaveProperty('cards');
      expect(data).toHaveProperty('examPreview');
      expect(data).toHaveProperty('pricing');
    });

    it('alert has default values', () => {
      const data = getMistakeArchiveData();
      expect(data.alert.studentName).toBe(STUDENT_PROFILE.name);
    });

    it('cards array matches MISTAKE_CARDS', () => {
      const data = getMistakeArchiveData();
      expect(data.cards).toBe(MISTAKE_CARDS);
    });

    it('examPreview matches EXAM_PREVIEW', () => {
      const data = getMistakeArchiveData();
      expect(data.examPreview).toBe(EXAM_PREVIEW);
    });

    it('pricing matches VIP_PRICING', () => {
      const data = getMistakeArchiveData();
      expect(data.pricing).toBe(VIP_PRICING);
    });

    it('accepts custom options for alert', () => {
      const data = getMistakeArchiveData({ studentName: '王小明', week: 8 });
      expect(data.alert.studentName).toBe('王小明');
      expect(data.alert.week).toBe(8);
    });

    it('student profile is consistent', () => {
      const data = getMistakeArchiveData();
      expect(data.student).toBe(STUDENT_PROFILE);
    });
  });
});
