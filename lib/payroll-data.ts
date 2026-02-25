// ===== Types =====

export type PayrollStatus = "未集計" | "集計済み・未承認" | "社長承認待ち" | "承認済み・確定"

export type WorkflowStep = 1 | 2 | 3 | 4

export interface PayrollWorker {
  id: string
  workerNo: number
  name: string
  workDays: number
  hours: number
  basePay: number
  overtime: number
  transport: number
  payTotal: number
  incomeTax: number
  socialInsurance: number
  residentTax: number
  advance: number
  otherDeduction: number
  deductionTotal: number
  netPay: number
  editedFields: Set<string>
}

export interface PayrollWorkerDetail {
  workerNo: number
  name: string
  employeeType: string
  nearestStation: string
  assignments: PayrollAssignment[]
  payBreakdown: PayBreakdown
  deductionBreakdown: DeductionBreakdown
  notes: string
}

export interface PayrollAssignment {
  workDate: string
  orderNumber: string
  customerName: string
  siteName: string
  hours: number
  unitPrice: number
  transport: number
  dailyPay: number
}

export interface PayBreakdown {
  basePay: number
  basePayNote: string
  overtime: number
  overtimeNote: string
  transport: number
  transportNote: string
  payTotal: number
}

export interface DeductionBreakdown {
  incomeTax: number
  incomeTaxNote: string
  socialInsurance: number
  socialInsuranceNote: string
  residentTax: number
  residentTaxNote: string
  advance: number
  advanceNote: string
  otherDeduction: number
  otherDeductionNote: string
  deductionTotal: number
}

export interface PayrollHistoryMonth {
  id: string
  month: string
  workerCount: number
  payTotal: number
  deductionTotal: number
  netTotal: number
  status: "確定"
}

export type AttendanceType = "出" | "休" | "有" | "欠" | "—"

export interface AttendanceRow {
  workerNo: number
  name: string
  days: AttendanceType[]
  workDays: number
  paidLeave: number
  absences: number
}

// ===== Format utility =====

const jpyFormatter = new Intl.NumberFormat("ja-JP")

export function formatPayrollJPY(value: number): string {
  return `\u00A5${jpyFormatter.format(value)}`
}

// ===== Sample data: Payroll workers (Tab 1) =====

export const payrollWorkers: PayrollWorker[] = [
  {
    id: "1",
    workerNo: 1,
    name: "佐藤 一郎",
    workDays: 22,
    hours: 176.0,
    basePay: 440000,
    overtime: 12000,
    transport: 28600,
    payTotal: 480600,
    incomeTax: 18200,
    socialInsurance: 32400,
    residentTax: 15000,
    advance: 0,
    otherDeduction: 0,
    deductionTotal: 65600,
    netPay: 415000,
    editedFields: new Set(),
  },
  {
    id: "2",
    workerNo: 2,
    name: "古市 英佑",
    workDays: 20,
    hours: 152.0,
    basePay: 380000,
    overtime: 8000,
    transport: 24200,
    payTotal: 412200,
    incomeTax: 14800,
    socialInsurance: 28600,
    residentTax: 12000,
    advance: 30000,
    otherDeduction: 0,
    deductionTotal: 85400,
    netPay: 326800,
    editedFields: new Set(),
  },
  {
    id: "3",
    workerNo: 3,
    name: "鈴木 大地",
    workDays: 21,
    hours: 168.0,
    basePay: 420000,
    overtime: 0,
    transport: 26400,
    payTotal: 446400,
    incomeTax: 16500,
    socialInsurance: 30200,
    residentTax: 14000,
    advance: 0,
    otherDeduction: 0,
    deductionTotal: 60700,
    netPay: 385700,
    editedFields: new Set(),
  },
  {
    id: "4",
    workerNo: 4,
    name: "佐藤 翔太",
    workDays: 19,
    hours: 142.0,
    basePay: 342000,
    overtime: 6000,
    transport: 22800,
    payTotal: 370800,
    incomeTax: 12400,
    socialInsurance: 26800,
    residentTax: 11000,
    advance: 20000,
    otherDeduction: 0,
    deductionTotal: 70200,
    netPay: 300600,
    editedFields: new Set(),
  },
  {
    id: "5",
    workerNo: 5,
    name: "田村 拓也",
    workDays: 20,
    hours: 158.0,
    basePay: 396000,
    overtime: 4000,
    transport: 25600,
    payTotal: 425600,
    incomeTax: 15600,
    socialInsurance: 29400,
    residentTax: 13000,
    advance: 0,
    otherDeduction: 5000,
    deductionTotal: 63000,
    netPay: 362600,
    editedFields: new Set(),
  },
  {
    id: "6",
    workerNo: 6,
    name: "山本 健太",
    workDays: 18,
    hours: 136.0,
    basePay: 324000,
    overtime: 0,
    transport: 20400,
    payTotal: 344400,
    incomeTax: 10800,
    socialInsurance: 24600,
    residentTax: 10000,
    advance: 0,
    otherDeduction: 0,
    deductionTotal: 45400,
    netPay: 299000,
    editedFields: new Set(),
  },
  {
    id: "7",
    workerNo: 7,
    name: "中島 翼",
    workDays: 21,
    hours: 164.0,
    basePay: 410000,
    overtime: 10000,
    transport: 27200,
    payTotal: 447200,
    incomeTax: 16800,
    socialInsurance: 30800,
    residentTax: 14000,
    advance: 15000,
    otherDeduction: 0,
    deductionTotal: 76600,
    netPay: 370600,
    editedFields: new Set(),
  },
  {
    id: "8",
    workerNo: 8,
    name: "高橋 大輝",
    workDays: 17,
    hours: 128.0,
    basePay: 306000,
    overtime: 0,
    transport: 18800,
    payTotal: 324800,
    incomeTax: 9600,
    socialInsurance: 22400,
    residentTax: 9000,
    advance: 0,
    otherDeduction: 0,
    deductionTotal: 41000,
    netPay: 283800,
    editedFields: new Set(),
  },
  {
    id: "9",
    workerNo: 9,
    name: "渡辺 蓮",
    workDays: 22,
    hours: 170.0,
    basePay: 425000,
    overtime: 6000,
    transport: 29000,
    payTotal: 460000,
    incomeTax: 17400,
    socialInsurance: 31200,
    residentTax: 14500,
    advance: 0,
    otherDeduction: 3000,
    deductionTotal: 66100,
    netPay: 393900,
    editedFields: new Set(),
  },
  {
    id: "10",
    workerNo: 10,
    name: "木村 大和",
    workDays: 15,
    hours: 112.0,
    basePay: 252000,
    overtime: 0,
    transport: 16200,
    payTotal: 268200,
    incomeTax: 7200,
    socialInsurance: 18400,
    residentTax: 7500,
    advance: 10000,
    otherDeduction: 0,
    deductionTotal: 43100,
    netPay: 225100,
    editedFields: new Set(),
  },
]

