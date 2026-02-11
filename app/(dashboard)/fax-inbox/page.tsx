"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight, X, CheckCircle2, PanelLeftClose, PanelLeftOpen, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { PdfViewer } from "@/components/pdf-viewer"

// Dummy FAX data
const dummyFaxList = [
  {
    id: 1,
    dateTime: "2026-01-15T09:00",
    tradingPartner: "ジューテック開発2",
    siteName: "ライオンズマンション麹町501",
    status: "unconfirmed" as const,
    housemaker: "朝日・マンション住替センター",
    address: "千代田区麹町2-5-3",
    contactName: "前田",
    contactPhone: "070-3277-6870",
    notes: "※挨拶やマナー等しっかりと、注意事項沢山ありますのでご注意下さい\n※動力の方は邪魔にならない所へ仮停車し、管理人室へ停車可能場所を確認する事\n※共用部への仮置きは極力控え、やむを得ず置く場合は養生をする等十分に注意する事",
    workContent: "【2F外階段3段の内右：0331】\nシステムキッチン一式の搬入(職方様不在、運転手と作業開始して下さい)\nトラック到着：9：20～9：40\n※安全靴・上履き着用の事!\n※現場及び現場周辺（路上含む）は禁煙",
    nearestStation: "半蔵門駅",
    walkingDistance: "110",
    workers: "4名ハーフ作業",
    transportCost: "5000",
  },
  {
    id: 2,
    dateTime: "2026-01-15T11:00",
    tradingPartner: "加藤ベニヤ本社",
    siteName: "新井　彰 邸",
    status: "unconfirmed" as const,
    housemaker: "ミサワホーム",
    address: "目黒区八雲1-10-8付近",
    contactName: "向井監督",
    contactPhone: "090-3230-3347",
    notes: "※安全靴・上履き着用の事!\n※タオル巻き禁止!\n※現場内及び周辺(路上含む)は禁煙",
    workContent: "（外差し）\n12　3×6　1F37　2F45\n強12　3×6　3F4\n強15　3×8　1F10　2F10　3F10\nバリア強12　3×6　1F3　2F3\nバリア強15　3×8　1F1\nSH12　3×6　2F21　3F22\n　合計　166枚",
    nearestStation: "都立大学",
    walkingDistance: "500",
    workers: "4名ハーフ作業",
    transportCost: "4500",
  },
  {
    id: 3,
    dateTime: "2026-01-15T13:00",
    tradingPartner: "加藤ベニヤ本社",
    siteName: "大田区西蒲田301②　2号棟",
    status: "unconfirmed" as const,
    housemaker: "ホークワン",
    address: "大田区西蒲田3-1-7",
    contactName: "竹村監督",
    contactPhone: "080-5544-1263",
    notes: "※作業前、作業後に必ず入場者名簿を記入!(記入モレは戻ってもらう事になります)\n※建物内土足厳禁\n※角欠けや破損に注意!(以前ご指摘あり)\n※安全靴・上履き着用の事!\n※タオル巻き禁止!\n※現場内及び周辺(路上含む)は禁煙",
    workContent: "(3F建・2TS現場・キーBOX№5741)\n15　3×9　1F40　2F50　3F63\n強15　3×6　1F14　2F25　3F21\n　合計　213枚",
    nearestStation: "蓮沼駅",
    walkingDistance: "830",
    workers: "3名ハーフ作業",
    transportCost: "4000",
  },
  {
    id: 4,
    dateTime: "2026-01-14T15:30",
    tradingPartner: "ジューテック開発2",
    siteName: "品川区南大井マンション",
    status: "confirmed" as const,
    housemaker: "住友不動産",
    address: "品川区南大井4-5-6",
    contactName: "山田",
    contactPhone: "03-1234-5678",
    notes: "※エレベーター使用可\n※駐車場あり",
    workContent: "システムバス搬入",
    nearestStation: "大森駅",
    walkingDistance: "300",
    workers: "3名作業",
    transportCost: "3500",
  },
  {
    id: 5,
    dateTime: "2026-01-14T17:00",
    tradingPartner: "東京建材",
    siteName: "世田谷区上野毛邸",
    status: "finalized" as const,
    housemaker: "積水ハウス",
    address: "世田谷区上野毛2-3-4",
    contactName: "佐藤",
    contactPhone: "090-9876-5432",
    notes: "※静かに作業すること",
    workContent: "フローリング材搬入\n合計 50枚",
    nearestStation: "上野毛駅",
    walkingDistance: "200",
    workers: "2名作業",
    transportCost: "3000",
  },
  {
    id: 6,
    dateTime: "2026-01-14T10:00",
    tradingPartner: "日本建材",
    siteName: "港区芝公園ビル",
    status: "unconfirmed" as const,
    housemaker: "大成建設",
    address: "港区芝公園1-2-3",
    contactName: "田中",
    contactPhone: "03-5555-1234",
    notes: "※セキュリティカード必要",
    workContent: "建材搬入一式",
    nearestStation: "芝公園駅",
    walkingDistance: "150",
    workers: "4名作業",
    transportCost: "4200",
  },
  {
    id: 7,
    dateTime: "2026-01-13T09:00",
    tradingPartner: "ジューテック開発2",
    siteName: "渋谷区恵比寿マンション",
    status: "finalized" as const,
    housemaker: "野村不動産",
    address: "渋谷区恵比寿1-2-3",
    contactName: "高橋",
    contactPhone: "03-4444-5555",
    notes: "",
    workContent: "キッチン設備搬入",
    nearestStation: "恵比寿駅",
    walkingDistance: "400",
    workers: "3名作業",
    transportCost: "3800",
  },
  {
    id: 8,
    dateTime: "2026-01-13T14:00",
    tradingPartner: "加藤ベニヤ本社",
    siteName: "新宿区西新宿ビル",
    status: "confirmed" as const,
    housemaker: "清水建設",
    address: "新宿区西新宿6-7-8",
    contactName: "伊藤",
    contactPhone: "03-6666-7777",
    notes: "※地下駐車場使用可",
    workContent: "内装材搬入",
    nearestStation: "西新宿駅",
    walkingDistance: "250",
    workers: "5名作業",
    transportCost: "4000",
  },
  {
    id: 9,
    dateTime: "2026-01-12T11:00",
    tradingPartner: "東京建材",
    siteName: "中央区銀座オフィス",
    status: "finalized" as const,
    housemaker: "鹿島建設",
    address: "中央区銀座3-4-5",
    contactName: "渡辺",
    contactPhone: "03-7777-8888",
    notes: "※搬入口は裏手",
    workContent: "OAフロア材搬入",
    nearestStation: "銀座駅",
    walkingDistance: "100",
    workers: "4名作業",
    transportCost: "5500",
  },
  {
    id: 10,
    dateTime: "2026-01-12T16:00",
    tradingPartner: "日本建材",
    siteName: "豊島区池袋マンション",
    status: "unconfirmed" as const,
    housemaker: "三井不動産",
    address: "豊島区池袋2-3-4",
    contactName: "小林",
    contactPhone: "03-8888-9999",
    notes: "※夜間作業禁止",
    workContent: "床材搬入\n合計 80枚",
    nearestStation: "池袋駅",
    walkingDistance: "350",
    workers: "3名作業",
    transportCost: "3200",
  },
  {
    id: 11,
    dateTime: "2026-01-11T09:30",
    tradingPartner: "ジューテック開発2",
    siteName: "文京区本郷邸",
    status: "confirmed" as const,
    housemaker: "住友林業",
    address: "文京区本郷5-6-7",
    contactName: "加藤",
    contactPhone: "03-1111-2222",
    notes: "",
    workContent: "木材搬入",
    nearestStation: "本郷三丁目駅",
    walkingDistance: "180",
    workers: "2名作業",
    transportCost: "2800",
  },
  {
    id: 12,
    dateTime: "2026-01-11T13:00",
    tradingPartner: "加藤ベニヤ本社",
    siteName: "台東区上野ビル",
    status: "unconfirmed" as const,
    housemaker: "大林組",
    address: "台東区上野1-2-3",
    contactName: "斎藤",
    contactPhone: "03-2222-3333",
    notes: "※荷物用エレベーター使用",
    workContent: "建材一式搬入",
    nearestStation: "上野駅",
    walkingDistance: "220",
    workers: "4名作業",
    transportCost: "3600",
  },
  {
    id: 13,
    dateTime: "2026-01-10T10:00",
    tradingPartner: "東京建材",
    siteName: "墨田区錦糸町マンション",
    status: "finalized" as const,
    housemaker: "東急不動産",
    address: "墨田区錦糸4-5-6",
    contactName: "松本",
    contactPhone: "03-3333-4444",
    notes: "",
    workContent: "フローリング搬入",
    nearestStation: "錦糸町駅",
    walkingDistance: "280",
    workers: "3名作業",
    transportCost: "3400",
  },
  {
    id: 14,
    dateTime: "2026-01-10T15:00",
    tradingPartner: "日本建材",
    siteName: "江東区豊洲タワー",
    status: "confirmed" as const,
    housemaker: "三菱地所",
    address: "江東区豊洲3-4-5",
    contactName: "井上",
    contactPhone: "03-4444-5555",
    notes: "※タワー駐車場利用可",
    workContent: "内装建材搬入",
    nearestStation: "豊洲駅",
    walkingDistance: "150",
    workers: "5名作業",
    transportCost: "4800",
  },
  {
    id: 15,
    dateTime: "2026-01-09T11:00",
    tradingPartner: "ジューテック開発2",
    siteName: "杉並区荻窪邸",
    status: "unconfirmed" as const,
    housemaker: "パナソニックホームズ",
    address: "杉並区荻窪2-3-4",
    contactName: "木村",
    contactPhone: "03-5555-6666",
    notes: "※住宅街のため静かに",
    workContent: "システムキッチン搬入",
    nearestStation: "荻窪駅",
    walkingDistance: "400",
    workers: "3名作業",
    transportCost: "3900",
  },
]

