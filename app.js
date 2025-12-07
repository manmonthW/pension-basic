// 养老金计算器 - 浏览器版本
console.log('app.js 已加载');

// ============ 配置数据 ============

// 城市配置
const CITY_CONFIG = {
  北京: {
    city: "北京",
    avgSalary: 12049, // 退休金核算基数（社平工资）
    pensionInterestRate: 0.015, // 个人账户年利率
    baseMin: 7162, // 缴费基数下限（60%）
    baseMax: 35811, // 缴费基数上限（300%）

    // 灵活就业人员缴费比例（失业后自己缴纳）
    flexibleEmploymentRate: 0.20, // 灵活就业总缴费比例 20%
    personalAccountRate: 0.08, // 计入个人账户 8%
    poolingRate: 0.12, // 进入统筹账户 12%

    // 在职员工缴费比例（仅供参考）
    companyRate: 0.16, // 单位缴费比例
    employeePersonalRate: 0.08, // 在职员工个人缴费比例
  },
};

// 计发月数表（N表）
const N_TABLE = {
  50: 195,
  51: 183,
  52: 171,
  53: 160,
  54: 150,
  55: 139,
  56: 129,
  57: 119,
  58: 110,
  59: 101,
  60: 93,
  61: 86,
  62: 79,
  63: 73,
};

// 退休年龄区间表
const RETIREMENT_AGE_TABLES = {
  male_worker: {
    ranges: [
      { start: 196501, end: 196504, code: 6001 },
      { start: 196505, end: 196508, code: 6002 },
      { start: 196509, end: 196512, code: 6003 },
      { start: 196801, end: 196804, code: 6010 },
      { start: 196901, end: 196904, code: 6101 },
      { start: 197001, end: 197004, code: 6104 },
      { start: 197101, end: 197104, code: 6107 },
      { start: 197201, end: 197204, code: 6110 },
      { start: 197301, end: 197304, code: 6201 },
      { start: 197401, end: 197404, code: 6204 },
      { start: 197501, end: 197504, code: 6207 },
      { start: 197601, end: 197612, code: 6300 },
    ],
    earlyRetiredBefore: 1965,
    unifiedAfter: { year: 1977, code: 6300 },
  },
  female_cadre: {
    ranges: [
      { start: 197001, end: 197004, code: 5501 },
      { start: 197005, end: 197008, code: 5502 },
      { start: 197009, end: 197012, code: 5503 },
      { start: 197301, end: 197304, code: 5510 },
      { start: 197401, end: 197404, code: 5601 },
      { start: 197501, end: 197504, code: 5604 },
      { start: 197601, end: 197604, code: 5607 },
      { start: 197701, end: 197704, code: 5610 },
      { start: 197801, end: 197804, code: 5701 },
      { start: 197901, end: 197904, code: 5704 },
      { start: 198001, end: 198004, code: 5707 },
      { start: 198101, end: 198112, code: 5800 },
    ],
    earlyRetiredBefore: 1970,
    unifiedAfter: { year: 1982, code: 5800 },
  },
  female_worker: {
    ranges: [
      { start: 197501, end: 197502, code: 5001 },
      { start: 197503, end: 197504, code: 5002 },
      { start: 197601, end: 197602, code: 5007 },
      { start: 197701, end: 197702, code: 5101 },
      { start: 197801, end: 197802, code: 5107 },
      { start: 197901, end: 197902, code: 5201 },
      { start: 198001, end: 198002, code: 5207 },
      { start: 198101, end: 198102, code: 5301 },
      { start: 198201, end: 198202, code: 5307 },
      { start: 198301, end: 198302, code: 5401 },
      { start: 198401, end: 198412, code: 5500 },
    ],
    earlyRetiredBefore: 1975,
    unifiedAfter: { year: 1984, code: 5500 },
  },
};

// ============ 退休年龄计算 ============

function toBirthCode(year, month) {
  return year * 100 + month;
}

function parseRetirementCode(code) {
  const years = Math.floor(code / 100);
  const months = code % 100;
  return { years, months };
}

