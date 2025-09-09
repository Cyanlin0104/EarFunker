# 🚀 部署指南

本文档详细说明了如何在各种平台上部署 EarFunker 应用。

## 📋 部署前准备

### 环境检查
确保您的系统满足以下要求：
- **Node.js**: >= 16.0.0
- **npm**: >= 7.0.0 或 **yarn**: >= 1.22.0
- **Git**: 用于代码版本管理

### 构建项目
```bash
# 克隆项目
git clone https://github.com/your-username/EarFunker.git
cd EarFunker

# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建完成后，`dist/` 目录将包含所有静态文件。

## 🌐 静态网站托管平台

### Vercel (推荐)

**优势**: 零配置、自动构建、全球CDN、免费额度

1. **通过Git部署（推荐）**
   ```bash
   # 安装Vercel CLI
   npm i -g vercel
   
   # 登录并部署
   vercel
   ```

2. **通过Web界面部署**
   - 访问 [vercel.com](https://vercel.com)
   - 连接GitHub仓库
   - 选择EarFunker项目
   - 自动部署完成

**配置文件** (`vercel.json`):
```json
{
  "name": "earfunker",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Netlify

**优势**: 拖拽部署、表单处理、边缘函数

1. **拖拽部署**
   - 构建项目：`npm run build`
   - 访问 [netlify.com](https://www.netlify.com)
   - 拖拽 `dist/` 文件夹到部署区域

2. **Git集成部署**
   - 连接GitHub仓库
   - 设置构建命令：`npm run build`
   - 设置发布目录：`dist`

**配置文件** (`netlify.toml`):
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

**优势**: 与GitHub无缝集成、完全免费

1. **启用GitHub Pages**
   - 进入仓库设置页面
   - 滚动到"Pages"部分
   - 选择"GitHub Actions"作为源

2. **创建部署工作流** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Firebase Hosting

**优势**: 谷歌基础设施、SSL证书、自定义域名

1. **初始化Firebase**
   ```bash
   # 安装Firebase CLI
   npm install -g firebase-tools
   
   # 登录Firebase
   firebase login
   
   # 初始化项目
   firebase init hosting
   ```

2. **配置Firebase** (`firebase.json`):
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

3. **部署**
   ```bash
   npm run build
   firebase deploy
   ```

## 🐳 Docker部署

### Dockerfile
```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 配置Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx配置 (`nginx.conf`)
```nginx
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # 启用gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # 单页应用路由支持
    location / {
      try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }
  }
}
```

### Docker Compose (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  earfunker:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### 部署命令
```bash
# 构建并运行
docker-compose up --build -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## ☁️ 云平台部署

### AWS S3 + CloudFront

1. **创建S3存储桶**
   ```bash
   aws s3 mb s3://your-bucket-name
   aws s3 website s3://your-bucket-name --index-document index.html
   ```

2. **上传文件**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **配置CloudFront**
   - 创建CloudFront分发
   - 设置源为S3存储桶
   - 配置错误页面重定向到index.html

### Azure Static Web Apps

1. **通过Azure Portal部署**
   - 创建Static Web App资源
   - 连接GitHub仓库
   - 设置构建配置

2. **配置文件** (`staticwebapp.config.json`):
```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "mimeTypes": {
    ".json": "application/json"
  }
}
```

## 🔧 性能优化

### 构建优化
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 缓存策略
```nginx
# 在Nginx配置中添加
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
  expires -1;
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

## 🔍 部署后验证

### 功能测试清单
- [ ] 页面正常加载
- [ ] 音频播放功能正常
- [ ] 角色动画显示正确
- [ ] 彩虹轨迹渲染正常
- [ ] 设置保存功能正常
- [ ] 关卡系统工作正常
- [ ] 响应式设计在移动设备上正常

### 性能检查
```bash
# 使用Lighthouse检查性能
npm install -g lighthouse
lighthouse https://your-domain.com --output html --output-path ./report.html
```

### 监控设置
```javascript
// 添加错误监控
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // 发送到错误监控服务
});

// 性能监控
window.addEventListener('load', () => {
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
  console.log('Page load time:', loadTime);
});
```

## 🚨 故障排除

### 常见问题

**1. 路由404错误**
- 确保服务器配置支持SPA路由重定向
- 检查`index.html`重定向规则

**2. 资源加载失败**
- 检查静态资源路径是否正确
- 验证CORS设置

**3. 音频无法播放**
- 确保HTTPS部署（某些浏览器要求）
- 检查音频文件权限

**4. 性能问题**
- 启用gzip压缩
- 配置适当的缓存策略
- 优化图片资源

### 调试命令
```bash
# 本地预览生产构建
npm run preview

# 检查构建大小
npm run build -- --report

# 分析bundle大小
npx vite-bundle-analyzer dist
```

---

选择适合您需求和技术栈的部署方案。对于简单的静态部署，推荐使用Vercel或Netlify；对于企业级部署，推荐使用Docker + 云平台方案。
