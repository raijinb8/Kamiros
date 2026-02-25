// ==========================================
// 申請管理 - Data Types & Sample Data
// ==========================================

// --- Common Types ---
export type RequestStatus = "承認待ち" | "承認済み" | "却下"

// --- 打刻 (Attendance / Time Stamp) ---
export type StampType = "到着" | "退勤"

export interface AttendanceRequest {
  id: string
  submittedAt: string   // 申請日時
  workerName: string    // 作業員名
  workerNo: string      // 作業員番号
  stampType: StampType  // 種別
  stampTime: string     // 打刻時刻
  targetDate: string    // 対象日
  orderNumber: string   // 手配番号
  clientName: string    // 顧客名
  siteName: string      // 現場名
  siteAddress: string   // 現場住所
  hasGps: boolean       // GPS有無
  scheduledTime: string // 予定時刻
  scheduledRange: string // 予定時刻範囲 (例: "08:00 〜 17:00")
  diffMinutes: number   // 差異（分）
  status: RequestStatus
  comment?: string
}

// --- 休暇 (Leave) ---
export type LeaveType = "有給" | "欠勤"

export interface LeaveRequest {
  id: string
  submittedAt: string    // 申請日
  workerName: string
  workerNo: string
  leaveType: LeaveType   // 休暇種別
  startDate: string      // 対象日（開始）
  endDate: string        // 対象日（終了）
  days: number           // 日数
  reason: string         // 理由
  remainingDays: number  // 有給残日数
  annualAllowance: number // 年間付与日数
  usedDays: number       // 使用済み
  status: RequestStatus
  comment?: string
}

// --- 経費 (Expense) ---
export interface ExpenseRequest {
  id: string
  submittedAt: string
  workerName: string
  workerNo: string
  expenseDate: string    // 利用日
  description: string    // 内容
  amount: number         // 金額
  hasReceipt: boolean    // レシート有無
  orderNumber: string    // 手配番号（関連案件）
  status: RequestStatus
  comment?: string
}

// --- その他 (Other) ---
export type OtherRequestType = "住所変更" | "口座変更" | "その他"

export interface OtherRequest {
  id: string
  submittedAt: string
  workerName: string
  workerNo: string
  requestType: OtherRequestType
  summary: string        // 内容の要約
  status: RequestStatus
  comment?: string
  // 変更内容（種別に応じた詳細）
  changeDetails?: {
    before: Record<string, string>
    after: Record<string, string>
  }
}

// ==========================================
// Sample Data
// ==========================================

