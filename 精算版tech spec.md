

# 🚀 **《养老金测算应用 纯前端版·技术规格说明书（Tech Spec）》**

版本：v1.0
适配架构：Web SPA / 微信小程序（通用前端规则）
开发模式：**100% 纯前端，无服务端依赖**
城市政策：配置化，可热插拔扩展其它城市
缴费档位：**60% / 100% / 200% / 300%**

---

---

# **1. 系统目标与约束**

## 1.1 目标

开发一个可在浏览器或小程序端运行的 **养老金模拟测算工具**，实现：

* 用户输入个人信息（出生年月、性别、人员类型）
* 城市政策参数自动加载（缴费基数、缴费比例、补贴、失业金等）
* 计算未来缴费期间的累计缴费金额
* 根据政策公式计算退休金（月金额）
* 输出四个方案（60/100/200/300%）的对比数据
* 展示回本周期
* 提供带“？”的字段帮助文案

## 1.2 关键约束

* **禁止使用后端服务**，所有逻辑由前端执行。
* 城市数据 **不能硬编码在算法中**，必须依赖 `cityConfig`。
* 所有计算公式必须 **与 Excel 表格保持一致**。
* 算法必须对不同城市的数据自动适配。

---

---

# **2. 功能模块结构**

```
src/
  config/
    cities.ts            # 城市政策配置（北京+扩展）
    nTable.ts            # 计发月数 N 表
    fieldHelp.ts         # “?”提示文案
  models/
    city.ts
    userInput.ts
    scenario.ts
    pensionResult.ts
  services/
    retirementAge.ts     # 退休年龄推算
    pensionCalculator.ts # 养老金计算核心
    validators.ts        # 输入校验
  pages/
    PensionEstimator.tsx # 主页面
  components/
    FieldWithHelp.tsx
    CitySelector.tsx
    ScenarioCard.tsx
    ResultTable.tsx
  utils/
    date.ts
    format.ts
```

---

---

# **3. 数据结构规范（必须严格遵守）**

## 3.1 城市政策配置（config/cities.ts）

```ts
export interface YearlyPolicy {
  year: number;
  baseA: number;           // 缴费基数 A
  retirementBaseB: number; // 退休金核算基数 B
  unemployment: number;    // 失业金 D
}

export interface PensionRates {
  employer: number;        // 单位缴费比例（如 15%）
  employee: number;        // 个人缴费比例（如 8%）
  personalAccount: number; // 进入个人账户比例（与 employee 相同）
}

export interface ContributionBand {
  id: string;        // "60" | "100" | "200" | "300"
  label: string;     // "60% 档" 等
  factor: number;    // 0.6 | 1.0 | 2.0 | 3.0
  defaultEnabled: boolean;
}

export interface CityConfig {
  id: string;
  name: string;
  yearly: YearlyPolicy[];
  pensionRates: PensionRates;
  bands: ContributionBand[];
  subsidy4050: {
    full: number;              // 第一年度补贴金额
    secondYearFactor: number;  // 第二年补贴比例（如 0.6）
  };
  retirementRulesId: string;    // 引用退休规则
}
```

## 3.2 北京市配置示例（必须提供）

```ts
export const CITIES: CityConfig[] = [
  {
    id: "beijing",
    name: "北京市",
    yearly: [
      { year: 2025, baseA: 11937, retirementBaseB: 12049, unemployment: 2693 },
      { year: 2024, baseA: 11761, retirementBaseB: 11820, unemployment: 2574 },
      { year: 2023, baseA: 11394, retirementBaseB: 11490, unemployment: 2454 },
      // …可继续补齐
    ],
    pensionRates: {
      employer: 0.15,
      employee: 0.08,
      personalAccount: 0.08,
    },
    bands: [
      { id: "60",  label: "60% 档",  factor: 0.6, defaultEnabled: true },
      { id: "100", label: "100% 档", factor: 1.0, defaultEnabled: true },
      { id: "200", label: "200% 档", factor: 2.0, defaultEnabled: true },
      { id: "300", label: "300% 档", factor: 3.0, defaultEnabled: true },
    ],
    subsidy4050: {
      full: 1375,
      secondYearFactor: 0.6,
    },
    retirementRulesId: "china_default_2025"
  }
];
```

---

---

# **4. 用户输入（UI 表单）规范**

所有字段附带 "?" 帮助按钮，说明文字来源于 `fieldHelp.ts`

## 4.1 输入字段列表（必须实现）

| 字段         | 数据类型              | 控件         | 必填 | 说明          |
| ---------- | ----------------- | ---------- | -- | ----------- |
| 城市         | string            | 下拉框        | ✓  | 默认北京        |
| 性别         | "male" / "female" | 单选         | ✓  | 用于退休年龄      |
| 人员类型       | 枚举                | 下拉         | ✓  | 男职工、女干部、女工人 |
| 出生年月       | {year,month}      | 年-月 Picker | ✓  | 1965–当前     |
| 失业金是否领取    | boolean           | 单选         | ✓  | 控制相关字段展示    |
| 领取月数       | number (0–24)     | 输入框        | 可选 | 校验最大 24     |
| 是否享受4050补贴 | boolean           | 单选         | ✓  | 控制展示        |
| 补贴月数       | number (0–24)     | 输入框        | 可选 | 分第一年+第二年    |

