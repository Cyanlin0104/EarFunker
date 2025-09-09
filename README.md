# 🎵 EarFunker

一个有趣的互动式练耳训练应用，通过可爱的角色动画和彩虹轨迹帮助用户提升音程识别能力。

![EarFunker Preview](./public/images/preview1.png)

## ✨ 主要功能

### 🎯 训练模式
- **首调模式**：基于数字记号法 (1, 2, 3...)
- **绝对音模式**：基于音名记号法 (C, D, E...)
- **单目标音模式**：经典的一对一音程训练
- **连续音程模式**：进阶的多音符序列训练

### 🎨 视觉特效
- **角色动画**：马里奥和公主的跳跃演示
- **彩虹轨迹**：平滑的彩虹色跳跃曲线
- **流动粒子**：沿轨迹移动的发光效果
- **动态同步**：角色动画与轨迹完美同步

### ⚙️ 灵活设置
- **调性选择**：支持C2-C5全音域范围
- **音程范围**：可调节向上/向下音程跨度
- **音阶类型**：自然音阶或半音阶
- **多目标音配置**：2-5个目标音数量可选

### 🏆 关卡系统
- **渐进式训练**：从简单到复杂的关卡设计
- **成就追踪**：记录最高分和通过率
- **开发者模式**：用于测试和调试

## 🚀 快速开始

### 环境要求
- **Node.js**: >= 16.0.0
- **npm**: >= 7.0.0 或 **yarn**: >= 1.22.0

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/your-username/EarFunker.git
cd EarFunker
```

2. **安装依赖**
```bash
npm install
# 或使用 yarn
yarn install
```

3. **启动开发服务器**
```bash
npm run dev
# 或使用 yarn
yarn dev
```

4. **打开浏览器**
访问 `http://localhost:8000` 开始使用

> **⚠️ 重要提示**：角色图片文件位于 `public/images/` 目录中。如果角色无法显示，请确保：
> - `public/images/` 目录包含所有 `.svg` 文件
> - 运行了 `npm run dev` 启动开发服务器
> - 或运行了 `npm run build` 生成生产版本

### 生产构建

```bash
npm run build
# 或使用 yarn
yarn build
```

构建完成后，`dist/` 目录将包含可部署的静态文件。

### 预览构建结果

```bash
npm run preview
# 或使用 yarn
yarn preview
```

## 📁 项目结构

```
EarFunker/
├── public/                 # 静态资源
│   └── images/            # 角色图片资源
│       ├── mario-*.svg
│       └── princess-*.svg
├── src/
│   ├── components/        # React组件
│   │   ├── Character.tsx
│   │   ├── GameBoard.tsx
│   │   ├── JumpTrajectory.tsx
│   │   ├── Settings.tsx
│   │   └── ...
│   ├── hooks/            # 自定义Hook
│   │   └── useCharacterAnimation.ts
│   ├── utils/            # 工具类
│   │   ├── audioUtils.ts
│   │   ├── gameUtils.ts
│   │   └── levelSystem.ts
│   ├── types.ts          # TypeScript类型定义
│   ├── App.tsx           # 主应用组件
│   ├── main.tsx          # 应用入口
│   └── index.css         # 全局样式
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎵 使用指南

### 基本操作
1. 选择训练模式（自由训练或关卡模式）
2. 在设置中调整难度和音程范围
3. 听音后点击对应的格子
4. 观察角色跳跃演示正确答案
5. 享受彩虹轨迹的视觉效果！

### 设置选项详解

#### 🎼 训练模式
- **首调模式**：使用数字1-7表示音阶
- **绝对音模式**：使用字母C-B表示音名

#### 🎯 音符范围
- **向上/向下范围**：控制音程的跨度
- **3/5/7/12半音**：对应不同的音程大小

#### 🎹 音阶类型
- **自然音阶**：只包含7个自然音（白键）
- **半音阶**：包含所有12个半音（黑白键）

#### 🎵 多目标音模式
- **目标音数量**：2-5个连续音符
- **适合进阶练习**：提升序列记忆能力

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 4
- **动画库**: Framer Motion
- **音频**: Web Audio API
- **样式**: CSS3 + CSS Grid/Flexbox

## 🎨 核心特性技术实现

### 角色动画系统
- 使用 `useCharacterAnimation` Hook 管理动画状态
- 基于音程距离动态计算跳跃时长
- 支持马里奥和公主两个角色的独立动画

### 彩虹轨迹渲染
- SVG路径 + 线性渐变实现彩虹效果
- 抛物线数学公式：`y = -4ht(1-t)`
- 多层渲染：外层发光 + 主曲线 + 内层高亮

### 音频引擎
- 基于Web Audio API的纯净音频合成
- 支持音程播放和和声播放
- 可配置音色、音量和时长

## 🐛 故障排除

### 常见问题

**1. 安装失败**
```bash
# 清除缓存后重新安装
rm -rf node_modules package-lock.json
npm install
```

**2. 音频无法播放**
- 确保浏览器支持 Web Audio API
- 检查浏览器音频权限设置
- 在用户交互后才能播放音频

**3. 角色图片不显示**
- **检查 public 目录**：确保 `public/images/` 目录包含所有SVG文件
- **确认 .gitignore 配置**：`public/` 目录不应该被忽略
- **重新构建**：运行 `npm run build` 重新生成 dist 目录
- **开发模式**：使用 `npm run dev` 启动开发服务器

**4. 动画卡顿**
- 关闭开发者工具
- 检查系统资源使用情况
- 尝试降低动画复杂度

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发规范
- 使用 TypeScript 编写代码
- 遵循现有的代码风格
- 添加适当的注释和类型定义
- 测试新功能的完整性

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 感谢所有贡献者的努力
- 特别感谢开源社区的支持
- 角色设计灵感来源于经典游戏

## 📞 联系方式

- **邮箱**: cyanlin0104@gmail.com

---

**⭐ 如果这个项目对你有帮助，请给个星星支持一下！**

![GitHub stars](https://img.shields.io/github/stars/your-username/EarFunker?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/EarFunker?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/EarFunker)
![GitHub license](https://img.shields.io/github/license/your-username/EarFunker)