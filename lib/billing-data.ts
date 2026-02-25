// ===== Types =====

export type BillingStatus = "未発行" | "発行済み"

export interface BillingCustomer {
  id: string
  customerCode: string
  customerName: string
  closingDay: string
  projectCount: number
  manDays: number
  baseAmount: number
  transportCost: number
  allowances: number
  subtotal: number
  tax: number
  totalWithTax: number
  status: BillingStatus
}

export interface BillingDetail {
  workDate: string
  orderNumber: string
  siteName: string
  workType: "フル" | "ハーフ"
  manDays: number
  unitPrice: number
  baseAmount: number
  transportCost: number
  allowances: number
  lineTotal: number
}

export interface CustomerSummary {
  customerCode: string
  closingDay: string
  aggregationPeriod: string
  collectionCycle: string
  collectionDay: string
  taxCategory: string
  taxRounding: string
}

export interface BillingHistory {
  id: string
  billingMonth: string
  customerCode: string
  customerName: string
  closingDay: string
  totalWithTax: number
  issuedDate: string
}

export interface UnitPriceEntry {
  customerCode: string
  customerName: string
  fullPrice: number
  halfPrice: number
  overtimeBaseFull: string
  overtimeBaseHalf: string
  closingDay: string
  collectionCycle: string
  collectionDay: string
  taxCategory: string
  taxRounding: string
  invoiceLayout: string
  memo: string
}

// ===== Format utility =====

const jpyFormatter = new Intl.NumberFormat("ja-JP")

export function formatJPY(value: number): string {
  return `\u00A5${jpyFormatter.format(value)}`
}

export function formatNumber(value: number): string {
  return jpyFormatter.format(value)
}

// ===== Sample data: Billing customers (Tab 1) =====

export const billingCustomers: BillingCustomer[] = [
  {
    id: "1",
    customerCode: "100",
    customerName: "ミロク商事(株) 東京支店",
    closingDay: "20日",
    projectCount: 18,
    manDays: 32.0,
    baseAmount: 640000,
    transportCost: 18200,
    allowances: 24000,
    subtotal: 682200,
    tax: 68220,
    totalWithTax: 750420,
    status: "未発行",
  },
  {
    id: "2",
    customerCode: "101",
    customerName: "ミロク商事(株) 群馬支店",
    closingDay: "20日",
    projectCount: 8,
    manDays: 14.0,
    baseAmount: 280000,
    transportCost: 12600,
    allowances: 0,
    subtotal: 292600,
    tax: 29260,
    totalWithTax: 321860,
    status: "未発行",
  },
  {
    id: "3",
    customerCode: "200",
    customerName: "住友林業(株)",
    closingDay: "末日",
    projectCount: 22,
    manDays: 40.0,
    baseAmount: 880000,
    transportCost: 32400,
    allowances: 18000,
    subtotal: 930400,
    tax: 93040,
    totalWithTax: 1023440,
    status: "発行済み",
  },
  {
    id: "4",
    customerCode: "201",
    customerName: "積水ハウス(株)",
    closingDay: "末日",
    projectCount: 15,
    manDays: 28.0,
    baseAmount: 560000,
    transportCost: 22800,
    allowances: 12000,
    subtotal: 594800,
    tax: 59480,
    totalWithTax: 654280,
    status: "未発行",
  },
  {
    id: "5",
    customerCode: "300",
    customerName: "大和ハウス工業(株)",
    closingDay: "末日",
    projectCount: 12,
    manDays: 20.0,
    baseAmount: 440000,
    transportCost: 16000,
    allowances: 8000,
    subtotal: 464000,
    tax: 46400,
    totalWithTax: 510400,
    status: "発行済み",
  },
  {
    id: "6",
    customerCode: "301",
    customerName: "一条工務店(株)",
    closingDay: "末日",
    projectCount: 10,
    manDays: 18.0,
    baseAmount: 396000,
    transportCost: 14400,
    allowances: 6000,
    subtotal: 416400,
    tax: 41640,
    totalWithTax: 458040,
    status: "未発行",
  },
  {
    id: "7",
    customerCode: "400",
    customerName: "セキスイハイム(株)",
    closingDay: "末日",
    projectCount: 8,
    manDays: 15.0,
    baseAmount: 300000,
    transportCost: 10200,
    allowances: 0,
    subtotal: 310200,
    tax: 31020,
    totalWithTax: 341220,
    status: "発行済み",
  },
  {
    id: "8",
    customerCode: "401",
    customerName: "ミサワホーム(株)",
    closingDay: "末日",
    projectCount: 6,
    manDays: 10.0,
    baseAmount: 220000,
    transportCost: 8400,
    allowances: 4000,
    subtotal: 232400,
    tax: 23240,
    totalWithTax: 255640,
    status: "発行済み",
  },
]

