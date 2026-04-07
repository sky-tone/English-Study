# 搭搭乐 (Dada-le) - 情景式英语写作助手 V1.0

> 🧱 积木化英语造句与智能语法防错拦截

## 📱 项目概述

**搭搭乐**是一款面向五年级学生的微信小程序，通过积木化拖拽造句的交互方式，帮助学生在情景化任务中掌握英语句子结构和语法规则。

### 核心功能
- 🧱 **积木控制台**: 五色物理积木（主语/时态/动词/时间/连接词），支持点击拼装
- 🎮 **情景闯关**: 教材原生 NPC（Aki、Ben）引导情景任务
- ⚙️ **碰撞校验引擎**: Be动词匹配、will/be going to 时态约束、Use...to...祈使句规则
- 📊 **五维雷达图**: 拼写、语法时态、句法结构、情景交际、自然拼读
- 📝 **O2O 智能组卷**: 根据错题自动生成对应题型的巩固测试卷

### 三端设计
| 角色 | 功能 | 状态 |
|------|------|------|
| 👦 学生端 | 积木闯关、情景造句 | ✅ Phase 1 完成 |
| 👩 家长端 | 雷达图、VIP导出错题卷 | ✅ Phase 1 完成 |
| 👨‍🏫 教师端 | 建班、下发作业（预览） | 🔲 Phase 2 |

---

## 🏗️ 项目结构

```
miniprogram/
├── app.js                          # 全局入口 & 错误追踪
├── app.json                        # 页面路由 & 全局配置
├── app.wxss                        # 全局样式 & 积木颜色系统
├── project.config.json             # 微信开发者工具配置
├── sitemap.json                    # 站点地图
│
├── utils/
│   ├── collision.js                # 🔥 核心物理引擎（碰撞校验算法）
│   ├── mock-data.js                # Module 2/5 积木 & 关卡数据
│   └── error-tracker.js            # O2O 组卷映射引擎
│
├── components/
│   ├── block/                      # 🧱 磁性积木组件（拖拽/吸附/弹开）
│   │   ├── block.js
│   │   ├── block.wxml
│   │   ├── block.wxss
│   │   └── block.json
│   ├── sentence-area/              # ✏️ 句子拼装区域
│   ├── backpack/                   # 🎒 词汇背包
│   ├── npc-dialog/                 # 💬 NPC 对话气泡
│   └── radar-chart/                # 📊 五维雷达图（Canvas 2D）
│
├── pages/
│   ├── index/                      # 🏠 首页（角色选择 & 关卡预览）
│   ├── level/                      # 🎮 闯关页面（核心玩法）
│   ├── parent/                     # 👩 家长中心
│   └── teacher/                    # 👨‍🏫 教师管理端
│
└── images/                         # 图片资源
```

---

## ⚙️ 碰撞校验引擎 (collision.js)

### 积木类型与颜色

| 颜色 | 类型 | 说明 | 示例 |
|------|------|------|------|
| 🟦 蓝色 | Subject | 主语 | I, We, Ben, My family |
| 🟥 红色 | Tense | 时态核心 | will, am, is, are, going to |
| 🟩 绿色 | Verb | 动词原形短语 | travel to Beijing, go mountain climbing |
| 🟨 黄色 | Time | 时间状语 | this Saturday, next week |
| 🟣 紫色 | Sequence | 顺序连接词 | First, Next, Then, Finally |

### 碰撞规则

#### 规则1: Be动词强绑定
```
I → am ✅ (I are ❌, I is ❌)
He/She/Ben → is ✅ (He am ❌, She are ❌)
We/They/My family → are ✅ (We am ❌)
```

#### 规则2: will + 动词原形
```
will travel ✅
will swimming ❌ (弹开 + 提示)
will went ❌ (弹开 + 提示)
```

#### 规则3: be going to + 动词原形
```
am going to travel ✅
am going to mountain climbing ❌ (名词块拦截)
```

#### 规则4: Use...to... 祈使句
```
Use a pencil to draw ✅
Use draw to a pencil ❌
```

---

## 📝 O2O 智能组卷映射

| 错误类型 | 输入事件 | 输出题型 |
|----------|----------|----------|
| 拼写错误 | 选错形近词 | 首字母填空 |
| Be动词错误 | I + are 触发拦截 | 单项选择 |
| will+ing | will + swimming 触发拦截 | 单项选择 |
| 缺少连接词 | 未使用 First/Next/Then | 情景写作 |
| 语音辨析 | 自然拼读选错 | 划线发音题 |

---

## 🚀 开发里程碑

### Phase 1 (MVP) ✅ 当前版本
- [x] 学生端积木拼装 UI
- [x] 碰撞校验引擎（Be动词、will/be going to、Use...to...）
- [x] Module 2 (Travel Plan) 3个关卡
- [x] NPC 情景对话触发器
- [x] 词汇背包
- [x] 五维雷达图（Canvas 2D）
- [x] 家长端数据可视化
- [x] O2O 组卷算法映射
- [x] 教师端功能预览
- [x] Mock 数据（写死数据）

### Phase 2 (后端绑定)
- [ ] 微信登录 & 身份鉴权
- [ ] 教师建班 & 生成二维码
- [ ] 学生扫码进入 & 班级绑定
- [ ] 答题数据回传服务器
- [ ] 云端数据存储

### Phase 3 (商业闭环)
- [ ] PDF 渲染 API（Puppeteer / HTML-to-PDF）
- [ ] 微信支付接入（VIP ¥15/月）
- [ ] 智能组卷 PDF 导出 & 打印
- [ ] 更多教材模块

---

## 🛠️ 本地开发

### 环境要求
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) (最新版)
- 基础库版本: 3.3.4+

### 开发步骤
1. 克隆本项目
2. 打开微信开发者工具
3. 导入 `miniprogram/` 目录
4. AppID 使用测试号或替换为正式 AppID
5. 编译运行

### 目录说明
- `miniprogram/` - 小程序源码目录
- `miniprogram/utils/collision.js` - 核心引擎，修改碰撞规则请在此文件
- `miniprogram/utils/mock-data.js` - 积木和关卡数据，添加新内容请在此文件

---

## 📄 License

MIT License

---

> 搭搭乐 Dada-le V1.0 - Phase 1 MVP
> 积木化英语造句 · 智能语法防错 · O2O 线上线下联动
