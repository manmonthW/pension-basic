// 显示缴费指数帮助信息
console.log('main.js 已加载');
function showIndexHelp() {
  const message = `缴费指数 = 您当年缴费工资 ÷ 当年社平工资

大多数人可以按以下经验估算：

• 最低基数缴费（灵活就业常见）
  → 0.6–0.7

• 普通就业、工资接近社平
  → 0.8–1.1

• 中高收入、工资明显高于社平
  → 1.2–1.8

• 高收入长期封顶缴费
  → 2.0–3.0

只要大致接近即可，对测算影响有限。`;

  // 创建自定义模态框
  const modal = document.createElement('div');
  modal.className = 'custom-modal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>历史平均缴费指数说明</h3>
        <button class="modal-close" onclick="this.closest('.custom-modal').remove()">×</button>
      </div>
      <div class="modal-body">
        <p style="white-space: pre-line;">${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="this.closest('.custom-modal').remove()">知道了</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // 添加淡入动画
  setTimeout(() => modal.classList.add('show'), 10);
}

// 主交互逻辑

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('pensionForm');
  const checkRetirementBtn = document.getElementById('checkRetirementBtn');
  const retirementResult = document.getElementById('retirementResult');
  const retirementInfo = document.getElementById('retirementInfo');
  const resultsSection = document.getElementById('resultsSection');

  // 显示错误提示模态框
  function showErrorModal(title, message) {
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
          <p style="color: #374151; font-size: 1.05em; line-height: 1.6; white-space: pre-line;">${message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="this.closest('.custom-modal').remove()">知道了</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
  }

  // 验证基本信息
  function validateBasicInfo() {
    const personType = document.getElementById('personType').value;
    const birthYear = parseInt(document.getElementById('birthYear').value);
    const birthMonth = parseInt(document.getElementById('birthMonth').value);
    const currentYear = new Date().getFullYear();

    if (!personType) {
      showErrorModal('输入错误', '请选择人员类型');
      return null;
    }

    if (!birthYear || isNaN(birthYear)) {
      showErrorModal('输入错误', '请填写出生年份');
      return null;
    }

    if (birthYear < 1940) {
      showErrorModal('输入错误', '出生年份不能早于1940年');
      return null;
    }

    if (birthYear > currentYear - 16) {
      showErrorModal('输入错误', `出生年份不能晚于${currentYear - 16}年（需满16周岁）`);
      return null;
    }

    if (!birthMonth || isNaN(birthMonth)) {
      showErrorModal('输入错误', '请选择出生月份');
      return null;
    }

    return { personType, birthYear, birthMonth };
  }

  // 验证历史缴费信息
  function validateHistoryInfo() {
    const histPaidMonths = parseInt(document.getElementById('histPaidMonths').value);
    const histAvgIndex = parseFloat(document.getElementById('histAvgIndex').value);
    const histPersonalAccount = parseFloat(document.getElementById('histPersonalAccount').value);

    if (isNaN(histPaidMonths)) {
      showErrorModal('输入错误', '请填写已累计缴费月数');
      return null;
    }

    if (histPaidMonths < 0) {
      showErrorModal('输入错误', '缴费月数不能为负数');
      return null;
    }

    if (histPaidMonths > 600) {
      showErrorModal('输入错误', '缴费月数不能超过600个月（50年）');
      return null;
    }

    if (isNaN(histAvgIndex)) {
      showErrorModal('输入错误', '请填写历史平均缴费指数');
      return null;
    }

    if (histAvgIndex < 0.4) {
      showErrorModal('输入错误', '缴费指数过低（最低为0.6）\n\n提示：缴费指数 = 您的缴费工资 ÷ 当年社平工资');
      return null;
    }

    if (histAvgIndex > 3.5) {
      showErrorModal('输入错误', '缴费指数过高（最高为3.0）\n\n提示：缴费指数 = 您的缴费工资 ÷ 当年社平工资');
      return null;
    }

    if (isNaN(histPersonalAccount)) {
      showErrorModal('输入错误', '请填写个人账户余额');
      return null;
    }

    if (histPersonalAccount < 0) {
      showErrorModal('输入错误', '个人账户余额不能为负数');
      return null;
    }

    if (histPersonalAccount > 10000000) {
      showErrorModal('输入错误', '个人账户余额请检查是否正确（超出合理范围）');
      return null;
    }

    return { histPaidMonths, histAvgIndex, histPersonalAccount };
  }

  // 查询退休年龄
  checkRetirementBtn.addEventListener('click', function () {
    console.log('查询退休年龄按钮被点击');
    const basicInfo = validateBasicInfo();
    console.log('基本信息验证结果:', basicInfo);
    if (!basicInfo) return;

    const { personType, birthYear, birthMonth } = basicInfo;
    console.log('准备计算退休年龄:', { personType, birthYear, birthMonth });

    try {
      const result = getRetirementAge(birthYear, birthMonth, personType);
      console.log('退休年龄计算结果:', result);

      let html = '';
      if (result.status === 'retired') {
        html = `
          <div class="info-item" style="background-color: #fff7e6; border-left-color: #faad14;">
            <div class="label">退休状态</div>
            <div class="value" style="color: #faad14;">${result.displayAge}</div>
          </div>
        `;
      } else {
        html = `
          <div class="info-item">
            <div class="label">法定退休年龄</div>
            <div class="value">${result.displayAge}</div>
          </div>
          <div class="info-item">
            <div class="label">预计退休时间</div>
            <div class="value">${result.retireYear}年${result.retireMonth}月</div>
          </div>
        `;
      }

      retirementInfo.innerHTML = html;
      retirementResult.style.display = 'block';
      retirementResult.classList.add('fade-in');
    } catch (error) {
      showErrorModal('查询失败', error.message);
    }
  });

  // 计算养老金方案
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // 验证基本信息
    const basicInfo = validateBasicInfo();
    if (!basicInfo) return;

    // 验证历史缴费信息
    const historyInfo = validateHistoryInfo();
    if (!historyInfo) return;

    // 获取表单数据
    const cityName = document.getElementById('citySelect').value;
    const { personType, birthYear, birthMonth } = basicInfo;
    const { histPaidMonths, histAvgIndex, histPersonalAccount } = historyInfo;

    // 获取当前日期
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // 获取选中城市配置
    const config = CITY_CONFIG[cityName];

    // 创建4档缴费基数：60%, 100%, 200%, 300%
    const payBaseOptions = [
      config.baseMin, // 60%档
      config.avgSalary, // 100%档
      Math.round(config.avgSalary * 2.0), // 200%档
      config.baseMax, // 300%档
    ];

    // 构建输入参数（灵活就业人员）
    const input = {
      personType: personType,
      birthYear: birthYear,
      birthMonth: birthMonth,
      currentYear: currentYear,
      currentMonth: currentMonth,
      histPaidMonths: histPaidMonths,
      histAvgIndex: histAvgIndex,
      histPersonalAccount: histPersonalAccount,
      lastYearAvgWage: config.avgSalary,
      payBaseOptions: payBaseOptions,
      personalRate: config.flexibleEmploymentRate, // 灵活就业20%
      employerRate: 0, // 灵活就业无单位缴费
      personalToAccountRate: config.personalAccountRate, // 8%计入个人账户
      basicAccrualRate: 0.01,
      accountInterestRate: config.pensionInterestRate,
      wageGrowthRate: 0.05,
    };

    try {
      // 计算养老金方案
      const result = simulatePensionPlans(input);

      // 显示结果
      displayResults(result);

      // 滚动到结果区域
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      showErrorModal('计算失败', error.message);
      console.error(error);
    }
  });

  // 重置表单
  form.addEventListener('reset', function () {
    retirementResult.style.display = 'none';
    resultsSection.style.display = 'none';
  });
});