type FaxStatus = "unconfirmed" | "confirmed" | "finalized"

interface FaxItem {
  id: number
  dateTime: string
  tradingPartner: string
  siteName: string
  status: FaxStatus
  housemaker: string
  address: string
  contactName: string
  contactPhone: string
  notes: string
  workContent: string
  nearestStation: string
  walkingDistance: string
  workers: string
  transportCost: string
}

// Field wrapper component
function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
        {!required && <span className="text-slate-400 text-xs ml-1">（オプション）</span>}
      </Label>
      {children}
    </div>
  )
}

function FaxInboxContent() {
  const router = useRouter()

  // FAX list state
  const [faxList, setFaxList] = useState<FaxItem[]>(dummyFaxList)
  const [selectedFaxId, setSelectedFaxId] = useState<number>(dummyFaxList[0].id)
  const [statusFilter, setStatusFilter] = useState<"all" | FaxStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  
  // Form state
  const selectedFax = faxList.find(f => f.id === selectedFaxId) || faxList[0]
  const [formData, setFormData] = useState({
    dateTime: selectedFax.dateTime,
    tradingPartner: selectedFax.tradingPartner,
    siteName: selectedFax.siteName,
    housemaker: selectedFax.housemaker,
    address: selectedFax.address,
    contactName: selectedFax.contactName,
    contactPhone: selectedFax.contactPhone,
    notes: selectedFax.notes,
    workContent: selectedFax.workContent,
    nearestStation: selectedFax.nearestStation,
    walkingDistance: selectedFax.walkingDistance,
    workers: selectedFax.workers,
    transportCost: selectedFax.transportCost,
  })

  // Filter FAX list
  const filteredFaxList = faxList.filter(fax => {
    const matchesStatus = statusFilter === "all" || fax.status === statusFilter
    const matchesSearch = searchQuery === "" || 
      fax.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fax.tradingPartner.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredFaxList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedFaxList = filteredFaxList.slice(startIndex, startIndex + itemsPerPage)
  const currentFaxIndex = filteredFaxList.findIndex(f => f.id === selectedFaxId)

  // Reset preview state
  const resetPreview = () => {
    setZoom(100)
    setRotation(0)
  }

  // Handle FAX selection
  const handleSelectFax = (fax: FaxItem) => {
    setSelectedFaxId(fax.id)
    // Reset zoom and rotation when switching FAX
    resetPreview()
    setFormData({
      dateTime: fax.dateTime,
      tradingPartner: fax.tradingPartner,
      siteName: fax.siteName,
      housemaker: fax.housemaker,
      address: fax.address,
      contactName: fax.contactName,
      contactPhone: fax.contactPhone,
      notes: fax.notes,
      workContent: fax.workContent,
      nearestStation: fax.nearestStation,
      walkingDistance: fax.walkingDistance,
      workers: fax.workers,
      transportCost: fax.transportCost,
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Auto-save: update the fax in the list
    setFaxList(prev => prev.map(fax => 
      fax.id === selectedFaxId 
        ? { ...fax, [field]: value, status: fax.status === "unconfirmed" ? "confirmed" : fax.status }
        : fax
    ))
  }

  const handleConfirmAndSend = () => {
    // Mark current FAX as finalized
    setFaxList(prev => prev.map(fax => 
      fax.id === selectedFaxId ? { ...fax, status: "finalized" as const } : fax
    ))
    setShowConfirmModal(false)
    
    // Move to next FAX or go back to dashboard
    const nextIndex = currentFaxIndex + 1
    if (nextIndex < filteredFaxList.length) {
      const nextFax = filteredFaxList[nextIndex]
      handleSelectFax(nextFax)
      // Check if we need to go to next page
      if (nextIndex >= startIndex + itemsPerPage) {
        setCurrentPage(prev => prev + 1)
      }
    } else {
      // Last FAX, go back to dashboard
      router.push("/dashboard")
    }
  }

  const handlePrevFax = () => {
    if (currentFaxIndex > 0) {
      const prevFax = filteredFaxList[currentFaxIndex - 1]
      handleSelectFax(prevFax)
      // Check if we need to go to previous page
      if (currentFaxIndex - 1 < startIndex) {
        setCurrentPage(prev => prev - 1)
      }
    }
  }

  const handleNextFax = () => {
    if (currentFaxIndex < filteredFaxList.length - 1) {
      const nextFax = filteredFaxList[currentFaxIndex + 1]
      handleSelectFax(nextFax)
      // Check if we need to go to next page
      if (currentFaxIndex + 1 >= startIndex + itemsPerPage) {
        setCurrentPage(prev => prev + 1)
      }
    }
  }

  const getStatusBadge = (status: FaxStatus) => {
    switch (status) {
      case "unconfirmed":
        return <Badge variant="secondary" className="bg-slate-100 text-slate-600">未確認</Badge>
      case "confirmed":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700">確認済</Badge>
      case "finalized":
        return <Badge variant="secondary" className="bg-green-100 text-green-700">確定済</Badge>
    }
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  }

  // PDF viewer state
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  // FAX list panel state (closed by default)
  const [isFaxListOpen, setIsFaxListOpen] = useState(false)

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col relative">
      {/* Page Header */}
      <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-slate-900">FAX確認</h1>
          <Badge variant="secondary" className="bg-slate-100 text-slate-600">
            進捗：{currentFaxIndex + 1} / {filteredFaxList.length}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFaxListOpen(!isFaxListOpen)}
          className="flex items-center gap-2"
        >
          {isFaxListOpen ? (
            <>
              <PanelLeftClose className="h-4 w-4" />
              FAXリストを閉じる
            </>
          ) : (
            <>
              <PanelLeftOpen className="h-4 w-4" />
              FAXリスト
            </>
          )}
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Slide-in FAX List Panel */}
        <div
          className={`absolute left-0 top-0 bottom-0 z-30 w-[300px] bg-white border-r border-slate-200 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isFaxListOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Panel Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-slate-900">FAX一覧</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFaxListOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-slate-500 mb-3">検索結果：{filteredFaxList.length}件</p>
            
            {/* Status Filter */}
            <div className="flex flex-wrap gap-1 mb-3">
              {[
                { value: "all", label: "すべて" },
                { value: "unconfirmed", label: "未確認" },
                { value: "confirmed", label: "確認済" },
                { value: "finalized", label: "確定済" },
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={statusFilter === value ? "default" : "outline"}
                  size="sm"
                  className={`text-xs px-2 py-1 h-7 ${statusFilter === value ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  onClick={() => {
                    setStatusFilter(value as "all" | FaxStatus)
                    setCurrentPage(1)
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
            
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="現場名で検索..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9 h-9"
              />
            </div>
            
            {/* Reset Button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs text-slate-500 hover:text-slate-700"
              onClick={() => {
                setStatusFilter("all")
                setSearchQuery("")
              }}
            >
              フィルターをリセット
            </Button>
          </div>
          
          {/* FAX List */}
          <div className="flex-1 overflow-auto" style={{ height: "calc(100% - 280px)" }}>
            {paginatedFaxList.map((fax) => (
              <div
                key={fax.id}
                className={`p-3 border-b border-slate-100 cursor-pointer transition-colors ${
                  fax.id === selectedFaxId
                    ? "bg-blue-50 border-l-4 border-l-blue-600"
                    : "hover:bg-slate-50 border-l-4 border-l-transparent"
                }`}
                onClick={() => {
                  handleSelectFax(fax)
                  setIsFaxListOpen(false)
                }}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {fax.status === "finalized" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <div
                        className={`h-4 w-4 rounded border-2 ${
                          fax.status === "confirmed" ? "border-amber-400 bg-amber-100" : "border-slate-300"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs text-slate-500">{formatDateTime(fax.dateTime)}</span>
                      {getStatusBadge(fax.status)}
                    </div>
                    <p className="text-sm font-medium text-slate-700 truncate">{fax.tradingPartner}</p>
                    <p className="text-sm text-slate-600 truncate">{fax.siteName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 absolute bottom-0 left-0 right-0">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>
                {startIndex + 1}～{Math.min(startIndex + itemsPerPage, filteredFaxList.length)} / {filteredFaxList.length}
              </span>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-16 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
                前へ
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-7 px-2"
              >
                次へ
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Overlay when panel is open */}
        {isFaxListOpen && (
          <div
            className="absolute inset-0 bg-black/20 z-20"
            onClick={() => setIsFaxListOpen(false)}
          />
        )}

        {/* Left Side - FAX Preview (50%) */}
        <div className="w-1/2 flex flex-col border-r border-slate-200 bg-slate-100">
          <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">FAXプレビュー</h2>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="h-8 w-8 p-0"
                title="縮小"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom((z) => Math.min(200, z + 10))}
                className="h-8 w-8 p-0"
                title="拡大"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="h-8 w-8 p-0"
                title="右に90度回転"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetPreview}
                className="h-8 px-2 text-xs bg-transparent"
                title="ズームと回転をリセット"
              >
                リセット
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <PdfViewer file="/sample-fax.pdf" zoom={zoom} rotation={rotation} />
          </div>
          {/* Preview Navigation */}
          <div className="p-3 border-t border-slate-200 bg-white flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevFax}
              disabled={currentFaxIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              前へ
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextFax}
              disabled={currentFaxIndex === filteredFaxList.length - 1}
            >
              次へ
              <ChevronRight className="h-4 w-4 mr-1" />
            </Button>
          </div>
        </div>

        {/* Right Side - Form (50%) */}
        <div className="w-1/2 flex flex-col bg-white">
          <div className="p-3 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900">読み取り結果・修正</h2>
            <p className="text-xs text-slate-500 mt-1">OCR読み取り結果を確認・修正してください</p>
          </div>
          
          <div className="flex-1 overflow-auto p-4 pb-24">
            <div className="space-y-4">
              {/* 1. Date/Time */}
              <FormField label="日時" required>
                <Input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => handleInputChange("dateTime", e.target.value)}
                />
              </FormField>

              {/* 2. Trading Partner */}
              <FormField label="取引先名" required>
                <Input
                  value={formData.tradingPartner}
                  onChange={(e) => handleInputChange("tradingPartner", e.target.value)}
                  placeholder="例：ジューテック開発2"
                />
              </FormField>

              {/* 3. Site Name */}
              <FormField label="現場名" required>
                <Input
                  value={formData.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                  placeholder="例：ライオンズマンション麹町501"
                />
              </FormField>

              {/* 4. House Maker */}
              <FormField label="ハウスメーカー">
                <Input
                  value={formData.housemaker}
                  onChange={(e) => handleInputChange("housemaker", e.target.value)}
                  placeholder="例：朝日・マンション住替センター"
                />
              </FormField>

              {/* 5. Address */}
              <FormField label="住所">
                <Input
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="例：千代田区麹町2-5-3"
                />
              </FormField>

              {/* 6. Contact Name */}
              <FormField label="担当者の氏名">
                <Input
                  value={formData.contactName}
                  onChange={(e) => handleInputChange("contactName", e.target.value)}
                  placeholder="例：前田"
                />
              </FormField>

              {/* 7. Contact Phone */}
              <FormField label="担当者の連絡先">
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  placeholder="例：070-3277-6870"
                />
              </FormField>

              {/* 8. Notes */}
              <FormField label="注意事項">
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="注意事項を入力してください"
                  className="min-h-[80px]"
                />
              </FormField>

              {/* 9. Work Content */}
              <FormField label="作業内容">
                <Textarea
                  value={formData.workContent}
                  onChange={(e) => handleInputChange("workContent", e.target.value)}
                  placeholder="作業内容を入力してください"
                  className="min-h-[80px]"
                />
              </FormField>

              {/* 10. Nearest Station */}
              <FormField label="最寄り駅">
                <Input
                  value={formData.nearestStation}
                  onChange={(e) => handleInputChange("nearestStation", e.target.value)}
                  placeholder="例：半蔵門駅"
                />
              </FormField>

              {/* 11. Walking Distance */}
              <FormField label="現場住所から最寄り駅までの徒歩距��">
                <div className="flex items-center gap-2">
                  <Input
                    value={formData.walkingDistance}
                    onChange={(e) => handleInputChange("walkingDistance", e.target.value)}
                    placeholder="例：110"
                    className="w-32"
                  />
                  <span className="text-sm text-slate-600">m</span>
                </div>
              </FormField>

              {/* 12. Workers */}
              <FormField label="人工（にんく）">
                <Input
                  value={formData.workers}
                  onChange={(e) => handleInputChange("workers", e.target.value)}
                  placeholder="例：4名ハーフ作業"
                />
              </FormField>

              {/* 13. Transport Cost */}
              <FormField label="交通費">
                <div className="flex items-center gap-2">
                  <Input
                    value={formData.transportCost}
                    onChange={(e) => handleInputChange("transportCost", e.target.value)}
                    placeholder="例：5000"
                    className="w-32"
                  />
                  <span className="text-sm text-slate-600">円</span>
                </div>
              </FormField>
            </div>
          </div>

          {/* Sticky Action Buttons */}
          <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                戻る
              </Button>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handlePrevFax} disabled={currentFaxIndex === 0}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  前へ
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextFax}
                  disabled={currentFaxIndex === filteredFaxList.length - 1}
                >
                  次へ
                  <ChevronRight className="h-4 w-4 mr-1" />
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowConfirmModal(true)}>
                  確定して基幹システムへ送信
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>FAXを確定しますか？</DialogTitle>
            <DialogDescription>このFAXを確定して、基幹システムへ送信しますか？</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              キャンセル
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleConfirmAndSend}>
              送信を実行する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function FaxInboxPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-4rem)]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>}>
      <FaxInboxContent />
    </Suspense>
  )
}
