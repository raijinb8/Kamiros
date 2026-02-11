"use client"

import { useState, useCallback, Suspense } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight, X, PanelLeftClose, PanelLeftOpen, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { PdfViewer } from "@/components/pdf-viewer"
import { FaxDetailForm } from "@/components/fax-detail-form"
import { FaxListItem } from "@/components/fax-list-item"
import { dummyFaxList, faxToFormData, type FaxItem, type FaxStatus, type FaxFormData } from "@/lib/fax-data"

// Lazy-load the heavy confirmation dialog
const FaxConfirmDialog = dynamic(() => import("@/components/fax-confirm-dialog"), { ssr: false })

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
  const selectedFax = faxList.find((f) => f.id === selectedFaxId) || faxList[0]
  const [formData, setFormData] = useState<FaxFormData>(() => faxToFormData(selectedFax))

  // Filter FAX list
  const filteredFaxList = faxList.filter((fax) => {
    const matchesStatus = statusFilter === "all" || fax.status === statusFilter
    const matchesSearch =
      searchQuery === "" ||
      fax.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fax.tradingPartner.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredFaxList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedFaxList = filteredFaxList.slice(startIndex, startIndex + itemsPerPage)
  const currentFaxIndex = filteredFaxList.findIndex((f) => f.id === selectedFaxId)

  // PDF viewer state
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  // FAX list panel state (closed by default)
  const [isFaxListOpen, setIsFaxListOpen] = useState(false)

  const closeFaxList = useCallback(() => setIsFaxListOpen(false), [])

  const resetPreview = useCallback(() => {
    setZoom(100)
    setRotation(0)
  }, [])

  const handleSelectFax = useCallback(
    (fax: FaxItem) => {
      setSelectedFaxId(fax.id)
      resetPreview()
      setFormData(faxToFormData(fax))
    },
    [resetPreview],
  )

  // Stable callback for the form component - deferred via useTransition in FaxDetailForm
  const handleFieldChange = useCallback(
    (field: keyof FaxFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setFaxList((prev) =>
        prev.map((fax) =>
          fax.id === selectedFaxId
            ? { ...fax, [field]: value, status: fax.status === "unconfirmed" ? "confirmed" : fax.status }
            : fax,
        ),
      )
    },
    [selectedFaxId],
  )

  const handleConfirmAndSend = useCallback(() => {
    setFaxList((prev) => prev.map((fax) => (fax.id === selectedFaxId ? { ...fax, status: "finalized" as const } : fax)))
    setShowConfirmModal(false)

    const nextIndex = currentFaxIndex + 1
    if (nextIndex < filteredFaxList.length) {
      const nextFax = filteredFaxList[nextIndex]
      handleSelectFax(nextFax)
      if (nextIndex >= startIndex + itemsPerPage) {
        setCurrentPage((prev) => prev + 1)
      }
    } else {
      router.push("/dashboard")
    }
  }, [selectedFaxId, currentFaxIndex, filteredFaxList, handleSelectFax, startIndex, itemsPerPage, router])

  const handlePrevFax = useCallback(() => {
    if (currentFaxIndex > 0) {
      const prevFax = filteredFaxList[currentFaxIndex - 1]
      handleSelectFax(prevFax)
      if (currentFaxIndex - 1 < startIndex) {
        setCurrentPage((prev) => prev - 1)
      }
    }
  }, [currentFaxIndex, filteredFaxList, handleSelectFax, startIndex])

  const handleNextFax = useCallback(() => {
    if (currentFaxIndex < filteredFaxList.length - 1) {
      const nextFax = filteredFaxList[currentFaxIndex + 1]
      handleSelectFax(nextFax)
      if (currentFaxIndex + 1 >= startIndex + itemsPerPage) {
        setCurrentPage((prev) => prev + 1)
      }
    }
  }, [currentFaxIndex, filteredFaxList, handleSelectFax, startIndex, itemsPerPage])

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
              <Button variant="ghost" size="sm" onClick={() => setIsFaxListOpen(false)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-slate-500 mb-3">{"検索結果："}{filteredFaxList.length}{"件"}</p>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-1 mb-3">
              {([
                { value: "all", label: "すべて" },
                { value: "unconfirmed", label: "未確認" },
                { value: "confirmed", label: "確認済" },
                { value: "finalized", label: "確定済" },
              ] as const).map(({ value, label }) => (
                <Button
                  key={value}
                  variant={statusFilter === value ? "default" : "outline"}
                  size="sm"
                  className={`text-xs px-2 py-1 h-7 ${statusFilter === value ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  onClick={() => {
                    setStatusFilter(value)
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
              <FaxListItem
                key={fax.id}
                fax={fax}
                isSelected={fax.id === selectedFaxId}
                onSelect={handleSelectFax}
                onClose={closeFaxList}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 absolute bottom-0 left-0 right-0">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>
                {startIndex + 1}{"～"}{Math.min(startIndex + itemsPerPage, filteredFaxList.length)} / {filteredFaxList.length}
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
          <div className="absolute inset-0 bg-black/20 z-20" onClick={() => setIsFaxListOpen(false)} />
        )}

        {/* Left Side - FAX Preview (50%) */}
        <div className="w-1/2 flex flex-col border-r border-slate-200 bg-slate-100">
          <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">FAXプレビュー</h2>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.max(50, z - 10))} className="h-8 w-8 p-0" title="縮小">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.min(200, z + 10))} className="h-8 w-8 p-0" title="拡大">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setRotation((r) => (r + 90) % 360)} className="h-8 w-8 p-0" title="右に90度回転">
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetPreview} className="h-8 px-2 text-xs bg-transparent" title="ズームと回転をリセット">
                リセット
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <PdfViewer file="/sample-fax.pdf" zoom={zoom} rotation={rotation} />
          </div>
          {/* Preview Navigation */}
          <div className="p-3 border-t border-slate-200 bg-white flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={handlePrevFax} disabled={currentFaxIndex === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              前へ
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextFax} disabled={currentFaxIndex === filteredFaxList.length - 1}>
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
            <FaxDetailForm formData={formData} onFieldChange={handleFieldChange} />
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
                <Button variant="outline" onClick={handleNextFax} disabled={currentFaxIndex === filteredFaxList.length - 1}>
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

      {/* Confirmation Modal - lazy loaded */}
      {showConfirmModal && (
        <FaxConfirmDialog
          open={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          onConfirm={handleConfirmAndSend}
        />
      )}
    </div>
  )
}

export default function FaxInboxPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      }
    >
      <FaxInboxContent />
    </Suspense>
  )
}
