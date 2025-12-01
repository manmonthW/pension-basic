# 部署指南

本文档详细说明如何将养老金计算器部署到GitHub Pages。

## 前提条件

- 已安装 Git
- 拥有 GitHub 账号
- 本地代码已准备完毕

## 步骤1：创建GitHub仓库

### 方式A：通过GitHub网页创建（推荐）

1. 访问 https://github.com
2. 点击右上角的 "+" → "New repository"
3. 填写仓库信息：
   - **Repository name**: `pension-basic`（或您喜欢的名称）
   - **Description**: "养老金缴费基数计算器 - 灵活就业人员养老保险智能对比分析系统"
   - **Public/Private**: 选择 Public（GitHub Pages需要公开仓库）
   - **不要勾选** "Initialize this repository with a README"
4. 点击 "Create repository"

### 方式B：使用命令行（如果GitHub CLI已安装）

```bash
gh repo create pension-basic --public --description "养老金缴费基数计算器"
```

## 步骤2：推送代码到GitHub

在您的项目目录下执行以下命令：

```bash
# 1. 确认当前在正确的目录
pwd  # 应该显示 E:/github/pension-basic

# 2. 检查git状态（已完成）
git status

# 3. 添加远程仓库（替换your-username为您的GitHub用户名）
git remote add origin https://github.com/your-username/pension-basic.git

# 4. 重命名主分支为main（GitHub新标准）
git branch -M main

# 5. 推送代码
git push -u origin main
```

### 如果遇到认证问题

GitHub 不再支持密码认证，需要使用以下方式之一：

**方式1：Personal Access Token（推荐）**

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成并复制 token
5. 推送时使用 token 作为密码

**方式2：SSH Key**

```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "your-email@example.com"

# 添加到GitHub
# 1. 复制公钥内容
cat ~/.ssh/id_ed25519.pub
# 2. 访问 https://github.com/settings/keys
# 3. 点击 "New SSH key"，粘贴公钥

# 修改远程仓库URL为SSH格式
git remote set-url origin git@github.com:your-username/pension-basic.git
```

## 步骤3：配置GitHub Pages

### 3.1 启用GitHub Pages

1. 进入您的仓库页面
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 "Build and deployment" 部分：
   - **Source**: 选择 "Deploy from a branch"
   - **Branch**: 选择 "main"，目录选择 "/ (root)"
   - 点击 **Save**

### 3.2 等待部署完成

- GitHub Pages 会自动构建和部署
- 通常需要 1-3 分钟
- 在 Pages 设置页面会显示部署状态
- 成功后会显示访问地址：`https://your-username.github.io/pension-basic/`

### 3.3 访问您的应用

部署完成后，访问：
```
https://your-username.github.io/pension-basic/
```

## 步骤4：更新README中的链接

更新 README.md 中的在线访问链接：

```bash
# 编辑README.md，将以下行：
# 🌐 **GitHub Pages部署**: [点击访问在线版本](https://your-username.github.io/pension-basic/)

# 替换为实际的链接，例如：
# 🌐 **GitHub Pages部署**: [点击访问在线版本](https://zhangsan.github.io/pension-basic/)

# 然后提交更改
git add README.md
git commit -m "docs: 更新在线访问链接"
git push
```

## 后续更新

每次修改代码后，只需三步：

```bash
# 1. 添加更改
git add .

# 2. 提交更改
git commit -m "描述您的更改内容"

# 3. 推送到GitHub
git push
```

GitHub Pages 会自动重新部署，通常 1-3 分钟后生效。

## 自定义域名（可选）

如果您有自己的域名，可以配置自定义域名：

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容为您的域名，例如：`pension.example.com`
3. 在您的域名管理处添加 CNAME 记录：
   - 主机记录：`pension`（或您想要的子域名）
   - 记录类型：`CNAME`
   - 记录值：`your-username.github.io`
4. 在 GitHub Pages 设置中的 "Custom domain" 输入您的域名
5. 勾选 "Enforce HTTPS"

## 故障排查

### 问题1：页面显示404

**可能原因：**
- GitHub Pages 还在构建中，等待几分钟
- 仓库设置为私有，需要改为公开
- 分支或路径设置错误

**解决方案：**
- 检查 Settings → Pages，确认分支为 "main"，路径为 "/"
- 查看 Actions 标签页，确认部署是否成功

### 问题2：推送被拒绝

**错误信息：** `remote: Permission denied`

**解决方案：**
- 检查是否使用了正确的 Personal Access Token
- 或者配置 SSH key
- 确认有仓库的写入权限

### 问题3：CSS/JS文件无法加载

**可能原因：**
- 文件路径使用了绝对路径

**解决方案：**
- 检查 index.html 中的资源引用
- 应该使用相对路径：`./styles.css` 而不是 `/styles.css`

## 项目当前状态

✅ Git 仓库已初始化
✅ 代码已提交
✅ .gitignore 已配置
✅ README.md 已更新

**下一步：** 执行步骤2，推送代码到GitHub

## 快速命令参考

```bash
# 查看当前状态
git status

# 查看提交历史
git log --oneline

# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/your-username/pension-basic.git

# 推送代码
git push -u origin main

# 拉取更新
git pull

# 创建新分支
git checkout -b feature-name

# 合并分支
git merge feature-name
```

## 联系支持

如果遇到问题：
1. 查看 GitHub Pages 文档：https://docs.github.com/pages
2. 查看仓库的 Actions 标签页，查看部署日志
3. 检查浏览器控制台的错误信息

---

**准备好了吗？** 从步骤2开始，将您的应用部署到全世界！ 🚀