// ===== Sample data: Worker details (for slide panel) =====

export const workerDetails: Record<number, PayrollWorkerDetail> = {
  2: {
    workerNo: 2,
    name: "古市 英佑",
    employeeType: "従業員（日雇い）",
    nearestStation: "西川口",
    assignments: [
      { workDate: "2/1", orderNumber: "26-004401", customerName: "ミロク東京", siteName: "尾﨑 邸", hours: 8.0, unitPrice: 20000, transport: 1240, dailyPay: 21240 },
      { workDate: "2/1", orderNumber: "26-004402", customerName: "住友林業", siteName: "渡辺 邸", hours: 3.0, unitPrice: 10000, transport: 560, dailyPay: 10560 },
      { workDate: "2/3", orderNumber: "26-004415", customerName: "積水ハウス", siteName: "小林 邸", hours: 8.0, unitPrice: 20000, transport: 1120, dailyPay: 21120 },
      { workDate: "2/4", orderNumber: "26-004420", customerName: "大和ハウス", siteName: "石井 邸", hours: 8.0, unitPrice: 20000, transport: 1240, dailyPay: 21240 },
      { workDate: "2/5", orderNumber: "26-004425", customerName: "ミロク東京", siteName: "山本 邸", hours: 8.0, unitPrice: 20000, transport: 1120, dailyPay: 21120 },
      { workDate: "2/6", orderNumber: "26-004430", customerName: "住友林業", siteName: "田中 邸", hours: 4.0, unitPrice: 10000, transport: 560, dailyPay: 10560 },
      { workDate: "2/7", orderNumber: "26-004435", customerName: "一条工務店", siteName: "佐藤 邸", hours: 8.0, unitPrice: 20000, transport: 1240, dailyPay: 21240 },
      { workDate: "2/8", orderNumber: "26-004440", customerName: "積水ハウス", siteName: "鈴木 邸", hours: 8.0, unitPrice: 20000, transport: 1120, dailyPay: 21120 },
      { workDate: "2/10", orderNumber: "26-004445", customerName: "セキスイハイム", siteName: "高橋 邸", hours: 8.0, unitPrice: 20000, transport: 1240, dailyPay: 21240 },
      { workDate: "2/11", orderNumber: "26-004450", customerName: "ミロク東京", siteName: "伊藤 邸", hours: 8.0, unitPrice: 20000, transport: 1120, dailyPay: 21120 },
      { workDate: "2/12", orderNumber: "26-004455", customerName: "住友林業", siteName: "中村 邸", hours: 8.0, unitPrice: 20000, transport: 1240, dailyPay: 21240 },
      { workDate: "2/13", orderNumber: "26-004460", customerName: "大和ハウス", siteName: "小林 邸", hours: 4.0, unitPrice: 10000, transport: 560, dailyPay: 10560 },
      { workDate: "2/14", orderNumber: "26-004465", customerName: "積水ハウス", siteName: "加藤 邸", hours: 8.0, unitPrice: 20000, transport: 1240, dailyPay: 21240 },
      { workDate: "2/17", orderNumber: "26-004470", customerName: "ミロク東京", siteName: "吉田 邸", hours: 8.0, unitPrice: 20000, transport: 1120, dailyPay: 21120 },
      { workDate: "2/18", orderNumber: "26-004475", customerName: "住友林業", siteName: "松本 邸", hours: 8.0, unitPrice: 20000, transport: 1240, dailyPay: 21240 },
      { workDate: "2/19", orderNumber: "26-004480", customerName: "一条工務店", siteName: "井上 邸", hours: 8.0, unitPrice: 20000, transport: 1120, dailyPay: 21120 },
      { workDate: "2/20", orderNumber: "26-004485", customerName: "セキスイハイム", siteName: "木村 邸", hours: 8.0, unitPrice: 20000, transport: 1240, dailyPay: 21240 },
      { workDate: "2/21", orderNumber: "26-004490", customerName: "大和ハウス", siteName: "林 邸", hours: 4.0, unitPrice: 10000, transport: 560, dailyPay: 10560 },
      { workDate: "2/24", orderNumber: "26-004495", customerName: "ミロク東京", siteName: "清水 邸", hours: 8.0, unitPrice: 20000, transport: 1120, dailyPay: 21120 },
      { workDate: "2/25", orderNumber: "26-004500", customerName: "積水ハウス", siteName: "前田 邸", hours: 8.0, unitPrice: 20000, transport: 1240, dailyPay: 21240 },
    ],
    payBreakdown: {
      basePay: 380000,
      basePayNote: "20日分",
      overtime: 8000,
      overtimeNote: "手動入力",
      transport: 24200,
      transportNote: "自動集計",
      payTotal: 412200,
    },
    deductionBreakdown: {
      incomeTax: 14800,
      incomeTaxNote: "税率表より自動計算",
      socialInsurance: 28600,
      socialInsuranceNote: "",
      residentTax: 12000,
      residentTaxNote: "",
      advance: 30000,
      advanceNote: "2/10に¥20,000、2/18に¥10,000",
      otherDeduction: 0,
      otherDeductionNote: "",
      deductionTotal: 85400,
    },
    notes: "",
  },
  1: {
    workerNo: 1,
    name: "佐藤 一郎",
    employeeType: "社員",
    nearestStation: "赤羽",
    assignments: [
      { workDate: "2/1", orderNumber: "26-004401", customerName: "ミロク東京", siteName: "尾﨑 邸", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/3", orderNumber: "26-004410", customerName: "住友林業", siteName: "新宿パークタワー", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/4", orderNumber: "26-004418", customerName: "積水ハウス", siteName: "田中 邸", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/5", orderNumber: "26-004422", customerName: "大和ハウス", siteName: "品川IC", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/6", orderNumber: "26-004428", customerName: "ミロク東京", siteName: "山本 邸", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/7", orderNumber: "26-004432", customerName: "一条工務店", siteName: "佐藤 邸", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/8", orderNumber: "26-004438", customerName: "住友林業", siteName: "渋谷CT", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/10", orderNumber: "26-004443", customerName: "セキスイハイム", siteName: "高橋 邸", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/11", orderNumber: "26-004448", customerName: "積水ハウス", siteName: "目黒RS", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/12", orderNumber: "26-004453", customerName: "大和ハウス", siteName: "世田谷G", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/13", orderNumber: "26-004458", customerName: "ミロク東京", siteName: "中村 邸", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/14", orderNumber: "26-004462", customerName: "住友林業", siteName: "池袋SS", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/15", orderNumber: "26-004467", customerName: "一条工務店", siteName: "大手町T", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/17", orderNumber: "26-004471", customerName: "積水ハウス", siteName: "丸の内B", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/18", orderNumber: "26-004476", customerName: "セキスイハイム", siteName: "銀座C", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/19", orderNumber: "26-004480", customerName: "大和ハウス", siteName: "上野PS", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/20", orderNumber: "26-004484", customerName: "ミロク東京", siteName: "浅草VS", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/21", orderNumber: "26-004489", customerName: "住友林業", siteName: "東京BA", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/24", orderNumber: "26-004494", customerName: "積水ハウス", siteName: "秋葉原U", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/25", orderNumber: "26-004498", customerName: "一条工務店", siteName: "お台場SS", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/26", orderNumber: "26-004502", customerName: "大和ハウス", siteName: "川崎M", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
      { workDate: "2/27", orderNumber: "26-004506", customerName: "ミロク東京", siteName: "横浜P", hours: 8.0, unitPrice: 20000, transport: 1300, dailyPay: 21300 },
    ],
    payBreakdown: {
      basePay: 440000,
      basePayNote: "22日分",
      overtime: 12000,
      overtimeNote: "手動入力",
      transport: 28600,
      transportNote: "自動集計",
      payTotal: 480600,
    },
    deductionBreakdown: {
      incomeTax: 18200,
      incomeTaxNote: "税率表より自動計算",
      socialInsurance: 32400,
      socialInsuranceNote: "",
      residentTax: 15000,
      residentTaxNote: "",
      advance: 0,
      advanceNote: "",
      otherDeduction: 0,
      otherDeductionNote: "",
      deductionTotal: 65600,
    },
    notes: "",
  },
}

// ===== Sample data: Payroll history (Tab 2) =====

export const payrollHistory: PayrollHistoryMonth[] = [
  { id: "h1", month: "2026/01", workerCount: 18, payTotal: 3920400, deductionTotal: 598200, netTotal: 3322200, status: "確定" },
  { id: "h2", month: "2025/12", workerCount: 17, payTotal: 3780100, deductionTotal: 572800, netTotal: 3207300, status: "確定" },
  { id: "h3", month: "2025/11", workerCount: 18, payTotal: 3856000, deductionTotal: 585400, netTotal: 3270600, status: "確定" },
  { id: "h4", month: "2025/10", workerCount: 18, payTotal: 3742800, deductionTotal: 568900, netTotal: 3173900, status: "確定" },
  { id: "h5", month: "2025/09", workerCount: 16, payTotal: 3524600, deductionTotal: 534200, netTotal: 2990400, status: "確定" },
  { id: "h6", month: "2025/08", workerCount: 17, payTotal: 3688200, deductionTotal: 558600, netTotal: 3129600, status: "確定" },
]

// ===== Sample data: Attendance (Tab 3) =====

function generateAttendance(workDays: number, paidLeave: number, absences: number): AttendanceType[] {
  // February 2026 has 28 days
  const days: AttendanceType[] = []
  let workCount = 0
  let paidCount = 0
  let absenceCount = 0

  for (let d = 1; d <= 28; d++) {
    const date = new Date(2026, 1, d)
    const dow = date.getDay()

    if (dow === 0) {
      // Sunday
      days.push("休")
    } else if (dow === 6) {
      // Saturday
      days.push("—")
    } else if (absenceCount < absences && d === 4) {
      days.push("欠")
      absenceCount++
    } else if (paidCount < paidLeave && d === 27) {
      days.push("有")
      paidCount++
    } else if (workCount < workDays) {
      days.push("出")
      workCount++
    } else {
      days.push("—")
    }
  }
  return days
}

export const attendanceData: AttendanceRow[] = [
  { workerNo: 1, name: "佐藤 一郎", days: generateAttendance(22, 0, 0), workDays: 22, paidLeave: 0, absences: 0 },
  { workerNo: 2, name: "古市 英佑", days: generateAttendance(20, 1, 0), workDays: 20, paidLeave: 1, absences: 0 },
  { workerNo: 3, name: "鈴木 大地", days: generateAttendance(21, 0, 1), workDays: 21, paidLeave: 0, absences: 1 },
  { workerNo: 4, name: "佐藤 翔太", days: generateAttendance(19, 0, 0), workDays: 19, paidLeave: 0, absences: 0 },
  { workerNo: 5, name: "田村 拓也", days: generateAttendance(20, 0, 0), workDays: 20, paidLeave: 0, absences: 0 },
  { workerNo: 6, name: "山本 健太", days: generateAttendance(18, 0, 0), workDays: 18, paidLeave: 0, absences: 0 },
  { workerNo: 7, name: "中島 翼", days: generateAttendance(21, 0, 0), workDays: 21, paidLeave: 0, absences: 0 },
  { workerNo: 8, name: "高橋 大輝", days: generateAttendance(17, 0, 0), workDays: 17, paidLeave: 0, absences: 0 },
  { workerNo: 9, name: "渡辺 蓮", days: generateAttendance(22, 0, 0), workDays: 22, paidLeave: 0, absences: 0 },
  { workerNo: 10, name: "木村 大和", days: generateAttendance(15, 0, 0), workDays: 15, paidLeave: 0, absences: 0 },
]
