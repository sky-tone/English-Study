/**
 * photo-exercise.test.js - 拍照上传 → 练习习题生成测试
 */

// Mock wx global
global.wx = {
  getStorageSync: jest.fn(() => null),
  setStorageSync: jest.fn()
};

const {
  generateExercisesFromPhotos,
  getModuleExercises,
  ocrRecognize
} = require('../photo-exercise');

// Helper to create mock photo objects
function makePhoto(id = 'photo_1', path = '/tmp/test.jpg') {
  return { id, path, timestamp: Date.now() };
}

describe('generateExercisesFromPhotos', () => {
  test('returns message when no photos provided', () => {
    const result = generateExercisesFromPhotos([]);
    expect(result.exercises).toBeNull();
    expect(result.photoCount).toBe(0);
    expect(result.message).toContain('请先上传');
  });

  test('returns message for null photos', () => {
    const result = generateExercisesFromPhotos(null);
    expect(result.exercises).toBeNull();
  });

  test('generates exercises from single photo', () => {
    const photos = [makePhoto('p1')];
    const result = generateExercisesFromPhotos(photos, { module: 'module_2' });
    expect(result.photoCount).toBe(1);
    expect(result.exercises).toBeDefined();
    expect(result.message).toContain('1 张照片');
  });

  test('generates exercises from multiple photos', () => {
    const photos = [makePhoto('p1'), makePhoto('p2'), makePhoto('p3')];
    const result = generateExercisesFromPhotos(photos, { module: 'module_2' });
    expect(result.photoCount).toBe(3);
    expect(result.exercises).toBeDefined();
  });

  test('exercises have correct structure', () => {
    const photos = [makePhoto('p1')];
    const result = generateExercisesFromPhotos(photos, { module: 'module_2' });
    expect(result.exercises).toHaveProperty('fillInBlank');
    expect(result.exercises).toHaveProperty('multipleChoice');
    expect(result.exercises).toHaveProperty('writing');
    expect(result.exercises).toHaveProperty('pronunciation');
  });

  test('exercise items have source photoId', () => {
    const photos = [makePhoto('photo_123')];
    const result = generateExercisesFromPhotos(photos, { module: 'module_2' });
    const allItems = [
      ...result.exercises.fillInBlank,
      ...result.exercises.multipleChoice,
      ...result.exercises.writing,
      ...result.exercises.pronunciation
    ];
    const itemsWithSource = allItems.filter(item => item.source && item.source.photoId);
    expect(itemsWithSource.length).toBeGreaterThan(0);
  });

  test('defaults to module_2 when no module specified', () => {
    const photos = [makePhoto('p1')];
    const result = generateExercisesFromPhotos(photos);
    expect(result.exercises).toBeDefined();
  });

  test('works with module_1', () => {
    const photos = [makePhoto('p1')];
    const result = generateExercisesFromPhotos(photos, { module: 'module_1' });
    expect(result.exercises).toBeDefined();
  });

  test('works with module_5', () => {
    const photos = [makePhoto('p1')];
    const result = generateExercisesFromPhotos(photos, { module: 'module_5' });
    expect(result.exercises).toBeDefined();
  });
});

describe('getModuleExercises', () => {
  test('module_1 returns spelling, grammar, writing arrays', () => {
    const result = getModuleExercises('module_1');
    expect(Array.isArray(result.spelling)).toBe(true);
    expect(Array.isArray(result.grammar)).toBe(true);
    expect(Array.isArray(result.writing)).toBe(true);
  });

  test('module_2 returns spelling templates with travel words', () => {
    const result = getModuleExercises('module_2');
    expect(result.spelling.length).toBeGreaterThan(0);
    const patterns = result.spelling.map(t => t.pattern);
    expect(patterns.some(p => ['climb', 'travel', 'museum', 'visit', 'swim'].includes(p))).toBe(true);
  });

  test('module_5 returns grammar templates for imperatives', () => {
    const result = getModuleExercises('module_5');
    expect(result.grammar.length).toBeGreaterThan(0);
  });

  test('unknown module returns default templates', () => {
    const result = getModuleExercises('module_99');
    expect(result.spelling.length).toBeGreaterThan(0);
    expect(result.grammar.length).toBeGreaterThan(0);
  });
});

describe('ocrRecognize', () => {
  test('returns unavailable in Phase 1', async () => {
    const result = await ocrRecognize('/tmp/test.jpg');
    expect(result.available).toBe(false);
    expect(result.message).toContain('Phase 2');
  });
});
