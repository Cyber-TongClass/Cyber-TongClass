"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery } from "@convex-dev/react"
import { api } from "@/convex/_generated/api"
import { Calendar, MapPin, Clock, Search, Filter, ChevronRight, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Event colors
const eventColors = [
  { name: "学术讲座", color: "bg-blue-500", textColor: "text-blue-600", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20" },
  { name: "学术会议", color: "bg-purple-500", textColor: "text-purple-600", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/20" },
  { name: "学生活动", color: "bg-green-500", textColor: "text-green-600", bgColor: "bg-green-500/10", borderColor: "border-green-500/20" },
  { name: "通知公告", color: "bg-amber-500", textColor: "text-amber-600", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/20" },
]

// Mock data - will be replaced with Convex API
const mockEvents = [
  {
    _id: "1" as any,
    title: "机器学习前沿讲座",
    date: "2024-03-15",
    time: "14:00 - 16:00",
    location: "北大昌平校区教学楼101",
    description: "邀请MIT教授进行机器学习前沿讲座，介绍最新研究进展。",
    url: "",
    color: "bg-blue-500",
    colorName: "学术讲座",
  },
  {
    _id: "2" as any,
    title: "ICML 2024 论文分享会",
    date: "2024-03-20",
    time: "10:00 - 12:00",
    location: "北大昌平校区会议室A",
    description: "通班学生分享ICML 2024接收论文的研究内容。",
    url: "",
    color: "bg-purple-500",
    colorName: "学术会议",
  },
  {
    _id: "3" as any,
    title: "2024级新生破冰活动",
    date: "2024-03-25",
    time: "18:00 - 21:00",
    location: "北大昌平校区学生活动中心",
    description: "新生破冰活动，帮助新同学相互认识。",
    url: "",
    color: "bg-green-500",
    colorName: "学生活动",
  },
  {
    _id: "4" as any,
    title: "清明节放假通知",
    date: "2024-04-04",
    time: "全天",
    location: "",
    description: "清明节放假安排。",
    url: "",
    color: "bg-amber-500",
    colorName: "通知公告",
  },
  {
    _id: "5" as any,
    title: "计算机视觉研讨会",
    date: "2024-04-10",
    time: "09:00 - 17:00",
    location: "北大英杰交流中心",
    description: "计算机视觉领域研讨会，邀请国内外知名学者参加。",
    url: "",
    color: "bg-purple-500",
    colorName: "学术会议",
  },
  {
    _id: "6" as any,
    title: "NLP 最新进展讲座",
    date: "2024-04-15",
    time: "15:00 - 17:00",
    location: "北大昌平校区教学楼202",
    description: "介绍NLP领域的最新研究进展和应用。",
    url: "",
    color: "bg-blue-500",
    colorName: "学术讲座",
  },
]

// Get color style
function getEventColorStyle(colorName: string) {
  const color = eventColors.find(c => c.name === colorName)
  return color || eventColors[0]
}

// Format date
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  })
}

// Group events by month
function groupEventsByMonth(events: typeof mockEvents) {
  const groups: Record<string, typeof events> = {}
  events.forEach(event => {
    const month = event.date.substring(0, 7) // YYYY-MM
    if (!groups[month]) {
      groups[month] = []
    }
    groups[month].push(event)
  })
  return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]))
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedColor, setSelectedColor] = React.useState("all")
  const [viewMode, setViewMode] = React.useState<"list" | "calendar">("list")
  
  // 实际项目中从 API 获取数据
  // const events = useQuery(api.events.list, {})
  const events = mockEvents

  // Filter events
  const filteredEvents = React.useMemo(() => {
    let result = [...events]
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
      )
    }
    
    // Color filter
    if (selectedColor !== "all") {
      result = result.filter((event) => event.colorName === selectedColor)
    }
    
    // Sort by date
    result.sort((a, b) => a.date.localeCompare(b.date))
    
    return result
  }, [events, searchQuery, selectedColor])

  // Group by month
  const groupedEvents = React.useMemo(() => {
    return groupEventsByMonth(filteredEvents)
  }, [filteredEvents])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 border-b border-border">
        <div className="container-custom py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              活动日程
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            了解通班即将举办和已结束的各类学术活动、学生事务与重要通知。
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-b border-border bg-white sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
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

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Color/Type Filter */}
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="活动类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {eventColors.map((color) => (
                    <SelectItem key={color.name} value={color.name}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color.color}`} />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Toggle */}
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

              {/* Clear Filters */}
              {(selectedColor !== "all" || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedColor("all")
                    setSearchQuery("")
                  }}
                >
                  清除筛选
                </Button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            共 {filteredEvents.length} 个活动
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="container-custom py-8">
        {viewMode === "list" ? (
          filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                未找到相关活动
              </h3>
              <p className="text-muted-foreground">
                尝试调整筛选条件或搜索关键词
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {groupedEvents.map(([month, monthEvents]) => (
                <div key={month}>
                  {/* Month Header */}
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {new Date(month + "-01").toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}
                  </h2>
                  
                  {/* Events Grid */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {monthEvents.map((event) => {
                      const colorStyle = getEventColorStyle(event.colorName)
                      return (
                        <Link key={event._id} href={`/events/${event._id}`}>
                          <Card className="group h-full hover:shadow-md transition-all border-l-4 border-l-primary border-border/50 hover:border-primary/30">
                            <CardContent className="p-5">
                              {/* Color indicator */}
                              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${colorStyle.bgColor} ${colorStyle.textColor} mb-3`}>
                                <div className={`w-2 h-2 rounded-full ${colorStyle.color}`} />
                                {event.colorName}
                              </div>
                              
                              {/* Title */}
                              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3">
                                {event.title}
                              </h3>
                              
                              {/* Date & Time */}
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
                              
                              {/* Arrow */}
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
          /* Calendar View - Simplified */
          <Card>
            <CardHeader>
              <CardTitle>日历视图</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <CalendarDays className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>日历视图组件开发中...</p>
                <p className="text-sm mt-2">将使用 React Big Calendar 实现月/周/日视图</p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