// 显示计算结果
function displayResults(result) {
  const resultsSection = document.getElementById('resultsSection');
  const retireInfoDisplay = document.getElementById('retireInfoDisplay');
  const plansComparison = document.getElementById('plansComparison');
  const recommendations = document.getElementById('recommendations');

  // 显示退休信息
  const retireInfo = result.retireInfo;
  retireInfoDisplay.innerHTML = `
    <div class="info-item">
      <div class="label">法定退休年龄</div>
      <div class="value">${retireInfo.displayAge}</div>
    </div>
    <div class="info-item">
      <div class="label">退休时间</div>
      <div class="value">${retireInfo.retireYear}年${retireInfo.retireMonth}月</div>
    </div>
    <div class="info-item">
      <div class="label">剩余缴费时间</div>
      <div class="value">${formatMonths(retireInfo.monthsToRetire)}</div>
    </div>
    <div class="info-item">
      <div class="label">计发月数(N)</div>
      <div class="value">${retireInfo.N}个月</div>
    </div>
  `;

  // 显示方案对比
  const planNames = ['基础档(60%)', '标准档(100%)', '进阶档(200%)', '尊享档(300%)'];
  let plansHTML = '';

  result.plans.forEach((plan, index) => {
    const isRecommended =
      plan.planId === result.bestByPayback.planId ||
      plan.planId === result.bestByPension.planId;

    plansHTML += `
      <div class="plan-card ${isRecommended ? 'recommended' : ''} fade-in" style="animation-delay: ${index * 0.1}s;">
        <div class="plan-header">
          <div class="plan-title">${planNames[index]}</div>
          <div class="plan-base">缴费基数: ${formatMoney(plan.monthlyBase)}元/月</div>
        </div>
        <div class="plan-details">
          <div class="plan-detail-item">
            <span class="label">每月个人缴费</span>
            <span class="value">${formatMoney(plan.personalPayPerMonth)}元</span>
          </div>
          <div class="plan-detail-item">
            <span class="label">个人总缴费</span>
            <span class="value">${formatMoney(plan.totalPersonalPay)}元</span>
          </div>
          <div class="plan-detail-item">
            <span class="label">累计缴费年限</span>
            <span class="value">${plan.totalPaidYears.toFixed(2)}年</span>
          </div>
          <div class="plan-detail-item">
            <span class="label">个人账户余额</span>
            <span class="value">${formatMoney(plan.finalPersonalAccount)}元</span>
          </div>
          <div class="plan-detail-item" style="border-top: 2px solid #1890ff; margin-top: 8px; padding-top: 12px;">
            <span class="label"><strong>预计月养老金</strong></span>
            <span class="value highlight">${formatMoney(plan.monthlyPension)}元</span>
          </div>
          <div class="plan-detail-item">
            <span class="label">└ 基础养老金</span>
            <span class="value">${formatMoney(plan.basicPensionPart)}元</span>
          </div>
          <div class="plan-detail-item">
            <span class="label">└ 个人账户养老金</span>
            <span class="value">${formatMoney(plan.accountPensionPart)}元</span>
          </div>
          ${plan.planId > 1
        ? `
          <div class="plan-detail-item" style="margin-top: 8px; background-color: #f0f9ff; padding: 8px; border-radius: 4px;">
            <span class="label">相比低档多缴</span>
            <span class="value negative">${formatMoney(plan.deltaPersonalPayVsPlan1)}元</span>
          </div>
          <div class="plan-detail-item" style="background-color: #f0f9ff; padding: 8px; border-radius: 4px;">
            <span class="label">每月多领</span>
            <span class="value positive">${formatMoney(plan.deltaMonthlyPensionVsPlan1)}元</span>
          </div>
          <div class="plan-detail-item" style="background-color: #f0f9ff; padding: 8px; border-radius: 4px;">
            <span class="label">回本时间</span>
            <span class="value">${plan.paybackMonthsVsPlan1 === Infinity ? '无法回本' : formatMonths(Math.ceil(plan.paybackMonthsVsPlan1))}</span>
          </div>
          `
        : ''
      }
        </div>
      </div>
    `;
  });

  plansComparison.innerHTML = plansHTML;

  // 显示推荐方案
  const bestPaybackPlan = result.plans.find(
    (p) => p.planId === result.bestByPayback.planId
  );
  const bestPensionPlan = result.plans.find(
    (p) => p.planId === result.bestByPension.planId
  );

  recommendations.innerHTML = `
    <div class="recommendation-card fade-in">
      <h3>回本最快方案</h3>
      <div class="rec-value">${planNames[bestPaybackPlan.planId - 1]}</div>
      <p>月养老金: <strong>${formatMoney(bestPaybackPlan.monthlyPension)}元</strong></p>
      ${bestPaybackPlan.planId > 1
      ? `<p>回本时间: <strong>${formatMonths(Math.ceil(bestPaybackPlan.paybackMonthsVsPlan1))}</strong></p>`
      : '<p>基准方案</p>'
    }
    </div>
    <div class="recommendation-card fade-in" style="animation-delay: 0.2s;">
      <h3>养老金最高方案</h3>
      <div class="rec-value">${planNames[bestPensionPlan.planId - 1]}</div>
      <p>月养老金: <strong>${formatMoney(bestPensionPlan.monthlyPension)}元</strong></p>
      <p>比低档多领: <strong>${formatMoney(bestPensionPlan.deltaMonthlyPensionVsPlan1)}元/月</strong></p>
    </div>
  `;

  // 显示汇总数据
  displaySummary(result);

  // 显示公式说明
  displayFormula(result);

  // 显示结果区域
  resultsSection.style.display = 'block';
}

