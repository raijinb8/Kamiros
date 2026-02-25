// ============================================================
// 申請管理 — データ型 & サンプルデータ
// ============================================================

// ---------- 共通 ----------
export type ApprovalStatus = "未処理" | "承認済み" | "却下"
export type ConfirmStatus = "未確認" | "確認済み"

// ---------- タブ1: 内金申請 ----------
export type AdvanceType = "MAX" | "金額指定"

export interface AdvanceRequest {
  id: string
  requestedAt: string
  workerName: string
  workerNo: number
  type: AdvanceType
  requestedAmount: number | null  // null = MAX
  confirmedAmount: number | null  // null = 未処理
  monthlyTotal: number
  status: ApprovalStatus
  // 詳細パネル用
  detail: {
    monthlyDailyWage: number
    monthlyTransport: number
    grossPay: number
    estimatedDeduction: number
    alreadyAdvanced: number
    availableAdvance: number
  }
  history: {
    date: string
    type: AdvanceType
    confirmedAmount: number | null
    status: ApprovalStatus
  }[]
}

export const ADVANCE_REQUESTS: AdvanceRequest[] = [
  {
    id: "adv-001",
    requestedAt: "2026/02/25 12:12",
    workerName: "佐藤 祐輔",
    workerNo: 8,
    type: "MAX",
    requestedAmount: null,
    confirmedAmount: null,
    monthlyTotal: 128000,
    status: "未処理",
    detail: {
      monthlyDailyWage: 248000,
      monthlyTransport: 18200,
      grossPay: 266200,
      estimatedDeduction: 38400,
      alreadyAdvanced: 96000,
      availableAdvance: 131800,
    },
    history: [
      { date: "2/24 11:54", type: "MAX", confirmedAmount: null, status: "未処理" },
      { date: "2/24 10:20", type: "MAX", confirmedAmount: null, status: "未処理" },
      { date: "2/21", type: "MAX", confirmedAmount: 32000, status: "承認済み" },
      { date: "2/15", type: "MAX", confirmedAmount: 32000, status: "承認済み" },
      { date: "2/10", type: "金額指定", confirmedAmount: 32000, status: "承認済み" },
    ],
  },
  {
    id: "adv-002",
    requestedAt: "2026/02/24 17:35",
    workerName: "真部 義明",
    workerNo: 12,
    type: "MAX",
    requestedAmount: null,
    confirmedAmount: null,
    monthlyTotal: 64000,
    status: "未処理",
    detail: {
      monthlyDailyWage: 198000,
      monthlyTransport: 14400,
      grossPay: 212400,
      estimatedDeduction: 28800,
      alreadyAdvanced: 32000,
      availableAdvance: 151600,
    },
    history: [
      { date: "2/21", type: "MAX", confirmedAmount: 32000, status: "承認済み" },
    ],
  },
  {
    id: "adv-003",
    requestedAt: "2026/02/24 11:54",
    workerName: "佐藤 祐輔",
    workerNo: 8,
    type: "MAX",
    requestedAmount: null,
    confirmedAmount: null,
    monthlyTotal: 96000,
    status: "未処理",
    detail: {
      monthlyDailyWage: 248000,
      monthlyTransport: 18200,
      grossPay: 266200,
      estimatedDeduction: 38400,
      alreadyAdvanced: 96000,
      availableAdvance: 131800,
    },
    history: [
      { date: "2/24 10:20", type: "MAX", confirmedAmount: null, status: "未処理" },
      { date: "2/21", type: "MAX", confirmedAmount: 32000, status: "承認済み" },
      { date: "2/15", type: "MAX", confirmedAmount: 32000, status: "承認済み" },
      { date: "2/10", type: "金額指定", confirmedAmount: 32000, status: "承認済み" },
    ],
  },
  {
    id: "adv-004",
    requestedAt: "2026/02/24 10:20",
    workerName: "佐藤 祐輔",
    workerNo: 8,
    type: "MAX",
    requestedAmount: null,
    confirmedAmount: null,
    monthlyTotal: 64000,
    status: "未処理",
    detail: {
      monthlyDailyWage: 248000,
      monthlyTransport: 18200,
      grossPay: 266200,
      estimatedDeduction: 38400,
      alreadyAdvanced: 96000,
      availableAdvance: 131800,
    },
    history: [
      { date: "2/21", type: "MAX", confirmedAmount: 32000, status: "承認済み" },
      { date: "2/15", type: "MAX", confirmedAmount: 32000, status: "承認済み" },
      { date: "2/10", type: "金額指定", confirmedAmount: 32000, status: "承認済み" },
    ],
  },
  {
    id: "adv-005",
    requestedAt: "2026/02/23 14:10",
    workerName: "石黒 豪",
    workerNo: 5,
    type: "MAX",
    requestedAmount: null,
    confirmedAmount: 32000,
    monthlyTotal: 32000,
    status: "承認済み",
    detail: {
      monthlyDailyWage: 176000,
      monthlyTransport: 12600,
      grossPay: 188600,
      estimatedDeduction: 24200,
      alreadyAdvanced: 32000,
      availableAdvance: 132400,
    },
    history: [],
  },
  {
    id: "adv-006",
    requestedAt: "2026/02/21 21:01",
    workerName: "堀内 禅",
    workerNo: 15,
    type: "MAX",
    requestedAmount: null,
    confirmedAmount: 28000,
    monthlyTotal: 28000,
    status: "承認済み",
    detail: {
      monthlyDailyWage: 160000,
      monthlyTransport: 10800,
      grossPay: 170800,
      estimatedDeduction: 22400,
      alreadyAdvanced: 28000,
      availableAdvance: 120400,
    },
    history: [],
  },
  {
    id: "adv-007",
    requestedAt: "2026/02/21 18:00",
    workerName: "古市 英佑",
    workerNo: 3,
    type: "MAX",
    requestedAmount: null,
    confirmedAmount: 30000,
    monthlyTotal: 60000,
    status: "承認済み",
    detail: {
      monthlyDailyWage: 220000,
      monthlyTransport: 16000,
      grossPay: 236000,
      estimatedDeduction: 32000,
      alreadyAdvanced: 60000,
      availableAdvance: 144000,
    },
    history: [
      { date: "2/15", type: "MAX", confirmedAmount: 30000, status: "承認済み" },
    ],
  },
  {
    id: "adv-008",
    requestedAt: "2026/02/21 17:16",
    workerName: "渡邊 良平",
    workerNo: 7,
    type: "金額指定",
    requestedAmount: 30000,
    confirmedAmount: 30000,
    monthlyTotal: 30000,
    status: "承認済み",
    detail: {
      monthlyDailyWage: 192000,
      monthlyTransport: 13600,
      grossPay: 205600,
      estimatedDeduction: 27200,
      alreadyAdvanced: 30000,
      availableAdvance: 148400,
    },
    history: [],
  },
  {
    id: "adv-009",
    requestedAt: "2026/02/21 17:00",
    workerName: "真部 義明",
    workerNo: 12,
    type: "MAX",
    requestedAmount: null,
    confirmedAmount: 32000,
    monthlyTotal: 32000,
    status: "承認済み",
    detail: {
      monthlyDailyWage: 198000,
      monthlyTransport: 14400,
      grossPay: 212400,
      estimatedDeduction: 28800,
      alreadyAdvanced: 32000,
      availableAdvance: 151600,
    },
    history: [],
  },
]

