"use client"

import { useState, useCallback, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Configure PDF.js worker using CDN with correct path for v4+
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString()

interface PdfViewerProps {
  file: string
  zoom: number
  rotation: number
}

export function PdfViewer({ file, zoom, rotation }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Fetch the PDF as an ArrayBuffer to ensure binary integrity
  useEffect(() => {
    setLoadError(null)
    setPdfData(null)
    fetch(file)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.arrayBuffer()
      })
      .then((buffer) => {
        setPdfData(buffer)
      })
      .catch((err) => {
        setLoadError(err.message)
      })
  }, [file])

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages)
      setCurrentPage(1)
    },
    [],
  )

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-red-500 gap-2">
        <p className="font-medium">PDF読み込みエラー</p>
        <p className="text-sm text-slate-500">{loadError}</p>
      </div>
    )
  }

  if (!pdfData) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto flex justify-center p-4">
        <div
          className="transition-transform duration-300 ease-in-out"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: "top center",
          }}
        >
          <Document
            file={{ data: pdfData }}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              setLoadError(error.message)
            }}
            loading={
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center p-12 text-red-500 gap-2">
                <p className="font-medium">PDF読み込みエラー</p>
                <p className="text-sm text-slate-500">PDFファイルの形式を確認してください</p>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              width={560}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </div>

      {/* PDF Page Navigation */}
      {numPages > 1 && (
        <div className="p-2 border-t border-slate-200 bg-white flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="h-7 px-2"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <span className="text-xs text-slate-600">
            {currentPage} / {numPages} ページ
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
            className="h-7 px-2"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
