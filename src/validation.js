// 表单验证模块 - ES Module版本

/**
 * 验证结果对象
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - 是否验证通过
 * @property {string} [message] - 错误信息
 * @property {string} [field] - 出错的字段名
 */

/**
 * 显示错误提示的模态框
 * @param {string} title - 标题
 * @param {string} message - 错误信息
 */
export function showErrorModal(title, message) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content">
      <div class="modal-header" style="background: linear-gradient(135deg, #ef4444, #f87171);">
        <h3 style="color: white;">⚠️ ${title}</h3>
        <button class="modal-close" onclick="this.closest('.custom-modal').remove()" style="color: white;">×</button>
      </div>
      <div class="modal-body">
        <p style="color: #374151; font-size: 1.05em; line-height: 1.6;">${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="this.closest('.custom-modal').remove()">知道了</button>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

/**
 * 显示成功提示的模态框
 * @param {string} title - 标题
 * @param {string} message - 信息
 */
export function showSuccessModal(title, message) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content">
      <div class="modal-header" style="background: linear-gradient(135deg, #10b981, #34d399);">
        <h3 style="color: white;">✓ ${title}</h3>
        <button class="modal-close" onclick="this.closest('.custom-modal').remove()" style="color: white;">×</button>
      </div>
      <div class="modal-body">
        <p style="color: #374151; font-size: 1.05em; line-height: 1.6;">${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="this.closest('.custom-modal').remove()">好的</button>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

/**
 * 验证出生年份
 * @param {number} birthYear - 出生年份
 * @returns {ValidationResult}
 */
export function validateBirthYear(birthYear) {
    const currentYear = new Date().getFullYear();

    if (!birthYear || isNaN(birthYear)) {
        return { valid: false, message: '请填写出生年份', field: 'birthYear' };
    }

    if (birthYear < 1940) {
        return { valid: false, message: '出生年份不能早于1940年', field: 'birthYear' };
    }

    if (birthYear > currentYear - 16) {
        return { valid: false, message: `出生年份不能晚于${currentYear - 16}年（需满16周岁）`, field: 'birthYear' };
    }

    return { valid: true };
}

/**
 * 验证出生月份
 * @param {number} birthMonth - 出生月份
 * @returns {ValidationResult}
 */
export function validateBirthMonth(birthMonth) {
    if (!birthMonth || isNaN(birthMonth)) {
        return { valid: false, message: '请选择出生月份', field: 'birthMonth' };
    }

    if (birthMonth < 1 || birthMonth > 12) {
        return { valid: false, message: '出生月份应在1-12之间', field: 'birthMonth' };
    }

    return { valid: true };
}

/**
 * 验证人员类型
 * @param {string} personType - 人员类型
 * @returns {ValidationResult}
 */
export function validatePersonType(personType) {
    const validTypes = ['male_worker', 'female_cadre', 'female_worker'];

    if (!personType) {
        return { valid: false, message: '请选择人员类型', field: 'personType' };
    }

    if (!validTypes.includes(personType)) {
        return { valid: false, message: '无效的人员类型', field: 'personType' };
    }

    return { valid: true };
}

/**
 * 验证已缴费月数
 * @param {number} histPaidMonths - 已缴费月数
 * @returns {ValidationResult}
 */
export function validateHistPaidMonths(histPaidMonths) {
    if (histPaidMonths === undefined || histPaidMonths === null || isNaN(histPaidMonths)) {
        return { valid: false, message: '请填写已累计缴费月数', field: 'histPaidMonths' };
    }

    if (histPaidMonths < 0) {
        return { valid: false, message: '缴费月数不能为负数', field: 'histPaidMonths' };
    }

    if (histPaidMonths > 600) {
        return { valid: false, message: '缴费月数不能超过600个月（50年）', field: 'histPaidMonths' };
    }

    if (!Number.isInteger(histPaidMonths)) {
        return { valid: false, message: '缴费月数必须是整数', field: 'histPaidMonths' };
    }

    return { valid: true };
}

/**
 * 验证历史平均缴费指数
 * @param {number} histAvgIndex - 历史平均缴费指数
 * @returns {ValidationResult}
 */
export function validateHistAvgIndex(histAvgIndex) {
    if (histAvgIndex === undefined || histAvgIndex === null || isNaN(histAvgIndex)) {
        return { valid: false, message: '请填写历史平均缴费指数', field: 'histAvgIndex' };
    }

    if (histAvgIndex < 0.4) {
        return {
            valid: false,
            message: '缴费指数过低（最低为0.6）。\n\n提示：缴费指数 = 您的缴费工资 ÷ 当年社平工资',
            field: 'histAvgIndex'
        };
    }

    if (histAvgIndex > 3.5) {
        return {
            valid: false,
            message: '缴费指数过高（最高为3.0）。\n\n提示：缴费指数 = 您的缴费工资 ÷ 当年社平工资',
            field: 'histAvgIndex'
        };
    }

    return { valid: true };
}

/**
 * 验证个人账户余额
 * @param {number} histPersonalAccount - 个人账户余额
 * @returns {ValidationResult}
 */
export function validateHistPersonalAccount(histPersonalAccount) {
    if (histPersonalAccount === undefined || histPersonalAccount === null || isNaN(histPersonalAccount)) {
        return { valid: false, message: '请填写个人账户余额', field: 'histPersonalAccount' };
    }

    if (histPersonalAccount < 0) {
        return { valid: false, message: '个人账户余额不能为负数', field: 'histPersonalAccount' };
    }

    if (histPersonalAccount > 10000000) {
        return { valid: false, message: '个人账户余额请检查是否正确（超出合理范围）', field: 'histPersonalAccount' };
    }

    return { valid: true };
}

/**
 * 综合验证所有表单字段
 * @param {Object} formData - 表单数据
 * @returns {ValidationResult}
 */
export function validateFormData(formData) {
    const validators = [
        () => validatePersonType(formData.personType),
        () => validateBirthYear(formData.birthYear),
        () => validateBirthMonth(formData.birthMonth),
        () => validateHistPaidMonths(formData.histPaidMonths),
        () => validateHistAvgIndex(formData.histAvgIndex),
        () => validateHistPersonalAccount(formData.histPersonalAccount),
    ];

    for (const validate of validators) {
        const result = validate();
        if (!result.valid) {
            return result;
        }
    }

    return { valid: true };
}

/**
 * 验证退休年龄查询的基本字段
 * @param {Object} formData - 表单数据
 * @returns {ValidationResult}
 */
export function validateRetirementQuery(formData) {
    const validators = [
        () => validatePersonType(formData.personType),
        () => validateBirthYear(formData.birthYear),
        () => validateBirthMonth(formData.birthMonth),
    ];

    for (const validate of validators) {
        const result = validate();
        if (!result.valid) {
            return result;
        }
    }

    return { valid: true };
}
