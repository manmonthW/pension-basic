// pages/index/index.js
const { getRetirementAge } = require('../../utils/retirementAge.js');
const { CITY_CONFIG } = require('../../utils/cityConfig.js');
const { simulatePensionPlans } = require('../../utils/pensionCalculator.js');
const util = require('../../utils/util.js');

Page({
  data: {
    // 城市选择
    cities: ['北京'],
    cityIndex: 0,

    // 人员类型
    personTypes: [
      { label: '男职工', value: 'male_worker' },
      { label: '女干部', value: 'female_cadre' },
      { label: '女工人', value: 'female_worker' }
    ],
    personTypeIndex: 0,

    // 出生年月
    birthYear: '',
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    birthMonthIndex: 0,

    // 退休信息
    retirementInfo: null,

    // 历史缴费信息
    histPaidMonths: '',
    histAvgIndex: '1.0',
    histPersonalAccount: ''
  },

  onLoad() {
    console.log('养老金计算器页面加载');
    // 设置默认值
    const currentYear = new Date().getFullYear();
    this.setData({
      birthYear: String(currentYear - 40) // 默认40岁
    });
  },

  // 城市选择
  onCityChange(e) {
    this.setData({
      cityIndex: parseInt(e.detail.value)
    });
  },

  // 人员类型选择
  onPersonTypeChange(e) {
    this.setData({
      personTypeIndex: parseInt(e.detail.value),
      retirementInfo: null // 清空退休信息
    });
  },

  // 出生年份选择
  onBirthYearChange(e) {
    const yearStr = e.detail.value;
    const year = yearStr.split('-')[0];
    this.setData({
      birthYear: year,
      retirementInfo: null
    });
  },

  // 出生月份选择
  onBirthMonthChange(e) {
    this.setData({
      birthMonthIndex: parseInt(e.detail.value),
      retirementInfo: null
    });
  },

  // 输入事件
  onHistPaidMonthsInput(e) {
    this.setData({
      histPaidMonths: e.detail.value
    });
  },

  onHistAvgIndexInput(e) {
    this.setData({
      histAvgIndex: e.detail.value
    });
  },

  onHistPersonalAccountInput(e) {
    this.setData({
      histPersonalAccount: e.detail.value
    });
  },

  // 查询退休年龄
  checkRetirement() {
    const { birthYear, birthMonthIndex, personTypes, personTypeIndex } = this.data;

    if (!birthYear) {
      util.showError('请选择出生年份');
      return;
    }

    const birthMonth = birthMonthIndex + 1;
    const personType = personTypes[personTypeIndex].value;

    try {
      const result = getRetirementAge(parseInt(birthYear), birthMonth, personType);
      this.setData({
        retirementInfo: result
      });
      util.showSuccess('查询成功');
    } catch (error) {
      util.showError('查询失败：' + error.message);
      console.error(error);
    }
  },

  // 计算养老金
  calculatePension() {
    const {
      birthYear,
      birthMonthIndex,
      personTypes,
      personTypeIndex,
      histPaidMonths,
      histAvgIndex,
      histPersonalAccount
    } = this.data;

    // 验证输入
    if (!birthYear) {
      util.showError('请选择出生年份');
      return;
    }

    if (!histPaidMonths || histPaidMonths === '0') {
      util.showError('请输入已累计缴费月数');
      return;
    }

    if (!histAvgIndex) {
      util.showError('请输入历史平均缴费指数');
      return;
    }

    if (!histPersonalAccount) {
      util.showError('请输入个人账户余额');
      return;
    }

    const birthMonth = birthMonthIndex + 1;
    const personType = personTypes[personTypeIndex].value;
    const config = CITY_CONFIG['北京'];

    // 准备计算参数
    const input = {
      birthYear: parseInt(birthYear),
      birthMonth: birthMonth,
      personType: personType,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      histPaidMonths: parseInt(histPaidMonths),
      histAvgIndex: parseFloat(histAvgIndex),
      histPersonalAccount: parseFloat(histPersonalAccount),
      avgSalary: config.avgSalary,
      personalRate: config.flexibleEmploymentRate,
      employerRate: 0,
      personalToAccountRate: config.personalAccountRate,
      accountInterestRate: config.pensionInterestRate,
      payBaseOptions: [
        config.baseMin,
        config.avgSalary,
        config.avgSalary * 2,
        config.baseMax
      ]
    };

    util.showLoading('计算中...');

    try {
      const result = simulatePensionPlans(input);

      util.hideLoading();

      // 跳转到结果页面
      wx.navigateTo({
        url: `/pages/result/result?data=${encodeURIComponent(JSON.stringify(result))}`
      });
    } catch (error) {
      util.hideLoading();
      util.showError('计算失败：' + error.message);
      console.error(error);
    }
  },

  // 重置表单
  resetForm() {
    const currentYear = new Date().getFullYear();
    this.setData({
      personTypeIndex: 0,
      birthYear: String(currentYear - 40),
      birthMonthIndex: 0,
      retirementInfo: null,
      histPaidMonths: '',
      histAvgIndex: '1.0',
      histPersonalAccount: ''
    });
    util.showSuccess('已重置');
  }
});
