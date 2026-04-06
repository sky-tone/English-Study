// app.js - 搭搭乐 (Dada-le) WeChat Mini Program
App({
  onLaunch() {
    // 初始化云开发环境（Phase 2）
    // wx.cloud.init({ env: 'dada-le-prod' });

    // 检查登录状态
    this.checkLoginStatus();
  },

  globalData: {
    userInfo: null,
    role: null, // 'student' | 'teacher' | 'parent'
    classId: null,
    studentId: null,
    // 错题记录（Phase 1 使用本地存储）
    errorLog: [],
    // 五维数据
    radarData: {
      spelling: 0,    // 拼写
      grammar: 0,     // 语法与时态
      structure: 0,   // 句法结构
      pragmatics: 0,  // 情景交际
      phonics: 0      // 自然拼读
    }
  },

  checkLoginStatus() {
    const role = wx.getStorageSync('role');
    const studentId = wx.getStorageSync('studentId');
    if (role) {
      this.globalData.role = role;
    }
    if (studentId) {
      this.globalData.studentId = studentId;
    }
  },

  /**
   * 记录错误事件（供 O2O 组卷算法使用）
   * @param {Object} error - 错误对象
   * @param {string} error.type - 错误类型: 'spelling' | 'grammar' | 'structure' | 'phonics'
   * @param {string} error.subType - 子类型: 'be_verb' | 'will_ing' | 'missing_sequence' 等
   * @param {string} error.context - 触发上下文
   * @param {Object} error.detail - 详细信息
   */
  logError(error) {
    const entry = {
      ...error,
      timestamp: Date.now(),
      moduleId: 'module_2'
    };
    this.globalData.errorLog.push(entry);

    // 更新五维雷达数据
    this.updateRadarData(error.type);

    // 持久化到本地存储
    wx.setStorageSync('errorLog', this.globalData.errorLog);
  },

  updateRadarData(errorType) {
    const data = this.globalData.radarData;
    const totalErrors = this.globalData.errorLog.length || 1;

    // 计算各维度错误率（0-100）
    const typeCount = this.globalData.errorLog.filter(e => e.type === errorType).length;
    const rate = Math.min(100, Math.round((typeCount / totalErrors) * 100));

    switch (errorType) {
      case 'spelling':
        data.spelling = rate;
        break;
      case 'grammar':
        data.grammar = rate;
        break;
      case 'structure':
        data.structure = rate;
        break;
      case 'pragmatics':
        data.pragmatics = rate;
        break;
      case 'phonics':
        data.phonics = rate;
        break;
    }

    wx.setStorageSync('radarData', data);
  }
});
