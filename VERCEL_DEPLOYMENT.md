# Vercel 部署指南

## 什么是 Vercel？

Vercel 是一个现代化的前端部署平台，特点：

- ⚡ **极速部署** - 全球 CDN 加速，毫秒级响应
- 🔒 **自动 HTTPS** - 自动配置 SSL 证书
- 🌍 **全球 CDN** - 边缘网络，就近访问
- 🔄 **自动部署** - Git 推送后自动部署
- 📊 **实时分析** - 访问统计和性能监控
- 💰 **免费使用** - 个人项目完全免费

## 快速开始

### 方法 1：使用部署脚本（推荐）

```bash
# 一键部署到 Vercel
bash deploy-vercel.sh

# 或同时部署到 GitHub Pages 和 Vercel
bash deploy-all.sh
```

### 方法 2：使用 Vercel CLI

#### 步骤 1：安装 Vercel CLI

```bash
# 使用 npm 安装
npm install -g vercel

# 或使用 yarn
yarn global add vercel
```

#### 步骤 2：登录 Vercel

```bash
vercel login
```

会自动打开浏览器进行登录，建议使用 GitHub 账号登录。

#### 步骤 3：部署项目

```bash
# 首次部署（会提示配置项目）
vercel

# 部署到生产环境
vercel --prod
```

### 方法 3：通过 GitHub 集成（最简单）

#### 1. 导入项目

1. 访问 https://vercel.com/new
2. 使用 GitHub 登录
3. 选择 **Import Git Repository**
4. 搜索或选择 `manmonthW/pension-basic`
5. 点击 **Import**

#### 2. 配置项目（通常自动识别）

- **Framework Preset**: Other（或自动识别为静态站点）
- **Root Directory**: `./`
- **Build Command**: 留空（静态站点无需构建）
- **Output Directory**: `./`

#### 3. 部署

点击 **Deploy** 按钮，等待几秒钟即可完成部署。

#### 4. 自动部署

配置完成后，每次推送代码到 GitHub 的 `main` 分支，Vercel 会自动部署。

- **主分支推送** → 自动部署到生产环境
- **其他分支推送** → 自动创建预览部署

## 配置文件说明

项目包含 `vercel.json` 配置文件：

```json
{
  "version": 2,
  "name": "pension-basic",
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"
        }
      ]
    }
  ]
}
```

### 配置说明

- **name**: 项目名称
- **builds**: 构建配置，使用静态文件服务
- **routes**: 路由规则，所有请求映射到对应文件
- **headers**: HTTP 头配置，设置缓存策略

## 常用命令

```bash
# 查看项目列表
vercel ls

# 查看当前部署详情
vercel inspect

# 查看部署日志
vercel logs

# 查看环境变量
vercel env ls

# 添加环境变量
vercel env add

# 删除部署
vercel rm <deployment-url>

# 查看域名列表
vercel domains ls

# 添加自定义域名
vercel domains add yourdomain.com

# 切换到不同的项目
vercel switch

# 查看帮助
vercel --help
```

## 自定义域名

### 1. 添加域名

```bash
vercel domains add yourdomain.com
```

### 2. 配置 DNS

在您的域名提供商处添加以下记录：

**A 记录方式：**
```
类型: A
主机: @
值: 76.76.21.21
```

**CNAME 记录方式（推荐）：**
```
类型: CNAME
主机: www
值: cname.vercel-dns.com
```

### 3. 等待验证

DNS 配置后，Vercel 会自动验证并配置 SSL 证书，通常需要几分钟到几小时。

## 环境变量

如果项目需要环境变量：

### 通过 CLI 添加

```bash
vercel env add API_KEY
```

### 通过网页添加

1. 访问项目设置：https://vercel.com/manmonthw/pension-basic/settings
2. 点击 **Environment Variables**
3. 添加变量名和值
4. 选择环境（Production/Preview/Development）

## 部署预览

### 创建预览部署

```bash
# 当前状态创建预览
vercel

# 特定分支部署
git checkout feature-branch
vercel
```

每个预览部署都有独立的 URL，可用于：
- 测试新功能
- 代码审查
- 客户演示

### 分享预览链接

```bash
# 部署后会显示预览 URL，例如：
# https://pension-basic-abc123.vercel.app
```

