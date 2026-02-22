"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useNewsById, useCreateNews, useUpdateNews } from "@/lib/api"
import { MarkdownSplitEditor } from "@/components/markdown/markdown-split-editor"

const categoryOptions = ["学术成果", "课程安排", "活动预告", "活动回顾", "通知公告"]
const statusOptions = [
  { value: "draft", label: "草稿" },
  { value: "published", label: "已发布" },
]

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const newsId = params.id
  const isCreateMode = newsId === "new"
  
  const { currentUser } = useAuth()
  
  const newsData = useNewsById(isCreateMode ? undefined : (newsId as string))
  const createNews = useCreateNews()
  const updateNews = useUpdateNews()

  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    category: "学术成果",
    author: "",
    status: "draft",
    content: "",
  })

  // Update form when news data loads
  useEffect(() => {
    if (isCreateMode) {
      setLoading(false)
      return
    }

    if (newsData === undefined) {
      return
    }

    if (newsData) {
      setFormData({
        title: newsData.title,
        category: newsData.category,
        author: newsData.authorName || "",
        status: newsData.isPublished ? "published" : "draft",
        content: newsData.content,
      })
    }
    setLoading(false)
  }, [newsData, isCreateMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isCreateMode) {
        await createNews({
          title: formData.title,
          category: formData.category,
          content: formData.content,
          authorId: currentUser?._id as any,
          authorName: formData.author,
          isPublished: formData.status === "published",
          publishedAt: formData.status === "published" ? Date.now() : undefined,
        })
      } else if (newsData) {
        await updateNews({
          id: newsData._id,
          title: formData.title,
          category: formData.category,
          authorName: formData.author,
          content: formData.content,
          isPublished: formData.status === "published",
          publishedAt: formData.status === "published" ? Date.now() : newsData.publishedAt,
        })
      }

      router.push("/admin/news")
    } catch (error) {
      console.error("Failed to save news:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!isCreateMode && !newsData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">新闻不存在</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500">未找到ID为 {newsId} 的新闻</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isCreateMode ? "创建新闻" : "编辑新闻"}</h1>
          <p className="text-gray-500 mt-1">{isCreateMode ? "填写并创建新闻内容" : "修改新闻信息"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{isCreateMode ? "新新闻信息" : "新闻信息"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">新闻标题</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <select
                  id="category"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">作者</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <select
                  id="status"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">新闻内容（Markdown）</Label>
              <MarkdownSplitEditor
                id="content"
                value={formData.content}
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                placeholder="输入新闻内容，支持 Markdown 语法。"
                minHeightClassName="min-h-[280px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            取消
          </Button>
          <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
            <Save className="h-4 w-4 mr-2" />
            {isCreateMode ? "创建" : "保存"}
          </Button>
        </div>
      </form>
    </div>
  )
}
