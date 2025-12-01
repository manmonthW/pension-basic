#!/bin/bash

# 养老金计算器 - 统一部署脚本
# 支持 GitHub Pages 和 Vercel 部署
# 使用方法：bash deploy-all.sh

set -e  # 遇到错误时退出

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear

echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                        ║${NC}"
echo -e "${CYAN}║    养老金计算器 - 部署管理脚本        ║${NC}"
echo -e "${CYAN}║                                        ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""

# 显示项目信息
echo -e "${BLUE}项目信息：${NC}"
echo -e "  • 名称: 养老金缴费基数计算器"
echo -e "  • 类型: 纯静态前端应用"
echo -e "  • 仓库: https://github.com/manmonthW/pension-basic"
echo ""

# 检查 Git 状态
if [ -d .git ]; then
    echo -e "${GREEN}✓ Git 仓库已初始化${NC}"

    # 检查是否有未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠️  检测到未提交的更改${NC}"
        echo ""
        git status --short
        echo ""
        read -p "是否提交这些更改？[y/N] " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "请输入提交信息: " commit_msg
            git add .
            git commit -m "$commit_msg"
            echo -e "${GREEN}✓ 更改已提交${NC}"
        fi
        echo ""
    else
        echo -e "${GREEN}✓ 工作区干净，无待提交更改${NC}"
    fi
else
    echo -e "${RED}✗ 未检测到 Git 仓库${NC}"
    read -p "是否初始化 Git 仓库？[y/N] " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git init
        git add .
        git commit -m "Initial commit"
        echo -e "${GREEN}✓ Git 仓库初始化完成${NC}"
    fi
fi

echo ""
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo -e "${YELLOW}请选择部署平台：${NC}"
echo ""
echo -e "  ${GREEN}1)${NC} GitHub Pages   ${BLUE}(免费, 适合开源项目)${NC}"
echo -e "  ${GREEN}2)${NC} Vercel         ${BLUE}(快速, 自动 HTTPS, CDN 加速)${NC}"
echo -e "  ${GREEN}3)${NC} 两者都部署     ${BLUE}(推荐, 双保险)${NC}"
echo -e "  ${GREEN}4)${NC} 只提交代码到 GitHub ${BLUE}(不部署)${NC}"
echo -e "  ${GREEN}5)${NC} 退出"
echo ""
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo ""

read -p "请输入选项 [1-5]: " platform_option

case $platform_option in
    1)
        echo ""
        echo -e "${BLUE}═══ 部署到 GitHub Pages ═══${NC}"
        echo ""

        # 检查是否已添加远程仓库
        if git remote | grep -q "origin"; then
            echo -e "${GREEN}✓ 远程仓库已配置${NC}"
        else
            git remote add origin https://github.com/manmonthW/pension-basic.git
            echo -e "${GREEN}✓ 远程仓库已添加${NC}"
        fi

        git branch -M main
        git push -u origin main

        echo ""
        echo -e "${GREEN}✓ 代码已推送到 GitHub${NC}"
        echo ""
        echo -e "${YELLOW}请完成以下步骤配置 GitHub Pages：${NC}"
        echo ""
        echo "1. 访问: https://github.com/manmonthW/pension-basic/settings/pages"
        echo "2. Source 选择: Deploy from a branch"
        echo "3. Branch 选择: main, 目录: / (root)"
        echo "4. 点击 Save"
        echo ""
        echo -e "部署后访问: ${GREEN}https://manmonthW.github.io/pension-basic/${NC}"
        ;;

    2)
        echo ""
        echo -e "${BLUE}═══ 部署到 Vercel ═══${NC}"
        echo ""

        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}安装 Vercel CLI...${NC}"
            npm install -g vercel
        fi

        echo -e "${GREEN}✓ Vercel CLI 已就绪${NC}"
        echo ""

        read -p "是否首次部署此项目到 Vercel? [Y/n] " -n 1 -r
        echo ""

        if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
            vercel
        else
            read -p "部署到生产环境? [Y/n] " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
                vercel --prod
            else
                vercel
            fi
        fi

        echo ""
        echo -e "${GREEN}✓ Vercel 部署完成${NC}"
        ;;

    3)
        echo ""
        echo -e "${BLUE}═══ 部署到 GitHub Pages ═══${NC}"
        echo ""

        # GitHub Pages 部署
        if git remote | grep -q "origin"; then
            echo -e "${GREEN}✓ 远程仓库已配置${NC}"
        else
            git remote add origin https://github.com/manmonthW/pension-basic.git
            echo -e "${GREEN}✓ 远程仓库已添加${NC}"
        fi

        git branch -M main
        git push -u origin main

        echo ""
        echo -e "${GREEN}✓ GitHub 推送完成${NC}"
        echo ""

        # Vercel 部署
        echo -e "${BLUE}═══ 部署到 Vercel ═══${NC}"
        echo ""

        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}安装 Vercel CLI...${NC}"
            npm install -g vercel
        fi

        echo -e "${GREEN}✓ Vercel CLI 已就绪${NC}"
        echo ""

        vercel --prod

        echo ""
        echo -e "${GREEN}════════════════════════════════════════${NC}"
        echo -e "${GREEN}  ✓ 双平台部署完成！${NC}"
        echo -e "${GREEN}════════════════════════════════════════${NC}"
        echo ""
        echo -e "${BLUE}访问地址：${NC}"
        echo -e "  • GitHub Pages: ${GREEN}https://manmonthW.github.io/pension-basic/${NC}"
        echo -e "  • Vercel: ${GREEN}(查看上方输出的 URL)${NC}"
        ;;

    4)
        echo ""
        echo -e "${BLUE}═══ 提交代码到 GitHub ═══${NC}"
        echo ""

        if git remote | grep -q "origin"; then
            echo -e "${GREEN}✓ 远程仓库已配置${NC}"
        else
            git remote add origin https://github.com/manmonthW/pension-basic.git
            echo -e "${GREEN}✓ 远程仓库已添加${NC}"
        fi

        git branch -M main
        git push -u origin main

        echo ""
        echo -e "${GREEN}✓ 代码已同步到 GitHub${NC}"
        ;;

    5)
        echo ""
        echo -e "${YELLOW}退出部署脚本${NC}"
        exit 0
        ;;

    *)
        echo ""
        echo -e "${RED}无效选项，退出${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo -e "${GREEN}部署完成！${NC}"
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo ""

# 显示下一步操作
echo -e "${BLUE}后续更新流程：${NC}"
echo ""
echo "1. 修改代码后运行此脚本重新部署"
echo "2. 或使用以下命令："
echo -e "   ${GREEN}git add . && git commit -m '更新说明' && git push${NC}"
echo -e "   ${GREEN}vercel --prod${NC} ${YELLOW}(如使用 Vercel)${NC}"
echo ""
