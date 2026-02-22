"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MoreHorizontal, Plus, Search, Filter, Trash2, Eye, Check, X, Upload, Pencil } from "lucide-react"
import {
  useAllCourseReviews,
  useCourses,
  useCreateCourseReview,
  useUpdateCourseReview,
  useApproveCourseReview,
  useRejectCourseReview,
  useDeleteCourseReview,
  useCreateCourse,
  useUpdateCourse,
} from "@/lib/api"
import type { Course, CourseReview } from "@/types"

const statusLabels: Record<CourseReview["status"], string> = {
  pending: "待审核",
  approved: "已通过",
  rejected: "已拒绝",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  // Fetch courses and reviews from Convex
  const coursesData = useCourses()
  const courses: Course[] = coursesData || []

  // Fetch all reviews for admin (including pending, approved, rejected)
  const allReviewsData = useAllCourseReviews()
  const allReviews: CourseReview[] = allReviewsData || []
  const reviews = allReviews.sort((a, b) => b.createdAt - a.createdAt)

  // Mutations
  const createReview = useCreateCourseReview()
  const updateReview = useUpdateCourseReview()
  const approveReview = useApproveCourseReview()
  const rejectReview = useRejectCourseReview()
  const deleteReview = useDeleteCourseReview()
  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse()

  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [manualAddOpen, setManualAddOpen] = useState(false)
  const [manualAddError, setManualAddError] = useState("")
  const [manualCourseName, setManualCourseName] = useState("")
  const [manualSemester, setManualSemester] = useState("")
  const [manualRating, setManualRating] = useState(8)
  const [manualStatus, setManualStatus] = useState<CourseReview["status"]>("approved")
  const [manualContent, setManualContent] = useState("")
  const [manualAnonymous, setManualAnonymous] = useState(true)

  const [courseDialogOpen, setCourseDialogOpen] = useState(false)
  const [courseDialogMode, setCourseDialogMode] = useState<"create" | "edit">("create")
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [courseError, setCourseError] = useState("")
  const [courseName, setCourseName] = useState("")
  const [courseInstructor, setCourseInstructor] = useState("")
  const [courseDepartment, setCourseDepartment] = useState("")

  const { confirm, ConfirmDialog } = useConfirmDialog()

  useState(() => {
    if (!manualCourseName && courses.length > 0) {
      setManualCourseName(courses[0].name)
    }
  })

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || review.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const selectedReview = useMemo(
    () => reviews.find((review) => review._id === selectedReviewId) ?? null,
    [reviews, selectedReviewId]
  )

  const resetManualForm = () => {
    setManualAddError("")
    setManualContent("")
    setManualRating(8)
    setManualStatus("approved")
    setManualAnonymous(true)
    if (courses.length > 0) {
      setManualCourseName(courses[0].name)
    }
  }

  const resetCourseForm = () => {
    setEditingCourseId(null)
    setCourseName("")
    setCourseInstructor("")
    setCourseDepartment("")
    setCourseError("")
  }

  const openCreateCourseDialog = () => {
    setCourseDialogMode("create")
    resetCourseForm()
    setCourseDialogOpen(true)
  }

  const openEditCourseDialog = (course: Course) => {
    setCourseDialogMode("edit")
    setEditingCourseId(course._id)
    setCourseName(course.name)
    setCourseInstructor(course.instructor)
    setCourseDepartment(course.department)
    setCourseError("")
    setCourseDialogOpen(true)
  }

  const handleStatusChange = async (id: string, status: CourseReview["status"]) => {
    const label = status === "approved" ? "通过" : "拒绝"
    await confirm({
      title: `确认${label}评测`,
      description: `确定要${label}这条课程评测吗？`,
      confirmLabel: label,
      onConfirm: async () => {
        if (status === "approved") {
          await approveReview({ id: id as any })
        } else {
          await rejectReview({ id: id as any })
        }
      },
    })
  }

  const handleDelete = async (id: string, courseNameValue: string) => {
    await confirm({
      title: "确认删除评测",
      description: `将删除课程「${courseNameValue}」的一条评测记录，此操作不可撤销。`,
      confirmLabel: "删除",
      variant: "danger",
      onConfirm: async () => {
        await deleteReview({ id: id as any })
        if (selectedReviewId === id) {
          setSelectedReviewId(null)
        }
      },
    })
  }

  const handleManualAddReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setManualAddError("")

    const rating = Number(manualRating)
    if (!manualCourseName || !manualSemester || !manualContent.trim()) {
      setManualAddError("请填写完整信息")
      return
    }

    if (Number.isNaN(rating) || rating < 0 || rating > 10) {
      setManualAddError("评分需在 0-10 之间")
      return
    }

    try {
      await createReview({
        courseName: manualCourseName,
        semester: manualSemester,
        rating,
        content: manualContent.trim(),
        isAnonymous: manualAnonymous,
        status: manualStatus,
      })
      setManualAddOpen(false)
      resetManualForm()
    } catch (error) {
      setManualAddError(error instanceof Error ? error.message : "添加评测失败")
    }
  }

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setCourseError("")

    try {
      if (courseDialogMode === "create") {
        await createCourse({
          name: courseName,
          instructor: courseInstructor,
          department: courseDepartment,
        })
      } else if (editingCourseId) {
        await updateCourse({
          id: editingCourseId as any,
          name: courseName,
          instructor: courseInstructor,
          department: courseDepartment,
        })
      }

      setCourseDialogOpen(false)
      resetCourseForm()
    } catch (error) {
      setCourseError(error instanceof Error ? error.message : "保存课程失败")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">评测审核</h1>
          <p className="text-gray-500 mt-1">管理课程评测内容</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                导入数据
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>导入课程评测数据</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">点击或拖拽文件到此处上传</p>
                  <p className="text-xs text-gray-400 mt-1">支持 CSV, Excel 格式</p>
                </div>
                <Button className="w-full" disabled>
                  选择文件
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={manualAddOpen} onOpenChange={(open) => {
            setManualAddOpen(open)
            if (!open) resetManualForm()
          }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800">
                <Plus className="h-4 w-4 mr-2" />
                手动添加
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>手动添加课程评测</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleManualAddReview}>
                <div className="space-y-2">
                  <Label htmlFor="manual-course">课程</Label>
                  <select
                    id="manual-course"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={manualCourseName}
                    onChange={(e) => {
                      const nextName = e.target.value
                      setManualCourseName(nextName)
                    }}
                  >
                    {courses.map((course) => (
                      <option key={course._id} value={course.name}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual-semester">开课学期</Label>
                  <Input
                    id="manual-semester"
                    value={manualSemester}
                    onChange={(e) => setManualSemester(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="manual-rating">评分 (0-10)</Label>
                    <Input
                      id="manual-rating"
                      type="number"
                      min={0}
                      max={10}
                      value={manualRating}
                      onChange={(e) => setManualRating(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manual-status">状态</Label>
                    <select
                      id="manual-status"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={manualStatus}
                      onChange={(e) => setManualStatus(e.target.value as CourseReview["status"])}
                    >
                      <option value="pending">待审核</option>
                      <option value="approved">已通过</option>
                      <option value="rejected">已拒绝</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual-content">评测内容</Label>
                  <Textarea
                    id="manual-content"
                    rows={4}
                    value={manualContent}
                    onChange={(e) => setManualContent(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="manual-anonymous"
                    type="checkbox"
                    checked={manualAnonymous}
                    onChange={(e) => setManualAnonymous(e.target.checked)}
                  />
                  <Label htmlFor="manual-anonymous">匿名发布</Label>
                </div>
                {manualAddError && <p className="text-sm text-red-600">{manualAddError}</p>}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setManualAddOpen(false)}>
                    取消
                  </Button>
                  <Button type="submit">保存</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">待审核</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reviews.filter((review) => review.status === "pending").length}
                </p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">需处理</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">已通过</p>
                <p className="text-2xl font-bold text-green-600">
                  {reviews.filter((review) => review.status === "approved").length}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">总计</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">课程总数</p>
                <p className="text-2xl font-bold text-blue-600">{courses.length}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">课程</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">课程信息管理</CardTitle>
          <Button size="sm" onClick={openCreateCourseDialog}>
            <Plus className="h-4 w-4 mr-1" />
            添加课程
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>课程名称</TableHead>
                <TableHead>教师</TableHead>
                <TableHead>院系</TableHead>
                <TableHead>评测数</TableHead>
                <TableHead>平均分</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>{course.reviewCount}</TableCell>
                  <TableCell>{course.averageRating.toFixed(1)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openEditCourseDialog(course)}>
                      <Pencil className="h-4 w-4 mr-1" />
                      编辑
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{courseDialogMode === "create" ? "添加课程" : "编辑课程信息"}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSaveCourse}>
            <div className="space-y-2">
              <Label htmlFor="course-name">课程名称</Label>
              <Input id="course-name" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-instructor">教师</Label>
              <Input id="course-instructor" value={courseInstructor} onChange={(e) => setCourseInstructor(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-department">开课院系</Label>
              <Input id="course-department" value={courseDepartment} onChange={(e) => setCourseDepartment(e.target.value)} required />
            </div>
            {courseError && <p className="text-sm text-red-600">{courseError}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCourseDialogOpen(false)}>
                取消
              </Button>
              <Button type="submit">保存</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索课程名称或内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter ? statusLabels[statusFilter as CourseReview["status"]] : "全部状态"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>全部状态</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>待审核</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("approved")}>已通过</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>已拒绝</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>课程名称</TableHead>
                <TableHead>学期</TableHead>
                <TableHead>评分</TableHead>
                <TableHead>评价内容</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>提交时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell className="font-medium">{review.courseName}</TableCell>
                  <TableCell className="text-gray-500">{review.semester}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        review.rating >= 8
                          ? "bg-green-100 text-green-800"
                          : review.rating >= 6
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {review.rating}/10
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-gray-500">{review.content}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[review.status]}>{statusLabels[review.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{new Date(review.createdAt).toLocaleDateString("zh-CN")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedReviewId(review._id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                        {review.status === "pending" && (
                          <>
                            <DropdownMenuItem className="text-green-600" onSelect={() => handleStatusChange(review._id, "approved")}>
                              <Check className="h-4 w-4 mr-2" />
                              通过
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onSelect={() => handleStatusChange(review._id, "rejected")}>
                              <X className="h-4 w-4 mr-2" />
                              拒绝
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem className="text-red-600" onSelect={() => handleDelete(review._id, review.courseName)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReviewId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>评测详情</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">课程名称</p>
                  <p className="font-medium">{selectedReview.courseName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">学期</p>
                  <p className="font-medium">{selectedReview.semester}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">评分</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${selectedReview.rating * 10}%` }} />
                  </div>
                  <span className="font-medium">{selectedReview.rating}/10</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">评价内容</p>
                <p className="mt-1 whitespace-pre-wrap">{selectedReview.content}</p>
              </div>
              <div className="flex gap-2 pt-4">
                {selectedReview.status === "pending" ? (
                  <>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(selectedReview._id, "approved")}>
                      <Check className="h-4 w-4 mr-2" />
                      通过
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleStatusChange(selectedReview._id, "rejected")}
                    >
                      <X className="h-4 w-4 mr-2" />
                      拒绝
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => setSelectedReviewId(null)}>
                    关闭
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">共 {filteredReviews.length} 条记录</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            上一页
          </Button>
          <Button variant="outline" size="sm" disabled>
            下一页
          </Button>
        </div>
      </div>

      <ConfirmDialog />
    </div>
  )
}
