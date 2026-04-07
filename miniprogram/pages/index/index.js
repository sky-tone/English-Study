/**
 * index.js - 首页/角色选择
 */
const { LEVELS } = require('../../utils/mock-data');

Page({
  data: {
    levels: LEVELS
  },

  onLoad() {
    // 检查是否有已保存的角色
    const role = wx.getStorageSync('role');
    if (role === 'student') {
      // 自动跳转到关卡页
      // wx.redirectTo({ url: '/pages/level/level?levelId=level_1' });
    }
  },

  enterStudent() {
    wx.setStorageSync('role', 'student');
    getApp().globalData.role = 'student';

    wx.navigateTo({
      url: '/pages/level/level?levelId=level_1'
    });
  },

  enterParent() {
    wx.setStorageSync('role', 'parent');
    getApp().globalData.role = 'parent';

    wx.navigateTo({
      url: '/pages/parent/parent'
    });
  },

  enterTeacher() {
    wx.setStorageSync('role', 'teacher');
    getApp().globalData.role = 'teacher';

    wx.navigateTo({
      url: '/pages/teacher/teacher'
    });
  },

  previewLevel(e) {
    const levelId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/level/level?levelId=${levelId}`
    });
  }
});
