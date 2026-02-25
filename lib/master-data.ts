// ── Types ────────────────────────────────────────────────────

export type CustomerStatus = "有効" | "無効"
export type WorkerStatus = "在籍" | "退職"
export type EmploymentType = "アルバイト" | "個人事業主"
export type ClosingDay = "月末" | "20日" | "25日" | "15日"
export type PaymentSite = "翌月末" | "翌々月末" | "翌月20日"
export type TaxCalcMethod = "案件ごと（税込）" | "案件ごと（税抜）" | "請求書一括"
export type InvoiceSendMethod = "メール" | "郵送" | "FAX"
export type AccountType = "普通" | "当座"

export interface Customer {
  id: string
  code: string
  name: string
  housemaker: string
  fullPrice: number
  halfPrice: number
  phone: string
  closingDay: ClosingDay
  monthlyProjects: number
  status: CustomerStatus
  // Detail fields
  postalCode: string
  address: string
  fax: string
  email: string
  contactPerson: string
  startDate: string
  paymentSite: PaymentSite
  taxCalcMethod: TaxCalcMethod
  invoiceNumber: string
  invoiceSendMethod: InvoiceSendMethod
  invoiceSendTo: string
  monthlyBillingEstimate: number
  lastMonthBilling: number
  yearlyBillingTotal: number
  notes: string
  history: AuditEntry[]
}

export interface Worker {
  id: string
  no: number
  name: string
  furigana: string
  employmentType: EmploymentType
  fullPrice: number
  halfPrice: number
  distanceAllowance: number
  phone: string
  startDate: string
  monthlyWork: string
  monthlyAdvance: number
  status: WorkerStatus
  // Detail fields
  birthDate: string
  email: string
  postalCode: string
  address: string
  nearestStation: string
  qualifications: string[]
  emergencyContact: string
  earlyAllowance: number
  holidayAllowanceRate: number
  bankName: string
  branchName: string
  accountType: AccountType
  accountNumber: string
  accountHolder: string
  annualLeave: number
  usedLeave: number
  remainingLeave: number
  nextLeaveDate: string
  monthlyPayEstimate: number
  notes: string
  history: AuditEntry[]
}

export interface HouseMaker {
  id: string
  code: string
  name: string
  customerCount: number
  notes: string
}

export interface AuditEntry {
  datetime: string
  operator: string
  content: string
}

// ── Format helpers ───────────────────────────────────────────

