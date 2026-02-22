"use client"

import * as React from "react"
import Link from "next/link"
import { Calendar, MapPin, Clock, Search, ChevronRight, CalendarDays, ChevronLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEvents } from "@/lib/api"
import type { Event } from "@/types"

const eventTypeStyles = {
  "学术讲座": { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-500/10" },
  "学术会议": { dot: "bg-indigo-500", text: "text-indigo-700", bg: "bg-indigo-500/10" },
  "学生活动": { dot: "bg-green-500", text: "text-green-700", bg: "bg-green-500/10" },
  "通知公告": { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-500/10" },
  其他: { dot: "bg-slate-500", text: "text-slate-700", bg: "bg-slate-500/10" },
} as const

const colorToType: Record<string, keyof typeof eventTypeStyles> = {
  "#0F4C81": "学术讲座",
  "#DC143C": "学术会议",
  "#2E7D32": "学生活动",
  "#F57C00": "通知公告",
}

const weekdayLabels = ["日", "一", "二", "三", "四", "五", "六"]

function getEventType(event: Event): keyof typeof eventTypeStyles {
  return colorToType[event.color] ?? "其他"
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  })
}

function monthStartKey(date: Date) {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, "0")
  return `${y}-${m}`
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long" })
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function getCalendarCells(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const offset = firstDay.getDay()
  const totalDays = daysInMonth(month)
  const cells: Array<number | null> = Array.from({ length: offset }, () => null)
  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(day)
  }
  while (cells.length % 7 !== 0) {
    cells.push(null)
  }
  return cells
}

export default function EventsPage() {
  const eventsData = useEvents()
  const [events, setEvents] = React.useState<Event[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedType, setSelectedType] = React.useState("all")
  const [viewMode, setViewMode] = React.useState<"list" | "calendar">("list")
  const [calendarMonth, setCalendarMonth] = React.useState(() => new Date())

  React.useEffect(() => {
    if (eventsData) {
      setEvents(eventsData)
    }
  }, [eventsData])

  const filteredEvents = React.useMemo(() => {
    let result = [...events]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) || Boolean(event.description?.toLowerCase().includes(query))
      )
    }

    if (selectedType !== "all") {
      result = result.filter((event) => getEventType(event) === selectedType)
    }

    result.sort((a, b) => a.date.localeCompare(b.date))
    return result
  }, [events, searchQuery, selectedType])

  const groupedEvents = React.useMemo(() => {
    const groups: Record<string, Event[]> = {}
    filteredEvents.forEach((event) => {
      const key = event.date.substring(0, 7)
      if (!groups[key]) groups[key] = []
      groups[key].push(event)
    })
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filteredEvents])

  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, Event[]>()
    filteredEvents.forEach((event) => {
      const list = map.get(event.date) ?? []
      list.push(event)
      map.set(event.date, list)
    })
    return map
  }, [filteredEvents])

  const cells = React.useMemo(() => getCalendarCells(calendarMonth), [calendarMonth])
  const calendarMonthKey = monthStartKey(calendarMonth)

  const previousMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary/5 border-b border-border">
        <div className="container-custom py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">活动日程</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">了解通班即将举办和已结束的各类学术活动、学生事务与重要通知。</p>
        </div>
      </section>

      <section className="border-b border-border bg-white sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索活动..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="活动类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {Object.keys(eventTypeStyles).map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${eventTypeStyles[type as keyof typeof eventTypeStyles].dot}`} />
                        {type}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex rounded-md border border-input">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  列表
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  className="rounded-l-none"
                >
                  <CalendarDays className="h-4 w-4 mr-1" />
                  日历
                </Button>
              </div>

              {(selectedType !== "all" || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedType("all")
                    setSearchQuery("")
                  }}
                >
                  清除筛选
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">共 {filteredEvents.length} 个活动</div>
        </div>
      </section>

      <section className="container-custom py-8">
        {viewMode === "list" ? (
          filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">未找到相关活动</h3>
              <p className="text-muted-foreground">尝试调整筛选条件或搜索关键词</p>
            </div>
          ) : (
            <div className="space-y-12">
              {groupedEvents.map(([month, monthEvents]) => (
                <div key={month}>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {new Date(`${month}-01`).toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}
                  </h2>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {monthEvents.map((event) => {
                      const eventType = getEventType(event)
                      const colorStyle = eventTypeStyles[eventType]
                      return (
                        <Link key={event._id} href={`/events/${event._id}`}>
                          <Card className="group h-full hover:shadow-md transition-all border-l-4 border-l-primary border-border/50 hover:border-primary/30">
                            <CardContent className="p-5 relative">
                              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${colorStyle.bg} ${colorStyle.text} mb-3`}>
                                <div className={`w-2 h-2 rounded-full ${colorStyle.dot}`} />
                                {eventType}
                              </div>

                              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3">
                                {event.title}
                              </h3>

                              <div className="space-y-1.5 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 flex-shrink-0" />
                                  <span>{formatDate(event.date)}</span>
                                </div>
                                {event.time && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 flex-shrink-0" />
                                    <span>{event.time}</span>
                                  </div>
                                )}
                                {event.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                    <span className="line-clamp-1">{event.location}</span>
                                  </div>
                                )}
                              </div>

                              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors absolute right-4 top-1/2 -translate-y-1/2" />
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{monthLabel(calendarMonth)}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={previousMonth} aria-label="上一月">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth} aria-label="下一月">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground font-medium">
                {weekdayLabels.map((day) => (
                  <div key={day} className="text-center py-1">
                    周{day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {cells.map((day, idx) => {
                  const dateKey = day === null ? "" : `${calendarMonthKey}-${`${day}`.padStart(2, "0")}`
                  const dayEvents = day === null ? [] : eventsByDate.get(dateKey) ?? []

                  return (
                    <div key={`${dateKey}-${idx}`} className="min-h-[96px] border rounded-md p-2 bg-white">
                      {day !== null && (
                        <>
                          <p className="text-xs font-medium mb-1">{day}</p>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event) => {
                              const eventType = getEventType(event)
                              const color = eventTypeStyles[eventType]
                              return (
                                <Link
                                  key={event._id}
                                  href={`/events/${event._id}`}
                                  className={`block px-1.5 py-0.5 rounded text-[11px] leading-4 truncate ${color.bg} ${color.text}`}
                                  title={event.title}
                                >
                                  {event.title}
                                </Link>
                              )
                            })}
                            {dayEvents.length > 2 && <p className="text-[11px] text-muted-foreground">+{dayEvents.length - 2} 更多</p>}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
