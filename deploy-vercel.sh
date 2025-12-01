#!/bin/bash

# 养老金计算器 - Vercel 部署脚本
# 使用方法：bash deploy-vercel.sh

set -e  # 遇到错误时退出

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  养老金计算器 Vercel 部署脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查 vercel CLI 是否安装
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  检测到 Vercel CLI 未安装${NC}"
    echo ""
    echo -e "正在安装 Vercel CLI..."

    if command -v npm &> /dev/null; then
        npm install -g vercel
        echo -e "${GREEN}✓ Vercel CLI 安装成功${NC}"
    else
        echo -e "${RED}错误：未检测到 npm，请先安装 Node.js${NC}"
        echo "下载地址：https://nodejs.org/"
        exit 1
    fi
    echo ""
fi

echo -e "${GREEN}✓ Vercel CLI 已就绪${NC}"
echo ""

# 显示当前配置
echo -e "${BLUE}项目配置：${NC}"
echo -e "  • 项目名称: pension-basic"
echo -e "  • 框架: 静态网站"
echo -e "  • 构建输出: ./ (当前目录)"
echo ""

# 询问部署类型
echo -e "${YELLOW}请选择部署方式：${NC}"
echo "  1) 首次部署（需要登录和配置）"
echo "  2) 生产环境部署（更新现有项目）"
echo "  3) 预览部署（测试分支）"
echo ""

read -p "请输入选项 [1-3]: " deploy_option

case $deploy_option in
    1)
        echo ""
        echo -e "${BLUE}开始首次部署...${NC}"
        echo ""
        echo -e "${YELLOW}注意：${NC}"
        echo -e "  1. 首次使用需要登录 Vercel 账号"
        echo -e "  2. 如果没有账号，会自动跳转到注册页面"
        echo -e "  3. 建议使用 GitHub 账号登录，可实现自动部署"
        echo ""
        read -p "按 Enter 继续..."

        # 首次部署
        vercel

        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  ✓ 首次部署完成！${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "接下来的部署可以使用选项 2 或 3"
        ;;

    2)
        echo ""
        echo -e "${BLUE}部署到生产环境...${NC}"
        echo ""

        # 生产环境部署
        vercel --prod

        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  ✓ 生产部署完成！${NC}"
        echo -e "${GREEN}========================================${NC}"
        ;;

    3)
        echo ""
        echo -e "${BLUE}创建预览部署...${NC}"
        echo ""

        # 预览部署
        vercel

        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  ✓ 预览部署完成！${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "预览链接已生成，可用于测试"
        ;;

    *)
        echo -e "${RED}无效选项，退出${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}部署后操作建议：${NC}"
echo ""
echo "1. 查看部署信息："
echo -e "   ${GREEN}vercel ls${NC}"
echo ""
echo "2. 查看项目详情："
echo -e "   ${GREEN}vercel inspect${NC}"
echo ""
echo "3. 查看部署日志："
echo -e "   ${GREEN}vercel logs${NC}"
echo ""
echo "4. 绑定自定义域名："
echo -e "   ${GREEN}vercel domains add yourdomain.com${NC}"
echo ""
echo -e "${GREEN}文档：https://vercel.com/docs${NC}"
echo ""
