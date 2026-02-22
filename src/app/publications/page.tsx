"use client"

import * as React from "react"
import Link from "next/link"
import { Search, FileText, ExternalLink, BookOpen, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePublications } from "@/lib/api"
import type { Publication } from "@/types"

function AuthorsList({ authors }: { authors: string[] }) {
  return (
    <span>
      {authors.map((author, index) => (
        <span key={index}>
          <span>{author}</span>
          {index < authors.length - 1 && ", "}
        </span>
      ))}
    </span>
  )
}

export default function PublicationsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [sortBy, setSortBy] = React.useState<"year" | "title">("year")
  const [sortOrder, setSortOrder] = React.useState<"desc" | "asc">("desc")
  const [activeTab, setActiveTab] = React.useState<"latest" | "archive">("latest")

  const publicationsData = usePublications()
  const publications: Publication[] = publicationsData || []

  const categoryOptions = React.useMemo(() => {
    const unique = Array.from(new Set(publications.map((pub) => pub.category))).sort((a, b) => a.localeCompare(b))
    return [{ value: "all", label: "全部领域" }, ...unique.map((item) => ({ value: item, label: item }))]
  }, [publications])

  const filteredPublications = React.useMemo(() => {
    let result = [...publications]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (pub) => pub.title.toLowerCase().includes(query) || pub.authors.some((author) => author.toLowerCase().includes(query))
      )
    }

    if (selectedCategory !== "all") {
      result = result.filter((pub) => pub.category === selectedCategory)
    }

    result.sort((a, b) => {
      if (sortBy === "year") {
        return sortOrder === "desc" ? b.year - a.year : a.year - b.year
      }
      return sortOrder === "desc" ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)
    })

    return result
  }, [publications, searchQuery, selectedCategory, sortBy, sortOrder])

  const splitIndex = Math.max(6, Math.ceil(filteredPublications.length / 2))
  const latestPublications = filteredPublications.slice(0, splitIndex)
  const archivePublications = filteredPublications.slice(splitIndex)
  const displayPublications = activeTab === "latest" ? latestPublications : archivePublications

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary/5 border-b border-border">
        <div className="container-custom py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">学术成果</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">展示通班师生的学术论文、研究成果与学术贡献。</p>
        </div>
      </section>

      <section className="border-b border-border bg-white sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索作者或题目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择领域" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "year" | "title")}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">按年份</SelectItem>
                  <SelectItem value="title">按标题</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "desc" | "asc")}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="顺序" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">降序</SelectItem>
                  <SelectItem value="asc">升序</SelectItem>
                </SelectContent>
              </Select>

              {(selectedCategory !== "all" || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("all")
                    setSearchQuery("")
                  }}
                >
                  清除筛选
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">共 {filteredPublications.length} 篇论文</div>
        </div>
      </section>

      <section className="bg-white border-b border-border">
        <div className="container-custom">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("latest")}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === "latest" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Latest Works
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-xs">{latestPublications.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("archive")}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === "archive" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Archive
              <span className="ml-2 px-2 py-0.5 rounded-full bg-muted text-xs">{archivePublications.length}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="container-custom py-8">
        {displayPublications.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">未找到相关成果</h3>
            <p className="text-muted-foreground">尝试调整筛选条件或搜索关键词</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayPublications.map((pub) => (
              <Link key={pub._id} href={`/publications/${pub._id}`}>
                <Card className="group hover:shadow-md transition-all border-border/50 hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/5 text-primary border border-primary/10">
                            {pub.category}
                          </span>
                          {pub.subCategory && <span className="text-xs text-muted-foreground">{pub.subCategory}</span>}
                        </div>

                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {pub.title}
                        </h3>

                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <User className="h-4 w-4" />
                          <AuthorsList authors={pub.authors} />
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-medium text-primary">{pub.venue}</span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground">{pub.year}</span>
                        </div>
                      </div>

                      {pub.url && <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />}
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
