// 测试文件 - Node.js环境
const { getRetirementAge, getStatutoryRetirementAge } = require('./retirementAge');
const { simulatePensionPlans, createPayBaseOptions, getNFromTable } = require('./pensionCalculator');
const { CITY_CONFIG } = require('./cityConfig');

console.log('=== 养老金计算器测试 ===\n');

// 测试1: 退休年龄查询
console.log('【测试1：退休年龄查询】');
const testCases = [
  { personType: 'male_worker', birthYear: 1965, birthMonth: 1, expected: '60岁1个月' },
  { personType: 'male_worker', birthYear: 1965, birthMonth: 6, expected: '60岁2个月' },
  { personType: 'male_worker', birthYear: 1980, birthMonth: 5, expected: '63岁' },
  { personType: 'female_cadre', birthYear: 1970, birthMonth: 2, expected: '55岁1个月' },
  { personType: 'female_cadre', birthYear: 1985, birthMonth: 3, expected: '58岁' },
  { personType: 'female_worker', birthYear: 1975, birthMonth: 1, expected: '50岁1个月' },
  { personType: 'female_worker', birthYear: 1990, birthMonth: 6, expected: '55岁' },
];

testCases.forEach((test, index) => {
  const result = getRetirementAge(test.birthYear, test.birthMonth, test.personType);
  const passed = result.displayAge === test.expected;
  console.log(
    `${index + 1}. ${test.personType} ${test.birthYear}-${test.birthMonth}: ${result.displayAge} ${passed ? '✓' : '✗ (期望: ' + test.expected + ')'}`
  );
});

console.log('\n【测试2：养老金计算】');

// 测试2: 养老金计算（灵活就业人员）
const config = CITY_CONFIG['北京'];
const payBaseOptions = createPayBaseOptions(config.avgSalary, [0.6, 1.0, 2.0, 3.0]);

const input = {
  personType: 'male_worker',
  gender: 'male',
  birthYear: 1985,
  birthMonth: 6,
  currentYear: 2025,
  currentMonth: 12,
  histPaidMonths: 120, // 已缴10年
  histAvgIndex: 1.0,
  histPersonalAccount: 50000,
  lastYearAvgWage: config.avgSalary,
  payBaseOptions: payBaseOptions,
  personalRate: config.flexibleEmploymentRate, // 灵活就业20%
  employerRate: 0, // 灵活就业无单位缴费
  personalToAccountRate: config.personalAccountRate, // 8%计入个人账户
  basicAccrualRate: 0.01,
  accountInterestRate: config.pensionInterestRate,
  wageGrowthRate: 0.05,
  getStatutoryRetirementAge: getStatutoryRetirementAge,
  getNFromTable: getNFromTable,
};

try {
  const result = simulatePensionPlans(input);

  console.log(`\n退休信息：`);
  console.log(`  - 退休时间: ${result.retireInfo.retireYear}年${result.retireInfo.retireMonth}月`);
  console.log(`  - 退休年龄: ${result.retireInfo.retireAgeYears.toFixed(2)}岁`);
  console.log(`  - 计发月数: ${result.retireInfo.N}个月`);
  console.log(`  - 剩余缴费: ${result.retireInfo.monthsToRetire}个月`);

  console.log(`\n四档方案对比：`);
  const planNames = ['基础档(60%)', '标准档(100%)', '进阶档(200%)', '尊享档(300%)'];

  result.plans.forEach((plan, index) => {
    console.log(`\n${planNames[index]}:`);
    console.log(`  - 缴费基数: ${plan.monthlyBase.toFixed(2)}元/月`);
    console.log(`  - 每月个人缴费: ${plan.personalPayPerMonth.toFixed(2)}元`);
    console.log(`  - 个人总缴费: ${plan.totalPersonalPay.toFixed(2)}元`);
    console.log(`  - 累计缴费年限: ${plan.totalPaidYears.toFixed(2)}年`);
    console.log(`  - 个人账户余额: ${plan.finalPersonalAccount.toFixed(2)}元`);
    console.log(`  - 预计月养老金: ${plan.monthlyPension.toFixed(2)}元`);
    console.log(`    └ 基础养老金: ${plan.basicPensionPart.toFixed(2)}元`);
    console.log(`    └ 个人账户养老金: ${plan.accountPensionPart.toFixed(2)}元`);

    if (plan.planId > 1) {
      console.log(`  - 相比低档多缴: ${plan.deltaPersonalPayVsPlan1.toFixed(2)}元`);
      console.log(`  - 每月多领: ${plan.deltaMonthlyPensionVsPlan1.toFixed(2)}元`);
      if (plan.paybackMonthsVsPlan1 !== Infinity) {
        console.log(`  - 回本时间: ${Math.ceil(plan.paybackMonthsVsPlan1)}个月 (${(plan.paybackMonthsVsPlan1 / 12).toFixed(1)}年)`);
      } else {
        console.log(`  - 回本时间: 无法回本`);
      }
    }
  });

  console.log(`\n推荐方案：`);
  console.log(`  - 回本最快: ${planNames[result.bestByPayback.planId - 1]}`);
  console.log(`  - 养老金最高: ${planNames[result.bestByPension.planId - 1]}`);

  console.log('\n✓ 养老金计算测试通过');
} catch (error) {
  console.error('\n✗ 养老金计算测试失败:', error.message);
  console.error(error.stack);
}

console.log('\n=== 测试完成 ===');
