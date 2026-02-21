"use client"

import * as React from "react"
import Link from "next/link"
import { BookOpen, Search, Star, Clock, Filter, MessageSquare, Plus, ChevronRight } from "lucide-react"
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
const mockCourses = [
  {
    name: "人工智能导论",
    reviews: [
      { semester: "2024春", rating: 9, content: "老师讲得很好，收获很大！", author: "匿名" },
      { semester: "2023秋", rating: 8, content: "课程内容充实，推荐选课。", author: "匿名" },
    ],
  },
  {
    name: "机器学习",
    reviews: [
      { semester: "2024春", rating: 10, content: "非常经典的ML课程，老师水平很高。", author: "匿名" },
    ],
  },
  {
    name: "深度学习",
    reviews: [
      { semester: "2024春", rating: 9, content: "理论与实践结合紧密。", author: "匿名" },
      { semester: "2023秋", rating: 8, content: "作业有难度但很有收获。", author: "匿名" },
    ],
  },
  {
    name: "计算机视觉",
    reviews: [
      { semester: "2023秋", rating: 9, content: "CV领域入门好课。", author: "匿名" },
    ],
  },
  {
    name: "自然语言处理",
    reviews: [
      { semester: "2024春", rating: 8, content: "内容丰富，需要较多时间投入。", author: "匿名" },
    ],
  },
]

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState("rating")

  // 搜索筛选
  const filteredCourses = mockCourses
    .filter(course =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(course => ({
      ...course,
      avgRating: course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length,
      reviewCount: course.reviews.length,
    }))
    .sort((a, b) => {
      if (sortBy === "rating") return b.avgRating - a.avgRating
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount
      return a.name.localeCompare(b.name, "zh-CN")
    })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 border-b border-border">
        <div className="container-custom py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              课程评测
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            分享课程评测信息，帮助同学们选择适合自己的课程。
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
                placeholder="搜索课程名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">按评分</SelectItem>
                <SelectItem value="reviews">按评测数量</SelectItem>
                <SelectItem value="name">按名称</SelectItem>
              </SelectContent>
            </Select>

            {/* Submit Review */}
            <Button className="md:ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              提交评测
            </Button>
          </div>
        </div>
      </section>

      {/* Course List */}
      <section className="container-custom py-8">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              未找到相关课程
            </h3>
            <p className="text-muted-foreground">
              尝试调整搜索关键词
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <Link key={course.name} href={`/resources/courses/${encodeURIComponent(course.name)}`}>
                <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {course.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-medium">{course.avgRating.toFixed(1)}</span>
                            <span>({course.reviewCount}条评测)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{course.reviewCount} 条评测</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
