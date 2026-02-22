"use client"

import * as React from "react"
import Link from "next/link"
import { BookOpen, Search, Star, MessageSquare, Plus, ChevronRight } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/hooks/use-auth"
import { useCourses, useCreateCourse } from "@/lib/api"
import type { Course } from "@/types"

export default function ResourcesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState("rating")

  // Fetch courses from Convex
  const coursesData = useCourses()
  const courses: Course[] = coursesData || []

  const [createOpen, setCreateOpen] = React.useState(false)
  const [createError, setCreateError] = React.useState("")
  const [courseName, setCourseName] = React.useState("")
  const [instructor, setInstructor] = React.useState("")
  const [department, setDepartment] = React.useState("")

  const createCourse = useCreateCourse()

  const resetForm = () => {
    setCourseName("")
    setInstructor("")
    setDepartment("")
    setCreateError("")
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError("")

    try {
      await createCourse({
        name: courseName,
        instructor,
        department,
      })
      setCreateOpen(false)
      resetForm()
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "创建课程失败")
    }
  }

  if (isLoading) {
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
            <CardTitle>成员资源需登录后访问</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">课程评测和学习资源仅对通班成员开放。请先登录，再进入资源页面。</p>
            <Button asChild className="w-full">
              <Link href="/login?next=%2Fresources">前往登录</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredCourses = courses
    .filter((course) => course.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "rating") return b.averageRating - a.averageRating
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount
      return a.name.localeCompare(b.name, "zh-CN")
    })

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary/5 border-b border-border">
        <div className="container-custom py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">课程评测</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">先创建课程，再进入课程详情页发布评测。</p>
        </div>
      </section>

      <section className="border-b border-border bg-white sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row gap-4">
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

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="md:ml-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  添加课程
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加课程</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreateCourse}>
                  <div className="space-y-2">
                    <Label htmlFor="course-name">课程名称</Label>
                    <Input id="course-name" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course-teacher">教师</Label>
                    <Input id="course-teacher" value={instructor} onChange={(e) => setInstructor(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course-department">开课院系</Label>
                    <Input id="course-department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                  </div>
                  {createError && <p className="text-sm text-red-600">{createError}</p>}
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); resetForm() }}>
                      取消
                    </Button>
                    <Button type="submit">创建</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <section className="container-custom py-8">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">未找到相关课程</h3>
            <p className="text-muted-foreground">可点击“添加课程”创建后再发布评测</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCourses.map((course) => (
              <Link key={course._id} href={`/resources/courses/${encodeURIComponent(course.name)}`}>
                <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{course.name}</h3>
                        <div className="mt-1 text-sm text-muted-foreground">
                          <p>{course.instructor} · {course.department}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-medium">{course.averageRating.toFixed(1)}</span>
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
