// 养老金计算核心模块

const { getStatutoryRetirementAge } = require('./retirementAge');
const { N_TABLE } = require('./cityConfig');

/**
 * 计算两个日期之间的月数差
 * @param {number} year1 - 起始年
 * @param {number} month1 - 起始月
 * @param {number} year2 - 结束年
 * @param {number} month2 - 结束月
 * @returns {number} - 月数差
 */
function monthsBetween(year1, month1, year2, month2) {
  return (year2 - year1) * 12 + (month2 - month1);
}

/**
 * 将月数转换为年数
 * @param {number} months - 月数
 * @returns {number} - 年数
 */
function yearsFromMonths(months) {
  return months / 12;
}

/**
 * 根据退休年龄查询计发月数N
 * @param {number} retireAgeYears - 退休年龄（岁）
 * @returns {number} - 计发月数N
 */
function getNFromTable(retireAgeYears) {
  const age = Math.round(retireAgeYears);
  const n = N_TABLE[age];

  if (!n) {
    throw new Error(`未找到退休年龄 ${age} 岁对应的计发月数`);
  }

  return n;
}

/**
 * 计算单个方案的养老金结果
 * @param {object} input - 输入参数
 * @param {number} monthlyBase - 本方案的月缴费基数
 * @param {number} monthsToRetire - 剩余缴费月数
 * @param {number} retireYear - 退休年份
 * @param {number} retireMonth - 退休月份
 * @param {number} N - 计发月数
 * @returns {object} - 方案结果
 */
function calculateSinglePlan(
  input,
  monthlyBase,
  monthsToRetire,
  retireYear,
  retireMonth,
  N
) {
  const M = monthsToRetire;

  // 1) 新增缴费指数 & 最终指数
  const index_i = monthlyBase / input.lastYearAvgWage;
  const totalMonths = input.histPaidMonths + M;
  const finalAvgIndex =
    (input.histAvgIndex * input.histPaidMonths + index_i * M) / totalMonths;

  // 2) 个人账户余额
  const addedAccount = monthlyBase * input.personalToAccountRate * M;
  const interestFactor =
    1 + input.accountInterestRate * (yearsFromMonths(M) / 2);
  const finalPersonalAccount =
    (input.histPersonalAccount + addedAccount) * interestFactor;

  // 3) 最终缴费年限
  const finalPaidMonths = input.histPaidMonths + M;
  const totalPaidYears = yearsFromMonths(finalPaidMonths);

  // 4) 养老金计算
  // 指数化月平均缴费工资
  const indexedAvgWage = finalAvgIndex * input.lastYearAvgWage;
  // 累计计发比例
  const accrual = totalPaidYears * input.basicAccrualRate;
  // 基础养老金
  const basicPension =
    ((input.lastYearAvgWage + indexedAvgWage) / 2) * accrual;
  // 个人账户养老金
  const accountPension = finalPersonalAccount / N;
  // 总养老金
  const monthlyPension = basicPension + accountPension;

  // 5) 个人缴费
  const personalPayPerMonth = monthlyBase * input.personalRate;
  const totalPersonalPay = personalPayPerMonth * M;

  return {
    monthlyBase,
    monthsToRetire: M,
    personalPayPerMonth,
    totalPersonalPay,
    finalPersonalAccount,
    finalAvgIndex,
    totalPaidYears,
    monthlyPension,
    basicPensionPart: basicPension,
    accountPensionPart: accountPension,
  };
}

/**
 * 模拟养老金缴费方案（主函数）
 * @param {object} input - 输入参数
 * @returns {object} - 输出结果
 */
function simulatePensionPlans(input) {
  // Step 1: 计算法定退休时间 & 剩余缴费月数
  const { retireYear, retireMonth } = getStatutoryRetirementAge(
    input.birthYear,
    input.birthMonth,
    input.gender || 'male',
    input.personType
  );

  const monthsToRetire = monthsBetween(
    input.currentYear,
    input.currentMonth,
    retireYear,
    retireMonth
  );

  // 用户自定义缴费年限限制
  const maxMonthsByUser = (input.futurePayYearsLimit ?? 100) * 12;
  const M = Math.min(monthsToRetire, maxMonthsByUser);

  // Step 2: 计算退休年龄和计发月数N
  const retireAgeYears =
    retireYear - input.birthYear + (retireMonth - input.birthMonth) / 12;
  const N = getNFromTable(Math.round(retireAgeYears));

  // 格式化退休年龄显示
  const ageYears = Math.floor(retireAgeYears);
  const ageMonths = Math.round((retireAgeYears - ageYears) * 12);
  const displayAge = ageMonths === 0 ? `${ageYears}岁` : `${ageYears}岁${ageMonths}个月`;

  // Step 3: 计算每个方案
  const plans = [];

  for (let idx = 0; idx < input.payBaseOptions.length; idx++) {
    const monthlyBase = input.payBaseOptions[idx];

    const planResult = calculateSinglePlan(
      input,
      monthlyBase,
      M,
      retireYear,
      retireMonth,
      N
    );

    plans.push({
      planId: idx + 1,
      ...planResult,
    });
  }

  // Step 4: 相对最低档方案做差分
  const basePlan = plans[0];

  for (const p of plans) {
    p.deltaPersonalPayVsPlan1 = p.totalPersonalPay - basePlan.totalPersonalPay;
    p.deltaMonthlyPensionVsPlan1 =
      p.monthlyPension - basePlan.monthlyPension;

    if (p.deltaMonthlyPensionVsPlan1 > 0) {
      p.paybackMonthsVsPlan1 =
        p.deltaPersonalPayVsPlan1 / p.deltaMonthlyPensionVsPlan1;
    } else {
      p.paybackMonthsVsPlan1 = Infinity;
    }
  }

  // Step 5: 找出推荐方案
  const bestByPayback =
    plans
      .filter(
        (p) => p.paybackMonthsVsPlan1 && p.paybackMonthsVsPlan1 !== Infinity
      )
      .sort((a, b) => a.paybackMonthsVsPlan1 - b.paybackMonthsVsPlan1)[0] ??
    plans[0];

  const bestByPension = plans
    .slice()
    .sort((a, b) => b.monthlyPension - a.monthlyPension)[0];

  return {
    basePlanIndex: 1,
    plans,
    bestByPayback,
    bestByPension,
    retireInfo: {
      retireYear,
      retireMonth,
      retireAgeYears,
      displayAge,
      N,
      monthsToRetire: M,
    },
  };
}

/**
 * 创建缴费基数选项（根据社平工资和档位比例）
 * @param {number} avgWage - 社平工资
 * @param {number[]} ratios - 档位比例数组，如 [0.6, 0.8, 1.0, 3.0]
 * @returns {number[]} - 缴费基数数组
 */
function createPayBaseOptions(avgWage, ratios = [0.6, 0.8, 1.0, 3.0]) {
  return ratios.map((ratio) => Math.round(avgWage * ratio));
}

module.exports = {
  simulatePensionPlans,
  createPayBaseOptions,
  monthsBetween,
  yearsFromMonths,
  getNFromTable,
};
