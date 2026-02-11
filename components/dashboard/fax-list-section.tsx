"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"

// ダミーデータ
const faxData = [
  {
    id: 1,
    receivedAt: "2026-01-14 10:30",
    companyName: "株式会社サンプル建設",
    confidence: 98,
    confidenceLevel: "high",
    status: "未確認",
  },
  {
    id: 2,
    receivedAt: "2026-01-14 09:45",
    companyName: "田中工業株式会社",
    confidence: 85,
    confidenceLevel: "high",
    status: "未確認",
  },
  {
    id: 3,
    receivedAt: "2026-01-14 09:15",
    companyName: "山本電機製作所",
    confidence: 75,
    confidenceLevel: "medium",
    status: "未確認",
  },
  {
    id: 4,
    receivedAt: "2026-01-14 08:50",
    companyName: "佐藤商事株式会社",
    confidence: 92,
    confidenceLevel: "high",
    status: "未確認",
  },
  {
    id: 5,
    receivedAt: "2026-01-14 08:20",
    companyName: "不明",
    confidence: 45,
    confidenceLevel: "low",
    status: "未確認",
  },
]

function ConfidenceBadge({ confidence, level }: { confidence: number; level: string }) {
  const config = {
    high: { label: "高", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    medium: { label: "中", className: "bg-amber-100 text-amber-700 border-amber-200" },
    low: { label: "低", className: "bg-red-100 text-red-700 border-red-200" },
  }
  const { label, className } = config[level as keyof typeof config]

  return (
    <Badge variant="outline" className={className}>
      {label}（{confidence}%）
    </Badge>
  )
}

export function FaxListSection() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-slate-900">未確認FAX一覧（AI解析済み）</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 検索・絞り込み機能 */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">開始日</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">終了日</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">取引先名</label>
            <Input
              type="text"
              placeholder="取引先名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">ステータス</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="unconfirmed">未確認</SelectItem>
                <SelectItem value="confirmed">確認済</SelectItem>
                <SelectItem value="error">エラー</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Search className="h-4 w-4 mr-2" />
            検索
          </Button>
        </div>

        {/* テーブル */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="text-slate-700">受信日時</TableHead>
                <TableHead className="text-slate-700">取引先名（AI予測）</TableHead>
                <TableHead className="text-slate-700">AI確信度</TableHead>
                <TableHead className="text-slate-700">ステータス</TableHead>
                <TableHead className="text-slate-700">アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faxData.map((fax) => (
                <TableRow key={fax.id}>
                  <TableCell className="text-slate-600">{fax.receivedAt}</TableCell>
                  <TableCell className="font-medium text-slate-900">{fax.companyName}</TableCell>
                  <TableCell>
                    <ConfidenceBadge confidence={fax.confidence} level={fax.confidenceLevel} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                      {fax.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Link href="/fax-inbox">レビュー画面へ</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
