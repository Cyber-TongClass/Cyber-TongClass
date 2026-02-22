"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Star, MessageSquare, Plus, Pencil, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  useCourses,
  useCourseByName,
  useCourseReviews,
  useCreateCourseReview,
  useUpdateCourseReview,
  useDeleteCourseReview,
} from "@/lib/api"
import type { Course, CourseReview } from "@/types"

const MarkdownRenderer = dynamic(
  () => import("@/components/markdown/markdown-renderer").then((mod) => mod.MarkdownRenderer),
  {
    ssr: false,
    loading: () => <p className="text-sm text-muted-foreground">内容加载中...</p>,
  }
)

const MarkdownSplitEditor = dynamic(
  () => import("@/components/markdown/markdown-split-editor").then((mod) => mod.MarkdownSplitEditor),
  {
    ssr: false,
    loading: () => <p className="text-sm text-muted-foreground">编辑器加载中...</p>,
  }
)

function getStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => i < Math.round(rating / 2))
}

function decodeRouteName(raw: string) {
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

function normalizeCourseName(name: string) {
  return name.replace(/\s+/g, "").toLowerCase()
}

export default function CourseDetailPage() {
  const { isAuthenticated, isLoading: authLoading, currentUser } = useAuth()
  const params = useParams<{ name: string | string[] }>()
  const rawRouteName = Array.isArray(params.name) ? (params.name[0] ?? "") : (params.name ?? "")
  const courseName = React.useMemo(() => decodeRouteName(rawRouteName), [rawRouteName])

  const [sortBy, setSortBy] = React.useState("newest")
  const [showSubmitForm, setShowSubmitForm] = React.useState(false)
  const [semesterYear, setSemesterYear] = React.useState("2026")
  const [semesterTerm, setSemesterTerm] = React.useState("第一学期")

  // Fetch courses and details from Convex
  const coursesData = useCourses()
  const courses: Course[] = coursesData || []
  const courseData = useCourseByName(courseName)
  const fallbackCourse = React.useMemo(() => {
    const target = normalizeCourseName(courseName)
    if (!target || courses.length === 0) return null

    return (
      courses.find((item) => {
        const current = normalizeCourseName(item.name)
        return current === target || current.includes(target) || target.includes(current)
      }) || null
    )
  }, [courseName, courses])
  const course: Course | null = courseData || fallbackCourse || null
  const reviewsData = useCourseReviews(course?.name || courseName)
  const reviews: CourseReview[] = reviewsData || []

  // Mutations
  const createReview = useCreateCourseReview()
  const updateReview = useUpdateCourseReview()
  const deleteReview = useDeleteCourseReview()

  // Generate years (2020 to current year)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => String(2020 + i)).reverse()
  const terms = ["第一学期", "第二学期", "第三学期"]

  // Combine year and term
  const semesterInput = `${semesterYear}${semesterTerm}`
  const [ratingInput, setRatingInput] = React.useState(5)
  const [contentInput, setContentInput] = React.useState("")
  const [isAnonymousInput, setIsAnonymousInput] = React.useState(true)

  const [editingReviewId, setEditingReviewId] = React.useState<string | null>(null)
  const [editContent, setEditContent] = React.useState("")
  const [editRating, setEditRating] = React.useState(5)

  React.useEffect(() => {
    if (course && reviews.length > 0) {
      // 从已有的评测中获取最新的学期作为默认值
      const latestReview = [...reviews].sort((a, b) => b.createdAt - a.createdAt)[0]
      const match = latestReview.semester.match(/^(\d+)(.+)$/)
      if (match) {
        setSemesterYear(match[1])
        setSemesterTerm(match[2])
      }
    }
  }, [course, reviews])

  const userReview = React.useMemo(() => {
    if (!currentUser) return null
    return reviews.find((review) => review.authorId === currentUser._id) || null
  }, [reviews, currentUser])

  const sortedReviews = React.useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      return b.createdAt - a.createdAt
    })
  }, [reviews, sortBy])

  const avgRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const reviewAuthor = (review: CourseReview) => {
    if (review.isAnonymous) return "匿名"
    if (review.authorId && review.authorId === currentUser?._id) return "我"
    return "用户"
  }

  const handleSubmitReview = async () => {
    if (!course || !currentUser) return
    if (!semesterInput || !contentInput.trim() || ratingInput < 0 || ratingInput > 10) return

    try {
      await createReview({
        courseName: course.name,
        semester: semesterInput,
        rating: ratingInput,
        content: contentInput.trim(),
        isAnonymous: isAnonymousInput,
        authorId: currentUser._id as any,
      })

      setRatingInput(5)
      setContentInput("")
      setShowSubmitForm(false)
    } catch (error) {
      console.error("Failed to submit review:", error)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview({ id: reviewId as any })
      if (editingReviewId === reviewId) {
        setEditingReviewId(null)
        setEditContent("")
      }
    } catch (error) {
      console.error("Failed to delete review:", error)
    }
  }

  const handleEditReview = (review: CourseReview) => {
    setEditingReviewId(review._id)
    setEditContent(review.content)
    setEditRating(review.rating)
  }

  const handleSaveEdit = async () => {
    if (!editingReviewId || !editContent.trim()) return

    try {
      await updateReview({
        id: editingReviewId as any,
        content: editContent.trim(),
        rating: editRating,
      })

      setEditingReviewId(null)
      setEditContent("")
    } catch (error) {
      console.error("Failed to update review:", error)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>课程评测需登录后访问</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">请先登录后再查看课程评测与发帖。</p>
            <Button asChild className="w-full">
              <Link href={`/login?next=${encodeURIComponent(`/resources/courses/${encodeURIComponent(courseName)}`)}`}>
                前往登录
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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

  const canSubmit = !userReview

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        <Button variant="ghost" asChild className="mb-6 -ml-3">
          <Link href="/resources">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回课程列表
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{course.name}</h1>
          <p className="text-sm text-muted-foreground mb-4">
            {course.instructor} · {course.department}
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-foreground">{avgRating.toFixed(1)}</span>
              <div className="space-y-1">
                <div className="flex gap-0.5">
                  {getStars(avgRating).map((filled, i) => (
                    <Star key={i} className={cn("h-5 w-5", filled ? "text-amber-500 fill-amber-500" : "text-muted")} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{reviews.length} 条评测</p>
              </div>
            </div>

            <div className="hidden md:flex gap-4 ml-8">
              {[10, 9, 8, 7, 6].map((rating) => {
                const count = reviews.filter((review) => review.rating === rating).length
                const percentage = reviews.length ? (count / reviews.length) * 100 : 0
                return (
                  <div key={rating} className="text-center">
                    <div className="w-8 h-16 bg-muted rounded-full overflow-hidden relative">
                      <div className="absolute bottom-0 w-full bg-amber-500 transition-all" style={{ height: `${percentage}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block">{rating}</span>
                  </div>
                )
              })}
            </div>

            {canSubmit ? (
              <Button className="ml-auto" onClick={() => setShowSubmitForm((open) => !open)}>
                <Plus className="h-4 w-4 mr-2" />
                提交评测
              </Button>
            ) : (
              <Button className="ml-auto" variant="outline" onClick={() => handleEditReview(userReview!)}>
                <Pencil className="h-4 w-4 mr-2" />
                修改我的评测
              </Button>
            )}
          </div>
        </div>

        {showSubmitForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>提交评测</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">开课学期</label>
                  <div className="flex gap-2">
                    <Select value={semesterYear} onValueChange={setSemesterYear}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="年份" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={semesterTerm} onValueChange={setSemesterTerm}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="学期" />
                      </SelectTrigger>
                      <SelectContent>
                        {terms.map((term) => (
                          <SelectItem key={term} value={term}>{term}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">评分 ({ratingInput}/10)</label>
                  <div className="pt-4">
                    <Slider value={ratingInput} onChange={setRatingInput} min={0} max={10} step={1} />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">评测内容</label>
                <MarkdownSplitEditor
                  id="new-review-content"
                  value={contentInput}
                  onChange={setContentInput}
                  placeholder="分享你的课程体验，支持 Markdown..."
                  minHeightClassName="min-h-[180px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymousInput}
                  onChange={(e) => setIsAnonymousInput(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="anonymous" className="text-sm text-muted-foreground">
                  匿名发布
                </label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmitReview}>提交</Button>
                <Button variant="outline" onClick={() => setShowSubmitForm(false)}>
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {editingReviewId && (
          <Card className="mb-8 border-amber-200">
            <CardHeader>
              <CardTitle>修改评测</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">评分 ({editRating}/10)</label>
                <div className="pt-4">
                  <Slider value={editRating} onChange={setEditRating} min={0} max={10} step={1} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">评测内容</label>
                <MarkdownSplitEditor
                  id="edit-review-content"
                  value={editContent}
                  onChange={setEditContent}
                  placeholder="分享你的课程体验，支持 Markdown..."
                  minHeightClassName="min-h-[180px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveEdit}>保存修改</Button>
                <Button variant="outline" onClick={() => setEditingReviewId(null)}>
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
            {sortedReviews.map((review) => {
              const isOwnReview = currentUser && review.authorId === currentUser._id
              return (
                <Card key={review._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-0.5">
                          {getStars(review.rating).map((filled, i) => (
                            <Star key={i} className={cn("h-4 w-4", filled ? "text-amber-500 fill-amber-500" : "text-muted")} />
                          ))}
                        </div>
                        <span className="font-medium">{review.rating}/10</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {isOwnReview && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-white border-gray-200 hover:bg-gray-100"
                              onClick={() => handleEditReview(review)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-white border-gray-200 hover:bg-red-500 hover:text-white hover:border-red-500"
                              onClick={() => handleDeleteReview(review._id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{review.semester}</span>
                          <span>·</span>
                          <span>{reviewAuthor(review)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md border border-border/60 bg-muted/10 p-4">
                      <MarkdownRenderer content={review.content} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
