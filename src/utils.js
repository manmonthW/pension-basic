// 工具函数模块 - ES Module版本

/**
 * 格式化金额显示
 * @param {number} value - 金额
 * @returns {string} - 格式化后的金额字符串
 */
export function formatMoney(value) {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 格式化月数为年月显示
 * @param {number} months - 月数
 * @returns {string} - 格式化后的年月字符串
 */
export function formatMonths(months) {
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
