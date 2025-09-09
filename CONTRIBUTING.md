# 贡献指南

感谢您对 EarFunker 项目的关注！我们欢迎所有形式的贡献，包括但不限于代码、文档、设计和反馈。

## 🤝 如何贡献

### 报告问题
如果您发现了bug或有功能建议：

1. 检查 [现有Issues](https://github.com/your-username/EarFunker/issues) 是否已有相关问题
2. 如果没有，请 [创建新Issue](https://github.com/your-username/EarFunker/issues/new)
3. 提供尽可能详细的信息：
   - 操作系统和浏览器版本
   - 复现步骤
   - 预期行为 vs 实际行为
   - 截图或录屏（如果适用）

### 提交代码

#### 开发环境设置
1. Fork 此仓库
2. 克隆您的 fork：
```bash
git clone https://github.com/YOUR-USERNAME/EarFunker.git
cd EarFunker
```

3. 安装依赖：
```bash
npm install
```

4. 创建功能分支：
```bash
git checkout -b feature/your-feature-name
```

5. 启动开发服务器：
```bash
npm run dev
```

#### 代码规范

**TypeScript**
- 使用严格的TypeScript模式
- 为所有公共API提供类型定义
- 避免使用 `any`，除非绝对必要

**React组件**
- 使用函数组件和Hooks
- 优先使用TypeScript接口定义props
- 组件名使用PascalCase

**文件命名**
- 组件文件：`ComponentName.tsx`
- Hook文件：`useHookName.ts`  
- 工具文件：`utilityName.ts`
- 类型文件：`types.ts`

**代码示例**：
```typescript
// ✅ 推荐写法
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false 
}) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="btn"
    >
      {children}
    </button>
  );
};

// ❌ 避免的写法
const Button = (props: any) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};
```

#### 提交信息格式
```
type(scope): description

[optional body]

[optional footer]
```

类型：
- `feat`: 新功能
- `fix`: bug修复
- `docs`: 文档更新
- `style`: 样式更新
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具链更新

示例：
```
feat(audio): add harmony playback feature

- Implement simultaneous note playback
- Add volume control for harmony mode
- Update audio engine with new harmony method

Fixes #123
```

#### 拉取请求流程

1. 确保您的代码遵循项目标准
2. 运行测试（如果有）：`npm test`
3. 构建项目确保无错误：`npm run build`
4. 提交更改并推送到您的分支
5. 创建 Pull Request

**PR 检查清单：**
- [ ] 代码遵循项目规范
- [ ] 所有测试通过
- [ ] 添加了必要的文档
- [ ] 更新了相关的类型定义
- [ ] PR描述清楚地说明了更改内容

## 🎯 开发重点领域

我们特别欢迎以下方面的贡献：

### 🎵 音频功能
- 音色改进和扩展
- 新的音频效果
- 音量和音质优化

### 🎨 视觉效果
- 新的角色动画
- 轨迹效果优化
- 主题和皮肤系统

### 🎮 游戏机制
- 新的训练模式
- 关卡设计
- 难度平衡

### 🛠️ 技术改进
- 性能优化
- 可访问性增强
- 移动端适配

### 🌐 国际化
- 多语言支持
- 音乐术语翻译
- 地区化适配

## 🐛 调试指南

### 开启开发者模式
在游戏中按 `Ctrl + Shift + D` 开启开发者面板，可以：
- 查看调试信息
- 跳过关卡限制
- 测试特定功能

### 常用调试技巧
```typescript
// 在组件中添加调试日志
console.log('🎵 Audio state:', { isPlaying, currentNote });

// 使用React DevTools
// Chrome扩展：React Developer Tools

// 性能分析
// 在组件中使用React.memo和useMemo优化性能
```

## 📚 项目架构

### 核心模块
- `audioUtils.ts`: 音频引擎
- `gameUtils.ts`: 游戏逻辑
- `levelSystem.ts`: 关卡系统
- `useCharacterAnimation.ts`: 角色动画

### 组件层次
```
App
├── MainMenu
├── Settings
├── LevelSelect
└── GameBoard
    ├── Character
    ├── PrincessCharacterWithAnimation
    ├── JumpTrajectory
    └── GridCell
```

## 🤔 获得帮助

如果您在贡献过程中遇到问题：

1. 查看 [文档](README.md)
2. 搜索 [现有Issues](https://github.com/your-username/EarFunker/issues)
3. 在 [Discussions](https://github.com/your-username/EarFunker/discussions) 中提问
4. 联系维护者

## 🎉 贡献者

感谢所有为 EarFunker 做出贡献的开发者！

<!-- 这里可以添加贡献者图片
[![Contributors](https://contrib.rocks/image?repo=your-username/EarFunker)](https://github.com/your-username/EarFunker/graphs/contributors)
-->

---

再次感谢您对 EarFunker 项目的支持！每一个贡献都让这个项目变得更好。🎵✨
