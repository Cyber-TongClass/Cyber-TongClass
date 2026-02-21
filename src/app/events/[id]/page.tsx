"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Clock, ExternalLink, Share2, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data - will be replaced with Convex API
const mockEventData: Record<string, {
  _id: string
  title: string
  date: string
  time?: string
  endDate?: string
  endTime?: string
  location?: string
  description?: string
  url?: string
  color: string
  colorName: string
}> = {
  "1": {
    _id: "1",
    title: "机器学习前沿讲座",
    date: "2024-03-15",
    time: "14:00 - 16:00",
    location: "北大昌平校区教学楼101",
    description: `## 讲座简介

本次讲座邀请了MIT人工智能实验室的知名教授，为大家介绍机器学习领域的最新研究进展。

## 主讲人

John Smith 教授
- MIT人工智能实验室
- 研究方向：深度学习、强化学习

## 讲座内容

1. 深度学习最新进展
2. 大模型训练技巧
3. 强化学习在机器人控制中的应用
4. Q&A 环节

## 注意事项

- 请提前15分钟入场
- 讲座结束后有茶歇时间
- 欢迎大家积极参与讨论`,
    url: "",
    color: "bg-blue-500",
    colorName: "学术讲座",
  },
  "2": {
    _id: "2",
    title: "ICML 2024 论文分享会",
    date: "2024-03-20",
    time: "10:00 - 12:00",
    location: "北大昌平校区会议室A",
    description: `## 活动简介

通班学生分享ICML 2024接收论文的研究内容。

## 分享论文

1. **Efficient Deep Learning for Image Classification**
   - 作者：张伟
   - 论文介绍图像分类的高效深度学习方法

2. **Robust Neural Networks against Adversarial Attacks**
   - 作者：李明
   - 论文介绍对抗鲁棒性训练方法

## 时间安排

- 10:00-10:30: 论文1分享
- 10:30-11:00: 论文2分享
- 11:00-11:30: 问答交流
- 11:30-12:00: 自由讨论`,
    url: "",
    color: "bg-purple-500",
    colorName: "学术会议",
  },
  "3": {
    _id: "3",
    title: "2024级新生破冰活动",
    date: "2024-03-25",
    time: "18:00 - 21:00",
    location: "北大昌平校区学生活动中心",
    description: `## 活动目的

帮助2024级新生相互认识，快速融入通班大家庭。

## 活动流程

1. **开场致辞** (18:00-18:30)
   - 辅导员致辞
   - 班委自我介绍

2. **破冰游戏** (18:30-19:30)
   - 分组自我介绍
   - 团队小游戏

3. **自由交流** (19:30-21:00)
   - 自助餐会
   - 自由讨论

## 报名方式

无需报名，直接参加即可。`,
    url: "",
    color: "bg-green-500",
    colorName: "学生活动",
  },
  "4": {
    _id: "4",
    title: "清明节放假通知",
    date: "2024-04-04",
    time: "全天",
    location: "",
    description: `## 放假安排

根据学校通知，2024年清明节放假安排如下：

- 放假时间：4月4日（周四）至4月6日（周六）
- 调休上课：4月7日（周日）正常上课

## 注意事项

1. 请同学们提前做好学习安排
2. 离校同学注意人身安全
3. 如有特殊情况请及时联系辅导员

祝大家清明节安康！`,
    url: "",
    color: "bg-amber-500",
    colorName: "通知公告",
  },
}

// Get color style
function getEventColorStyle(colorName: string) {
  const colors: Record<string, { bg: string; text: string }> = {
    "学术讲座": { bg: "bg-blue-500/10", text: "text-blue-600" },
    "学术会议": { bg: "bg-purple-500/10", text: "text-purple-600" },
    "学生活动": { bg: "bg-green-500/10", text: "text-green-600" },
    "通知公告": { bg: "bg-amber-500/10", text: "text-amber-600" },
  }
  return colors[colorName] || colors["通知公告"]
}

// Format date
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })
}

// Simple markdown rendering
function renderMarkdown(content: string) {
  return content.split('\n').map((line, index) => {
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground">{line.slice(3)}</h2>
    }
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-foreground">{line.slice(4)}</h3>
    }
    if (line.startsWith('- ')) {
      return <li key={index} className="ml-4 text-muted-foreground">{line.slice(2)}</li>
    }
    if (line.startsWith('1. ')) {
      return <li key={index} className="ml-4 list-decimal text-muted-foreground">{line.slice(3)}</li>
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={index} className="font-semibold text-foreground my-2">{line.slice(2, -2)}</p>
    }
    if (line.trim() === '') {
      return <br key={index} />
    }
    return <p key={index} className="text-muted-foreground mb-2">{line}</p>
  })
}

export default function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  // In real app: useQuery(api.events.getById, { id: params.id })
  const event = mockEventData[params.id] || mockEventData["1"]
  const colorStyle = getEventColorStyle(event.colorName)

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8 md:py-12">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6 -ml-3 gap-2">
          <Link href="/events">
            <ArrowLeft className="h-4 w-4" />
            返回活动列表
          </Link>
        </Button>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            {/* Type badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${colorStyle.bg} ${colorStyle.text} border`}>
                {event.colorName}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6">
              {event.title}
            </h1>

            {/* Event Info */}
            <div className="flex flex-wrap gap-6 text-muted-foreground pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(event.date)}</span>
              </div>
              {event.time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{event.time}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{event.location}</span>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex items-center gap-2 ml-auto">
                {event.url && (
                  <Button asChild>
                    <a href={event.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      访问链接
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Share2 className="h-4 w-4" />
                  分享
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Bookmark className="h-4 w-4" />
                  收藏
                </Button>
              </div>
            </div>
          </header>

          {/* Description */}
          {event.description && (
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="prose prose-slate max-w-none">
                  {renderMarkdown(event.description)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/events">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回活动列表
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  )
}
