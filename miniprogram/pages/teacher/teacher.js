/**
 * teacher.js - 教师管理端
 * Phase 1: 功能预览模式
 * Phase 2: 完整的班级管理、作业下发功能
 */
Page({
  data: {
    classes: [],
    modules: [
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
        name: 'Module 5 - Invitations',
        description: '祈使句 Use...to... 句型',
        icon: '🎨',
        color: '#9B59B6',
        levelCount: 1
      }
    ]
  },

  onLoad() {
    // Phase 2: 从服务器加载教师的班级数据
    this.loadMockData();
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
  }
});
