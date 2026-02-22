"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import {
  usePublicationById,
  useUsers,
  useCreatePublication,
  useUpdatePublication,
} from "@/lib/api"
import {
  DEFAULT_PUBLICATION_CATEGORY,
  formatPublicationAuthors,
  getPublicationCategoryOptions,
  getPublicationSubCategoryOptions,
  parsePublicationAuthors,
} from "@/lib/publication-taxonomy"
import type { Publication } from "@/types"

type PublicationFormData = {
  title: string
  authors: string
  venue: string
  year: string
  abstract: string
  url: string
  category: string
  subCategory: string
  userId: string
}

const currentYear = new Date().getFullYear()

export default function AdminPublicationEditorPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const publicationId = params.id
  const isCreateMode = publicationId === "new"
  const { currentUser, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth()

  const [formError, setFormError] = useState("")

  // Fetch publication data from Convex
  const publicationData = usePublicationById(isCreateMode ? undefined : publicationId)
  const publication: Publication | null = publicationData || null
  const publicationLoading = !isCreateMode && publicationData === undefined

  // Fetch users from Convex
  const usersData = useUsers()
  const users: any[] = usersData || []

  // Mutations
  const createPublication = useCreatePublication()
  const updatePublication = useUpdatePublication()

  const [formData, setFormData] = useState<PublicationFormData>({
    title: "",
    authors: "",
    venue: "",
    year: String(currentYear),
    abstract: "",
    url: "",
    category: DEFAULT_PUBLICATION_CATEGORY,
    subCategory: "",
    userId: "",
  })

  // Update form data when publication is loaded
  useEffect(() => {
    if (isCreateMode) {
      setFormData((previous) => ({
        ...previous,
        userId: previous.userId || currentUser?._id || "",
      }))
      return
    }

    if (publication) {
      setFormData({
        title: publication.title,
        authors: formatPublicationAuthors(publication.authors),
        venue: publication.venue,
        year: String(publication.year),
        abstract: publication.abstract,
        url: publication.url || "",
        category: publication.category,
        subCategory: publication.subCategory || "",
        userId: publication.userId,
      })
    }
  }, [currentUser?._id, isCreateMode, publication])

  const categoryOptions = useMemo(
    () => getPublicationCategoryOptions(formData.category),
    [formData.category]
  )

  const subCategoryOptions = useMemo(
    () => getPublicationSubCategoryOptions(formData.category, formData.subCategory),
    [formData.category, formData.subCategory]
  )

  const handleCategoryChange = (category: string) => {
    const nextSubCategoryOptions = getPublicationSubCategoryOptions(category)
    setFormData((previous) => ({
      ...previous,
      category,
      subCategory: nextSubCategoryOptions.includes(previous.subCategory) ? previous.subCategory : "",
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isAdmin) {
      return
    }

    setFormError("")

    const parsedAuthors = parsePublicationAuthors(formData.authors)
    if (parsedAuthors.length === 0) {
      setFormError("请至少填写一位作者。")
      return
    }

    const parsedYear = Number(formData.year)
    if (!Number.isInteger(parsedYear) || parsedYear < 1900 || parsedYear > currentYear + 1) {
      setFormError("发表年份格式不正确。")
      return
    }

    setFormError("")

    const payload = {
      title: formData.title.trim(),
      authors: parsedAuthors,
      venue: formData.venue.trim(),
      year: parsedYear,
      abstract: formData.abstract.trim(),
      url: formData.url.trim() || undefined,
      category: formData.category,
      subCategory: formData.subCategory.trim() || undefined,
    }

    try {
      if (isCreateMode) {
        await createPublication({
          ...payload,
          userId: formData.userId as any,
        })
      } else if (publication) {
        await updatePublication({
          id: (publication as any)._id,
          ...payload,
        })
      }

      router.push("/admin/publications")
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "保存失败")
    }
  }

  if (authLoading || publicationLoading) {
    return (
      <div className="space-y-6">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  if (!isCreateMode && !publication) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/admin/publications")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回成果管理
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500">未找到该成果记录。</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/publications")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isCreateMode ? "新建成果" : "编辑成果"}</h1>
          <p className="text-gray-500 mt-1">{isCreateMode ? "创建新的学术成果记录" : "修改已有学术成果记录"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{isCreateMode ? "成果信息" : "编辑信息"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">归属用户</Label>
              <select
                id="userId"
                className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.userId}
                onChange={(event) => setFormData((previous) => ({ ...previous, userId: event.target.value }))}
                required
              >
                <option value="" disabled>
                  请选择用户
                </option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.englishName} ({user.username})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(event) => setFormData((previous) => ({ ...previous, title: event.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authors">作者（换行或逗号分隔）</Label>
              <Textarea
                id="authors"
                rows={4}
                value={formData.authors}
                onChange={(event) => setFormData((previous) => ({ ...previous, authors: event.target.value }))}
                placeholder={"例如：Alice Zhang\nBob Li\nCarol Wang"}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">领域</Label>
                <select
                  id="category"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.category}
                  onChange={(event) => handleCategoryChange(event.target.value)}
                  required
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subCategory">子领域</Label>
                <select
                  id="subCategory"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.subCategory}
                  onChange={(event) => setFormData((previous) => ({ ...previous, subCategory: event.target.value }))}
                >
                  <option value="">未指定</option>
                  {subCategoryOptions.map((subCategory) => (
                    <option key={subCategory} value={subCategory}>
                      {subCategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue">会议/期刊</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(event) => setFormData((previous) => ({ ...previous, venue: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">年份</Label>
                <Input
                  id="year"
                  type="number"
                  min={1900}
                  max={currentYear + 1}
                  value={formData.year}
                  onChange={(event) => setFormData((previous) => ({ ...previous, year: event.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">链接（可选）</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://arxiv.org/..."
                value={formData.url}
                onChange={(event) => setFormData((previous) => ({ ...previous, url: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                rows={6}
                value={formData.abstract}
                onChange={(event) => setFormData((previous) => ({ ...previous, abstract: event.target.value }))}
                required
              />
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/publications")}>
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
