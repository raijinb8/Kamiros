"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Search, Plus, MoreHorizontal, Pencil, UserX, KeyRound, RefreshCw } from "lucide-react"
import { toast } from "sonner"

type Role = "社長" | "事務員" | "作業員"
type Status = "有効" | "無効"

interface UserRecord {
  id: string
  name: string
  email: string
  role: Role
  lastLogin: string
  status: Status
}

const initialUsers: UserRecord[] = [
  { id: "1", name: "田中 篤史", email: "tanaka@active.co.jp", role: "社長", lastLogin: "2026/02/26 08:30", status: "有効" },
  { id: "2", name: "事務担当者A", email: "jimu-a@active.co.jp", role: "事務員", lastLogin: "2026/02/26 09:15", status: "有効" },
  { id: "3", name: "事務担当者B", email: "jimu-b@active.co.jp", role: "事務員", lastLogin: "2026/02/25 17:00", status: "有効" },
  { id: "4", name: "古市 英佑", email: "furuichi@active.co.jp", role: "作業員", lastLogin: "2026/02/26 07:50", status: "有効" },
  { id: "5", name: "佐藤 祐輔", email: "sato.y@active.co.jp", role: "作業員", lastLogin: "2026/02/25 18:10", status: "有効" },
  { id: "6", name: "石黒 豪", email: "ishiguro@active.co.jp", role: "作業員", lastLogin: "2026/02/26 08:00", status: "有効" },
  { id: "7", name: "山田 一郎", email: "yamada@active.co.jp", role: "作業員", lastLogin: "2025/12/20 09:00", status: "無効" },
]

const workerOptions = [
  "古市 英佑",
  "佐藤 祐輔",
  "石黒 豪",
  "山田 一郎",
  "鈴木 健太",
  "高橋 誠",
]

interface UserFormData {
  id: string
  name: string
  email: string
  role: Role
  linkedWorker: string
  initialPassword: string
}

const roleBadgeStyles: Record<Role, string> = {
  "社長": "bg-red-100 text-red-700 hover:bg-red-100",
  "事務員": "bg-blue-100 text-blue-700 hover:bg-blue-100",
  "作業員": "bg-green-100 text-green-700 hover:bg-green-100",
}

const statusBadgeStyles: Record<Status, string> = {
  "有効": "bg-green-100 text-green-700 hover:bg-green-100",
  "無効": "bg-slate-100 text-slate-500 hover:bg-slate-100",
}

function generatePassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  let password = ""
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export function UserManagementTab() {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UserFormData>({
    id: "",
    name: "",
    email: "",
    role: "事務員",
    linkedWorker: "",
    initialPassword: "",
  })

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !searchQuery ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchQuery, roleFilter, statusFilter])

  const openAddModal = () => {
    setIsEditing(false)
    setFormData({
      id: String(Date.now()),
      name: "",
      email: "",
      role: "事務員",
      linkedWorker: "",
      initialPassword: generatePassword(),
    })
    setShowModal(true)
  }

  const openEditModal = (user: UserRecord) => {
    setIsEditing(true)
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      linkedWorker: "",
      initialPassword: "",
    })
    setShowModal(true)
  }

  const handleSaveUser = () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast.error("必須項目を入力してください")
      return
    }

    if (isEditing) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === formData.id
            ? { ...u, name: formData.name, email: formData.email, role: formData.role }
            : u
        )
      )
      toast.success("ユーザー情報を更新しました")
    } else {
      setUsers((prev) => [
        ...prev,
        {
          id: formData.id,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          lastLogin: "—",
          status: "有効" as Status,
        },
      ])
      toast.success("ユーザーを追加しました")
    }
    setShowModal(false)
  }

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "有効" ? "無効" : "有効" as Status }
          : u
      )
    )
    toast.success("ステータスを変更しました")
  }

  const resetPassword = (userName: string) => {
    toast.success(`${userName} のパスワードをリセットしました`)
  }

  return (
    <div className="space-y-4">
      {/* Filters + Action bar */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-48 max-w-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="名前・メールアドレスで検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="ロール" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="社長">社長</SelectItem>
            <SelectItem value="事務員">事務員</SelectItem>
            <SelectItem value="作業員">作業員</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="有効">有効</SelectItem>
            <SelectItem value="無効">無効</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <Button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            ユーザー追加
          </Button>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-slate-600">氏名</TableHead>
              <TableHead className="text-slate-600">メールアドレス</TableHead>
              <TableHead className="text-slate-600">ロール</TableHead>
              <TableHead className="text-slate-600">最終ログイン</TableHead>
              <TableHead className="text-slate-600">ステータス</TableHead>
              <TableHead className="text-slate-600 w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-slate-900">{user.name}</TableCell>
                <TableCell className="text-slate-600 font-mono text-sm">{user.email}</TableCell>
                <TableCell>
                  <Badge className={roleBadgeStyles[user.role]}>{user.role}</Badge>
                </TableCell>
                <TableCell className="text-slate-600 text-sm whitespace-nowrap tabular-nums">
                  {user.lastLogin}
                </TableCell>
                <TableCell>
                  <Badge className={statusBadgeStyles[user.status]}>{user.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(user)}
                      className="text-slate-500 hover:text-slate-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                          <UserX className="h-4 w-4 mr-2" />
                          {user.status === "有効" ? "無効化" : "有効化"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => resetPassword(user.name)}>
                          <KeyRound className="h-4 w-4 mr-2" />
                          パスワードリセット
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  該当するユーザーが見つかりません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit User Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "ユーザーを編集" : "ユーザーを追加"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>
                氏名 <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="氏名を入力"
              />
            </div>
            <div className="space-y-2">
              <Label>
                メールアドレス <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@company.co.jp"
              />
            </div>
            <div className="space-y-2">
              <Label>
                ロール <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as Role })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="社長">社長</SelectItem>
                  <SelectItem value="事務員">事務員</SelectItem>
                  <SelectItem value="作業員">作業員</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "作業員" && (
              <div className="space-y-2">
                <Label>紐づけ作業員</Label>
                <Select
                  value={formData.linkedWorker}
                  onValueChange={(value) => setFormData({ ...formData, linkedWorker: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="作業員を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {workerOptions.map((worker) => (
                      <SelectItem key={worker} value={worker}>
                        {worker}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  作業員マスタに登録されている方を選択してください。未登録の場合は先にマスタ管理で作業員を登録してください。
                </p>
              </div>
            )}

            {!isEditing && (
              <div className="space-y-2">
                <Label>初期パスワード</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={formData.initialPassword}
                    onChange={(e) => setFormData({ ...formData, initialPassword: e.target.value })}
                    placeholder="初期パスワード"
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormData({ ...formData, initialPassword: generatePassword() })
                    }
                    className="shrink-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSaveUser} className="bg-blue-600 hover:bg-blue-700 text-white">
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
