"use client"

import { useState, useCallback, Suspense } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { FaxDetailForm } from "@/components/fax-detail-form"
import { FaxList } from "@/components/fax-list"
import { FaxPreview } from "@/components/fax-preview"
import { dummyFaxList, faxToFormData, type FaxItem, type FaxStatus, type FaxFormData } from "@/lib/fax-data"

const FaxConfirmDialog = dynamic(() => import("@/components/fax-confirm-dialog"), { ssr: false })

function FaxInboxContent() {
  const router = useRouter()

  // Core state
  const [faxList, setFaxList] = useState<FaxItem[]>(dummyFaxList)
  const [selectedFaxId, setSelectedFaxId] = useState<number>(dummyFaxList[0].id)
  const [statusFilter, setStatusFilter] = useState<"all" | FaxStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isFaxListOpen, setIsFaxListOpen] = useState(false)

  // PDF viewer state
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  // Form state
  const selectedFax = faxList.find((f) => f.id === selectedFaxId) || faxList[0]
  const [formData, setFormData] = useState<FaxFormData>(() => faxToFormData(selectedFax))

  // Filtered list
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

  // Stable callbacks
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

  // Preview callbacks
  const onZoomIn = useCallback(() => setZoom((z) => Math.min(200, z + 10)), [])
  const onZoomOut = useCallback(() => setZoom((z) => Math.max(50, z - 10)), [])
  const onRotate = useCallback(() => setRotation((r) => (r + 90) % 360), [])

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

      {/* Main Content */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Slide-in FAX List Panel */}
        <FaxList
          isOpen={isFaxListOpen}
          onClose={closeFaxList}
          faxList={faxList}
          selectedFaxId={selectedFaxId}
          onSelectFax={handleSelectFax}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          currentPage={currentPage}
          onCurrentPageChange={setCurrentPage}
          filteredCount={filteredFaxList.length}
          totalPages={totalPages}
          paginatedFaxList={paginatedFaxList}
          startIndex={startIndex}
        />

        {/* Overlay */}
        {isFaxListOpen && (
          <div className="absolute inset-0 bg-black/20 z-20" onClick={closeFaxList} />
        )}

        {/* Left: FAX Preview (memo'd - only re-renders on zoom/rotation/file change) */}
        <FaxPreview
          file="/sample-fax.pdf"
          zoom={zoom}
          rotation={rotation}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onRotate={onRotate}
          onReset={resetPreview}
          onPrev={handlePrevFax}
          onNext={handleNextFax}
          canGoPrev={currentFaxIndex > 0}
          canGoNext={currentFaxIndex < filteredFaxList.length - 1}
        />

        {/* Right: Form (memo'd - only re-renders on formData change) */}
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

      {/* Lazy-loaded dialog */}
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
