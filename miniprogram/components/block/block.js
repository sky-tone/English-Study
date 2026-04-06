/**
 * block.js - 磁性积木组件逻辑
 * 支持拖拽、碰撞检测、吸附、弹开
 */
Component({
  properties: {
    // 积木数据对象
    blockData: {
      type: Object,
      value: {}
    },
    // 是否显示类型标签
    showTag: {
      type: Boolean,
      value: false
    },
    // 初始 X 坐标
    initialX: {
      type: Number,
      value: 0
    },
    // 初始 Y 坐标
    initialY: {
      type: Number,
      value: 0
    },
    // 是否在句子区域内（已吸附）
    inSentence: {
      type: Boolean,
      value: false
    }
  },

  data: {
    x: 0,
    y: 0,
    dragging: false,
    shaking: false,
    bouncing: false,
    showReject: false,
    rejectMessage: '',
    color: '#4A90D9',
    tagText: '',
    showLeftConnector: true,
    showRightConnector: true,
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0
  },

  lifetimes: {
    attached() {
      this.setData({
        x: this.properties.initialX,
        y: this.properties.initialY,
        color: this.properties.blockData.color || '#4A90D9'
      });
      this.updateTagText();
    }
  },

  observers: {
    'blockData.type': function(type) {
      this.updateTagText();
    },
    'initialX, initialY': function(x, y) {
      if (!this.data.dragging) {
        this.setData({ x, y });
      }
    }
  },

  methods: {
    updateTagText() {
      const typeLabels = {
        'subject': '主语',
        'tense': '时态',
        'verb': '动词',
        'time': '时间',
        'sequence': '连接'
      };
      this.setData({
        tagText: typeLabels[this.properties.blockData.type] || ''
      });
    },

    onTouchStart(e) {
      const touch = e.touches[0];
      this.setData({
        dragging: true,
        startX: touch.clientX - this.data.x,
        startY: touch.clientY - this.data.y
      });

      this.triggerEvent('dragstart', {
        blockData: this.properties.blockData,
        x: this.data.x,
        y: this.data.y
      });
    },

    onTouchMove(e) {
      if (!this.data.dragging) return;

      const touch = e.touches[0];
      const newX = touch.clientX - this.data.startX;
      const newY = touch.clientY - this.data.startY;

      this.setData({
        x: newX,
        y: newY
      });

      this.triggerEvent('dragmove', {
        blockData: this.properties.blockData,
        x: newX,
        y: newY
      });
    },

    onTouchEnd(e) {
      this.setData({ dragging: false });

      this.triggerEvent('dragend', {
        blockData: this.properties.blockData,
        x: this.data.x,
        y: this.data.y
      });
    },

    /**
     * 触发拒绝动画（震动 + 弹开 + 提示气泡）
     * @param {string} message - 提示消息
     */
    reject(message) {
      this.setData({
        shaking: true,
        showReject: true,
        rejectMessage: message
      });

      // 震动反馈
      wx.vibrateShort({ type: 'heavy' });

      // 1.5秒后隐藏提示
      setTimeout(() => {
        this.setData({
          shaking: false,
          showReject: false,
          rejectMessage: ''
        });
      }, 2000);

      // 弹回原位
      setTimeout(() => {
        this.setData({
          x: this.properties.initialX,
          y: this.properties.initialY
        });
      }, 500);
    },

    /**
     * 触发吸附动画
     * @param {number} targetX - 目标 X
     * @param {number} targetY - 目标 Y
     */
    snapTo(targetX, targetY) {
      this.setData({
        bouncing: true,
        x: targetX,
        y: targetY
      });

      // 吸附反馈
      wx.vibrateShort({ type: 'light' });

      setTimeout(() => {
        this.setData({ bouncing: false });
      }, 400);
    },

    /**
     * 重置到初始位置
     */
    reset() {
      this.setData({
        x: this.properties.initialX,
        y: this.properties.initialY,
        dragging: false,
        shaking: false,
        bouncing: false
      });
    }
  }
});
