/**
 * photo-exercise.js - 拍照上传资料 → 练习习题生成
 *
 * Phase 1: 根据上传照片关联的模块上下文生成模拟练习题
 * Phase 2: 接入 OCR API 识别照片内容，精准生成习题
 *
 * 使用场景：
 * - 家长/教师上传纸质练习资料照片后，自动生成对应练习题
 */

const { SPELLING_TEMPLATES, GRAMMAR_TEMPLATES, WRITING_TEMPLATES, PHONICS_TEMPLATES } = require('./error-tracker');

/**
 * 根据上传的照片列表生成练习习题
 * Phase 1: 基于模块上下文生成示范习题
 * Phase 2: OCR 识别后精准生成
 *
 * @param {Array} photos - 照片列表（来自 photo-uploader.getPhotos）
 * @param {Object} options - 配置选项
 * @param {string} options.module - 当前模块 ('module_1' | 'module_2' | 'module_5')
 * @returns {Object} { exercises, photoCount, message }
 */
function generateExercisesFromPhotos(photos, options = {}) {
  if (!photos || !Array.isArray(photos) || photos.length === 0) {
    return {
      exercises: null,
      photoCount: 0,
      message: '请先上传练习资料照片'
    };
  }

  const moduleName = options.module || 'module_2';
  const exercises = {
    fillInBlank: [],
    multipleChoice: [],
    writing: [],
    pronunciation: []
  };

  // Phase 1: 根据模块上下文生成对应习题
  // Phase 2 将使用 OCR 识别照片内容并精准匹配
  const moduleExercises = getModuleExercises(moduleName);

  // 根据照片数量和模块内容生成习题
  // 每张照片对应一组习题
  const exercisesPerPhoto = Math.max(1, Math.ceil(3 / photos.length));

  for (let i = 0; i < photos.length; i++) {
    // 首字母填空
    const spStart = (i * exercisesPerPhoto) % moduleExercises.spelling.length;
    for (let j = 0; j < exercisesPerPhoto && (spStart + j) < moduleExercises.spelling.length; j++) {
      const template = moduleExercises.spelling[spStart + j];
      exercises.fillInBlank.push({
        ...template,
        type: 'fill_in_blank',
        source: { photoId: photos[i].id, photoIndex: i }
      });
    }

    // 语法选择题
    const grStart = (i * exercisesPerPhoto) % moduleExercises.grammar.length;
    for (let j = 0; j < exercisesPerPhoto && (grStart + j) < moduleExercises.grammar.length; j++) {
      const template = moduleExercises.grammar[grStart + j];
      exercises.multipleChoice.push({
        ...template,
        type: 'multiple_choice',
        source: { photoId: photos[i].id, photoIndex: i }
      });
    }
  }

  // 添加写作题（至多1道）
  if (moduleExercises.writing.length > 0) {
    exercises.writing.push({
      ...moduleExercises.writing[0],
      type: 'writing',
      source: { photoId: photos[0].id, photoIndex: 0 }
    });
  }

  // 添加发音题（至多1道）
  if (PHONICS_TEMPLATES.length > 0) {
    exercises.pronunciation.push({
      ...PHONICS_TEMPLATES[0],
      type: 'pronunciation',
      source: { photoId: photos[0].id, photoIndex: 0 }
    });
  }

  // 去重
  const seen = new Set();
  for (const key of ['fillInBlank', 'multipleChoice']) {
    exercises[key] = exercises[key].filter(item => {
      const id = item.question || item.pattern || JSON.stringify(item);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  const totalCount = exercises.fillInBlank.length +
    exercises.multipleChoice.length +
    exercises.writing.length +
    exercises.pronunciation.length;

  return {
    exercises,
    photoCount: photos.length,
    message: totalCount > 0
      ? `已从 ${photos.length} 张照片生成 ${totalCount} 道练习题（Phase 2 将支持 OCR 精准识别）`
      : '暂无法从照片生成习题，请确认照片内容清晰'
  };
}

/**
 * 根据模块获取对应的习题模板
 * @param {string} moduleName - 模块名称
 * @returns {Object} { spelling, grammar, writing }
 */
function getModuleExercises(moduleName) {
  const result = {
    spelling: [],
    grammar: [],
    writing: []
  };

  if (moduleName === 'module_1') {
    // Module 1 Seasons - 没有专门的拼写模板，使用通用的
    result.spelling = SPELLING_TEMPLATES.filter(t =>
      ['autumn', 'swim'].includes(t.pattern)
    );
    result.grammar = GRAMMAR_TEMPLATES.be_verb || [];
    result.writing = WRITING_TEMPLATES.filter(t => !t.module);
  } else if (moduleName === 'module_2') {
    // Module 2 Travel Plan
    result.spelling = SPELLING_TEMPLATES.filter(t =>
      ['climb', 'travel', 'museum', 'autumn', 'picnic', 'visit', 'swim'].includes(t.pattern)
    );
    const grammarTemplates = [
      ...(GRAMMAR_TEMPLATES.be_verb || []),
      ...(GRAMMAR_TEMPLATES.will_ing || []),
      ...(GRAMMAR_TEMPLATES.be_going_to_noun || []),
      ...(GRAMMAR_TEMPLATES.be_going_to_wrong_form || [])
    ];
    result.grammar = grammarTemplates;
    result.writing = WRITING_TEMPLATES.filter(t => !t.module || t.module !== 'Module 5');
  } else if (moduleName === 'module_5') {
    // Module 5 Safety
    result.spelling = SPELLING_TEMPLATES.filter(t =>
      ['dangerous', 'careful', 'cross', 'touch', 'feed'].includes(t.pattern)
    );
    const grammarTemplates = [
      ...(GRAMMAR_TEMPLATES.imperative_verb_form || []),
      ...(GRAMMAR_TEMPLATES.imperative_be_adjective || [])
    ];
    result.grammar = grammarTemplates;
    result.writing = WRITING_TEMPLATES.filter(t => t.module === 'Module 5');
  } else {
    // 默认使用所有模板
    result.spelling = SPELLING_TEMPLATES.slice(0, 5);
    const allGrammar = Object.values(GRAMMAR_TEMPLATES).flat();
    result.grammar = allGrammar.slice(0, 5);
    result.writing = WRITING_TEMPLATES.slice(0, 1);
  }

  return result;
}

/**
 * OCR 识别照片内容（Phase 2 占位）
 * @param {string} photoPath - 照片路径
 * @returns {Promise<Object>} OCR 结果
 */
function ocrRecognize(photoPath) {
  // Phase 2: 接入微信 OCR 或第三方 OCR API
  // wx.cloud.callFunction({ name: 'ocrRecognize', data: { path: photoPath } })
  return Promise.resolve({
    available: false,
    text: '',
    message: 'OCR 功能将在 Phase 2 中开放'
  });
}

module.exports = {
  generateExercisesFromPhotos,
  getModuleExercises,
  ocrRecognize
};
