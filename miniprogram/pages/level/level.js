/**
 * level.js - 闯关页面逻辑（学生端核心玩法）
 *
 * 核心流程：
 * 1. 加载关卡数据，展示 NPC 对话
 * 2. 学生点击/拖拽积木到句子拼装区
 * 3. 碰撞校验引擎实时验证
 * 4. 提交句子 → 计分 → 记录错误 → 解锁下一关
 */
const { checkCollision, validateSentence, BlockType } = require('../../utils/collision');
const { LEVELS, getBlocksForLevel, NPC_CHARACTERS, VOCABULARY_BACKPACK } = require('../../utils/mock-data');

Page({
  data: {
    levelId: 'level_1',
    levelData: {
      module: '',
      title: '',
      objectives: [],
      trigger: {
        character: '',
        message: '',
        subMessage: ''
      }
    },
    levelIndex: 0,
    availableBlocks: {
      subjects: [],
      tenses: [],
      verbs: [],
      times: [],
      sequences: []
    },
    currentSentence: [],    // 当前正在拼装的句子
    completedSentences: [],  // 已完成的句子（文本）
    totalScore: 0,
    isDragging: false,
    showNpcDialog: false,
    npcName: 'Aki',
    showCompletion: false,
    hasNextLevel: true,
    completedObjectives: [],
    vocabularyWords: []
  },

  onLoad(options) {
    const levelId = options.levelId || 'level_1';
    this.loadLevel(levelId);
  },

  /**
   * 加载关卡
   */
  loadLevel(levelId) {
    const levelData = LEVELS.find(l => l.id === levelId);
    if (!levelData) {
      wx.showToast({ title: '关卡不存在', icon: 'error' });
      return;
    }

    const levelIndex = LEVELS.indexOf(levelData);
    const blocks = getBlocksForLevel(levelId);
    const npcChar = NPC_CHARACTERS[levelData.npc] || NPC_CHARACTERS.aki;
    const hasNextLevel = levelIndex < LEVELS.length - 1;

    // 获取词汇背包
    const vocab = VOCABULARY_BACKPACK.module_2;

    this.setData({
      levelId,
      levelData,
      levelIndex,
      availableBlocks: blocks,
      currentSentence: [],
      completedSentences: [],
      totalScore: 0,
      showNpcDialog: true,
      npcName: npcChar.name,
      showCompletion: false,
      hasNextLevel,
      completedObjectives: new Array(levelData.objectives.length).fill(false),
      vocabularyWords: vocab ? vocab.words : []
    });

    wx.setNavigationBarTitle({ title: levelData.title });
  },

  /**
   * NPC 对话关闭
   */
  onNpcDismiss() {
    this.setData({ showNpcDialog: false });
  },

  /**
   * 点击积木 → 添加到句子中
   */
  onBlockTap(e) {
    const block = e.currentTarget.dataset.block;
    if (!block) return;

    // 创建积木副本（避免引用问题）
    const newBlock = { ...block, instanceId: `${block.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` };

    // 执行碰撞检测
    const insertIndex = this.data.currentSentence.length;
    const collisionResult = checkCollision(
      null,
      newBlock,
      this.data.currentSentence,
      insertIndex
    );

    if (!collisionResult.accepted) {
      // 拒绝 - 显示提示
      wx.showToast({
        title: collisionResult.message.split('\n')[0],
        icon: 'none',
        duration: 2500
      });

      // 震动反馈
      wx.vibrateShort({ type: 'heavy' });

      // 记录错误
      this.logCollisionError(collisionResult);
      return;
    }

    // 接受 - 添加到句子中
    const sentence = [...this.data.currentSentence, newBlock];
    this.setData({ currentSentence: sentence });

    // 吸附反馈
    wx.vibrateShort({ type: 'light' });

    // 如果有提示消息（非错误），也显示
    if (collisionResult.message) {
      wx.showToast({
        title: collisionResult.message.split('\n')[0],
        icon: 'none',
        duration: 2000
      });
    }

    // 检查目标完成度
    this.checkObjectives();
  },

  /**
   * 移除句子中的积木
   */
  onRemoveBlock(e) {
    const index = e.detail.index;
    const sentence = [...this.data.currentSentence];
    sentence.splice(index, 1);
    this.setData({ currentSentence: sentence });
  },

  /**
   * 清空当前句子
   */
  onSentenceClear() {
    this.setData({ currentSentence: [] });
  },

  /**
   * 句子提交成功
   */
  onSentenceSubmit(e) {
    const { sentence, blocks, score, hasSequence } = e.detail;

    // 添加到已完成句子
    const completed = [...this.data.completedSentences, sentence];
    const newScore = this.data.totalScore + score;

    this.setData({
      completedSentences: completed,
      currentSentence: [],
      totalScore: newScore
    });

    // 持久化已完成的句子到本地存储
    wx.setStorageSync('completedSentences', completed);

    // 检查目标
    this.checkObjectives();

    // 检查关卡是否完成
    this.checkLevelCompletion();
  },

  /**
   * 句子验证错误
   */
  onValidationError(e) {
    const { errors } = e.detail;

    // 记录结构错误
    if (errors) {
      errors.forEach(err => {
        getApp().logError({
          type: 'structure',
          subType: 'validation_error',
          context: err,
          detail: { sentence: this.data.currentSentence.map(b => b.word).join(' ') }
        });
      });
    }
  },

  /**
   * 词汇背包点击
   */
  onVocabTap(e) {
    const word = e.detail.word;
    wx.showToast({
      title: `${word.word} - ${word.chinese}`,
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 检查目标完成度
   */
  checkObjectives() {
    const { levelData, currentSentence, completedSentences } = this.data;
    const objectives = [...this.data.completedObjectives];

    // 目标1: 使用 will 或 be going to
    const allBlocks = [...currentSentence];
    const hasWill = allBlocks.some(b => b.word === 'will');
    const hasGoingTo = allBlocks.some(b => b.word === 'going to');
    if (hasWill || hasGoingTo) {
      objectives[0] = true;
    }

    // 目标2: 正确搭配主语和 Be 动词
    if (completedSentences.length > 0) {
      objectives[1] = true;
    }

    // 目标3: 使用连接词（关卡2）
    if (levelData.id === 'level_2') {
      const hasSequence = allBlocks.some(b => b.type === BlockType.SEQUENCE);
      if (hasSequence || completedSentences.length >= 2) {
        objectives[2] = true;
      }
    }

    this.setData({ completedObjectives: objectives });
  },

  /**
   * 检查关卡完成
   */
  checkLevelCompletion() {
    const { levelData, completedSentences, totalScore } = this.data;
    const minSentences = levelData.minSentences || 1;

    if (completedSentences.length >= minSentences && totalScore >= levelData.passScore) {
      // 更新并持久化已完成关卡数
      const prevCompleted = wx.getStorageSync('levelsCompleted') || 0;
      const levelsCompleted = Math.max(prevCompleted, this.data.levelIndex + 1);
      wx.setStorageSync('levelsCompleted', levelsCompleted);

      // 延迟显示完成弹窗
      setTimeout(() => {
        this.setData({ showCompletion: true });
      }, 500);

      // 检查结构性错误（未使用连接词）
      if (levelData.id === 'level_2') {
        const hasSequenceInAny = completedSentences.some(s =>
          s.startsWith('First') || s.startsWith('Next') ||
          s.startsWith('Then') || s.startsWith('Finally') ||
          s.startsWith('On the')
        );
        if (!hasSequenceInAny) {
          getApp().logError({
            type: 'structure',
            subType: 'missing_sequence',
            context: 'Level 2 完成但未使用连接词',
            detail: { sentences: completedSentences }
          });
        }
      }
    }
  },

  /**
   * 记录碰撞错误到全局错误日志
   */
  logCollisionError(result) {
    if (result.errorType) {
      getApp().logError({
        type: result.errorType,
        subType: result.errorSubType,
        context: result.message,
        detail: result.detail || {}
      });
    }
  },

  /**
   * 重试当前关卡
   */
  retryLevel() {
    this.loadLevel(this.data.levelId);
  },

  /**
   * 进入下一关
   */
  nextLevel() {
    const nextIndex = this.data.levelIndex + 1;
    if (nextIndex < LEVELS.length) {
      this.loadLevel(LEVELS[nextIndex].id);
    }
  },

  /**
   * 回首页
   */
  goHome() {
    wx.navigateBack();
  },

  /**
   * 关闭完成弹窗
   */
  closeCompletion() {
    this.setData({ showCompletion: false });
  }
});
