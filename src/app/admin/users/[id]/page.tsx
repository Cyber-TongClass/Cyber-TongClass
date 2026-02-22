"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save, UserPlus } from "lucide-react"
import { useUserById, useCreateUser, useUpdateUser } from "@/lib/api"
import type { UserRole } from "@/types"

type Organization = "pku" | "thu"
type Role = UserRole

const roleOptions: { value: Role; label: string }[] = [
  { value: "member", label: "成员" },
  { value: "admin", label: "管理员" },
  { value: "super_admin", label: "超级管理员" },
]

const organizationOptions: { value: Organization; label: string }[] = [
  { value: "pku", label: "北大通班" },
  { value: "thu", label: "清华通班" },
]

const CURRENT_YEAR = new Date().getFullYear()
const cohortOptions = Array.from({ length: CURRENT_YEAR - 2019 }, (_, idx) => CURRENT_YEAR - idx)

type UserFormData = {
  englishName: string
  username: string
  email: string
  organization: Organization
  cohort: number
  role: Role
  studentId: string
  password: string
}

export default function UserFormPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const userId = params.id
  const isCreateMode = userId === "new"

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<UserFormData>({
    englishName: "",
    username: "",
    email: "",
    organization: "pku",
    cohort: cohortOptions[0] || CURRENT_YEAR,
    role: "member",
    studentId: "",
    password: "",
  })

  // Use hooks at top level
  const userData = useUserById(isCreateMode ? undefined : userId)
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()

  // Set user data when fetched
  useEffect(() => {
    if (!isCreateMode && userData) {
      setFormData({
        englishName: userData.englishName || "",
        username: userData.username || "",
        email: userData.email || "",
        organization: userData.organization || "pku",
        cohort: userData.cohort || cohortOptions[0] || CURRENT_YEAR,
        role: userData.role || "member",
        studentId: userData.studentId || "",
        password: "",
      })
    }
    setLoading(false)
  }, [isCreateMode, userData])

  const expectedEmailHint = useMemo(() => {
    const studentId = formData.studentId.trim().toLowerCase() || "your_student_id"
    if (formData.organization === "pku") {
      return `${studentId}@stu.pku.edu.cn`
    }
    return `${studentId}@mails.tsinghua.edu.cn`
  }, [formData.organization, formData.studentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isCreateMode) {
      try {
        await createUserMutation({
          englishName: formData.englishName.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          organization: formData.organization,
          cohort: formData.cohort,
          role: formData.role,
          studentId: formData.studentId.trim(),
          password: formData.password,
        })
        router.push("/admin/users")
      } catch (err: any) {
        setError(err.message || "创建用户失败")
      }
      return
    }

    try {
      await updateUserMutation({
        id: userId as any,
        englishName: formData.englishName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        organization: formData.organization,
        cohort: formData.cohort,
        role: formData.role,
        studentId: formData.studentId.trim(),
      })
      router.push("/admin/users")
    } catch (err: any) {
      setError(err.message || "更新用户失败")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!isCreateMode && !userData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">用户不存在</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500">未找到ID为 {userId} 的用户</p>
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
          <h1 className="text-2xl font-bold text-gray-900">{isCreateMode ? "新建用户" : "编辑用户"}</h1>
          <p className="text-gray-500 mt-1">{isCreateMode ? "创建成员或管理员账号" : "修改用户信息与角色权限"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{isCreateMode ? "用户注册信息" : "用户信息"}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {isCreateMode ? "学校邮箱需与组织和学号匹配，创建后可立即登录。" : "保存后会立即同步到用户列表。"}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="englishName">姓名</Label>
                <Input
                  id="englishName"
                  value={formData.englishName}
                  onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">组织</Label>
                <Select
                  value={formData.organization}
                  onValueChange={(value) => setFormData({ ...formData, organization: value as Organization })}
                >
                  <SelectTrigger id="organization">
                    <SelectValue placeholder="选择组织" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationOptions.map((org) => (
                      <SelectItem key={org.value} value={org.value}>
                        {org.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cohort">年级</Label>
                <Select
                  value={formData.cohort.toString()}
                  onValueChange={(value) => setFormData({ ...formData, cohort: Number(value) })}
                >
                  <SelectTrigger id="cohort">
                    <SelectValue placeholder="选择年级" />
                  </SelectTrigger>
                  <SelectContent>
                    {cohortOptions.map((cohort) => (
                      <SelectItem key={cohort} value={cohort.toString()}>
                        {cohort}级
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">学校邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={expectedEmailHint}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">建议格式：{expectedEmailHint}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">角色</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as Role })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="studentId">学号</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                />
              </div>
              {isCreateMode && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="password">初始密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="至少 8 位"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    minLength={8}
                    required
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            取消
          </Button>
          <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
            {isCreateMode ? <UserPlus className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {isCreateMode ? "创建用户" : "保存"}
          </Button>
        </div>
      </form>
    </div>
  )
}
