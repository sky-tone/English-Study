/**
 * teacher.js - 教师管理端
 * Phase 1: 功能预览模式 + 拍照上传练习资料
 * Phase 2: 完整的班级管理、作业下发功能
 */
const { choosePhoto, getPhotos, deletePhoto, clearPhotos, previewPhoto } = require('../../utils/photo-uploader');
const { generateExercisesFromPhotos } = require('../../utils/photo-exercise');

Page({
  data: {
    classes: [],
    modules: [
      {
        id: 'module_1',
        name: 'Module 1 - Seasons',
        description: '四季天气 · It is + 形容词 / can + 动词原形',
        icon: '🌤️',
        color: '#27AE60',
        levelCount: 2
      },
      {
        id: 'module_2',
        name: 'Module 2 - Travel Plan',
        description: '旅行计划 · will/be going to 将来时',
        icon: '✈️',
        color: '#4A90D9',
        levelCount: 2
      },
      {
        id: 'module_5',
        name: 'Module 5 - Safety',
        description: '安全守则 · 祈使句 Don\'t / Be / Use...to...',
        icon: '🚦',
        color: '#9B59B6',
        levelCount: 4
      }
    ],
    uploadedPhotos: []
  },

  onLoad() {
    // Phase 2: 从服务器加载教师的班级数据
    this.loadMockData();
  },

  onShow() {
    this.setData({ uploadedPhotos: getPhotos('teacher') });
  },

  loadMockData() {
    // Phase 1: 模拟数据
    this.setData({
      classes: []
    });
  },

  createClass() {
    wx.showModal({
      title: '创建班级',
      content: '班级创建功能将在 Phase 2 中实现。\n\n届时您可以：\n1. 通过微信登录验证身份\n2. 创建并命名班级\n3. 生成班级专属二维码\n4. 分享到微信群邀请学生加入',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  assignHomework() {
    wx.showModal({
      title: '下发作业',
      content: '请从下方"可下发的闯关模块"中选择要下发的模块。\n\n完整功能将在 Phase 2 中实现。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  assignModule(e) {
    const moduleId = e.currentTarget.dataset.id;
    const mod = this.data.modules.find(m => m.id === moduleId);

    wx.showModal({
      title: `下发 ${mod.name}`,
      content: `确定要将 "${mod.name}" 作为本周闯关作业下发给班级学生吗？\n\n（Phase 2 实现后将自动推送到学生端）`,
      confirmText: '确定下发',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '作业已下发（模拟）',
            icon: 'success'
          });
        }
      }
    });
  },

  viewStats() {
    wx.showModal({
      title: '班级统计',
      content: '班级学情统计功能将在 Phase 2 中实现。\n\n届时您可以查看：\n1. 班级整体五维雷达图\n2. 学生个人完成情况\n3. 高频错误类型分析\n4. 作业完成率排行',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  shareToGroup() {
    wx.showModal({
      title: '分享到微信群',
      content: '微信分享功能将在 Phase 2 中实现。\n\n届时您可以：\n1. 生成带参的小程序卡片\n2. 一键分享至班级微信群\n3. 学生点击卡片自动绑定班级',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * 拍照上传练习资料
   */
  uploadPhoto() {
    choosePhoto({ role: 'teacher', maxPhotos: 9 }).then(result => {
      if (result.success) {
        this.setData({ uploadedPhotos: getPhotos('teacher') });
        wx.showToast({ title: result.message, icon: 'success' });
      } else if (result.message) {
        wx.showToast({ title: result.message, icon: 'none' });
      }
    });
  },

  /**
   * 预览照片
   */
  onPreviewPhoto(e) {
    const url = e.currentTarget.dataset.url;
    const urls = this.data.uploadedPhotos.map(p => p.path);
    previewPhoto(url, urls);
  },

  /**
   * 删除照片
   */
  onDeletePhoto(e) {
    const photoId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除照片',
      content: '确定要删除这张照片吗？',
      success: (res) => {
        if (res.confirm) {
          deletePhoto('teacher', photoId);
          this.setData({ uploadedPhotos: getPhotos('teacher') });
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  /**
   * 清空所有照片
   */
  onClearPhotos() {
    if (this.data.uploadedPhotos.length === 0) return;
    wx.showModal({
      title: '清空照片',
      content: '确定要清空所有已上传的练习资料照片吗？',
      success: (res) => {
        if (res.confirm) {
          clearPhotos('teacher');
          this.setData({ uploadedPhotos: [] });
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  },

  /**
   * 从上传照片生成练习习题
   */
  generateFromPhotos() {
    const photos = getPhotos('teacher');
    if (photos.length === 0) {
      wx.showToast({ title: '请先上传练习资料照片', icon: 'none', duration: 2000 });
      return;
    }

    wx.showLoading({ title: '正在生成习题...' });

    const result = generateExercisesFromPhotos(photos, { module: 'module_2' });

    setTimeout(() => {
      wx.hideLoading();

      if (result.exercises) {
        const summary = [];
        const ex = result.exercises;
        if (ex.fillInBlank.length > 0) summary.push(`首字母填空: ${ex.fillInBlank.length} 题`);
        if (ex.multipleChoice.length > 0) summary.push(`单项选择: ${ex.multipleChoice.length} 题`);
        if (ex.pronunciation.length > 0) summary.push(`发音辨析: ${ex.pronunciation.length} 题`);
        if (ex.writing.length > 0) summary.push(`情景写作: ${ex.writing.length} 题`);

        wx.showModal({
          title: '📝 照片习题生成',
          content: `${result.message}\n\n${summary.join('\n')}\n\n完整 OCR 识别功能将在 Phase 2 中开放。`,
          showCancel: false,
          confirmText: '知道了'
        });
      } else {
        wx.showToast({ title: result.message, icon: 'none', duration: 2500 });
      }
    }, 1000);
  }
});
