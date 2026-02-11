"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"

// Site data type
export interface SiteData {
  id: string
  time: string
  siteName: string
  tradingPartner: string
  contactPerson: string
  address: string
  requiredWorkers: number
  assignedWorkers: (string | null)[]
  details: string
}

// Worker data type
export interface WorkerData {
  id: string
  name: string
  email: string
  status: "unsent" | "sent" | "error"
}

// Send log type
export interface SendLog {
  timestamp: string
  totalRecipients: number
  successCount: number
  errorCount: number
}

interface ShiftContextType {
  selectedDate: string
  setSelectedDate: (date: string) => void
  sites: SiteData[]
  workers: WorkerData[]
  assignWorkerToSite: (siteId: string, slotIndex: number, workerName: string | null) => void
  getWorkerAssignedSites: (workerName: string) => SiteData[]
  getAssignedWorkersForSite: (siteId: string) => string[]
  sendLogs: SendLog[]
  addSendLog: (log: SendLog) => void
  markWorkerSent: (workerId: string, status: "sent" | "error") => void
  markAllWorkersSent: () => void
  resetWorkerStatuses: () => void
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined)

// Initial dummy data for sites (expanded for pagination demo)
const createInitialSites = (): SiteData[] => {
  const baseSites: SiteData[] = [
    {
      id: "site-1",
      time: "09:00",
      siteName: "ライオンズマンション麹町501",
      tradingPartner: "ジューテック開発2",
      contactPerson: "杉岡",
      address: "千代田区麹町2-5-3",
      requiredWorkers: 4,
      assignedWorkers: [null, null, null, null],
      details: `朝日・マンション住替センター
千代田区麹町2-5-3
前田：070-3277-6870
※挨拶やマナー等しっかりと、注意事項沢山ありますのでご注意下さい
※動力の方は邪魔にならない所へ仮停車し、管理人室へ停車可能場所を確認する事
※共用部への仮置きは極力控え、やむを得ず置く場合は養生をする等十分に注意する事
【2F外階段3段の内右：0331】
システムキッチン一式の搬入(職方様不在、運転手と作業開始して下さい)
トラック到着：9：20～9：40
※安全靴・上履き着用の事!
※現場及び現場周辺（路上含む）は禁煙
半蔵門駅（110m）　麹町駅（250m）
4名ハーフ作業`,
    },
    {
      id: "site-2",
      time: "13:00",
      siteName: "新井　彰 邸",
      tradingPartner: "加藤ベニヤ本社",
      contactPerson: "高橋",
      address: "目黒区八雲1-10-8付近",
      requiredWorkers: 4,
      assignedWorkers: [null, null, null, null],
      details: `ミサワホーム
目黒区八雲1-10-8付近
向井監督：090-3230-3347
（外差し）
12　3×6　1F37　2F45
強12　3×6　3F4
強15　3×8　1F10　2F10　3F10
バリア強12　3×6　1F3　2F3
バリア強15　3×8　1F1
SH12　3×6　2F21　3F22
　合計　166枚
※安全靴・上履き着用の事!
※タオル巻き禁止!
※現場内及び周辺(路上含む)は禁煙
都立大学（500m）　緑が丘（1.6㎞）
4名ハーフ作業`,
    },
    {
      id: "site-3",
      time: "15:00",
      siteName: "大田区西蒲田301②　2号棟",
      tradingPartner: "加藤ベニヤ本社",
      contactPerson: "山本",
      address: "大田区西蒲田3-1-7",
      requiredWorkers: 3,
      assignedWorkers: [null, null, null],
      details: `ホークワン
大田区西蒲田3-1-7
竹村監督：080-5544-1263
※作業前、作業後に必ず入場者名簿を記入!(記入モレは戻ってもらう事になります)
※建物内土足厳禁
※角欠けや破損に注意!(以前ご指摘あり)
※安全靴・上履き着用の事!
※タオル巻き禁止!
※現場内及び周辺(路上含む)は禁煙
(3F建・2TS現場・キーBOX№5741)
15　3×9　1F40　2F50　3F63
強15　3×6　1F14　2F25　3F21
　合計　213枚
蓮沼駅（830m）　
3名ハーフ作業`,
    },
  ]
  return baseSites
}

// Initial dummy data for workers
const initialWorkers: WorkerData[] = [
  { id: "w-1", name: "長田", email: "nagata@example.com", status: "unsent" },
  { id: "w-2", name: "吉田", email: "yoshida@example.com", status: "unsent" },
  { id: "w-3", name: "一ノ瀬", email: "ichinose@example.com", status: "unsent" },
  { id: "w-4", name: "金谷", email: "kanaya@example.com", status: "unsent" },
  { id: "w-5", name: "吉野", email: "yoshino@example.com", status: "unsent" },
]

export function ShiftProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState("2026-01-15")
  const [sites, setSites] = useState<SiteData[]>(createInitialSites())
  const [workers, setWorkers] = useState<WorkerData[]>(initialWorkers)
  const [sendLogs, setSendLogs] = useState<SendLog[]>([])

  const assignWorkerToSite = useCallback((siteId: string, slotIndex: number, workerName: string | null) => {
    setSites((prevSites) =>
      prevSites.map((site) => {
        if (site.id === siteId) {
          const newAssignedWorkers = [...site.assignedWorkers]
          newAssignedWorkers[slotIndex] = workerName
          return { ...site, assignedWorkers: newAssignedWorkers }
        }
        return site
      }),
    )
  }, [])

  const getWorkerAssignedSites = useCallback((workerName: string): SiteData[] => {
    return sites
      .filter((site) => site.assignedWorkers.includes(workerName))
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [sites])

  const getAssignedWorkersForSite = useCallback((siteId: string): string[] => {
    const site = sites.find((s) => s.id === siteId)
    if (!site) return []
    return site.assignedWorkers.filter((w): w is string => w !== null)
  }, [sites])

  const addSendLog = useCallback((log: SendLog) => {
    setSendLogs((prev) => [log, ...prev])
  }, [])

  const markWorkerSent = useCallback((workerId: string, status: "sent" | "error") => {
    setWorkers((prevWorkers) => prevWorkers.map((worker) => (worker.id === workerId ? { ...worker, status } : worker)))
  }, [])

  const markAllWorkersSent = useCallback(() => {
    setWorkers((prevWorkers) =>
      prevWorkers.map((worker) => (worker.status === "unsent" ? { ...worker, status: "sent" as const } : worker)),
    )
  }, [])

  const resetWorkerStatuses = useCallback(() => {
    setWorkers((prevWorkers) => prevWorkers.map((worker) => ({ ...worker, status: "unsent" as const })))
  }, [])

  const contextValue = useMemo(() => ({
    selectedDate,
    setSelectedDate,
    sites,
    workers,
    assignWorkerToSite,
    getWorkerAssignedSites,
    getAssignedWorkersForSite,
    sendLogs,
    addSendLog,
    markWorkerSent,
    markAllWorkersSent,
    resetWorkerStatuses,
  }), [selectedDate, sites, workers, sendLogs, assignWorkerToSite, getWorkerAssignedSites, getAssignedWorkersForSite, addSendLog, markWorkerSent, markAllWorkersSent, resetWorkerStatuses])

  return (
    <ShiftContext.Provider value={contextValue}>
      {children}
    </ShiftContext.Provider>
  )
}

export function useShift() {
  const context = useContext(ShiftContext)
  if (context === undefined) {
    throw new Error("useShift must be used within a ShiftProvider")
  }
  return context
}
