"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Star, Clock, User, Calendar, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// 模拟课程评价数据
const mockCourseReviews: Record<string, {
  courseName: string
  semester: string
  rating: number
  content: string
  isAnonymous: boolean
  createdAt: string
}[]> = {
  "机器学习": [
    {
      courseName: "机器学习",
      semester: "2024春季",
      rating: 9,
      content: "课程内容非常丰富，老师讲解深入浅出，是入门机器学习的绝佳选择。作业设计很有挑战性，能学到很多东西。",
      isAnonymous: false,
      createdAt: "2024-01-20",
    },
    {
      courseName: "机器学习",
      semester: "2024春季",
      rating: 8,
      content: "课程覆盖了机器学习的基础理论和实践，推荐！",
      isAnonymous: true,
      createdAt: "2024-01-18",
    },
    {
      courseName: "机器学习",
      semester: "2023秋季",
      rating: 9,
      content: "非常经典的机器学习课程，适合有一定数学基础的同学选修。",
      isAnonymous: false,
      createdAt: "2023-12-15",
    },
    {
      courseName: "机器学习",
      semester: "2023秋季",
      rating: 7,
      content: "内容偏理论，需要较强的数学基础。",
      isAnonymous: true,
      createdAt: "2023-12-10",
    },
  ],
  "深度学习": [
    {
      courseName: "深度学习",
      semester: "2024春季",
      rating: 10,
      content: "深度学习必选课！老师是业界大牛，课程内容前沿且实用。",
      isAnonymous: false,
      createdAt: "2024-01-22",
    },
    {
      courseName: "深度学习",
      semester: "2024春季",
      rating: 9,
      content: "实验环节设计得很好，能快速上手深度学习框架。",
      isAnonymous: true,
      createdAt: "2024-01-19",
    },
  ],
}

// 模拟课程信息
const mockCourseInfo: Record<string, {
  name: string
  averageRating: number
  reviewCount: number
  semester: string
}> = {
  "机器学习": {
    name: "机器学习",
    averageRating: 8.5,
    reviewCount: 25,
    semester: "2024春季",
  },
  "深度学习": {
    name: "深度学习",
    averageRating: 9.0,
    reviewCount: 18,
    semester: "2024春季",
  },
  "计算机视觉": {
    name: "计算机视觉",
    averageRating: 8.8,
    reviewCount: 15,
    semester: "2024春季",
  },
}

// 渲染评分星星
function RatingStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  const emptyStars = 10 - fullStars - (hasHalf ? 1 : 0)
  const starSize = size === "lg" ? "h-5 w-5" : "h-4 w-4"
  const starClass = size === "lg" ? "h-5 w-5" : "h-4 w-4"

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${starClass} fill-yellow-400 text-yellow-400`} />
      ))}
      {hasHalf && <Star className={`${starClass} fill-yellow-400 text-yellow-400/50`} />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${starClass} text-muted`} />
      ))}
    </div>
  )
}

// 渲染评分数字
function RatingBadge({ rating }: { rating: number }) {
  const color =
    rating >= 9 ? "bg-green-500" :
    rating >= 7 ? "bg-yellow-500" :
    rating >= 5 ? "bg-orange-500" : "bg-red-500"

  return (
    <span className={`${color} text-white px-2 py-0.5 rounded text-sm font-medium`}>
      {rating}
    </span>
  )
}

export default function CourseDetailPage({
  params,
}: {
  params: { name: string }
}) {
  const courseName = decodeURIComponent(params.name)
  const reviews = mockCourseReviews[courseName] || []
  const courseInfo = mockCourseInfo[courseName] || {
    name: courseName,
    averageRating: 0,
    reviewCount: 0,
    semester: "2024春季",
  }

  // 计算平均评分
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : courseInfo.averageRating

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8 md:py-12">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6 -ml-3 gap-2">
          <Link href="/resources">
            <ArrowLeft className="h-4 w-4" />
            返回课程列表
          </Link>
        </Button>

        {/* Course Header */}
        <section className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {courseInfo.name}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {courseInfo.semester}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-3">
                <RatingStars rating={averageRating} size="lg" />
                <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                基于 {reviews.length || courseInfo.reviewCount} 条评价
              </p>
            </div>
          </div>
        </section>

        {/* Rating Distribution */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>评分分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((score) => {
                  const count = reviews.filter((r) => r.rating === score).length
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0

                  return (
                    <div key={score} className="flex items-center gap-2">
                      <span className="w-8 text-sm font-medium">{score}</span>
                      <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-12 text-sm text-muted-foreground text-right">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Submit Review CTA */}
        <section className="mb-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">上过这门课？</h3>
                  <p className="text-sm text-muted-foreground">
                    分享你的课程体验，帮助其他同学选课
                  </p>
                </div>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  提交评价
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Reviews List */}
        <section>
          <h2 className="text-xl font-semibold mb-6">课程评价</h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无评价，期待你的分享！</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <Card key={index}>
                  <CardContent className="py-4">
                    {/* Rating & Date */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <RatingBadge rating={review.rating} />
                        <RatingStars rating={review.rating} />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{review.createdAt}</span>
                      </div>
                    </div>

                    {/* Semester */}
                    <div className="mb-2">
                      <Badge variant="outline">{review.semester}</Badge>
                    </div>

                    {/* Content */}
                    <p className="text-muted-foreground">{review.content}</p>

                    {/* Author */}
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{review.isAnonymous ? "匿名用户" : "真实用户"}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
