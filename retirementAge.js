// 退休年龄查询模块

// 退休年龄区间表
const RETIREMENT_AGE_TABLES = {
  // 男职工法定退休年龄（区间表）
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

  // 女干部法定退休年龄（区间表）
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

  // 女工人法定退休年龄（区间表）
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

/**
 * 将年月转换为YYYYMM格式的数字
 * @param {number} year - 年份
 * @param {number} month - 月份 (1-12)
 * @returns {number} - YYYYMM格式
 */
function toBirthCode(year, month) {
  return year * 100 + month;
}

/**
 * 解析退休年龄代码
 * @param {number} code - 退休年龄代码 (如: 6001 表示60岁1个月)
 * @returns {object} - {years: 60, months: 1}
 */
function parseRetirementCode(code) {
  const years = Math.floor(code / 100);
  const months = code % 100;
  return { years, months };
}

/**
 * 查询法定退休年龄
 * @param {number} birthYear - 出生年
 * @param {number} birthMonth - 出生月 (1-12)
 * @param {string} personType - 人员类型: 'male_worker' | 'female_cadre' | 'female_worker'
 * @returns {object} - 退休年龄信息
 */
function getRetirementAge(birthYear, birthMonth, personType) {
  const table = RETIREMENT_AGE_TABLES[personType];

  if (!table) {
    throw new Error(`无效的人员类型: ${personType}`);
  }

  // 检查是否已退休
  if (birthYear < table.earlyRetiredBefore) {
    return {
      status: 'retired',
      message: '已退休',
      retireYear: null,
      retireMonth: null,
      displayAge: '已退休',
    };
  }

  // 检查是否属于统一退休年龄
  if (birthYear >= table.unifiedAfter.year) {
    const code = table.unifiedAfter.code;
    const { years, months } = parseRetirementCode(code);

    // 计算退休年月：出生年月 + 退休年龄 + 1个月
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

  // 查询区间表
  const birthCode = toBirthCode(birthYear, birthMonth);

  for (const range of table.ranges) {
    if (birthCode >= range.start && birthCode <= range.end) {
      const { years, months } = parseRetirementCode(range.code);

      // 计算退休年月：出生年月 + 退休年龄 + 1个月
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

  // 如果没有找到匹配的区间
  throw new Error(`未找到出生日期 ${birthYear}-${birthMonth} 对应的退休年龄`);
}

/**
 * 获取法定退休年龄（包装函数，用于养老金计算）
 * @param {number} birthYear - 出生年
 * @param {number} birthMonth - 出生月 (1-12)
 * @param {string} gender - 性别（兼容参数，实际不使用）
 * @param {string} personType - 人员类型
 * @returns {object} - {retireYear, retireMonth}
 */
function getStatutoryRetirementAge(birthYear, birthMonth, gender, personType) {
  const result = getRetirementAge(birthYear, birthMonth, personType);

  if (result.status === 'retired') {
    throw new Error('该人员已达到退休年龄');
  }

  return {
    retireYear: result.retireYear,
    retireMonth: result.retireMonth,
  };
}

module.exports = {
  getRetirementAge,
  getStatutoryRetirementAge,
  RETIREMENT_AGE_TABLES,
};
