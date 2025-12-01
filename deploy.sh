#!/bin/bash

# 养老金计算器 - GitHub 部署脚本
# 使用方法：bash deploy.sh <your-github-username>

set -e  # 遇到错误时退出

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  养老金计算器 GitHub 部署脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查参数
if [ -z "$1" ]; then
    echo -e "${RED}错误：请提供您的GitHub用户名${NC}"
    echo "使用方法：bash deploy.sh <your-github-username>"
    echo "例如：bash deploy.sh zhangsan"
    exit 1
fi

USERNAME=$1
REPO_NAME="pension-basic"
REPO_URL="https://github.com/${USERNAME}/${REPO_NAME}.git"

echo -e "${GREEN}✓ GitHub用户名: ${USERNAME}${NC}"
echo -e "${GREEN}✓ 仓库地址: ${REPO_URL}${NC}"
echo ""

# 检查是否已有远程仓库
if git remote | grep -q "origin"; then
    echo -e "${BLUE}检测到已存在的远程仓库，正在删除...${NC}"
    git remote remove origin
fi

# 添加远程仓库
echo -e "${BLUE}正在添加远程仓库...${NC}"
git remote add origin $REPO_URL

# 重命名主分支为main
echo -e "${BLUE}正在设置主分支为main...${NC}"
git branch -M main

# 推送代码
echo -e "${BLUE}正在推送代码到GitHub...${NC}"
echo ""
echo -e "${RED}注意：如果这是第一次推送，您需要进行认证：${NC}"
echo -e "  1. 如果提示输入密码，请使用您的GitHub Personal Access Token"
echo -e "  2. Token获取地址：https://github.com/settings/tokens"
echo -e "  3. 或者配置SSH密钥：https://docs.github.com/en/authentication"
echo ""

if git push -u origin main; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  ✓ 代码推送成功！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "接下来请完成以下步骤："
    echo ""
    echo -e "1. 访问您的仓库："
    echo -e "   ${BLUE}https://github.com/${USERNAME}/${REPO_NAME}${NC}"
    echo ""
    echo -e "2. 配置GitHub Pages："
    echo -e "   • 点击 Settings → Pages"
    echo -e "   • Source 选择 'Deploy from a branch'"
    echo -e "   • Branch 选择 'main'，目录选择 '/ (root)'"
    echo -e "   • 点击 Save"
    echo ""
    echo -e "3. 等待1-3分钟后，访问您的应用："
    echo -e "   ${GREEN}https://${USERNAME}.github.io/${REPO_NAME}/${NC}"
    echo ""
    echo -e "4. 更新README中的访问链接（可选）"
    echo ""
    echo -e "${GREEN}部署完成！享受您的养老金计算器吧！ 🎉${NC}"
else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}  ✗ 推送失败${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo -e "可能的原因："
    echo -e "1. GitHub仓库不存在"
    echo -e "   → 请先在GitHub上创建仓库：https://github.com/new"
    echo -e "2. 认证失败"
    echo -e "   → 使用Personal Access Token或配置SSH"
    echo -e "3. 没有写入权限"
    echo -e "   → 确认仓库所有者和权限设置"
    echo ""
    echo -e "详细部署指南请查看：${BLUE}DEPLOYMENT.md${NC}"
    exit 1
fi