// ===== Sample data: Detail line items for each customer =====

export const billingDetails: Record<string, BillingDetail[]> = {
  "100": [
    { workDate: "2/1", orderNumber: "26-004401", siteName: "尾﨑 洋子 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1120, allowances: 0, lineTotal: 41120 },
    { workDate: "2/3", orderNumber: "26-004412", siteName: "加瀬 典之 邸", workType: "ハーフ", manDays: 1, unitPrice: 10000, baseAmount: 10000, transportCost: 560, allowances: 2000, lineTotal: 12560 },
    { workDate: "2/4", orderNumber: "26-004418", siteName: "田中 太郎 邸", workType: "フル", manDays: 3, unitPrice: 20000, baseAmount: 60000, transportCost: 1680, allowances: 3000, lineTotal: 64680 },
    { workDate: "2/6", orderNumber: "26-004425", siteName: "山本 花子 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1120, allowances: 2000, lineTotal: 43120 },
    { workDate: "2/7", orderNumber: "26-004430", siteName: "佐藤 一郎 邸", workType: "ハーフ", manDays: 1, unitPrice: 10000, baseAmount: 10000, transportCost: 560, allowances: 0, lineTotal: 10560 },
    { workDate: "2/8", orderNumber: "26-004435", siteName: "鈴木 次郎 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1120, allowances: 2000, lineTotal: 43120 },
    { workDate: "2/10", orderNumber: "26-004441", siteName: "高橋 三郎 邸", workType: "フル", manDays: 3, unitPrice: 20000, baseAmount: 60000, transportCost: 1680, allowances: 0, lineTotal: 61680 },
    { workDate: "2/12", orderNumber: "26-004448", siteName: "伊藤 四郎 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1120, allowances: 3000, lineTotal: 44120 },
    { workDate: "2/13", orderNumber: "26-004452", siteName: "渡辺 五郎 邸", workType: "ハーフ", manDays: 1, unitPrice: 10000, baseAmount: 10000, transportCost: 560, allowances: 0, lineTotal: 10560 },
    { workDate: "2/14", orderNumber: "26-004457", siteName: "中村 六郎 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1120, allowances: 2000, lineTotal: 43120 },
    { workDate: "2/15", orderNumber: "26-004461", siteName: "小林 七郎 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1120, allowances: 2000, lineTotal: 43120 },
    { workDate: "2/17", orderNumber: "26-004468", siteName: "加藤 八郎 邸", workType: "フル", manDays: 3, unitPrice: 20000, baseAmount: 60000, transportCost: 1680, allowances: 3000, lineTotal: 64680 },
    { workDate: "2/18", orderNumber: "26-004472", siteName: "吉田 九郎 邸", workType: "ハーフ", manDays: 1, unitPrice: 10000, baseAmount: 10000, transportCost: 560, allowances: 2000, lineTotal: 12560 },
    { workDate: "2/19", orderNumber: "26-004476", siteName: "松本 十郎 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1120, allowances: 0, lineTotal: 41120 },
    { workDate: "2/20", orderNumber: "26-004480", siteName: "井上 十一 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1120, allowances: 0, lineTotal: 41120 },
    { workDate: "2/3", orderNumber: "26-004413", siteName: "木村 正 邸", workType: "フル", manDays: 1, unitPrice: 20000, baseAmount: 20000, transportCost: 560, allowances: 1000, lineTotal: 21560 },
    { workDate: "2/10", orderNumber: "26-004442", siteName: "林 誠 邸", workType: "フル", manDays: 1, unitPrice: 20000, baseAmount: 20000, transportCost: 560, allowances: 1000, lineTotal: 21560 },
    { workDate: "2/14", orderNumber: "26-004458", siteName: "清水 健 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1120, allowances: 1000, lineTotal: 42120 },
  ],
  "101": [
    { workDate: "2/2", orderNumber: "26-004405", siteName: "斎藤 明 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1680, allowances: 0, lineTotal: 41680 },
    { workDate: "2/5", orderNumber: "26-004420", siteName: "石井 光 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1680, allowances: 0, lineTotal: 41680 },
    { workDate: "2/8", orderNumber: "26-004436", siteName: "前田 茂 邸", workType: "ハーフ", manDays: 1, unitPrice: 10000, baseAmount: 10000, transportCost: 840, allowances: 0, lineTotal: 10840 },
    { workDate: "2/12", orderNumber: "26-004449", siteName: "藤田 進 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1680, allowances: 0, lineTotal: 41680 },
    { workDate: "2/14", orderNumber: "26-004459", siteName: "後藤 武 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1680, allowances: 0, lineTotal: 41680 },
    { workDate: "2/16", orderNumber: "26-004463", siteName: "天野 勇 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1680, allowances: 0, lineTotal: 41680 },
    { workDate: "2/18", orderNumber: "26-004473", siteName: "岡田 弘 邸", workType: "フル", manDays: 2, unitPrice: 20000, baseAmount: 40000, transportCost: 1680, allowances: 0, lineTotal: 41680 },
    { workDate: "2/20", orderNumber: "26-004481", siteName: "金子 誠一 邸", workType: "フル", manDays: 1, unitPrice: 20000, baseAmount: 30000, transportCost: 1680, allowances: 0, lineTotal: 31680 },
  ],
  "200": [
    { workDate: "2/1", orderNumber: "26-004402", siteName: "新宿パークタワー", workType: "フル", manDays: 4, unitPrice: 22000, baseAmount: 88000, transportCost: 3200, allowances: 2000, lineTotal: 93200 },
    { workDate: "2/3", orderNumber: "26-004414", siteName: "渋谷クロスタワー", workType: "フル", manDays: 3, unitPrice: 22000, baseAmount: 66000, transportCost: 2400, allowances: 0, lineTotal: 68400 },
    { workDate: "2/5", orderNumber: "26-004421", siteName: "品川インターシティ", workType: "フル", manDays: 2, unitPrice: 22000, baseAmount: 44000, transportCost: 1600, allowances: 2000, lineTotal: 47600 },
    { workDate: "2/7", orderNumber: "26-004431", siteName: "六本木ヒルズ別棟", workType: "ハーフ", manDays: 2, unitPrice: 11000, baseAmount: 22000, transportCost: 1600, allowances: 0, lineTotal: 23600 },
    { workDate: "2/10", orderNumber: "26-004443", siteName: "目黒リバーサイド", workType: "フル", manDays: 3, unitPrice: 22000, baseAmount: 66000, transportCost: 2400, allowances: 2000, lineTotal: 70400 },
    { workDate: "2/12", orderNumber: "26-004450", siteName: "世田谷ガーデン", workType: "フル", manDays: 2, unitPrice: 22000, baseAmount: 44000, transportCost: 1600, allowances: 0, lineTotal: 45600 },
    { workDate: "2/14", orderNumber: "26-004460", siteName: "池袋サンシャイン隣", workType: "フル", manDays: 3, unitPrice: 22000, baseAmount: 66000, transportCost: 2400, allowances: 2000, lineTotal: 70400 },
    { workDate: "2/17", orderNumber: "26-004469", siteName: "大手町タワー", workType: "フル", manDays: 4, unitPrice: 22000, baseAmount: 88000, transportCost: 3200, allowances: 2000, lineTotal: 93200 },
    { workDate: "2/19", orderNumber: "26-004477", siteName: "丸の内ビル", workType: "フル", manDays: 3, unitPrice: 22000, baseAmount: 66000, transportCost: 2400, allowances: 2000, lineTotal: 70400 },
    { workDate: "2/21", orderNumber: "26-004483", siteName: "銀座コリドー", workType: "フル", manDays: 2, unitPrice: 22000, baseAmount: 44000, transportCost: 1600, allowances: 0, lineTotal: 45600 },
    { workDate: "2/22", orderNumber: "26-004485", siteName: "上野パークサイド", workType: "ハーフ", manDays: 2, unitPrice: 11000, baseAmount: 22000, transportCost: 1600, allowances: 2000, lineTotal: 25600 },
    { workDate: "2/24", orderNumber: "26-004490", siteName: "浅草ビューサイト", workType: "フル", manDays: 2, unitPrice: 22000, baseAmount: 44000, transportCost: 1600, allowances: 0, lineTotal: 45600 },
    { workDate: "2/25", orderNumber: "26-004492", siteName: "東京ベイエリア", workType: "フル", manDays: 3, unitPrice: 22000, baseAmount: 66000, transportCost: 2400, allowances: 2000, lineTotal: 70400 },
    { workDate: "2/26", orderNumber: "26-004495", siteName: "秋葉原UDX", workType: "フル", manDays: 2, unitPrice: 22000, baseAmount: 44000, transportCost: 1600, allowances: 0, lineTotal: 45600 },
    { workDate: "2/27", orderNumber: "26-004498", siteName: "お台場シーサイド", workType: "フル", manDays: 3, unitPrice: 22000, baseAmount: 66000, transportCost: 2400, allowances: 2000, lineTotal: 70400 },
  ],
}

export const customerSummaries: Record<string, CustomerSummary> = {
  "100": {
    customerCode: "100",
    closingDay: "20日",
    aggregationPeriod: "2026/01/21 - 2026/02/20",
    collectionCycle: "翌月",
    collectionDay: "20日",
    taxCategory: "外税",
    taxRounding: "四捨五入",
  },
  "101": {
    customerCode: "101",
    closingDay: "20日",
    aggregationPeriod: "2026/01/21 - 2026/02/20",
    collectionCycle: "翌月",
    collectionDay: "20日",
    taxCategory: "外税",
    taxRounding: "四捨五入",
  },
  "200": {
    customerCode: "200",
    closingDay: "末日",
    aggregationPeriod: "2026/02/01 - 2026/02/28",
    collectionCycle: "翌月",
    collectionDay: "末日",
    taxCategory: "外税",
    taxRounding: "四捨五入",
  },
  "201": {
    customerCode: "201",
    closingDay: "末日",
    aggregationPeriod: "2026/02/01 - 2026/02/28",
    collectionCycle: "翌々月",
    collectionDay: "末日",
    taxCategory: "外税",
    taxRounding: "四捨五入",
  },
  "300": {
    customerCode: "300",
    closingDay: "末日",
    aggregationPeriod: "2026/02/01 - 2026/02/28",
    collectionCycle: "翌月",
    collectionDay: "末日",
    taxCategory: "外税",
    taxRounding: "四捨五入",
  },
  "301": {
    customerCode: "301",
    closingDay: "末日",
    aggregationPeriod: "2026/02/01 - 2026/02/28",
    collectionCycle: "翌月",
    collectionDay: "末日",
    taxCategory: "外税",
    taxRounding: "四捨五入",
  },
  "400": {
    customerCode: "400",
    closingDay: "末日",
    aggregationPeriod: "2026/02/01 - 2026/02/28",
    collectionCycle: "翌月",
    collectionDay: "末日",
    taxCategory: "外税",
    taxRounding: "四捨五入",
  },
  "401": {
    customerCode: "401",
    closingDay: "末日",
    aggregationPeriod: "2026/02/01 - 2026/02/28",
    collectionCycle: "翌々月",
    collectionDay: "末日",
    taxCategory: "外税",
    taxRounding: "四捨五入",
  },
}

// ===== Sample data: Billing history (Tab 2) =====

export const billingHistory: BillingHistory[] = [
  { id: "h1", billingMonth: "2026/01", customerCode: "100", customerName: "ミロク商事(株) 東京支店", closingDay: "20日", totalWithTax: 698500, issuedDate: "2026/01/25" },
  { id: "h2", billingMonth: "2026/01", customerCode: "200", customerName: "住友林業(株)", closingDay: "末日", totalWithTax: 1105200, issuedDate: "2026/02/03" },
  { id: "h3", billingMonth: "2026/01", customerCode: "201", customerName: "積水ハウス(株)", closingDay: "末日", totalWithTax: 589600, issuedDate: "2026/02/03" },
  { id: "h4", billingMonth: "2025/12", customerCode: "100", customerName: "ミロク商事(株) 東京支店", closingDay: "20日", totalWithTax: 722100, issuedDate: "2025/12/25" },
  { id: "h5", billingMonth: "2025/12", customerCode: "300", customerName: "大和ハウス工業(株)", closingDay: "末日", totalWithTax: 478300, issuedDate: "2026/01/05" },
]

// ===== Sample data: Unit price settings (Tab 3) =====

export const unitPriceSettings: UnitPriceEntry[] = [
  { customerCode: "100", customerName: "ミロク商事(株) 東京支店", fullPrice: 20000, halfPrice: 10000, overtimeBaseFull: "08:00", overtimeBaseHalf: "04:00", closingDay: "20日", collectionCycle: "翌月", collectionDay: "20日", taxCategory: "外税", taxRounding: "四捨五入", invoiceLayout: "時間のみ", memo: "フル作業20,000円、ハーフ10,000円。2026/04改定予定" },
  { customerCode: "101", customerName: "ミロク商事(株) 群馬支店", fullPrice: 20000, halfPrice: 10000, overtimeBaseFull: "08:00", overtimeBaseHalf: "04:00", closingDay: "20日", collectionCycle: "翌月", collectionDay: "20日", taxCategory: "外税", taxRounding: "四捨五入", invoiceLayout: "時間のみ", memo: "" },
  { customerCode: "200", customerName: "住友林業(株)", fullPrice: 22000, halfPrice: 11000, overtimeBaseFull: "08:00", overtimeBaseHalf: "04:00", closingDay: "末日", collectionCycle: "翌月", collectionDay: "末日", taxCategory: "外税", taxRounding: "四捨五入", invoiceLayout: "詳細", memo: "2025/10より単価改定済み" },
  { customerCode: "201", customerName: "積水ハウス(株)", fullPrice: 20000, halfPrice: 10000, overtimeBaseFull: "08:00", overtimeBaseHalf: "04:00", closingDay: "末日", collectionCycle: "翌々月", collectionDay: "末日", taxCategory: "外税", taxRounding: "四捨五入", invoiceLayout: "時間のみ", memo: "" },
  { customerCode: "300", customerName: "大和ハウス工業(株)", fullPrice: 22000, halfPrice: 12000, overtimeBaseFull: "08:00", overtimeBaseHalf: "04:00", closingDay: "末日", collectionCycle: "翌月", collectionDay: "末日", taxCategory: "外税", taxRounding: "四捨五入", invoiceLayout: "詳細", memo: "ハーフ単価12,000円" },
  { customerCode: "301", customerName: "一条工務店(株)", fullPrice: 22000, halfPrice: 11000, overtimeBaseFull: "08:00", overtimeBaseHalf: "04:00", closingDay: "末日", collectionCycle: "翌月", collectionDay: "末日", taxCategory: "外税", taxRounding: "四捨五入", invoiceLayout: "時間のみ", memo: "" },
  { customerCode: "400", customerName: "セキスイハイム(株)", fullPrice: 20000, halfPrice: 10000, overtimeBaseFull: "08:00", overtimeBaseHalf: "04:00", closingDay: "末日", collectionCycle: "翌月", collectionDay: "末日", taxCategory: "外税", taxRounding: "四捨五入", invoiceLayout: "時間のみ", memo: "" },
  { customerCode: "401", customerName: "ミサワホーム(株)", fullPrice: 22000, halfPrice: 11000, overtimeBaseFull: "08:00", overtimeBaseHalf: "04:00", closingDay: "末日", collectionCycle: "翌々月", collectionDay: "末日", taxCategory: "外税", taxRounding: "四捨五入", invoiceLayout: "詳細", memo: "" },
]