function getRetirementAge(birthYear, birthMonth, personType) {
  const table = RETIREMENT_AGE_TABLES[personType];

  if (!table) {
    throw new Error(`无效的人员类型: ${personType}`);
  }

  if (birthYear < table.earlyRetiredBefore) {
    return {
      status: 'retired',
      message: '已退休',
      retireYear: null,
      retireMonth: null,
      displayAge: '已退休',
    };
  }

  if (birthYear >= table.unifiedAfter.year) {
    const code = table.unifiedAfter.code;
    const { years, months } = parseRetirementCode(code);

    let retireYear = birthYear + years;
    let retireMonth = birthMonth + months + 1;

    if (retireMonth > 12) {
      retireYear += Math.floor(retireMonth / 12);
      retireMonth = retireMonth % 12;
      if (retireMonth === 0) {
        retireMonth = 12;
        retireYear -= 1;
      }
    }

    return {
      status: 'normal',
      code: code,
      retireYear: retireYear,
      retireMonth: retireMonth,
      displayAge: months === 0 ? `${years}岁` : `${years}岁${months}个月`,
    };
  }

  const birthCode = toBirthCode(birthYear, birthMonth);

  for (const range of table.ranges) {
    if (birthCode >= range.start && birthCode <= range.end) {
      const { years, months } = parseRetirementCode(range.code);

      let retireYear = birthYear + years;
      let retireMonth = birthMonth + months + 1;

      if (retireMonth > 12) {
        retireYear += Math.floor(retireMonth / 12);
        retireMonth = retireMonth % 12;
        if (retireMonth === 0) {
          retireMonth = 12;
          retireYear -= 1;
        }
      }

      return {
        status: 'normal',
        code: range.code,
        retireYear: retireYear,
        retireMonth: retireMonth,
        displayAge: months === 0 ? `${years}岁` : `${years}岁${months}个月`,
      };
    }
  }

  throw new Error(`未找到出生日期 ${birthYear}-${birthMonth} 对应的退休年龄`);
}

// ============ 养老金计算 ============

function monthsBetween(year1, month1, year2, month2) {
  return (year2 - year1) * 12 + (month2 - month1);
}

function yearsFromMonths(months) {
  return months / 12;
}

function getNFromTable(retireAgeYears) {
  const age = Math.round(retireAgeYears);
  const n = N_TABLE[age];
  if (!n) {
    throw new Error(`未找到退休年龄 ${age} 岁对应的计发月数`);
  }
  return n;
}

function simulatePensionPlans(input) {
  const retirementResult = getRetirementAge(
    input.birthYear,
    input.birthMonth,
    input.personType
  );

  if (retirementResult.status === 'retired') {
    throw new Error('该人员已达到退休年龄');
  }

  const retireYear = retirementResult.retireYear;
  const retireMonth = retirementResult.retireMonth;

  const monthsToRetire = monthsBetween(
    input.currentYear,
    input.currentMonth,
    retireYear,
    retireMonth
  );

  const M = monthsToRetire;

  const retireAgeYears =
    retireYear - input.birthYear + (retireMonth - input.birthMonth) / 12;
  const N = getNFromTable(Math.round(retireAgeYears));

  const plans = [];

  for (let idx = 0; idx < input.payBaseOptions.length; idx++) {
    const monthlyBase = input.payBaseOptions[idx];

    const index_i = monthlyBase / input.lastYearAvgWage;
    const totalMonths = input.histPaidMonths + M;
    const finalAvgIndex =
      (input.histAvgIndex * input.histPaidMonths + index_i * M) / totalMonths;

    const addedAccount = monthlyBase * input.personalToAccountRate * M;
    const interestFactor =
      1 + input.accountInterestRate * (yearsFromMonths(M) / 2);
    const finalPersonalAccount =
      (input.histPersonalAccount + addedAccount) * interestFactor;

    const finalPaidMonths = input.histPaidMonths + M;
    const totalPaidYears = yearsFromMonths(finalPaidMonths);

    const indexedAvgWage = finalAvgIndex * input.lastYearAvgWage;
    const accrual = totalPaidYears * input.basicAccrualRate;
    const basicPension =
      ((input.lastYearAvgWage + indexedAvgWage) / 2) * accrual;
    const accountPension = finalPersonalAccount / N;
    const monthlyPension = basicPension + accountPension;

    const personalPayPerMonth = monthlyBase * input.personalRate;
    const totalPersonalPay = personalPayPerMonth * M;

    plans.push({
      planId: idx + 1,
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
    });
  }

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
      displayAge: retirementResult.displayAge,
      N,
      monthsToRetire: M,
    },
  };
}

// ============ 格式化辅助函数 ============

function formatMoney(value) {
  return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatMonths(months) {
  const years = Math.floor(months / 12);
  const remainMonths = months % 12;
  if (years === 0) {
    return `${remainMonths}个月`;
  } else if (remainMonths === 0) {
    return `${years}年`;
  } else {
    return `${years}年${remainMonths}个月`;
  }
}
