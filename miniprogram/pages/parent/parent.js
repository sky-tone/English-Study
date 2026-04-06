/**
 * parent.js - 家长中心页面
 * 功能：五维雷达图 + 学习统计 + VIP 导出错题卷
 */
const { generatePDFData, generateExercises } = require('../../utils/error-tracker');

Page({
  data: {
    isVip: false,
    studentBound: true, // Phase 1 默认绑定
    radarData: {
      spelling: 0,
      grammar: 0,
      structure: 0,
      pragmatics: 0,
      phonics: 0
    },
    stats: {
      totalSentences: 0,
      totalErrors: 0,
      accuracy: 100,
      levelsCompleted: 0
    },
    errorList: []
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const app = getApp();

    // 加载雷达数据
    const radarData = wx.getStorageSync('radarData') || app.globalData.radarData;

    // 加载错误日志
    const errorLog = wx.getStorageSync('errorLog') || app.globalData.errorLog || [];

    // 计算统计
    const completedSentences = wx.getStorageSync('completedSentences') || [];
    const totalSentences = completedSentences.length || 0;
    const totalErrors = errorLog.length;
    const accuracy = totalSentences > 0
      ? Math.round(((totalSentences - totalErrors) / totalSentences) * 100)
      : 100;
    const levelsCompleted = wx.getStorageSync('levelsCompleted') || 0;

    // 格式化错误列表
    const typeColors = {
      spelling: '#4A90D9',
      grammar: '#E74C3C',
      structure: '#27AE60',
      pragmatics: '#F39C12',
      phonics: '#9B59B6'
    };
    const typeLabels = {
      spelling: '拼写',
      grammar: '语法',
      structure: '句法',
      pragmatics: '交际',
      phonics: '拼读'
    };

    const errorList = errorLog.map(e => ({
      ...e,
      color: typeColors[e.type] || '#999',
      typeLabel: typeLabels[e.type] || '其他',
      context: e.context ? e.context.split('\n')[0] : '未知错误'
    })).reverse(); // 最新的在前

    this.setData({
      radarData,
      stats: {
        totalSentences: Math.max(totalSentences, totalErrors),
        totalErrors,
        accuracy: Math.max(0, accuracy),
        levelsCompleted
      },
      errorList
    });
  },

  bindStudent() {
    wx.showToast({
      title: '扫码绑定功能将在 Phase 2 开放',
      icon: 'none',
      duration: 2000
    });
  },

  subscribeVip() {
    wx.showModal({
      title: '开通 VIP',
      content: 'VIP 订阅功能（¥15/月）将在 Phase 3 接入微信支付后开放。\n\n当前为体验模式，点击确定可免费体验导出功能。',
      confirmText: '免费体验',
      success: (res) => {
        if (res.confirm) {
          this.setData({ isVip: true });
          wx.showToast({ title: '已开启体验模式', icon: 'success' });
        }
      }
    });
  },

  exportPDF() {
    const errorLog = wx.getStorageSync('errorLog') || getApp().globalData.errorLog || [];

    if (errorLog.length === 0) {
      wx.showToast({
        title: '暂无错题数据，请先完成闯关练习',
        icon: 'none',
        duration: 2500
      });
      return;
    }

    wx.showLoading({ title: '正在生成试卷...' });

    // 生成 PDF 数据
    const pdfData = generatePDFData(errorLog, {
      name: '小明',
      className: '五年级(3)班'
    });

    // Phase 3 将接入 Puppeteer / HTML-to-PDF API
    // 当前展示预览
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

      wx.showModal({
        title: '📄 试卷生成预览',
        content: `${pdfData.header.title}\n\n已生成题目：\n${summary.join('\n')}\n\nPDF 导出功能将在 Phase 3 完成对接。`,
        showCancel: false,
        confirmText: '知道了'
      });
    }, 1500);
  }
});
