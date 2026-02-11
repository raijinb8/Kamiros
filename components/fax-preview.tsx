"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { PdfViewer } from "@/components/pdf-viewer"

interface FaxPreviewProps {
  file: string
  zoom: number
  rotation: number
  onZoomIn: () => void
  onZoomOut: () => void
  onRotate: () => void
  onReset: () => void
  onPrev: () => void
  onNext: () => void
  canGoPrev: boolean
  canGoNext: boolean
}

function FaxPreviewInner({
  file,
  zoom,
  rotation,
  onZoomIn,
  onZoomOut,
  onRotate,
  onReset,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}: FaxPreviewProps) {
  return (
    <div className="w-1/2 flex flex-col border-r border-slate-200 bg-slate-100">
      <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">FAXプレビュー</h2>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={onZoomOut} className="h-8 w-8 p-0" title="縮小">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onZoomIn} className="h-8 w-8 p-0" title="拡大">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onRotate} className="h-8 w-8 p-0" title="右に90度回転">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onReset} className="h-8 px-2 text-xs bg-transparent" title="リセット">
            リセット
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <PdfViewer file={file} zoom={zoom} rotation={rotation} />
      </div>
      <div className="p-3 border-t border-slate-200 bg-white flex justify-center gap-3">
        <Button variant="outline" size="sm" onClick={onPrev} disabled={!canGoPrev}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          前へ
        </Button>
        <Button variant="outline" size="sm" onClick={onNext} disabled={!canGoNext}>
          次へ
          <ChevronRight className="h-4 w-4 mr-1" />
        </Button>
      </div>
    </div>
  )
}

export const FaxPreview = memo(FaxPreviewInner)