export function formatJPY(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`
}

// ── Sample Data: Customers ───────────────────────────────────

export const customers: Customer[] = [
  {
    id: "c1",
    code: "C-0001",
    name: "加藤ベニヤ 本社",
    housemaker: "ミサワホーム",
    fullPrice: 18000,
    halfPrice: 12000,
    phone: "03-1234-5678",
    closingDay: "月末",
    monthlyProjects: 12,
    status: "有効",
    postalCode: "332-0012",
    address: "埼玉県川口市本町2-3-15",
    fax: "03-1234-5679",
    email: "info@kato-beni.co.jp",
    contactPerson: "加藤 浩二",
    startDate: "2020/04/01",
    paymentSite: "翌月末",
    taxCalcMethod: "案件ごと（税込）",
    invoiceNumber: "T1234567890123",
    invoiceSendMethod: "メール",
    invoiceSendTo: "keiri@kato-beni.co.jp",
    monthlyBillingEstimate: 384000,
    lastMonthBilling: 412000,
    yearlyBillingTotal: 4286000,
    notes: "",
    history: [
      { datetime: "2026/02/15 10:30", operator: "事務担当者A", content: "売上単価を更新（フル ¥17,000→¥18,000）" },
      { datetime: "2026/01/10 14:00", operator: "事務担当者A", content: "メールアドレスを変更" },
      { datetime: "2025/04/01 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "c2",
    code: "C-0005",
    name: "三栄建設 横浜支店",
    housemaker: "積水ハウス",
    fullPrice: 20000,
    halfPrice: 13000,
    phone: "045-234-5678",
    closingDay: "25日",
    monthlyProjects: 8,
    status: "有効",
    postalCode: "220-0011",
    address: "神奈川県横浜市西区高島2-1-1",
    fax: "045-234-5679",
    email: "info@sanei-yokohama.co.jp",
    contactPerson: "三栄 太郎",
    startDate: "2021/06/01",
    paymentSite: "翌月末",
    taxCalcMethod: "案件ごと（税込）",
    invoiceNumber: "T9876543210987",
    invoiceSendMethod: "メール",
    invoiceSendTo: "keiri@sanei-yokohama.co.jp",
    monthlyBillingEstimate: 296000,
    lastMonthBilling: 320000,
    yearlyBillingTotal: 3540000,
    notes: "",
    history: [
      { datetime: "2026/01/20 11:00", operator: "事務担当者A", content: "担当者名を変更" },
      { datetime: "2021/06/01 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "c3",
    code: "C-0012",
    name: "大久保メゾン",
    housemaker: "大和ハウス",
    fullPrice: 17500,
    halfPrice: 11500,
    phone: "048-345-6789",
    closingDay: "月末",
    monthlyProjects: 5,
    status: "有効",
    postalCode: "330-0845",
    address: "埼玉県さいたま市大宮区仲町1-2-3",
    fax: "048-345-6790",
    email: "info@okubo-maison.co.jp",
    contactPerson: "大久保 次郎",
    startDate: "2019/11/15",
    paymentSite: "翌月末",
    taxCalcMethod: "案件ごと（税抜）",
    invoiceNumber: "T1111222233334",
    invoiceSendMethod: "郵送",
    invoiceSendTo: "",
    monthlyBillingEstimate: 172500,
    lastMonthBilling: 195000,
    yearlyBillingTotal: 2080000,
    notes: "請求書は郵送のみ対応",
    history: [
      { datetime: "2019/11/15 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "c4",
    code: "C-0018",
    name: "須藤工業 さいたま営業所",
    housemaker: "ミサワホーム",
    fullPrice: 18000,
    halfPrice: 12000,
    phone: "048-456-7890",
    closingDay: "20日",
    monthlyProjects: 3,
    status: "有効",
    postalCode: "330-0063",
    address: "埼玉県さいたま市浦和区高砂3-5-10",
    fax: "048-456-7891",
    email: "info@sudo-kogyo.co.jp",
    contactPerson: "須藤 健一",
    startDate: "2022/01/10",
    paymentSite: "翌々月末",
    taxCalcMethod: "案件ごと（税込）",
    invoiceNumber: "T4444555566667",
    invoiceSendMethod: "FAX",
    invoiceSendTo: "",
    monthlyBillingEstimate: 108000,
    lastMonthBilling: 126000,
    yearlyBillingTotal: 1350000,
    notes: "",
    history: [
      { datetime: "2022/01/10 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "c5",
    code: "C-0023",
    name: "松本建材 千葉事業部",
    housemaker: "住友林業",
    fullPrice: 19000,
    halfPrice: 12500,
    phone: "043-567-8901",
    closingDay: "月末",
    monthlyProjects: 7,
    status: "有効",
    postalCode: "260-0013",
    address: "千葉県千葉市中央区中央1-11-1",
    fax: "043-567-8902",
    email: "info@matsumoto-chiba.co.jp",
    contactPerson: "松本 俊介",
    startDate: "2020/09/01",
    paymentSite: "翌月末",
    taxCalcMethod: "請求書一括",
    invoiceNumber: "T7777888899990",
    invoiceSendMethod: "メール",
    invoiceSendTo: "billing@matsumoto-chiba.co.jp",
    monthlyBillingEstimate: 275500,
    lastMonthBilling: 304000,
    yearlyBillingTotal: 3420000,
    notes: "",
    history: [
      { datetime: "2020/09/01 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "c6",
    code: "C-0031",
    name: "高橋住設",
    housemaker: "セキスイハイム",
    fullPrice: 18500,
    halfPrice: 12000,
    phone: "042-678-9012",
    closingDay: "25日",
    monthlyProjects: 10,
    status: "有効",
    postalCode: "190-0012",
    address: "東京都立川市曙町2-8-3",
    fax: "042-678-9013",
    email: "info@takahashi-jyusetsu.co.jp",
    contactPerson: "高橋 誠",
    startDate: "2018/04/01",
    paymentSite: "翌月末",
    taxCalcMethod: "案件ごと（税込）",
    invoiceNumber: "T2222333344445",
    invoiceSendMethod: "メール",
    invoiceSendTo: "keiri@takahashi-jyusetsu.co.jp",
    monthlyBillingEstimate: 365000,
    lastMonthBilling: 388000,
    yearlyBillingTotal: 4520000,
    notes: "",
    history: [
      { datetime: "2018/04/01 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "c7",
    code: "C-0045",
    name: "関東揚重",
    housemaker: "ミサワホーム",
    fullPrice: 18000,
    halfPrice: 12000,
    phone: "03-789-0123",
    closingDay: "月末",
    monthlyProjects: 2,
    status: "有効",
    postalCode: "116-0013",
    address: "東京都荒川区西日暮里5-26-7",
    fax: "03-789-0124",
    email: "info@kanto-yoju.co.jp",
    contactPerson: "関東 一男",
    startDate: "2023/03/15",
    paymentSite: "翌月末",
    taxCalcMethod: "案件ごと（税込）",
    invoiceNumber: "T5555666677778",
    invoiceSendMethod: "メール",
    invoiceSendTo: "keiri@kanto-yoju.co.jp",
    monthlyBillingEstimate: 72000,
    lastMonthBilling: 84000,
    yearlyBillingTotal: 960000,
    notes: "",
    history: [
      { datetime: "2023/03/15 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "c8",
    code: "C-0052",
    name: "野村建設 川越支店",
    housemaker: "トヨタホーム",
    fullPrice: 17000,
    halfPrice: 11000,
    phone: "049-890-1234",
    closingDay: "20日",
    monthlyProjects: 4,
    status: "有効",
    postalCode: "350-0043",
    address: "埼玉県川越市新富町1-22-8",
    fax: "049-890-1235",
    email: "info@nomura-kawagoe.co.jp",
    contactPerson: "野村 正男",
    startDate: "2021/08/01",
    paymentSite: "翌月末",
    taxCalcMethod: "案件ごと（税込）",
    invoiceNumber: "T8888999900001",
    invoiceSendMethod: "メール",
    invoiceSendTo: "keiri@nomura-kawagoe.co.jp",
    monthlyBillingEstimate: 132000,
    lastMonthBilling: 148000,
    yearlyBillingTotal: 1680000,
    notes: "",
    history: [
      { datetime: "2021/08/01 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "c9",
    code: "C-0068",
    name: "渡辺工務店",
    housemaker: "一条工務店",
    fullPrice: 16500,
    halfPrice: 10500,
    phone: "048-901-2345",
    closingDay: "月末",
    monthlyProjects: 0,
    status: "無効",
    postalCode: "336-0021",
    address: "埼玉県さいたま市南区別所5-1-1",
    fax: "048-901-2346",
    email: "info@watanabe-koumuten.co.jp",
    contactPerson: "渡辺 清",
    startDate: "2017/04/01",
    paymentSite: "翌月末",
    taxCalcMethod: "案件ごと（税込）",
    invoiceNumber: "T3333444455556",
    invoiceSendMethod: "郵送",
    invoiceSendTo: "",
    monthlyBillingEstimate: 0,
    lastMonthBilling: 0,
    yearlyBillingTotal: 120000,
    notes: "2025年12月より取引停止",
    history: [
      { datetime: "2025/12/01 10:00", operator: "事務担当者A", content: "ステータスを無効に変更" },
      { datetime: "2017/04/01 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "c10",
    code: "C-0074",
    name: "佐々木ハウジング",
    housemaker: "積水ハウス",
    fullPrice: 20000,
    halfPrice: 13000,
    phone: "03-012-3456",
    closingDay: "25日",
    monthlyProjects: 6,
    status: "有効",
    postalCode: "171-0022",
    address: "東京都豊島区南池袋1-25-9",
    fax: "03-012-3457",
    email: "info@sasaki-housing.co.jp",
    contactPerson: "佐々木 隆",
    startDate: "2019/07/01",
    paymentSite: "翌月末",
    taxCalcMethod: "案件ごと（税込）",
    invoiceNumber: "T6666777788889",
    invoiceSendMethod: "メール",
    invoiceSendTo: "keiri@sasaki-housing.co.jp",
    monthlyBillingEstimate: 238000,
    lastMonthBilling: 260000,
    yearlyBillingTotal: 3060000,
    notes: "",
    history: [
      { datetime: "2019/07/01 09:00", operator: "社長", content: "新規登録" },
    ],
  },
]

// ── Sample Data: Workers ─────────────────────────────────────

export const workers: Worker[] = [
  {
    id: "w1", no: 1, name: "古市 英佑", furigana: "フルイチ エイスケ",
    employmentType: "個人事業主", fullPrice: 11200, halfPrice: 8200, distanceAllowance: 2000,
    phone: "090-1111-2222", startDate: "2020/04/01", monthlyWork: "38H", monthlyAdvance: 60000, status: "在籍",
    birthDate: "1990/05/12", email: "furuichi@example.com", postalCode: "332-0001",
    address: "埼玉県川口市朝日1-1-1", nearestStation: "JR川口駅",
    qualifications: ["フォークリフト", "玉掛け"], emergencyContact: "古市 花子（妻）090-1111-3333",
    earlyAllowance: 1500, holidayAllowanceRate: 25,
    bankName: "三菱UFJ銀行", branchName: "川口支店", accountType: "普通", accountNumber: "****1234", accountHolder: "フルイチ エイスケ",
    annualLeave: 10, usedLeave: 2, remainingLeave: 8, nextLeaveDate: "2027/04/01",
    monthlyPayEstimate: 280000, notes: "",
    history: [
      { datetime: "2026/01/15 10:00", operator: "事務担当者A", content: "遠方手当を更新（¥1,500→¥2,000）" },
      { datetime: "2020/04/01 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "w2", no: 3, name: "鈴木 大地", furigana: "スズキ ダイチ",
    employmentType: "個人事業主", fullPrice: 11200, halfPrice: 8200, distanceAllowance: 2000,
    phone: "090-2222-3333", startDate: "2021/06/15", monthlyWork: "34H", monthlyAdvance: 32000, status: "在籍",
    birthDate: "1992/08/20", email: "suzuki.d@example.com", postalCode: "336-0018",
    address: "埼玉県さいたま市南区南本町2-4-6", nearestStation: "JR南浦和駅",
    qualifications: ["玉掛け"], emergencyContact: "鈴木 太郎（父）090-2222-4444",
    earlyAllowance: 1500, holidayAllowanceRate: 25,
    bankName: "みずほ銀行", branchName: "浦和支店", accountType: "普通", accountNumber: "****5678", accountHolder: "スズキ ダイチ",
    annualLeave: 10, usedLeave: 4, remainingLeave: 6, nextLeaveDate: "2027/06/15",
    monthlyPayEstimate: 245000, notes: "",
    history: [
      { datetime: "2021/06/15 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "w3", no: 5, name: "石黒 豪", furigana: "イシグロ ゴウ",
    employmentType: "個人事業主", fullPrice: 12000, halfPrice: 8500, distanceAllowance: 2500,
    phone: "090-3333-4444", startDate: "2019/08/01", monthlyWork: "42H", monthlyAdvance: 32000, status: "在籍",
    birthDate: "1988/01/30", email: "ishiguro@example.com", postalCode: "330-0072",
    address: "埼玉県さいたま市浦和区領家5-3-2", nearestStation: "JR北浦和駅",
    qualifications: ["フォークリフト", "玉掛け", "足場組立"], emergencyContact: "石黒 美和（妻）090-3333-5555",
    earlyAllowance: 2000, holidayAllowanceRate: 25,
    bankName: "りそな銀行", branchName: "浦和支店", accountType: "普通", accountNumber: "****9012", accountHolder: "イシグロ ゴウ",
    annualLeave: 12, usedLeave: 1, remainingLeave: 11, nextLeaveDate: "2026/08/01",
    monthlyPayEstimate: 360000, notes: "ベテラン。単価個別設定あり。",
    history: [
      { datetime: "2025/04/01 11:00", operator: "事務担当者A", content: "フル単価を更新（¥11,200→¥12,000）ハーフ単価を更新（¥8,200→¥8,500）" },
      { datetime: "2019/08/01 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "w4", no: 7, name: "田村 拓也", furigana: "タムラ タクヤ",
    employmentType: "アルバイト", fullPrice: 9000, halfPrice: 6000, distanceAllowance: 2000,
    phone: "080-4444-5555", startDate: "2023/01/10", monthlyWork: "28H", monthlyAdvance: 28000, status: "在籍",
    birthDate: "2001/11/05", email: "tamura@example.com", postalCode: "333-0801",
    address: "埼玉県川口市東川口1-5-8", nearestStation: "JR東川口駅",
    qualifications: [], emergencyContact: "田村 一郎（父）080-4444-6666",
    earlyAllowance: 1500, holidayAllowanceRate: 25,
    bankName: "三井住友銀行", branchName: "川口支店", accountType: "普通", accountNumber: "****3456", accountHolder: "タムラ タクヤ",
    annualLeave: 5, usedLeave: 1, remainingLeave: 4, nextLeaveDate: "2027/01/10",
    monthlyPayEstimate: 168000, notes: "",
    history: [
      { datetime: "2023/01/10 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "w5", no: 8, name: "佐藤 祐輔", furigana: "サトウ ユウスケ",
    employmentType: "個人事業主", fullPrice: 11200, halfPrice: 8200, distanceAllowance: 2000,
    phone: "090-5555-6666", startDate: "2022/03/01", monthlyWork: "36H", monthlyAdvance: 128000, status: "在籍",
    birthDate: "1995/03/15", email: "sato.yusuke@example.com", postalCode: "332-0015",
    address: "埼玉県川口市川口3-2-1", nearestStation: "JR川口駅",
    qualifications: ["フォークリフト", "玉掛け"], emergencyContact: "佐藤 太郎（父）090-0000-0000",
    earlyAllowance: 1500, holidayAllowanceRate: 25,
    bankName: "三井住友銀行", branchName: "川口支店", accountType: "普通", accountNumber: "****5678", accountHolder: "サトウ ユウスケ",
    annualLeave: 10, usedLeave: 3, remainingLeave: 7, nextLeaveDate: "2027/03/01",
    monthlyPayEstimate: 247000, notes: "",
    history: [
      { datetime: "2026/02/22 09:15", operator: "作業員本人（申請承認）", content: "口座情報を変更" },
      { datetime: "2026/01/05 11:00", operator: "事務担当者A", content: "遠方手当を更新（¥1,500→¥2,000）" },
      { datetime: "2022/03/01 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "w6", no: 10, name: "真部 義明", furigana: "マナベ ヨシアキ",
    employmentType: "個人事業主", fullPrice: 11500, halfPrice: 8400, distanceAllowance: 3000,
    phone: "090-6666-7777", startDate: "2021/11/20", monthlyWork: "30H", monthlyAdvance: 64000, status: "在籍",
    birthDate: "1987/07/22", email: "manabe@example.com", postalCode: "338-0001",
    address: "埼玉県さいたま市中央区上落合2-1-3", nearestStation: "JR北与野駅",
    qualifications: ["フォークリフト"], emergencyContact: "真部 恵子（妻）090-6666-8888",
    earlyAllowance: 1500, holidayAllowanceRate: 25,
    bankName: "埼玉りそな銀行", branchName: "大宮支店", accountType: "普通", accountNumber: "****7890", accountHolder: "マナベ ヨシアキ",
    annualLeave: 10, usedLeave: 5, remainingLeave: 5, nextLeaveDate: "2026/11/20",
    monthlyPayEstimate: 255000, notes: "単価個別設定あり。遠方手当高め。",
    history: [
      { datetime: "2025/11/01 10:00", operator: "事務担当者A", content: "フル単価を更新（¥11,200→¥11,500）ハーフ単価を更新（¥8,200→¥8,400）遠方手当を更新（¥2,000→¥3,000）" },
      { datetime: "2021/11/20 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "w7", no: 12, name: "堀内 禅", furigana: "ホリウチ ゼン",
    employmentType: "アルバイト", fullPrice: 9000, halfPrice: 6000, distanceAllowance: 2000,
    phone: "080-7777-8888", startDate: "2024/05/01", monthlyWork: "26H", monthlyAdvance: 28000, status: "在籍",
    birthDate: "2003/04/10", email: "horiuchi@example.com", postalCode: "332-0034",
    address: "埼玉県川口市並木3-10-5", nearestStation: "JR西川口駅",
    qualifications: [], emergencyContact: "堀内 修（父）080-7777-9999",
    earlyAllowance: 1500, holidayAllowanceRate: 25,
    bankName: "三菱UFJ銀行", branchName: "西川口支店", accountType: "普通", accountNumber: "****2345", accountHolder: "ホリウチ ゼン",
    annualLeave: 5, usedLeave: 0, remainingLeave: 5, nextLeaveDate: "2027/05/01",
    monthlyPayEstimate: 156000, notes: "",
    history: [
      { datetime: "2024/05/01 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "w8", no: 15, name: "渡邊 良平", furigana: "ワタナベ リョウヘイ",
    employmentType: "個人事業主", fullPrice: 11200, halfPrice: 8200, distanceAllowance: 2000,
    phone: "090-8888-9999", startDate: "2023/07/15", monthlyWork: "30H", monthlyAdvance: 30000, status: "在籍",
    birthDate: "1993/12/01", email: "watanabe.r@example.com", postalCode: "337-0042",
    address: "埼玉県さいたま市見沼区南中野1-8-2", nearestStation: "JR大和田駅",
    qualifications: ["玉掛け"], emergencyContact: "渡邊 花子（母）090-8888-0000",
    earlyAllowance: 1500, holidayAllowanceRate: 25,
    bankName: "みずほ銀行", branchName: "大宮支店", accountType: "普通", accountNumber: "****6789", accountHolder: "ワタナベ リョウヘイ",
    annualLeave: 10, usedLeave: 2, remainingLeave: 8, nextLeaveDate: "2027/07/15",
    monthlyPayEstimate: 216000, notes: "",
    history: [
      { datetime: "2023/07/15 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "w9", no: 18, name: "山本 健太", furigana: "ヤマモト ケンタ",
    employmentType: "アルバイト", fullPrice: 9500, halfPrice: 6500, distanceAllowance: 2000,
    phone: "070-9999-0000", startDate: "2024/09/01", monthlyWork: "22H", monthlyAdvance: 0, status: "在籍",
    birthDate: "2000/06/18", email: "yamamoto.k@example.com", postalCode: "333-0844",
    address: "埼玉県川口市上青木2-15-3", nearestStation: "SR鳩ヶ谷駅",
    qualifications: [], emergencyContact: "山本 和子（母）070-9999-1111",
    earlyAllowance: 1500, holidayAllowanceRate: 25,
    bankName: "りそな銀行", branchName: "川口支店", accountType: "普通", accountNumber: "****0123", accountHolder: "ヤマモト ケンタ",
    annualLeave: 5, usedLeave: 0, remainingLeave: 5, nextLeaveDate: "2027/09/01",
    monthlyPayEstimate: 143000, notes: "アルバイトだがデフォルトより高い単価設定",
    history: [
      { datetime: "2024/09/01 09:00", operator: "社長", content: "新規登録（単価カスタム: フル¥9,500 / ハーフ¥6,500）" },
    ],
  },
  {
    id: "w10", no: 20, name: "吉井 明彦", furigana: "ヨシイ アキヒコ",
    employmentType: "アルバイト", fullPrice: 9000, halfPrice: 6000, distanceAllowance: 2000,
    phone: "080-0000-1111", startDate: "2025/02/01", monthlyWork: "18H", monthlyAdvance: 0, status: "在籍",
    birthDate: "2002/09/25", email: "yoshii@example.com", postalCode: "332-0016",
    address: "埼玉県川口市幸町1-3-7", nearestStation: "JR川口駅",
    qualifications: [], emergencyContact: "吉井 由美子（母）080-0000-2222",
    earlyAllowance: 1500, holidayAllowanceRate: 25,
    bankName: "三井住友銀行", branchName: "川口支店", accountType: "普通", accountNumber: "****4567", accountHolder: "ヨシイ アキヒコ",
    annualLeave: 5, usedLeave: 1, remainingLeave: 4, nextLeaveDate: "2027/02/01",
    monthlyPayEstimate: 108000, notes: "",
    history: [
      { datetime: "2025/02/01 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "w11", no: 22, name: "石崎 剛哉", furigana: "イシザキ ゴウヤ",
    employmentType: "個人事業主", fullPrice: 11200, halfPrice: 8200, distanceAllowance: 2500,
    phone: "090-1234-5678", startDate: "2022/08/10", monthlyWork: "40H", monthlyAdvance: 32000, status: "在籍",
    birthDate: "1991/03/08", email: "ishizaki@example.com", postalCode: "330-0062",
    address: "埼玉県さいたま市浦和区仲町4-2-1", nearestStation: "JR浦和駅",
    qualifications: ["フォークリフト", "玉掛け"], emergencyContact: "石崎 美咲（妻）090-1234-6789",
    earlyAllowance: 1500, holidayAllowanceRate: 25,
    bankName: "埼玉りそな銀行", branchName: "浦和支店", accountType: "普通", accountNumber: "****8901", accountHolder: "イシザキ ゴウヤ",
    annualLeave: 10, usedLeave: 3, remainingLeave: 7, nextLeaveDate: "2026/08/10",
    monthlyPayEstimate: 310000, notes: "",
    history: [
      { datetime: "2022/08/10 09:00", operator: "社長", content: "新規登録" },
    ],
  },
  {
    id: "w12", no: 25, name: "下平 正史", furigana: "シモヒラ マサフミ",
    employmentType: "アルバイト", fullPrice: 9000, halfPrice: 6000, distanceAllowance: 2000,
    phone: "080-2345-6789", startDate: "2025/06/01", monthlyWork: "0H", monthlyAdvance: 0, status: "退職",
    birthDate: "1998/10/30", email: "shimohira@example.com", postalCode: "333-0861",
    address: "埼玉県川口市柳崎5-10-2", nearestStation: "JR東川口駅",
    qualifications: [], emergencyContact: "下平 正（父）080-2345-7890",
    earlyAllowance: 1500, holidayAllowanceRate: 25,
    bankName: "三菱UFJ銀行", branchName: "川口支店", accountType: "普通", accountNumber: "****2345", accountHolder: "シモヒラ マサフミ",
    annualLeave: 0, usedLeave: 0, remainingLeave: 0, nextLeaveDate: "-",
    monthlyPayEstimate: 0, notes: "2025年12月退職",
    history: [
      { datetime: "2025/12/31 09:00", operator: "事務担当者A", content: "退職処理" },
      { datetime: "2025/06/01 09:00", operator: "社長", content: "新規登録" },
    ],
  },
]

// ── Sample Data: HouseMakers ─────────────────────────────────

export const houseMakers: HouseMaker[] = [
  { id: "hm1", code: "HM-001", name: "ミサワホーム", customerCount: 18, notes: "" },
  { id: "hm2", code: "HM-002", name: "積水ハウス", customerCount: 15, notes: "" },
  { id: "hm3", code: "HM-003", name: "大和ハウス", customerCount: 12, notes: "" },
  { id: "hm4", code: "HM-004", name: "住友林業", customerCount: 8, notes: "" },
  { id: "hm5", code: "HM-005", name: "セキスイハイム", customerCount: 7, notes: "" },
  { id: "hm6", code: "HM-006", name: "一条工務店", customerCount: 5, notes: "" },
  { id: "hm7", code: "HM-007", name: "トヨタホーム", customerCount: 4, notes: "" },
  { id: "hm8", code: "HM-008", name: "パナソニックホームズ", customerCount: 3, notes: "" },
]