// ---------- タブ2: 現場状況 ----------
export interface SiteConditionReport {
  id: string
  reportedAt: string
  workerName: string
  workerNo: number
  siteName: string
  clientHm: string
  photoCount: number
  photos: string[]  // filenames
  notes: string
  status: ConfirmStatus
  adminMemo: string
}

export const SITE_CONDITION_REPORTS: SiteConditionReport[] = [
  {
    id: "sc-001",
    reportedAt: "2026/02/09 09:48",
    workerName: "石黒 豪",
    workerNo: 5,
    siteName: "堀江 千賀子 邸（ミサワホーム）",
    clientHm: "ミサワホーム",
    photoCount: 5,
    photos: ["IMG_4114.jpeg", "IMG_4115.jpeg", "IMG_4116.jpeg", "IMG_4117.jpeg", "IMG_4118.jpeg"],
    notes: "",
    status: "未確認",
    adminMemo: "",
  },
  {
    id: "sc-002",
    reportedAt: "2026/02/07 13:45",
    workerName: "吉井 明彦",
    workerNo: 9,
    siteName: "鶴岡 真明 邸",
    clientHm: "",
    photoCount: 1,
    photos: ["IMG_3992.jpeg"],
    notes: "足場階段です",
    status: "未確認",
    adminMemo: "",
  },
  {
    id: "sc-003",
    reportedAt: "2026/02/05 09:31",
    workerName: "石崎 剛哉",
    workerNo: 11,
    siteName: "箱崎 邸",
    clientHm: "",
    photoCount: 1,
    photos: ["IMG_3880.jpeg"],
    notes: "",
    status: "確認済み",
    adminMemo: "",
  },
  {
    id: "sc-004",
    reportedAt: "2026/01/28 13:11",
    workerName: "下平 正史",
    workerNo: 14,
    siteName: "淵脇 空輝 邸",
    clientHm: "",
    photoCount: 1,
    photos: ["IMG_3701.jpeg"],
    notes: "",
    status: "確認済み",
    adminMemo: "",
  },
  {
    id: "sc-005",
    reportedAt: "2026/01/22 12:14",
    workerName: "吉井 明彦",
    workerNo: 9,
    siteName: "大久保 裕之 邸（大久保メゾン）",
    clientHm: "",
    photoCount: 1,
    photos: ["IMG_3645.jpeg"],
    notes: "",
    status: "確認済み",
    adminMemo: "",
  },
  {
    id: "sc-006",
    reportedAt: "2026/01/18 08:55",
    workerName: "田村 拓也",
    workerNo: 4,
    siteName: "松本 裕子 邸",
    clientHm: "",
    photoCount: 3,
    photos: ["IMG_3580.jpeg", "IMG_3581.jpeg", "IMG_3582.jpeg"],
    notes: "搬入経路に足場あり注意",
    status: "確認済み",
    adminMemo: "取引先に連絡済み。2/10に足場撤去予定。",
  },
  {
    id: "sc-007",
    reportedAt: "2026/01/15 14:20",
    workerName: "古市 英佑",
    workerNo: 3,
    siteName: "加瀬 典之 邸",
    clientHm: "",
    photoCount: 2,
    photos: ["IMG_3510.jpeg", "IMG_3511.jpeg"],
    notes: "2F階段狭い",
    status: "確認済み",
    adminMemo: "",
  },
]

