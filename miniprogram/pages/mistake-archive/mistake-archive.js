/**
 * mistake-archive.js - 错题档案库页面
 *
 * 家长端核心转化页面：
 * Zone 1: 顶部学情警报
 * Zone 2: 错题"案发现场"还原卡片
 * Zone 3: VIP 试卷预览
 * Zone 4: 底部悬浮支付按钮
 */
const { getMistakeArchiveData, generateDynamicAlert } = require('../../utils/mistake-archive-data');
const { generateExercises, generatePDFData } = require('../../utils/error-tracker');

Page({
  data: {
    // Zone 1 - 学情警报
    alert: null,
    // Zone 2 - 错题卡片
    cards: [],
    currentCardIndex: 0,
    // Zone 3 - VIP 预览
    examPreview: null,
    pricing: null,
    // Zone 4 - 支付状态
    isVip: false,
    // 学生信息
    student: null,
    // 加载状态
    loading: true
  },

  onLoad() {
    this.loadArchiveData();
  },

  onShow() {
    // 刷新 VIP 状态
    const isVip = wx.getStorageSync('isVip') || false;
    if (isVip !== this.data.isVip) {
      this.setData({ isVip });
    }
  },

  /**
   * 获取错误日志
   * @returns {Array} errorLog
   */
  _getErrorLog() {
    return wx.getStorageSync('errorLog') || getApp().globalData.errorLog || [];
  },

  /**
   * 加载错题档案数据
   */
  loadArchiveData() {
    // 获取真实错误日志（如果有的话）
    const errorLog = this._getErrorLog();

    // 获取完整的 mock 页面数据
    const archiveData = getMistakeArchiveData();

    // 如果有真实错误日志，用动态数据覆盖警报
    const alert = errorLog.length > 0
      ? generateDynamicAlert(errorLog)
      : archiveData.alert;

    const isVip = wx.getStorageSync('isVip') || false;

    this.setData({
      alert,
      student: archiveData.student,
      cards: archiveData.cards,
      examPreview: archiveData.examPreview,
      pricing: archiveData.pricing,
      isVip,
      loading: false
    });
  },

  /**
   * 卡片滑动切换
   */
  onCardSwipe(e) {
    this.setData({
      currentCardIndex: e.detail.current
    });
  },

  /**
   * 开通 VIP
   */
  onSubscribeVip() {
    wx.showModal({
      title: '开通 VIP',
      content: 'VIP 订阅功能（¥15/月）将在 Phase 3 接入微信支付后开放。\n\n当前为体验模式，点击确定可免费体验导出功能。',
      confirmText: '免费体验',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('isVip', true);
          this.setData({ isVip: true });
          wx.showToast({ title: '已开启体验模式', icon: 'success' });
        }
      }
    });
  },

  /**
   * 一键生成错题卷
   */
  onGeneratePaper() {
    if (!this.data.isVip) {
      this.onSubscribeVip();
      return;
    }

    const errorLog = this._getErrorLog();

    wx.showLoading({ title: '正在生成试卷...' });

    const pdfData = generatePDFData(errorLog, {
      name: this.data.student.name,
      className: this.data.student.className
    });

    setTimeout(() => {
      wx.hideLoading();

      const exercises = generateExercises(errorLog);
      const summary = [];

      if (exercises.fillInBlank.length > 0) {
        summary.push(`首字母填空: ${exercises.fillInBlank.length} 题`);
      }
      if (exercises.multipleChoice.length > 0) {
        summary.push(`单项选择: ${exercises.multipleChoice.length} 题`);
      }
      if (exercises.pronunciation.length > 0) {
        summary.push(`发音辨析: ${exercises.pronunciation.length} 题`);
      }
      if (exercises.writing.length > 0) {
        summary.push(`情景写作: ${exercises.writing.length} 题`);
      }

      const content = summary.length > 0
        ? `${pdfData.header.title}\n\n已生成题目：\n${summary.join('\n')}\n\nPDF 导出功能将在 Phase 3 完成对接。`
        : '暂无错题数据。请先让孩子完成闯关练习，系统将自动追踪薄弱点并生成专属试卷。';

      wx.showModal({
        title: '📄 试卷生成预览',
        content,
        showCancel: false,
        confirmText: '知道了'
      });
    }, 1500);
  },

  /**
   * 分享给家人
   */
  onShareAppMessage() {
    const { student, alert } = this.data;
    return {
      title: `${student.name}的英语错题档案 - 第${alert.week}周`,
      path: '/pages/mistake-archive/mistake-archive'
    };
  }
});
