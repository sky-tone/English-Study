/**
 * mock-data.test.js - 模拟数据完整性与查询函数测试
 *
 * 测试覆盖：
 * - 积木数据完整性（每个积木有 id, word, type, color）
 * - 关卡配置完整性
 * - getBlocksForLevel 查询
 * - getBlockById 查询
 * - NPC 角色数据
 * - 词汇背包数据
 */

const {
  NPC_CHARACTERS,
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
} = require('../mock-data');

const { BlockType, VerbForm } = require('../collision');

// ============================================================
// 1. Block data integrity
// ============================================================
describe('Block data integrity', () => {
  const allBlocks = [
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

  test('every block has required fields: id, word, type, color', () => {
    for (const block of allBlocks) {
      expect(block).toHaveProperty('id');
      expect(block).toHaveProperty('word');
      expect(block).toHaveProperty('type');
      expect(block).toHaveProperty('color');
      expect(typeof block.id).toBe('string');
      expect(typeof block.word).toBe('string');
      expect(block.word.length).toBeGreaterThan(0);
    }
  });

  test('all block IDs are unique', () => {
    const ids = allBlocks.map(b => b.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('subject blocks all have type SUBJECT', () => {
    for (const block of SUBJECT_BLOCKS) {
      expect(block.type).toBe(BlockType.SUBJECT);
    }
  });

  test('tense blocks all have type TENSE', () => {
    for (const block of TENSE_BLOCKS) {
      expect(block.type).toBe(BlockType.TENSE);
    }
  });

  test('verb blocks all have type VERB', () => {
    for (const block of VERB_BLOCKS) {
      expect(block.type).toBe(BlockType.VERB);
    }
  });

  test('time blocks all have type TIME', () => {
    for (const block of TIME_BLOCKS) {
      expect(block.type).toBe(BlockType.TIME);
    }
  });

  test('sequence blocks all have type SEQUENCE', () => {
    for (const block of SEQUENCE_BLOCKS) {
      expect(block.type).toBe(BlockType.SEQUENCE);
    }
  });

  test('verb blocks have verbForm defined', () => {
    const allVerbBlocks = [...VERB_BLOCKS, ...SAFETY_VERB_BLOCKS];
    for (const block of allVerbBlocks) {
      expect(block.verbForm).toBeDefined();
      expect([VerbForm.BARE, VerbForm.GERUND, VerbForm.PAST, VerbForm.NOUN, VerbForm.THIRD_PERSON]).toContain(block.verbForm);
    }
  });

  test('sequence blocks have order defined', () => {
    for (const block of SEQUENCE_BLOCKS) {
      expect(block.order).toBeDefined();
      expect(typeof block.order).toBe('number');
    }
  });

  test('there are distractor verb blocks', () => {
    const distractors = VERB_BLOCKS.filter(b => b.isDistractor);
    expect(distractors.length).toBeGreaterThan(0);
    // Distractors should not be bare form
    for (const d of distractors) {
      expect(d.verbForm).not.toBe(VerbForm.BARE);
    }
  });
});

// ============================================================
// 2. NPC Characters
// ============================================================
describe('NPC Characters', () => {
  test('aki character exists with required fields', () => {
    const aki = NPC_CHARACTERS.aki;
    expect(aki).toBeDefined();
    expect(aki.id).toBe('aki');
    expect(aki.name).toBe('Aki');
    expect(aki.avatar).toBeDefined();
    expect(aki.greeting).toBeDefined();
  });

  test('ben character exists with required fields', () => {
    const ben = NPC_CHARACTERS.ben;
    expect(ben).toBeDefined();
    expect(ben.id).toBe('ben');
    expect(ben.name).toBe('Ben');
    expect(ben.avatar).toBeDefined();
    expect(ben.greeting).toBeDefined();
  });
});

// ============================================================
// 3. Level configurations
// ============================================================
describe('Level configurations', () => {
  test('there are at least 3 levels', () => {
    expect(LEVELS.length).toBeGreaterThanOrEqual(3);
  });

  test('each level has required fields', () => {
    for (const level of LEVELS) {
      expect(level).toHaveProperty('id');
      expect(level).toHaveProperty('module');
      expect(level).toHaveProperty('title');
      expect(level).toHaveProperty('difficulty');
      expect(level).toHaveProperty('npc');
      expect(level).toHaveProperty('trigger');
      expect(level).toHaveProperty('objectives');
      expect(level).toHaveProperty('availableBlocks');
      expect(level).toHaveProperty('sampleAnswers');
      expect(level).toHaveProperty('maxScore');
      expect(level).toHaveProperty('passScore');
    }
  });

  test('level IDs are unique', () => {
    const ids = LEVELS.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('level trigger has character, message, subMessage', () => {
    for (const level of LEVELS) {
      expect(level.trigger.character).toBeDefined();
      expect(level.trigger.message).toBeDefined();
      expect(level.trigger.subMessage).toBeDefined();
    }
  });

  test('level NPC references valid characters', () => {
    for (const level of LEVELS) {
      expect(NPC_CHARACTERS[level.npc]).toBeDefined();
    }
  });

  test('level availableBlocks references valid block IDs', () => {
    const allBlockIds = new Set([
      ...SUBJECT_BLOCKS.map(b => b.id),
      ...TENSE_BLOCKS.map(b => b.id),
      ...VERB_BLOCKS.map(b => b.id),
      ...TIME_BLOCKS.map(b => b.id),
      ...SEQUENCE_BLOCKS.map(b => b.id),
      ...IMPERATIVE_BLOCKS.map(b => b.id),
      ...SAFETY_VERB_BLOCKS.map(b => b.id),
      ...OBJECT_BLOCKS.map(b => b.id),
      ...ADJECTIVE_BLOCKS.map(b => b.id)
    ]);

    for (const level of LEVELS) {
      const refs = [
        ...level.availableBlocks.subjects,
        ...level.availableBlocks.tenses,
        ...level.availableBlocks.verbs,
        ...level.availableBlocks.times,
        ...level.availableBlocks.sequences,
        ...(level.availableBlocks.imperatives || []),
        ...(level.availableBlocks.objects || []),
        ...(level.availableBlocks.adjectives || [])
      ];
      for (const ref of refs) {
        expect(allBlockIds.has(ref)).toBe(true);
      }
    }
  });

  test('passScore is less than or equal to maxScore', () => {
    for (const level of LEVELS) {
      expect(level.passScore).toBeLessThanOrEqual(level.maxScore);
    }
  });

  test('level_1 is Module 2 with difficulty 1', () => {
    const l1 = LEVELS.find(l => l.id === 'level_1');
    expect(l1.module).toBe('Module 2');
    expect(l1.difficulty).toBe(1);
  });

  test('level_2 requires minSentences >= 3', () => {
    const l2 = LEVELS.find(l => l.id === 'level_2');
    expect(l2.minSentences).toBeGreaterThanOrEqual(3);
  });

  test('level_3 is Module 5 (Use...to...)', () => {
    const l3 = LEVELS.find(l => l.id === 'level_3');
    expect(l3.module).toBe('Module 5');
  });
});

// ============================================================
// 4. getBlocksForLevel
// ============================================================
describe('getBlocksForLevel', () => {
  test('returns blocks for level_1', () => {
    const blocks = getBlocksForLevel('level_1');
    expect(blocks).not.toBeNull();
    expect(blocks.subjects.length).toBeGreaterThan(0);
    expect(blocks.tenses.length).toBeGreaterThan(0);
    expect(blocks.verbs.length).toBeGreaterThan(0);
  });

  test('level_1 has 3 subject blocks (s1, s2, s3)', () => {
    const blocks = getBlocksForLevel('level_1');
    expect(blocks.subjects).toHaveLength(3);
    const ids = blocks.subjects.map(b => b.id);
    expect(ids).toContain('s1');
    expect(ids).toContain('s2');
    expect(ids).toContain('s3');
  });

  test('level_1 has no sequence blocks', () => {
    const blocks = getBlocksForLevel('level_1');
    expect(blocks.sequences).toHaveLength(0);
  });

  test('level_2 has sequence blocks', () => {
    const blocks = getBlocksForLevel('level_2');
    expect(blocks.sequences.length).toBeGreaterThan(0);
  });

  test('level_2 includes distractor verbs', () => {
    const blocks = getBlocksForLevel('level_2');
    const distractors = blocks.verbs.filter(b => b.isDistractor);
    expect(distractors.length).toBeGreaterThan(0);
  });

  test('level_3 only has verb/tool blocks', () => {
    const blocks = getBlocksForLevel('level_3');
    expect(blocks.subjects).toHaveLength(0);
    expect(blocks.tenses).toHaveLength(0);
    expect(blocks.times).toHaveLength(0);
    expect(blocks.sequences).toHaveLength(0);
    expect(blocks.verbs.length).toBeGreaterThan(0);
  });

  test('returns null for non-existent level', () => {
    const blocks = getBlocksForLevel('level_999');
    expect(blocks).toBeNull();
  });
});

// ============================================================
// 5. getBlockById
// ============================================================
describe('getBlockById', () => {
  test('finds subject block s1', () => {
    const block = getBlockById('s1');
    expect(block).not.toBeNull();
    expect(block.word).toBe('I');
    expect(block.type).toBe(BlockType.SUBJECT);
  });

  test('finds tense block t1 (will)', () => {
    const block = getBlockById('t1');
    expect(block).not.toBeNull();
    expect(block.word).toBe('will');
  });

  test('finds verb block v1', () => {
    const block = getBlockById('v1');
    expect(block).not.toBeNull();
    expect(block.type).toBe(BlockType.VERB);
  });

  test('finds time block tm1', () => {
    const block = getBlockById('tm1');
    expect(block).not.toBeNull();
    expect(block.type).toBe(BlockType.TIME);
  });

  test('finds sequence block sq1', () => {
    const block = getBlockById('sq1');
    expect(block).not.toBeNull();
    expect(block.type).toBe(BlockType.SEQUENCE);
  });

  test('returns null for non-existent ID', () => {
    const block = getBlockById('does_not_exist');
    expect(block).toBeNull();
  });
});

// ============================================================
// 6. Vocabulary Backpack
// ============================================================
describe('Vocabulary Backpack', () => {
  test('module_2 vocabulary exists', () => {
    expect(VOCABULARY_BACKPACK.module_2).toBeDefined();
    expect(VOCABULARY_BACKPACK.module_2.title).toContain('Module 2');
  });

  test('module_2 has words array with entries', () => {
    const words = VOCABULARY_BACKPACK.module_2.words;
    expect(Array.isArray(words)).toBe(true);
    expect(words.length).toBeGreaterThan(0);
  });

  test('each vocabulary word has word and chinese fields', () => {
    for (const entry of VOCABULARY_BACKPACK.module_2.words) {
      expect(entry).toHaveProperty('word');
      expect(entry).toHaveProperty('chinese');
      expect(typeof entry.word).toBe('string');
      expect(typeof entry.chinese).toBe('string');
    }
  });

  test('vocabulary includes key travel words', () => {
    const words = VOCABULARY_BACKPACK.module_2.words.map(w => w.word);
    expect(words).toContain('travel');
    expect(words).toContain('visit');
    expect(words).toContain('swim');
    expect(words).toContain('will');
    expect(words).toContain('going to');
  });
});
