/**
 * sentence-area.js - 句子拼装区域组件
 */
const { validateSentence } = require('../../utils/collision');
const { checkGrammarLocal } = require('../../utils/grammar-checker');

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

  lifetimes: {
    attached() {
      // 在组件挂载时创建音频上下文
      this._successAudio = wx.createInnerAudioContext();
      this._failAudio = wx.createInnerAudioContext();
      this._successAudio.src = '/audio/success.wav';
      this._failAudio.src = '/audio/fail.wav';
    },
    detached() {
      // 在组件卸载时销毁音频上下文，防止内存泄漏
      if (this._successAudio) {
        this._successAudio.destroy();
        this._successAudio = null;
      }
      if (this._failAudio) {
        this._failAudio.destroy();
        this._failAudio = null;
      }
    }
  },

  observers: {
    'sentenceBlocks': function(blocks) {
      // 更新预览文本（避免在连接词逗号后重复添加句号）
      if (blocks.length === 0) {
        this.setData({ previewText: '' });
        return;
      }
      const text = blocks.map(b => b.word).join(' ');
      const lastChar = text.trim().slice(-1);
      const needsPeriod = lastChar !== '.' && lastChar !== ',' && lastChar !== '!' && lastChar !== '?';
      this.setData({ previewText: text + (needsPeriod ? '.' : '') });
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

      // 增强语法检查（在碰撞引擎之上追加本地语法规则）
      const sentenceText = blocks.map(b => b.word).join(' ');
      const grammarResult = checkGrammarLocal(sentenceText, blocks);
      if (grammarResult.errors.length > 0) {
        result.valid = false;
        result.errors.push(...grammarResult.errors);
      }
      if (grammarResult.warnings.length > 0) {
        result.warnings.push(...grammarResult.warnings);
      }

      if (result.valid) {
        const finalText = sentenceText + '.';
        this.setData({
          feedbackMessage: '🎉 太棒了！句子正确！Great job!',
          feedbackType: 'success'
        });
        // 播放成功音效
        if (this._successAudio) {
          this._successAudio.stop();
          this._successAudio.play();
        }
        this.triggerEvent('submit', {
          sentence: finalText,
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
        // 播放失败音效
        if (this._failAudio) {
          this._failAudio.stop();
          this._failAudio.play();
        }
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
