/**
 * mistake-archive-data.js - 错题档案库模拟数据
 *
 * Phase 1 使用写死数据，模拟家长端"错题档案库"页面所需的全部数据：
 * - 学生学情警报 (Zone 1)
 * - 错题"案发现场"卡片 (Zone 2)
 * - VIP 试卷预览题目 (Zone 3)
 */

// ============================================================
// 错误严重级别
// ============================================================
const SeverityLevel = {
  FATAL: 'fatal',       // 致命错误
  HIGH: 'high',         // 高频错误
  MEDIUM: 'medium'      // 中等错误
};

// ============================================================
// 学生档案信息
// ============================================================
const STUDENT_PROFILE = {
  name: '白浩辰',
  grade: '五年级下册',
  week: 5,
  school: '广州理工实验学校',
  className: '五年级(3)班'
};

// ============================================================
// 学情警报摘要
// ============================================================

/**
 * 生成学情警报数据
 * @param {Object} options - 配置
 * @param {string} options.studentName - 学生姓名
 * @param {number} options.week - 第几周
 * @param {string} options.grade - 年级学期
 * @param {number} options.grammarIssues - 语法隐患数
 * @param {number} options.spellingIssues - 拼写易错词数
 * @param {string} options.examTarget - 对标考试名称
 * @returns {Object} 警报数据
 */
function generateAlertData(options) {
  const {
    studentName = STUDENT_PROFILE.name,
    week = STUDENT_PROFILE.week,
    grade = STUDENT_PROFILE.grade,
    grammarIssues = 3,
    spellingIssues = 4,
    examTarget = 'Module 2 周小结'
  } = options || {};

  const totalIssues = grammarIssues + spellingIssues;

  return {
    studentName,
    week,
    grade,
    grammarIssues,
    spellingIssues,
    totalIssues,
    examTarget,
    alertMessage: `发现 ${grammarIssues} 个高频语法隐患，${spellingIssues} 个拼写易错词。`,
    suggestion: `这些薄弱点极易在《${examTarget}》中导致扣分，建议立即巩固！`
  };
}

// ============================================================
// 错题"案发现场"卡片
// ============================================================
const MISTAKE_CARDS = [
  {
    id: 'card_1',
    title: '时态与主谓搭配',
    severity: SeverityLevel.FATAL,
    severityLabel: '致命错误',
    category: 'grammar',
    categoryLabel: '语法',
    color: '#E74C3C',
    scene: {
      description: '孩子在 App 中强行把蓝色主语积木和红色助动词积木错误拼接',
      blocks: [
        { word: 'I', color: '#4A90D9', type: 'subject' },
        { word: 'are', color: '#E74C3C', type: 'tense', isWrong: true },
        { word: 'going to', color: '#E74C3C', type: 'tense' },
        { word: 'go mountain climbing', color: '#27AE60', type: 'verb' },
        { word: 'do', color: '#E74C3C', type: 'tense', isWrong: true },
        { word: 'this Saturday', color: '#F39C12', type: 'time' }
      ]
    },
    wrongSentence: 'I are going to go mountain climbing do this Saturday.',
    diagnosis: '"一般将来时" be 动词搭配完全混淆；短语堆砌。该错误在"语法选择题"中失分率极高。',
    examImpact: '语法选择题失分率极高'
  },
  {
    id: 'card_2',
    title: '核心词汇拼写',
    severity: SeverityLevel.HIGH,
    severityLabel: '高频错词',
    category: 'spelling',
    categoryLabel: '拼写',
    color: '#4A90D9',
    scene: {
      description: '孩子在词汇背包中选错字母，拼出残缺的积木块',
      blocks: []
    },
    spellingErrors: [
      { correct: 'travel', wrong: 'taurel', highlight: '元音字母顺序颠倒' },
      { correct: 'museum', wrong: 'wausew', highlight: '首字母及元音组合混淆' },
      { correct: 'match', wrong: 'macth', highlight: '辅音字母顺序颠倒' }
    ],
    diagnosis: '元音字母组合记忆模糊，严重影响"首字母填空题"。',
    examImpact: '首字母填空题直接失分'
  },
  {
    id: 'card_3',
    title: '句型结构混淆',
    severity: SeverityLevel.MEDIUM,
    severityLabel: '中式英语',
    category: 'structure',
    categoryLabel: '句法',
    color: '#27AE60',
    scene: {
      description: '积木拼接语序错误，动词形式与主语人称不匹配',
      blocks: [
        { word: 'I', color: '#4A90D9', type: 'subject' },
        { word: 'likes', color: '#27AE60', type: 'verb', isWrong: true },
        { word: 'togo', color: '#27AE60', type: 'verb', isWrong: true },
        { word: 'swimming', color: '#27AE60', type: 'verb' }
      ]
    },
    wrongSentence: 'I likes togo swimming.',
    diagnosis: '动词形式错误（单数第一人称误加s），连写错误。直接影响写作大题《My travel plan》的得分。',
    examImpact: '写作大题失分'
  }
];