export const SAMPLE_ATTENDANCE: AttendanceRequest[] = [
  {
    id: "att-001",
    submittedAt: "2026/02/25 08:12",
    workerName: "古市 英佑",
    workerNo: "No.2",
    stampType: "到着",
    stampTime: "08:10",
    targetDate: "2/25",
    orderNumber: "26-004530",
    clientName: "ミロク商事(株) 東京支店",
    siteName: "尾﨑 洋子 邸",
    siteAddress: "東京都世田谷区上北沢3-4-2",
    hasGps: true,
    scheduledTime: "08:00",
    scheduledRange: "08:00 〜 17:00",
    diffMinutes: 10,
    status: "承認待ち",
  },
  {
    id: "att-002",
    submittedAt: "2026/02/25 08:05",
    workerName: "鈴木 大地",
    workerNo: "No.5",
    stampType: "到着",
    stampTime: "08:03",
    targetDate: "2/25",
    orderNumber: "26-004528",
    clientName: "(株)ヤマダホームズ",
    siteName: "渡辺 健一 邸",
    siteAddress: "東京都練馬区石神井町5-1-8",
    hasGps: true,
    scheduledTime: "08:00",
    scheduledRange: "08:00 〜 17:00",
    diffMinutes: 3,
    status: "承認済み",
  },
  {
    id: "att-003",
    submittedAt: "2026/02/25 07:58",
    workerName: "佐藤 翔太",
    workerNo: "No.3",
    stampType: "到着",
    stampTime: "07:55",
    targetDate: "2/25",
    orderNumber: "26-004526",
    clientName: "積水ハウス(株)",
    siteName: "高橋 美咲 邸",
    siteAddress: "東京都杉並区阿佐ヶ谷南1-2-3",
    hasGps: true,
    scheduledTime: "08:30",
    scheduledRange: "08:30 〜 17:30",
    diffMinutes: -35,
    status: "承認待ち",
  },
  {
    id: "att-004",
    submittedAt: "2026/02/25 07:45",
    workerName: "田村 拓也",
    workerNo: "No.7",
    stampType: "到着",
    stampTime: "07:42",
    targetDate: "2/25",
    orderNumber: "26-004525",
    clientName: "大和ハウス工業(株)",
    siteName: "山田 太郎 邸",
    siteAddress: "埼玉県さいたま市浦和区常盤6-5-1",
    hasGps: false,
    scheduledTime: "08:00",
    scheduledRange: "08:00 〜 17:00",
    diffMinutes: -18,
    status: "承認待ち",
  },
  {
    id: "att-005",
    submittedAt: "2026/02/24 17:32",
    workerName: "古市 英佑",
    workerNo: "No.2",
    stampType: "退勤",
    stampTime: "17:30",
    targetDate: "2/24",
    orderNumber: "26-004521",
    clientName: "ミロク商事(株) 東京支店",
    siteName: "尾﨑 洋子 邸",
    siteAddress: "東京都世田谷区上北沢3-4-2",
    hasGps: true,
    scheduledTime: "17:00",
    scheduledRange: "08:00 〜 17:00",
    diffMinutes: 30,
    status: "承認待ち",
  },
  {
    id: "att-006",
    submittedAt: "2026/02/24 17:05",
    workerName: "鈴木 大地",
    workerNo: "No.5",
    stampType: "退勤",
    stampTime: "17:00",
    targetDate: "2/24",
    orderNumber: "26-004519",
    clientName: "(株)ヤマダホームズ",
    siteName: "渡辺 健一 邸",
    siteAddress: "東京都練馬区石神井町5-1-8",
    hasGps: true,
    scheduledTime: "17:00",
    scheduledRange: "08:00 〜 17:00",
    diffMinutes: 0,
    status: "承認済み",
  },
  {
    id: "att-007",
    submittedAt: "2026/02/24 16:15",
    workerName: "佐藤 翔太",
    workerNo: "No.3",
    stampType: "退勤",
    stampTime: "16:10",
    targetDate: "2/24",
    orderNumber: "26-004516",
    clientName: "積水ハウス(株)",
    siteName: "中村 誠一 邸",
    siteAddress: "東京都中野区新井1-7-4",
    hasGps: true,
    scheduledTime: "16:00",
    scheduledRange: "08:00 〜 16:00",
    diffMinutes: 10,
    status: "承認済み",
  },
  {
    id: "att-008",
    submittedAt: "2026/02/24 15:48",
    workerName: "山本 健太",
    workerNo: "No.8",
    stampType: "退勤",
    stampTime: "15:45",
    targetDate: "2/24",
    orderNumber: "26-004511",
    clientName: "旭化成ホームズ(株)",
    siteName: "藤田 正義 邸",
    siteAddress: "埼玉県川口市本町2-5-3",
    hasGps: false,
    scheduledTime: "15:00",
    scheduledRange: "08:00 〜 15:00",
    diffMinutes: 45,
    status: "却下",
    comment: "GPS情報なし。現場責任者に確認が必要。",
  },
  {
    id: "att-009",
    submittedAt: "2026/02/24 12:10",
    workerName: "古市 英佑",
    workerNo: "No.2",
    stampType: "退勤",
    stampTime: "12:00",
    targetDate: "2/24",
    orderNumber: "26-004508",
    clientName: "住友林業(株)",
    siteName: "岡田 幸一 邸",
    siteAddress: "東京都板橋区成増3-2-1",
    hasGps: true,
    scheduledTime: "12:00",
    scheduledRange: "08:00 〜 12:00",
    diffMinutes: 0,
    status: "承認済み",
  },
  {
    id: "att-010",
    submittedAt: "2026/02/24 12:05",
    workerName: "中島 翼",
    workerNo: "No.9",
    stampType: "退勤",
    stampTime: "12:00",
    targetDate: "2/24",
    orderNumber: "26-004506",
    clientName: "パナソニックホームズ(株)",
    siteName: "西村 雅彦 邸",
    siteAddress: "東京都世田谷区桜丘5-6-7",
    hasGps: true,
    scheduledTime: "12:00",
    scheduledRange: "08:00 〜 12:00",
    diffMinutes: 0,
    status: "承認済み",
  },
]

