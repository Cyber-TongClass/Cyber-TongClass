"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Star, Clock, MessageSquare, Plus, Filter } from "lucide-react"
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

// 模拟课程数据
const mockCourseData: Record<string, {
  name: string
  reviews: Array<{
    semester: string
    rating: number
    content: string
    author: string
  }>
}> = {
  "人工智能导论": {
    name: "人工智能导论",
    reviews: [
      { semester: "2024春", rating: 9, content: "老师讲得很好，收获很大！课程内容涵盖AI基础知识，适合入门学习。", author: "匿名" },
      { semester: "2023秋", rating: 8, content: "课程内容充实，推荐选课。老师非常负责任。", author: "匿名" },
      { semester: "2023春", rating: 9, content: "作为AI入门课程非常合格，作业量适中。", author: "匿名" },
    ],
  },
  "机器学习": {
    name: "机器学习",
    reviews: [
      { semester: "2024春", rating: 10, content: "非常经典的ML课程，老师水平很高，强烈推荐！", author: "匿名" },
    ],
  },
  "深度学习": {
    name: "深度学习",
    reviews: [
      { semester: "2024春", rating: 9, content: "理论与实践结合紧密，需要一定的数学基础。", author: "匿名" },
      { semester: "2023秋", rating: 8, content: "作业有难度但很有收获，课程内容与时俱进。", author: "匿名" },
    ],
  },
  "计算机视觉": {
    name: "计算机视觉",
    reviews: [
      { semester: "2023秋", rating: 9, content: "CV领域入门好课，老师讲解清晰。", author: "匿名" },
    ],
  },
  "自然语言处理": {
    name: "自然语言处理",
    reviews: [
      { semester: "2024春", rating: 8, content: "内容丰富，需要较多时间投入。推荐对NLP感兴趣的同学选课。", author: "匿名" },
    ],
  },
}

// 获取评分对应的星星
function getStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => i < Math.round(rating / 2))
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseName = decodeURIComponent(params.name as string)
  const course = mockCourseData[courseName]
  
  const [sortBy, setSortBy] = React.useState("newest")
  const [showSubmitForm, setShowSubmitForm] = React.useState(false)

  // 排序评测
  const sortedReviews = course?.reviews.sort((a, b) => {
    if (sortBy === "newest") return b.semester.localeCompare(a.semester)
    if (sortBy === "rating") return b.rating - a.rating
    return 0
  }) || []

  const avgRating = course 
    ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length 
    : 0

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">课程不存在</h2>
          <p className="text-muted-foreground mb-4">该课程可能已被删除或不存在</p>
          <Link href="/resources">
            <Button>返回课程列表</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6 -ml-3">
          <Link href="/resources">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回课程列表
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {course.name}
          </h1>
          
          {/* Rating Summary */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-foreground">{avgRating.toFixed(1)}</span>
              <div className="space-y-1">
                <div className="flex gap-0.5">
                  {getStars(avgRating).map((filled, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "h-5 w-5", 
                        filled ? "text-amber-500 fill-amber-500" : "text-muted"
                      )} 
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{course.reviews.length} 条评测</p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="hidden md:flex gap-4 ml-8">
              {[10, 9, 8, 7, 6].map((rating) => {
                const count = course.reviews.filter(r => r.rating === rating).length
                const percentage = course.reviews.length ? (count / course.reviews.length) * 100 : 0
                return (
                  <div key={rating} className="text-center">
                    <div className="w-8 h-16 bg-muted rounded-full overflow-hidden relative">
                      <div 
                        className="absolute bottom-0 w-full bg-amber-500 transition-all"
                        style={{ height: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block">{rating}</span>
                  </div>
                )
              })}
            </div>

            <Button className="ml-auto" onClick={() => setShowSubmitForm(!showSubmitForm)}>
              <Plus className="h-4 w-4 mr-2" />
              提交评测
            </Button>
          </div>
        </div>

        {/* Submit Review Form */}
        {showSubmitForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>提交评测</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">开课学期</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择学期" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024春">2024春</SelectItem>
                      <SelectItem value="2023秋">2023秋</SelectItem>
                      <SelectItem value="2023春">2023春</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">评分 (0-10)</label>
                  <Input type="number" min="0" max="10" placeholder="请输入评分" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">评测内容</label>
                <textarea 
                  className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background resize-none"
                  placeholder="分享你的课程体验..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="anonymous" defaultChecked className="rounded" />
                <label htmlFor="anonymous" className="text-sm text-muted-foreground">匿名发布</label>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowSubmitForm(false)}>提交</Button>
                <Button variant="outline" onClick={() => setShowSubmitForm(false)}>取消</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">课程评测</h2>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="排序" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">最新</SelectItem>
              <SelectItem value="rating">评分</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {sortedReviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>暂无评测，快来提交第一个评测吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedReviews.map((review, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {getStars(review.rating).map((filled, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "h-4 w-4", 
                              filled ? "text-amber-500 fill-amber-500" : "text-muted"
                            )} 
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.rating}/10</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{review.semester}</span>
                      <span>·</span>
                      <span>{review.author}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
