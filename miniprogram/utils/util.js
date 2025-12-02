/**
 * 格式化金额（添加千分位）
 */
function formatMoney(money) {
  if (money === null || money === undefined) return '0';
  return parseFloat(money).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 格式化月数为年月
 */
function formatMonths(months) {
  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);

  if (years === 0) {
    return `${remainingMonths}个月`;
  } else if (remainingMonths === 0) {
    return `${years}年`;
  } else {
    return `${years}年${remainingMonths}个月`;
  }
}

/**
 * 获取当前年月
 */
function getCurrentYearMonth() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1
  };
}

/**
 * 计算两个年月之间的月数差
 */
function monthsBetween(year1, month1, year2, month2) {
  return (year2 - year1) * 12 + (month2 - month1);
}

/**
 * 显示加载提示
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title: title,
    mask: true
  });
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示成功提示
 */
function showSuccess(title = '操作成功') {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: 2000
  });
}

/**
 * 显示错误提示
 */
function showError(title = '操作失败') {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  });
}

/**
 * 显示确认对话框
 */
function showConfirm(content, title = '提示') {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title,
      content: content,
      success(res) {
        if (res.confirm) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail() {
        reject(new Error('对话框显示失败'));
      }
    });
  });
}

module.exports = {
  formatMoney,
  formatMonths,
  getCurrentYearMonth,
  monthsBetween,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showConfirm
};
