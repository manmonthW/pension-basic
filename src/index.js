// 主入口文件 - ES Module版本
// 统一导出所有模块，供浏览器使用

export { CITY_CONFIG, N_TABLE } from './cityConfig.js';
export {
    RETIREMENT_AGE_TABLES,
    getRetirementAge,
    getStatutoryRetirementAge,
    toBirthCode,
    parseRetirementCode
} from './retirementAge.js';
export {
    simulatePensionPlans,
    createPayBaseOptions,
    monthsBetween,
    yearsFromMonths,
    getNFromTable
} from './pensionCalculator.js';
export {
    validateFormData,
    validateRetirementQuery,
    validateBirthYear,
    validateBirthMonth,
    validatePersonType,
    validateHistPaidMonths,
    validateHistAvgIndex,
    validateHistPersonalAccount,
    showErrorModal,
    showSuccessModal
} from './validation.js';
export { formatMoney, formatMonths } from './utils.js';
