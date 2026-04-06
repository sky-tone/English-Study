/**
 * sentence-area.js - 句子拼装区域组件
 */
const { validateSentence } = require('../../utils/collision');

Component({
  properties: {
    // 当前句子中的积木
    sentenceBlocks: {
      type: Array,
      value: []
    },
    // 是否为拖拽目标
    isDropTarget: {
      type: Boolean,
      value: false
    },
    // 已完成的句子（多句模式）
    completedSentences: {
      type: Array,
      value: []
    }
  },

  data: {
    editMode: false,
    previewText: '',
    feedbackMessage: '',
    feedbackType: '' // 'success' | 'warning' | 'error'
  },

  observers: {
    'sentenceBlocks': function(blocks) {
      // 更新预览文本
      const preview = blocks.map(b => b.word).join(' ') + (blocks.length > 0 ? '.' : '');
      this.setData({ previewText: preview });
    }
  },

  methods: {
    onAreaTap() {
      // 退出编辑模式
      if (this.data.editMode) {
        this.setData({ editMode: false });
      }
    },

    onBlockTap(e) {
      // 点击已放置的积木
      const index = e.currentTarget.dataset.index;
      this.triggerEvent('blocktap', { index });
    },

    onBlockLongPress(e) {
      // 长按进入编辑模式（显示删除按钮）
      this.setData({ editMode: true });
      wx.vibrateShort({ type: 'medium' });
    },

    onRemoveBlock(e) {
      const index = e.currentTarget.dataset.index;
      this.triggerEvent('removeblock', { index });
    },

    onClear() {
      wx.showModal({
        title: '确认清空',
        content: '确定要清空当前句子吗？',
        success: (res) => {
          if (res.confirm) {
            this.triggerEvent('clear');
            this.setData({
              editMode: false,
              feedbackMessage: '',
              feedbackType: ''
            });
          }
        }
      });
    },

    onSubmit() {
      const blocks = this.properties.sentenceBlocks;
      const result = validateSentence(blocks);

      if (result.valid) {
        const sentenceText = blocks.map(b => b.word).join(' ') + '.';
        this.setData({
          feedbackMessage: '🎉 太棒了！句子正确！Great job!',
          feedbackType: 'success'
        });
        this.triggerEvent('submit', {
          sentence: sentenceText,
          blocks: blocks,
          score: result.score,
          hasSequence: result.hasSequence
        });
      } else {
        const errorMsg = result.errors.join('；');
        this.setData({
          feedbackMessage: errorMsg,
          feedbackType: 'error'
        });
        this.triggerEvent('validationerror', {
          errors: result.errors,
          warnings: result.warnings
        });
      }

      // 显示警告
      if (result.warnings && result.warnings.length > 0) {
        setTimeout(() => {
          this.setData({
            feedbackMessage: result.warnings.join('；'),
            feedbackType: 'warning'
          });
        }, result.valid ? 2000 : 0);
      }
    },

    /**
     * 显示反馈消息
     */
    showFeedback(message, type) {
      this.setData({
        feedbackMessage: message,
        feedbackType: type
      });

      if (type === 'success' || type === 'warning') {
        setTimeout(() => {
          this.setData({ feedbackMessage: '', feedbackType: '' });
        }, 3000);
      }
    },

    /**
     * 清除反馈
     */
    clearFeedback() {
      this.setData({ feedbackMessage: '', feedbackType: '' });
    }
  }
});