// 显示汇总数据
function displaySummary(result) {
  const summarySection = document.getElementById('summarySection');
  const planNames = ['基础档(60%)', '标准档(100%)', '进阶档(200%)', '尊享档(300%)'];

  let summaryHTML = `
    <div class="summary-container">
      <!-- 对比图表 -->
      <div class="chart-section">
        <h3>📈 四档方案对比一览</h3>
        <div class="comparison-charts">
          <!-- 月缴费对比 -->
          <div class="chart-item">
            <h4>每月缴费对比</h4>
            <div class="bar-chart">
  `;

  // 月缴费柱状图
  const maxPay = Math.max(...result.plans.map(p => p.personalPayPerMonth));
  result.plans.forEach((plan, index) => {
    const percentage = (plan.personalPayPerMonth / maxPay) * 100;
    summaryHTML += `
      <div class="bar-item">
        <div class="bar-label">${planNames[index]}</div>
        <div class="bar-wrapper">
          <div class="bar" style="width: ${percentage}%">
            <span class="bar-value">${formatMoney(plan.personalPayPerMonth)}元</span>
          </div>
        </div>
      </div>
    `;
  });

  summaryHTML += `
            </div>
          </div>

          <!-- 月养老金对比 -->
          <div class="chart-item">
            <h4>退休月养老金对比</h4>
            <div class="bar-chart">
  `;

  const maxPension = Math.max(...result.plans.map(p => p.monthlyPension));
  result.plans.forEach((plan, index) => {
    const percentage = (plan.monthlyPension / maxPension) * 100;
    summaryHTML += `
      <div class="bar-item">
        <div class="bar-label">${planNames[index]}</div>
        <div class="bar-wrapper">
          <div class="bar pension" style="width: ${percentage}%">
            <span class="bar-value">${formatMoney(plan.monthlyPension)}元</span>
          </div>
        </div>
      </div>
    `;
  });

  summaryHTML += `
            </div>
          </div>
        </div>
      </div>

      <!-- 养老金构成饼图 -->
      <div class="pension-structure-section">
        <h3>💰 养老金构成分析（选择方案查看）</h3>
        <div class="structure-grid">
  `;

  result.plans.forEach((plan, index) => {
    const basicRatio = (plan.basicPensionPart / plan.monthlyPension * 100).toFixed(2);
    const accountRatio = (plan.accountPensionPart / plan.monthlyPension * 100).toFixed(2);

    summaryHTML += `
      <div class="structure-card">
        <h4>${planNames[index]}</h4>
        <div class="pie-chart-container">
          <svg viewBox="0 0 200 200" class="pie-chart">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#4f46e5"
                    stroke-width="60"
                    stroke-dasharray="${basicRatio * 5.027} 502.7"
                    transform="rotate(-90 100 100)" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981"
                    stroke-width="60"
                    stroke-dasharray="${accountRatio * 5.027} 502.7"
                    stroke-dashoffset="${-basicRatio * 5.027}"
                    transform="rotate(-90 100 100)" />
          </svg>
          <div class="pie-legend">
            <div class="legend-item">
              <span class="legend-color" style="background: #4f46e5;"></span>
              <span>基础养老金: ${basicRatio}%</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #10b981;"></span>
              <span>个人账户: ${accountRatio}%</span>
            </div>
          </div>
        </div>
        <div class="structure-details">
          <div class="detail-row">
            <span>基础养老金:</span>
            <strong>${formatMoney(plan.basicPensionPart)}元</strong>
          </div>
          <div class="detail-row">
            <span>个人账户:</span>
            <strong>${formatMoney(plan.accountPensionPart)}元</strong>
          </div>
          <div class="detail-row total">
            <span>合计:</span>
            <strong>${formatMoney(plan.monthlyPension)}元/月</strong>
          </div>
        </div>
      </div>
    `;
  });

  summaryHTML += `
        </div>
      </div>

      <!-- 核心数据总览 -->
      <div class="key-data-section">
        <h3>🔑 核心数据总览</h3>
        <div class="key-data-table">
          <table>
            <thead>
              <tr>
                <th>对比项</th>
                <th>基础档(60%)</th>
                <th>标准档(100%)</th>
                <th>进阶档(200%)</th>
                <th>尊享档(300%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>月缴费基数</td>
                ${result.plans.map(p => `<td>${formatMoney(p.monthlyBase)}元</td>`).join('')}
              </tr>
              <tr class="highlight">
                <td>月个人缴费(20%)</td>
                ${result.plans.map(p => `<td><strong>${formatMoney(p.personalPayPerMonth)}元</strong></td>`).join('')}
              </tr>
              <tr>
                <td>未来总缴费</td>
                ${result.plans.map(p => `<td>${formatMoney(p.totalPersonalPay)}元</td>`).join('')}
              </tr>
              <tr>
                <td>退休时账户余额</td>
                ${result.plans.map(p => `<td>${formatMoney(p.finalPersonalAccount)}元</td>`).join('')}
              </tr>
              <tr class="highlight">
                <td>预计月养老金</td>
                ${result.plans.map(p => `<td><strong class="pension-value">${formatMoney(p.monthlyPension)}元</strong></td>`).join('')}
              </tr>
              <tr>
                <td>└ 基础养老金</td>
                ${result.plans.map(p => `<td>${formatMoney(p.basicPensionPart)}元</td>`).join('')}
              </tr>
              <tr>
                <td>└ 个人账户养老金</td>
                ${result.plans.map(p => `<td>${formatMoney(p.accountPensionPart)}元</td>`).join('')}
              </tr>
              <tr>
                <td>相比基础档多缴</td>
                <td>-</td>
                ${result.plans.slice(1).map(p => `<td class="negative">${formatMoney(p.deltaPersonalPayVsPlan1)}元</td>`).join('')}
              </tr>
              <tr>
                <td>每月多领</td>
                <td>-</td>
                ${result.plans.slice(1).map(p => `<td class="positive">${formatMoney(p.deltaMonthlyPensionVsPlan1)}元</td>`).join('')}
              </tr>
              <tr class="highlight">
                <td>回本时间</td>
                <td>-</td>
                ${result.plans.slice(1).map(p => `<td><strong>${formatMonths(Math.ceil(p.paybackMonthsVsPlan1))}</strong></td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  summarySection.innerHTML = summaryHTML;
}