// ---------- タブ3: 休暇 ----------
export type LeaveType = "有給" | "欠勤"

export interface LeaveRequest {
  id: string
  requestedAt: string
  workerName: string
  workerNo: number
  leaveType: LeaveType
  startDate: string
  endDate: string
  days: number
  reason: string
  remainingDays: number
  status: ApprovalStatus
  // 詳細パネル用
  detail: {
    annualGranted: number
    used: number
    thisRequest: number
    afterApproval: number
  }
}

export const LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "lv-001",
    requestedAt: "2026/02/23",
    workerName: "古市 英佑",
    workerNo: 3,
    leaveType: "有給",
    startDate: "2/28",
    endDate: "2/28",
    days: 1,
    reason: "私用のため",
    remainingDays: 8,
    status: "未処理",
    detail: { annualGranted: 10, used: 2, thisRequest: 1, afterApproval: 7 },
  },
  {
    id: "lv-002",
    requestedAt: "2026/02/20",
    workerName: "田村 拓也",
    workerNo: 4,
    leaveType: "有給",
    startDate: "3/3",
    endDate: "3/4",
    days: 2,
    reason: "通院のため",
    remainingDays: 5,
    status: "未処理",
    detail: { annualGranted: 10, used: 5, thisRequest: 2, afterApproval: 3 },
  },
  {
    id: "lv-003",
    requestedAt: "2026/02/18",
    workerName: "山本 健太",
    workerNo: 6,
    leaveType: "欠勤",
    startDate: "2/19",
    endDate: "2/19",
    days: 1,
    reason: "体調不良",
    remainingDays: 10,
    status: "承認済み",
    detail: { annualGranted: 10, used: 0, thisRequest: 0, afterApproval: 10 },
  },
  {
    id: "lv-004",
    requestedAt: "2026/02/15",
    workerName: "中島 翼",
    workerNo: 10,
    leaveType: "有給",
    startDate: "2/21",
    endDate: "2/21",
    days: 1,
    reason: "家庭の事情",
    remainingDays: 6,
    status: "承認済み",
    detail: { annualGranted: 10, used: 4, thisRequest: 1, afterApproval: 5 },
  },
  {
    id: "lv-005",
    requestedAt: "2026/02/10",
    workerName: "鈴木 大地",
    workerNo: 2,
    leaveType: "有給",
    startDate: "2/14",
    endDate: "2/14",
    days: 1,
    reason: "引越し",
    remainingDays: 9,
    status: "未処理",
    detail: { annualGranted: 10, used: 1, thisRequest: 1, afterApproval: 8 },
  },
]