## 性能优化

### 1. 缓存配置

`vercel.json` 中已配置：
- HTML 文件：1 小时缓存
- 静态资源（CSS/JS/图片）：1 年缓存

### 2. 图片优化

使用 Vercel Image Optimization：

```html
<!-- 原始图片 -->
<img src="/image.png" alt="...">

<!-- 优化后 -->
<img src="/_vercel/image?url=/image.png&w=800&q=75" alt="...">
```

### 3. 启用压缩

Vercel 自动启用 Gzip/Brotli 压缩，无需额外配置。

## 分析和监控

### 查看访问分析

1. 访问 https://vercel.com/manmonthw/pension-basic/analytics
2. 查看：
   - 访问量
   - 地理分布
   - 设备类型
   - 浏览器分布

### 性能监控

1. 访问 https://vercel.com/manmonthw/pension-basic/speed-insights
2. 查看：
   - Core Web Vitals
   - 页面加载时间
   - 性能评分

## 故障排查

### 问题 1：部署失败

**检查步骤：**
1. 查看部署日志：`vercel logs`
2. 检查 `vercel.json` 语法
3. 确认文件路径正确

### 问题 2：页面 404

**可能原因：**
- 文件路径错误
- 路由配置问题

**解决方案：**
检查 `vercel.json` 的 `routes` 配置。

### 问题 3：自定义域名不工作

**检查步骤：**
1. 验证 DNS 配置：`nslookup yourdomain.com`
2. 等待 DNS 传播（可能需要 24-48 小时）
3. 检查 Vercel 控制台的域名状态

### 问题 4：SSL 证书错误

Vercel 自动配置 SSL，如果出现问题：
1. 确认域名已验证
2. 等待证书颁发（通常几分钟）
3. 联系 Vercel 支持

## GitHub + Vercel 工作流

### 推荐的开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/new-calculator

# 2. 开发并测试
# ... 修改代码 ...

# 3. 提交代码
git add .
git commit -m "feat: 添加新计算功能"

# 4. 推送到 GitHub（自动创建预览部署）
git push origin feature/new-calculator

# 5. 在 Vercel 预览 URL 中测试

# 6. 合并到主分支
git checkout main
git merge feature/new-calculator

# 7. 推送主分支（自动部署到生产环境）
git push origin main
```

### 自动化流程

- ✅ 推送分支 → 自动预览部署
- ✅ 合并 PR → 自动生产部署
- ✅ 回滚部署 → 一键回滚到之前版本

## 对比：GitHub Pages vs Vercel

| 特性 | GitHub Pages | Vercel |
|------|-------------|--------|
| **部署速度** | 1-3 分钟 | 10-30 秒 |
| **全球 CDN** | ✅ | ✅ |
| **自动 HTTPS** | ✅ | ✅ |
| **自定义域名** | ✅ | ✅ |
| **预览部署** | ❌ | ✅ |
| **分析统计** | ❌ | ✅ |
| **环境变量** | ❌ | ✅ |
| **服务器端功能** | ❌ | ✅ (Serverless) |
| **免费额度** | 无限 | 100GB/月带宽 |

### 建议

- **开源项目**：GitHub Pages（与仓库集成更紧密）
- **快速迭代**：Vercel（部署快，预览方便）
- **最佳实践**：同时使用两者

## 成本说明

### 免费套餐包含

- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ 100 次构建/天
- ✅ 自动 SSL
- ✅ 全球 CDN
- ✅ 预览部署
- ✅ Web Analytics

### 超出免费额度

- 带宽超出：$20/100GB
- 构建时间超出：根据用量计费

**对于个人项目，免费额度完全够用。**

## 资源链接

- 📚 官方文档：https://vercel.com/docs
- 💬 社区讨论：https://github.com/vercel/vercel/discussions
- 🎓 学习教程：https://vercel.com/guides
- 🐛 问题反馈：https://github.com/vercel/vercel/issues

## 当前项目状态

✅ Vercel 配置文件已创建（vercel.json）
✅ 部署脚本已准备（deploy-vercel.sh）
✅ 统一部署脚本已创建（deploy-all.sh）

**下一步：** 运行 `bash deploy-all.sh` 开始部署！

---

**准备好体验极速部署了吗？** 🚀