// 显示公式说明
function displayFormula(result) {
  const formulaSection = document.getElementById('formulaSection');
  const retireInfo = result.retireInfo;

  const formulaHTML = `
    <div class="formula-container">
      <div class="formula-main">
        <h3>养老金计算总公式</h3>
        <div class="formula-box primary">
          <div class="formula-title">月养老金 =</div>
          <div class="formula-content">
            <span class="formula-part">基础养老金</span>
            <span class="formula-operator">+</span>
            <span class="formula-part">个人账户养老金</span>
          </div>
        </div>
      </div>

      <div class="formula-details">
        <div class="formula-section">
          <h4>1️⃣ 基础养老金计算</h4>
          <div class="formula-box">
            <div class="formula-content">
              基础养老金 = <strong>(全市上年在岗职工月平均工资 + 本人指数化月平均缴费工资)</strong> ÷ 2 × <strong>缴费年限</strong> × 1%
            </div>
          </div>
          <div class="formula-notes">
            <div class="note-item">
              <span class="note-label">其中：</span>
              <ul>
                <li>全市上年平均工资 = <strong>12,049元</strong>（北京2025年标准）</li>
                <li>本人指数化工资 = <strong>平均缴费指数 × 社平工资</strong></li>
                <li>缴费年限 = 您的累计缴费月数 ÷ 12</li>
              </ul>
            </div>
            <div class="index-explanation-compact" style="margin-top: 16px;">
              <div class="note-label" style="font-weight: bold; color: #92400e; margin-bottom: 12px;">📊 历史平均缴费指数计算方法</div>
              <div class="explanation-row">
                <span class="explanation-label">基本公式</span>
                <span class="explanation-value">缴费指数 = 您的缴费工资 ÷ 当年社平工资</span>
              </div>
              <div class="explanation-row">
                <span class="explanation-label">历年不同</span>
                <span class="explanation-value">平均指数 = Σ(每年指数×缴费月数) ÷ 总月数</span>
              </div>
              <div class="explanation-divider"></div>
              <div class="explanation-tag">💡 经验值参考</div>
              <div class="explanation-grid">
                <div class="explanation-item">
                  <div class="item-range">0.6-0.7</div>
                  <div class="item-desc">最低基数</div>
                </div>
                <div class="explanation-item">
                  <div class="item-range">0.8-1.1</div>
                  <div class="item-desc">普通工资</div>
                </div>
                <div class="explanation-item">
                  <div class="item-range">1.2-1.8</div>
                  <div class="item-desc">中高收入</div>
                </div>
                <div class="explanation-item">
                  <div class="item-range">2.0-3.0</div>
                  <div class="item-desc">封顶缴费</div>
                </div>
              </div>
              <div class="explanation-footer">⚠️ 大致接近即可，对测算影响有限</div>
            </div>
          </div>
        </div>

        <div class="formula-section">
          <h4>2️⃣ 个人账户养老金计算</h4>
          <div class="formula-box">
            <div class="formula-content">
              个人账户养老金 = <strong>退休时个人账户余额</strong> ÷ <strong>计发月数(N)</strong>
            </div>
          </div>
          <div class="formula-notes">
            <div class="note-item">
              <span class="note-label">其中：</span>
              <ul>
                <li>个人账户余额 = 历史余额 + 未来缴费×8% + 利息</li>
                <li>计发月数(N) = <strong>${retireInfo.N}个月</strong>（${retireInfo.displayAge}退休对应）</li>
                <li>灵活就业人员：月缴费×8%计入个人账户</li>
                <li>账户年利率：<strong>1.5%</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="formula-section">
          <h4>3️⃣ 灵活就业人员缴费标准</h4>
          <div class="formula-box highlight-box">
            <div class="formula-content">
              <div class="fee-structure">
                <div class="fee-item">
                  <div class="fee-label">个人总缴费</div>
                  <div class="fee-value">缴费基数 × <strong>20%</strong></div>
                </div>
                <div class="fee-arrow">→</div>
                <div class="fee-split">
                  <div class="fee-sub-item">
                    <span class="fee-percent">8%</span>
                    <span class="fee-desc">计入个人账户</span>
                  </div>
                  <div class="fee-sub-item">
                    <span class="fee-percent">12%</span>
                    <span class="fee-desc">进入统筹账户</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="formula-notes">
            <div class="note-item warning">
              <span class="note-label">⚠️ 注意：</span>
              <p>灵活就业人员需自己承担全部20%的缴费，其中只有8%计入个人账户，12%进入统筹账户用于支付当期退休人员的养老金。</p>
            </div>
          </div>
        </div>

        <div class="formula-section">
          <h4>4️⃣ 您的具体参数</h4>
          <div class="param-grid">
            <div class="param-item">
              <div class="param-label">退休年龄</div>
              <div class="param-value">${retireInfo.displayAge}</div>
            </div>
            <div class="param-item">
              <div class="param-label">退休时间</div>
              <div class="param-value">${retireInfo.retireYear}年${retireInfo.retireMonth}月</div>
            </div>
            <div class="param-item">
              <div class="param-label">剩余缴费</div>
              <div class="param-value">${formatMonths(retireInfo.monthsToRetire)}</div>
            </div>
            <div class="param-item">
              <div class="param-label">计发月数(N)</div>
              <div class="param-value">${retireInfo.N}个月</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  formulaSection.innerHTML = formulaHTML;
}
