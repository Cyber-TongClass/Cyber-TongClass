"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useCreateNews } from "@/lib/api"
import { MarkdownSplitEditor } from "@/components/markdown/markdown-split-editor"

const categoryOptions = ["学术成果", "课程安排", "活动预告", "活动回顾", "通知公告"]
const statusOptions = [
  { value: "draft", label: "草稿" },
  { value: "published", label: "已发布" },
]

export default function NewNewsPage() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const createNews = useCreateNews()

  const [formData, setFormData] = useState({
    title: "",
    category: "学术成果",
    author: "",
    status: "draft",
    content: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createNews({
        title: formData.title,
        category: formData.category,
        content: formData.content,
        authorId: currentUser?._id as any,
        authorName: formData.author,
        isPublished: formData.status === "published",
        publishedAt: formData.status === "published" ? Date.now() : undefined,
      })

      router.push("/admin/news")
    } catch (error) {
      console.error("Failed to create news:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">创建新闻</h1>
          <p className="text-gray-500 mt-1">填写并创建新闻内容</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>新闻信息</CardTitle>
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
            创建
          </Button>
        </div>
      </form>
    </div>
  )
}
