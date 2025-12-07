// 城市配置模块 - ES Module版本

// 城市配置
export const CITY_CONFIG = {
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

        unemploymentBase: 2286, // 失业金标准
        unemploymentCutoffMonth: 24, // 失业金最长期限
        subsidy4050: 669.58, // 4050补贴金额
    },
    // 可以在这里添加更多城市
};

// 计发月数表（N表）
export const N_TABLE = {
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