// ============================================================
// VIP 试卷预览题目 (部分清晰展示，其余虚化)
// ============================================================
const EXAM_PREVIEW = {
  title: '广州理工实验学校：五年级英语第5周 专项突破卷',
  subtitle: '对标学校真题 · 精准靶向薄弱点',
  previewQuestions: [
    {
      id: 'q1',
      type: '首字母填空',
      targetWeakness: '拼写',
      question: 'We will go mountain c_______ all day.',
      answer: 'climbing',
      visible: true
    },
    {
      id: 'q2',
      type: '语法选择',
      targetWeakness: '时态',
      question: 'I ______ going to go mountain climbing.',
      options: ['am', 'are'],
      answer: 'am',
      visible: true
    },
    {
      id: 'q3',
      type: '发音辨析',
      targetWeakness: '语音',
      question: '找出划线部分发音不同的单词',
      options: ['ask', 'classmate', 'father'],
      answer: 'father',
      visible: true
    }
  ],
  sellingPoints: [
    '拒绝题海战术，仅需 15 分钟攻克本周 7 个软肋',
    '题型排版 100% 对标学校《周周末作业卷》与《周小结》',
    '自动排版，支持一键连接家用打印机或导出微信 PDF'
  ],
  bonusContent: '包含《本周必背清单》一键导入及自然拼读动画解析'
};

// ============================================================
// VIP 定价数据
// ============================================================
const VIP_PRICING = {
  monthlyPrice: 15,
  originalPrice: 29,
  currency: '¥',
  trialText: '首月仅',
  ctaText: '开通 VIP，一键生成本周专属错题卷',
  ctaPriceText: '首月仅 15 元'
};

/**
 * 获取错题档案库完整页面数据
 * @param {Object} options - 可选覆盖参数
 * @returns {Object} 页面所需全部数据
 */
function getMistakeArchiveData(options) {
  const alertData = generateAlertData(options);

  return {
    alert: alertData,
    student: STUDENT_PROFILE,
    cards: MISTAKE_CARDS,
    examPreview: EXAM_PREVIEW,
    pricing: VIP_PRICING
  };
}

/**
 * 根据错误日志生成动态警报数据
 * @param {Array} errorLog - 来自 app.globalData.errorLog 的错误列表
 * @returns {Object} 动态计算的警报数据
 */
function generateDynamicAlert(errorLog) {
  if (!errorLog || !Array.isArray(errorLog) || errorLog.length === 0) {
    return generateAlertData({
      grammarIssues: 0,
      spellingIssues: 0
    });
  }

  const grammarIssues = errorLog.filter(
    e => e.type === 'grammar' || e.type === 'structure'
  ).length;
  const spellingIssues = errorLog.filter(
    e => e.type === 'spelling'
  ).length;

  return generateAlertData({
    grammarIssues,
    spellingIssues
  });
}

module.exports = {
  SeverityLevel,
  STUDENT_PROFILE,
  MISTAKE_CARDS,
  EXAM_PREVIEW,
  VIP_PRICING,
  generateAlertData,
  generateDynamicAlert,
  getMistakeArchiveData
};
