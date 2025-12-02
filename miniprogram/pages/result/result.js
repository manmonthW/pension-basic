// pages/result/result.js
const util = require('../../utils/util.js');

Page({
  data: {
    result: null,
    planNames: ['基础档(60%)', '标准档(100%)', '进阶档(200%)', '尊享档(300%)']
  },

  onLoad(options) {
    if (options.data) {
      try {
        const result = JSON.parse(decodeURIComponent(options.data));
        this.setData({
          result: result
        });
        console.log('计算结果:', result);
      } catch (error) {
        util.showError('数据解析失败');
        console.error(error);
      }
    } else {
      util.showError('未找到计算结果');
    }
  },

  // 格式化金额
  formatMoney(money) {
    return util.formatMoney(money);
  },

  // 格式化月数
  formatMonths(months) {
    return util.formatMonths(months);
  },

  // 返回重新计算
  goBack() {
    wx.navigateBack();
  },

  // 分享结果
  shareResult() {
    const { result } = this.data;
    if (!result) {
      util.showError('没有可分享的结果');
      return;
    }

    const basePlan = result.plans[result.basePlanIndex - 1];
    const shareText = `我的养老金方案：
退休年龄：${result.retireInfo.displayAge}
推荐方案：${this.data.planNames[result.basePlanIndex - 1]}
月养老金：${util.formatMoney(basePlan.monthlyPension)}元
每月缴费：${util.formatMoney(basePlan.personalPayPerMonth)}元

来测算你的养老金方案吧！`;

    wx.setClipboardData({
      data: shareText,
      success() {
        util.showSuccess('结果已复制到剪贴板');
      }
    });
  },

  // 分享给好友
  onShareAppMessage() {
    const { result } = this.data;
    if (!result) {
      return {
        title: '养老金计算器',
        path: '/pages/index/index'
      };
    }

    const basePlan = result.plans[result.basePlanIndex - 1];
    return {
      title: `我的养老金${util.formatMoney(basePlan.monthlyPension)}元/月，来测算你的吧！`,
      path: '/pages/index/index',
      imageUrl: '' // 可以设置分享图片
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    const { result } = this.data;
    if (!result) {
      return {
        title: '养老金缴费基数计算器'
      };
    }

    const basePlan = result.plans[result.basePlanIndex - 1];
    return {
      title: `养老金计算器：我的月养老金${util.formatMoney(basePlan.monthlyPension)}元`,
      query: ''
    };
  }
});
