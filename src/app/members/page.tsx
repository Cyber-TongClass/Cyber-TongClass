"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Users as UsersIcon, GraduationCap, School } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUsers } from "@/lib/api"
import type { User } from "@/types"

// 排序函数：学校 → 年级（新→旧）→ 拼音
function sortUsers(users: User[]) {
  const orgOrder = { pku: 0, thu: 1 }
  
  return [...users].sort((a, b) => {
    // 首先按学校排序
    if (a.organization !== b.organization) {
      return orgOrder[a.organization as keyof typeof orgOrder] - orgOrder[b.organization as keyof typeof orgOrder]
    }
    // 然后按年级（新→旧，即从大到小）
    if (a.cohort !== b.cohort) {
      return b.cohort - a.cohort
    }
    // 最后按拼音排序
    return a.englishName.localeCompare(b.englishName, 'en')
  })
}

// 获取所有唯一的研究兴趣标签
function getAllTags(users: User[]) {
  const tags = new Set<string>()
  users.forEach(user => {
    user.researchInterests?.forEach(interest => tags.add(interest))
  })
  return Array.from(tags).sort()
}

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedOrg, setSelectedOrg] = React.useState<string>("all")
  const [selectedCohort, setSelectedCohort] = React.useState<string>("all")
  const [selectedTag, setSelectedTag] = React.useState<string>("all")

  // Fetch users from Convex
  const usersData = useUsers()
  const usersFromConvex = usersData || []
  const users: User[] = usersFromConvex.map((u) => ({
    ...u,
    _id: u._id,
  }))

  // Show loading state while fetching
  if (!usersData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-custom py-12">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const allTags = getAllTags(users)
  const sortedUsers = sortUsers(users)

  // 筛选用户
  const filteredUsers = sortedUsers.filter(user => {
    // 搜索筛选
    if (searchQuery && !user.englishName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    // 学校筛选
    if (selectedOrg !== "all" && user.organization !== selectedOrg) {
      return false
    }
    // 年级筛选
    if (selectedCohort !== "all" && user.cohort !== parseInt(selectedCohort)) {
      return false
    }
    // 标签筛选
    if (selectedTag !== "all" && !user.researchInterests?.includes(selectedTag)) {
      return false
    }
    return true
  })

  // 年级选项
  const currentYear = new Date().getFullYear()
  const cohorts = Array.from({ length: currentYear - 2019 }, (_, idx) => currentYear - idx)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 border-b border-border">
        <div className="container-custom py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              团队成员
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            北京大学与清华大学联合培养的人工智能创新人才，涵盖机器学习、计算机视觉、自然语言处理等多个前沿领域。
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
                placeholder="搜索成员..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Organization Filter */}
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="选择学校" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部学校</SelectItem>
                  <SelectItem value="pku">北大通班</SelectItem>
                  <SelectItem value="thu">清华通班</SelectItem>
                </SelectContent>
              </Select>

              {/* Cohort Filter */}
              <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="选择年级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部年级</SelectItem>
                  {cohorts.map((cohort) => (
                    <SelectItem key={cohort} value={cohort.toString()}>
                      {cohort}级
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Tag Filter */}
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="研究方向" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部方向</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {(selectedOrg !== "all" || selectedCohort !== "all" || selectedTag !== "all" || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedOrg("all")
                    setSelectedCohort("all")
                    setSelectedTag("all")
                    setSearchQuery("")
                  }}
                >
                  清除筛选
                </Button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            显示 {filteredUsers.length} 位成员
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="container-custom py-8">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              未找到匹配成员
            </h3>
            <p className="text-muted-foreground">
              尝试调整筛选条件或搜索关键词
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <Link key={user._id} href={`/members/${user._id}`}>
                <Card className="group h-full hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30">
                  <CardContent className="p-6">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className="h-20 w-20 rounded-full overflow-hidden bg-muted ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.englishName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-semibold text-primary">
                            {(user.englishName || user.username || "U").charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-semibold text-center text-foreground group-hover:text-primary transition-colors">
                      {user.englishName}
                    </h3>

                    {/* Organization & Cohort */}
                    <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                      {user.organization === "pku" ? (
                        <School className="h-4 w-4" />
                      ) : (
                        <GraduationCap className="h-4 w-4" />
                      )}
                      <span>
                        {user.organization === "pku" ? "北大" : "清华"}通班 · {user.cohort}级
                      </span>
                    </div>
                  </CardContent>

                  {/* Tags */}
                  {user.researchInterests && user.researchInterests.length > 0 && (
                    <CardFooter className="pt-0 px-6 pb-6">
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {user.researchInterests.slice(0, 3).map((interest) => (
                          <span
                            key={interest}
                            className="px-2 py-0.5 text-xs rounded-full bg-primary/5 text-primary/80 border border-primary/10"
                          >
                            {interest}
                          </span>
                        ))}
                        {user.researchInterests.length > 3 && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                            +{user.researchInterests.length - 3}
                          </span>
                        )}
                      </div>
                    </CardFooter>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
