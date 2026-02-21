"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mock data - will be replaced with Convex API
const mockEvents = [
  {
    id: "1",
    title: "通班学术沙龙",
    date: "2024-02-15",
    time: "14:00-16:00",
    location: "北京大学光华楼",
    description: "邀请业界专家分享最新的AI研究成果",
    color: "#0F4C81",
    url: "",
  },
  {
    id: "2",
    title: "春季学期开学典礼",
    date: "2024-02-20",
    time: "09:00-11:00",
    location: "清华大学主楼",
    description: "新学期开学典礼暨新生欢迎会",
    color: "#DC143C",
    url: "",
  },
  {
    id: "3",
    title: "AI前沿技术讲座",
    date: "2024-03-05",
    time: "15:00-17:00",
    location: "线上",
    description: "邀请MIT教授进行线上讲座",
    color: "#2E7D32",
    url: "",
  },
  {
    id: "4",
    title: "通班运动会",
    date: "2024-04-10",
    time: "08:00-18:00",
    location: "北京大学体育场",
    description: "一年一度的通班运动会",
    color: "#F57C00",
    url: "",
  },
]

export function EventsList() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")

  return (
    <div className="space-y-6">
      {/* View toggle */}
      <div className="flex justify-end">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            列表视图
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            日历视图
          </Button>
        </div>
      </div>

      {/* Events list */}
      <div className="grid gap-4">
        {mockEvents.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer card-hover overflow-hidden">
              <div className="h-1" style={{ backgroundColor: event.color }} />
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                </div>
                {event.description && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {mockEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">暂无活动</h3>
          <p className="text-muted-foreground">敬请期待 upcoming events</p>
        </div>
      )}
    </div>
  )
}