// ---------- タブ4: 経費 ----------
export interface ExpenseRequest {
  id: string
  requestedAt: string
  workerName: string
  workerNo: number
  expenseDate: string
  description: string
  amount: number
  hasReceipt: boolean
  orderNumber: string
  status: ApprovalStatus
  approvalComment: string
}

export const EXPENSE_REQUESTS: ExpenseRequest[] = [
  {
    id: "exp-001",
    requestedAt: "2026/02/24",
    workerName: "古市 英佑",
    workerNo: 3,
    expenseDate: "2/24",
    description: "現場駐車場代",
    amount: 1200,
    hasReceipt: true,
    orderNumber: "26-004521",
    status: "未処理",
    approvalComment: "",
  },
  {
    id: "exp-002",
    requestedAt: "2026/02/20",
    workerName: "田村 拓也",
    workerNo: 4,
    expenseDate: "2/20",
    description: "養生テープ購入",
    amount: 3800,
    hasReceipt: true,
    orderNumber: "26-004490",
    status: "承認済み",
    approvalComment: "",
  },
  {
    id: "exp-003",
    requestedAt: "2026/02/18",
    workerName: "鈴木 大地",
    workerNo: 2,
    expenseDate: "2/18",
    description: "タクシー代（終電後）",
    amount: 4200,
    hasReceipt: true,
    orderNumber: "",
    status: "承認済み",
    approvalComment: "",
  },
  {
    id: "exp-004",
    requestedAt: "2026/02/15",
    workerName: "佐藤 翔太",
    workerNo: 1,
    expenseDate: "2/15",
    description: "現場駐車場代",
    amount: 800,
    hasReceipt: true,
    orderNumber: "26-004462",
    status: "承認済み",
    approvalComment: "",
  },
]

// ---------- タブ5: その他 ----------
export type OtherRequestType = "住所変更" | "口座変更" | "その他"

export interface OtherRequest {
  id: string
  requestedAt: string
  workerName: string
  workerNo: number
  requestType: OtherRequestType
  summary: string
  status: ApprovalStatus
  // 詳細パネル用
  changes?: {
    field: string
    before: string
    after: string
  }[]
}

export const OTHER_REQUESTS: OtherRequest[] = [
  {
    id: "oth-001",
    requestedAt: "2026/02/22",
    workerName: "古市 英佑",
    workerNo: 3,
    requestType: "口座変更",
    summary: "振込先をみずほ→三井住友に変更",
    status: "未処理",
    changes: [
      { field: "銀行名", before: "みずほ銀行", after: "三井住友銀行" },
      { field: "支店名", before: "川口支店", after: "大宮支店" },
      { field: "口座番号", before: "****1234", after: "****5678" },
    ],
  },
  {
    id: "oth-002",
    requestedAt: "2026/02/15",
    workerName: "渡辺 蓮",
    workerNo: 16,
    requestType: "住所変更",
    summary: "川口市→さいたま市に転居",
    status: "承認済み",
    changes: [
      { field: "郵便番号", before: "332-0012", after: "330-0801" },
      { field: "住所", before: "埼玉県川口市本町2-1-5", after: "埼玉県さいたま市大宮区土手町1-8-3" },
      { field: "最寄り駅", before: "川口", after: "大宮" },
    ],
  },
  {
    id: "oth-003",
    requestedAt: "2026/02/10",
    workerName: "木村 大和",
    workerNo: 17,
    requestType: "その他",
    summary: "フォークリフト資格取得の届出",
    status: "承認済み",
  },
]

// ---------- バッジ件数ヘルパー ----------
export function getUnprocessedCounts() {
  const advance = ADVANCE_REQUESTS.filter((r) => r.status === "未処理").length
  const siteCondition = SITE_CONDITION_REPORTS.filter((r) => r.status === "未確認").length
  const leave = LEAVE_REQUESTS.filter((r) => r.status === "未処理").length
  const expense = EXPENSE_REQUESTS.filter((r) => r.status === "未処理").length
  const other = OTHER_REQUESTS.filter((r) => r.status === "未処理").length
  return { advance, siteCondition, leave, expense, other, total: advance + siteCondition + leave + expense + other }
}