export const SAMPLE_LEAVE: LeaveRequest[] = [
  {
    id: "lev-001",
    submittedAt: "2026/02/23",
    workerName: "古市 英佑",
    workerNo: "No.2",
    leaveType: "有給",
    startDate: "2/28",
    endDate: "2/28",
    days: 1,
    reason: "私用のため",
    remainingDays: 8,
    annualAllowance: 10,
    usedDays: 2,
    status: "承認待ち",
  },
  {
    id: "lev-002",
    submittedAt: "2026/02/20",
    workerName: "田村 拓也",
    workerNo: "No.7",
    leaveType: "有給",
    startDate: "3/3",
    endDate: "3/4",
    days: 2,
    reason: "通院のため",
    remainingDays: 5,
    annualAllowance: 10,
    usedDays: 5,
    status: "承認待ち",
  },
  {
    id: "lev-003",
    submittedAt: "2026/02/18",
    workerName: "山本 健太",
    workerNo: "No.8",
    leaveType: "欠勤",
    startDate: "2/19",
    endDate: "2/19",
    days: 1,
    reason: "体調不良",
    remainingDays: 10,
    annualAllowance: 10,
    usedDays: 0,
    status: "承認済み",
  },
  {
    id: "lev-004",
    submittedAt: "2026/02/15",
    workerName: "中島 翼",
    workerNo: "No.9",
    leaveType: "有給",
    startDate: "2/21",
    endDate: "2/21",
    days: 1,
    reason: "家庭の事情",
    remainingDays: 6,
    annualAllowance: 10,
    usedDays: 4,
    status: "承認済み",
  },
  {
    id: "lev-005",
    submittedAt: "2026/02/10",
    workerName: "鈴木 大地",
    workerNo: "No.5",
    leaveType: "有給",
    startDate: "2/14",
    endDate: "2/14",
    days: 1,
    reason: "引越し",
    remainingDays: 9,
    annualAllowance: 10,
    usedDays: 1,
    status: "承認待ち",
  },
]

export const SAMPLE_EXPENSE: ExpenseRequest[] = [
  {
    id: "exp-001",
    submittedAt: "2026/02/24",
    workerName: "古市 英佑",
    workerNo: "No.2",
    expenseDate: "2/24",
    description: "現場駐車場代",
    amount: 1200,
    hasReceipt: true,
    orderNumber: "26-004521",
    status: "承認待ち",
  },
  {
    id: "exp-002",
    submittedAt: "2026/02/20",
    workerName: "田村 拓也",
    workerNo: "No.7",
    expenseDate: "2/20",
    description: "養生テープ購入",
    amount: 3800,
    hasReceipt: true,
    orderNumber: "26-004490",
    status: "承認済み",
  },
  {
    id: "exp-003",
    submittedAt: "2026/02/18",
    workerName: "鈴木 大地",
    workerNo: "No.5",
    expenseDate: "2/18",
    description: "タクシー代（終電後）",
    amount: 4200,
    hasReceipt: true,
    orderNumber: "",
    status: "承認済み",
  },
  {
    id: "exp-004",
    submittedAt: "2026/02/15",
    workerName: "佐藤 翔太",
    workerNo: "No.3",
    expenseDate: "2/15",
    description: "現場駐車場代",
    amount: 800,
    hasReceipt: true,
    orderNumber: "26-004462",
    status: "承認済み",
  },
]

export const SAMPLE_OTHER: OtherRequest[] = [
  {
    id: "oth-001",
    submittedAt: "2026/02/22",
    workerName: "古市 英佑",
    workerNo: "No.2",
    requestType: "口座変更",
    summary: "振込先をみずほ銀行→三井住友銀行に変更",
    status: "承認待ち",
    changeDetails: {
      before: {
        銀行名: "みずほ銀行",
        支店名: "川口支店",
        口座種別: "普通",
        口座番号: "****1234",
      },
      after: {
        銀行名: "三井住友銀行",
        支店名: "大宮支店",
        口座種別: "普通",
        口座番号: "****5678",
      },
    },
  },
  {
    id: "oth-002",
    submittedAt: "2026/02/15",
    workerName: "渡辺 蓮",
    workerNo: "No.11",
    requestType: "住所変更",
    summary: "川口市→さいたま市に転居",
    status: "承認済み",
    changeDetails: {
      before: {
        郵便番号: "332-0012",
        住所: "埼玉県川口市本町2-1-5",
        最寄り駅: "川口",
      },
      after: {
        郵便番号: "330-0801",
        住所: "埼玉県さいたま市大宮区土手町1-8-3",
        最寄り駅: "大宮",
      },
    },
  },
  {
    id: "oth-003",
    submittedAt: "2026/02/10",
    workerName: "木村 大和",
    workerNo: "No.12",
    requestType: "その他",
    summary: "フォークリフト資格取得の届出",
    status: "承認済み",
  },
]
