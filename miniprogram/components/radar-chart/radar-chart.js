/**
 * radar-chart.js - 五维学情雷达图组件
 * 维度：拼写、语法与时态、句法结构、情景交际、自然拼读
 */
Component({
  properties: {
    // 雷达数据 { spelling, grammar, structure, pragmatics, phonics }
    radarData: {
      type: Object,
      value: {
        spelling: 0,
        grammar: 0,
        structure: 0,
        pragmatics: 0,
        phonics: 0
      }
    }
  },

  data: {
    canvasWidth: 280,
    canvasHeight: 280,
    dimensions: [],
    overallScore: 0,
    overallLevel: 'average',
    overallDesc: ''
  },

  observers: {
    'radarData': function(data) {
      this.updateDimensions(data);
      this.drawRadar(data);
    }
  },

  lifetimes: {
    attached() {
      // 获取屏幕宽度适配
      const systemInfo = wx.getWindowInfo();
      const canvasSize = Math.min(systemInfo.windowWidth * 0.7, 280);
      this.setData({
        canvasWidth: canvasSize,
        canvasHeight: canvasSize
      });

      this.updateDimensions(this.properties.radarData);

      // 延迟绘制确保 canvas 准备好
      setTimeout(() => {
        this.drawRadar(this.properties.radarData);
      }, 300);
    }
  },

  methods: {
    updateDimensions(data) {
      // 显示的是掌握度（100 - 错误率）
      const dims = [
        { key: 'spelling', label: '拼写', value: Math.max(0, 100 - (data.spelling || 0)), color: '#4A90D9' },
        { key: 'grammar', label: '语法时态', value: Math.max(0, 100 - (data.grammar || 0)), color: '#E74C3C' },
        { key: 'structure', label: '句法结构', value: Math.max(0, 100 - (data.structure || 0)), color: '#27AE60' },
        { key: 'pragmatics', label: '情景交际', value: Math.max(0, 100 - (data.pragmatics || 0)), color: '#F39C12' },
        { key: 'phonics', label: '自然拼读', value: Math.max(0, 100 - (data.phonics || 0)), color: '#9B59B6' }
      ];

      // 计算等级
      dims.forEach(d => {
        if (d.value >= 90) d.level = '优秀';
        else if (d.value >= 75) d.level = '良好';
        else if (d.value >= 60) d.level = '一般';
        else d.level = '薄弱';
      });

      // 综合分
      const overall = Math.round(dims.reduce((sum, d) => sum + d.value, 0) / dims.length);
      let overallLevel = 'average';
      let overallDesc = '';

      if (overall >= 90) { overallLevel = 'excellent'; overallDesc = '非常棒！继续保持！'; }
      else if (overall >= 75) { overallLevel = 'good'; overallDesc = '不错哦，还可以更好！'; }
      else if (overall >= 60) { overallLevel = 'average'; overallDesc = '加油，多练习积木拼装！'; }
      else { overallLevel = 'weak'; overallDesc = '需要多多练习哦！'; }

      this.setData({
        dimensions: dims,
        overallScore: overall,
        overallLevel,
        overallDesc
      });
    },

    drawRadar(data) {
      const query = this.createSelectorQuery();
      query.select('#radarCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0] || !res[0].node) return;

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = wx.getWindowInfo().pixelRatio;

          canvas.width = this.data.canvasWidth * dpr;
          canvas.height = this.data.canvasHeight * dpr;
          ctx.scale(dpr, dpr);

          this.renderRadarChart(ctx, data);
        });
    },

    renderRadarChart(ctx, data) {
      const w = this.data.canvasWidth;
      const h = this.data.canvasHeight;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.38;

      // 清空画布
      ctx.clearRect(0, 0, w, h);

      const dims = [
        { label: '拼写', value: 100 - (data.spelling || 0) },
        { label: '语法', value: 100 - (data.grammar || 0) },
        { label: '句法', value: 100 - (data.structure || 0) },
        { label: '交际', value: 100 - (data.pragmatics || 0) },
        { label: '拼读', value: 100 - (data.phonics || 0) }
      ];

      const n = dims.length;
      const angleStep = (2 * Math.PI) / n;
      const startAngle = -Math.PI / 2;

      // 绘制背景网格（3层）
      for (let layer = 1; layer <= 3; layer++) {
        const r = radius * (layer / 3);
        ctx.beginPath();
        ctx.strokeStyle = '#E8ECF0';
        ctx.lineWidth = 1;

        for (let i = 0; i <= n; i++) {
          const angle = startAngle + i * angleStep;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // 绘制轴线
      for (let i = 0; i < n; i++) {
        const angle = startAngle + i * angleStep;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
        ctx.strokeStyle = '#D0D5DD';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 绘制数据区域
      ctx.beginPath();
      const colors = ['#4A90D9', '#E74C3C', '#27AE60', '#F39C12', '#9B59B6'];

      for (let i = 0; i < n; i++) {
        const angle = startAngle + i * angleStep;
        const r = radius * (dims[i].value / 100);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      ctx.fillStyle = 'rgba(74, 144, 217, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#4A90D9';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制数据点
      for (let i = 0; i < n; i++) {
        const angle = startAngle + i * angleStep;
        const r = radius * (dims[i].value / 100);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 绘制标签
      ctx.fillStyle = '#333';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';

      for (let i = 0; i < n; i++) {
        const angle = startAngle + i * angleStep;
        const labelR = radius + 20;
        const x = cx + labelR * Math.cos(angle);
        const y = cy + labelR * Math.sin(angle);
        ctx.fillText(dims[i].label, x, y + 4);
      }
    }
  }
});