---

---

# **5. 退休年龄与计发月数（N 表）**

## 5.1 人员类型 → 法定退休年龄

规则 ID：`china_default_2025`

```ts
export interface RetirementRule {
  personType: "male" | "female_cadre" | "female_worker";
  legalAge: { years: number; months: number };
  maxDelayYears: number;
}
```

规则示例：

```ts
china_default_2025 = [
  { personType: "male",           legalAge: { years: 60, months: 0 }, maxDelayYears: 3 },
  { personType: "female_cadre",   legalAge: { years: 55, months: 0 }, maxDelayYears: 3 },
  { personType: "female_worker",  legalAge: { years: 50, months: 0 }, maxDelayYears: 3 },
]
```

---

## 5.2 计发月数表 N （按国家统一 N 表）

文件：`config/nTable.ts`

示例：

```ts
export const N_TABLE = [
  { age: 50, N: 195 },
  { age: 51, N: 187 },
  { age: 52, N: 179 },
  ...
  { age: 60, N: 139 },
  ...
];
```

查询函数：

```ts
lookupN(age: number): number
```

---

---

# **6. 养老金计算核心（完全按 Excel 公式）**

核心计算文件：`services/pensionCalculator.ts`

## 6.1 输入结构

```ts
interface PensionCalcInput {
  city: CityConfig;
  user: UserInput; 
  band: ContributionBand;
  retirementInfo: {
    retireAgeYears: number;
    retireAgeMonths: number;
    monthsToRetire: number;
    N: number;
  };
}
```

## 6.2 输出结构

```ts
interface PensionCalcResult {
  bandId: string;
  bandLabel: string;

  monthlyBase: number;
  monthlyPersonal: number;
  monthlyEmployer: number;

  totalPersonal: number;
  totalEmployer: number;

  basePension: number;
  accountPension: number;
  totalPension: number;

  unemploymentIncome: number;
  subsidyIncome: number;

  paybackMonths: number;
}
```

---

---

# **7. 公式（严格保持 Excel 原始结构）**

## 7.1 缴费基数（方案档位）

```
monthlyBase = A * band.factor
```

## 7.2 每月缴费金额

```
monthlyPersonal = monthlyBase * employeeRate
monthlyEmployer = monthlyBase * employerRate
```

## 7.3 累计缴费金额

```
totalPersonal = monthlyPersonal * monthsToRetire
totalEmployer = monthlyEmployer * monthsToRetire
```

## 7.4 个人账户累计 C

**按 Excel：**

```
C = monthsToRetire * monthlyBase * personalAccountRate
```

## 7.5 基础养老金（保持 Excel 原表达式）

```
基础养老金 = B * (Y*100% + X*300% + (V1-5)*60% + 2*60% + (V1-5-2)*60%) / N
```

> 注：X, Y, V1 完全按你 Excel 对应字段实现
> 不能私自更改变量定义

## 7.6 个人账户养老金

```
accountPension = C / N
```

## 7.7 退休金总额

```
totalPension = basePension + accountPension
```

## 7.8 回本周期

```
paybackMonths = totalPersonal / totalPension
```

---

---

# **8. 前端交互与状态机**

## 状态机字段（全局）

```ts
{
  selectedCity: CityConfig,
  userInput: UserInput,
  scenarioStates: { "60": true, "100": true, "200": true, "300": true },
  pensionResults: PensionCalcResult[]
}
```

---

---

# **9. UI 组件接口规范**

## 9.1 带提示的输入组件（FieldWithHelp）

```ts
interface FieldWithHelpProps {
  label: string;
  modelKey: string;
  value: any;
  onChange: (value: any) => void;
  helpKey: string; 
}
```

点击 “?” → 弹窗读取 `fieldHelp.ts`：

```ts
FIELD_HELP[helpKey] = { title, content }
```

---

---

# **10. 性能要求**

* 所有计算均在毫秒级完成，低复杂度 O(n)
* 不允许出现明显卡顿（须避免 useEffect 死循环）
* N 表、城市配置必须提前加载到静态资源（import），不能运行时请求

---

---

# **11. 城市扩展规范（必须支持）**

新增城市只需：

1. 在 `cities.ts` 新增一个 CityConfig 项
2. 添加该城市的 retirementRulesId（如相同可复用）
3. 添加该城市的历史缴费基数
4. 无需修改任何算法代码

算法必须完全由配置驱动。

---

---

# **12. QA 测试案例（必须覆盖）**

### Case 1

性别：女
人员类型：女工人
出生：1980-06
城市：北京
档位：60%
验证结果必须与 Excel 结果误差 < ±0.05%

### Case 2

性别：男
出生：1970-03
档位：300%
验证基数 / N 值 / 回本周期一致

### Case 3

带失业金 + 带 4050 补贴
验证失业金与补贴累计金额显示正确

---

