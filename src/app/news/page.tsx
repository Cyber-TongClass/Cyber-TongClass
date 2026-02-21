"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Newspaper, Calendar, User, Clock } from "lucide-react"
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
import { formatDate, truncate } from "@/lib/utils"

// 新闻分类
const categories = [
  { value: "all", label: "全部分类" },
  { value: "学术成果", label: "学术成果" },
  { value: "课程安排", label: "课程安排" },
  { value: "活动预告", label: "活动预告" },
  { value: "活动回顾", label: "活动回顾" },
  { value: "通知公告", label: "通知公告" },
]

// 模拟数据
const mockNews = [
  {
    _id: "1" as any,
    title: "通班学生获ICML 2024最佳论文奖",
    content: "恭喜通班学生XXX在ICML 2024获得最佳论文奖！这是在机器学习领域顶级会议上获得的殊荣...",
    authorName: "王老师",
    category: "学术成果",
    publishedAt: "2024-01-15",
    createdAt: Date.now(),
  },
  {
    _id: "2" as any,
    title: "2024年春季学期课程安排发布",
    content: "2024年春季学期课程安排已发布，请同学们查看具体课程时间和上课地点...",
    authorName: "教务处",
    category: "课程安排",
    publishedAt: "2024-01-10",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "3" as any,
    title: "通班学术沙龙圆满结束",
    content: "上周五举办的通班学术沙龙活动圆满结束，本次沙龙邀请了多位优秀学长学姐分享科研经验...",
    authorName: "学生会",
    category: "活动回顾",
    publishedAt: "2024-01-05",
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "4" as any,
    title: "关于举办2024年通班新生见面会的通知",
    content: "为帮助新生更好地了解通班项目，将于本周六举办新生见面会...",
    authorName: "学生会",
    category: "活动预告",
    publishedAt: "2024-01-01",
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "5" as any,
    title: "通班项目获批国家自然科学基金重点项目",
    content: "近日，通班项目获批国家自然科学基金重点项目，资助金额达...",
    authorName: "通班办公室",
    category: "学术成果",
    publishedAt: "2023-12-20",
    createdAt: Date.now() - 26 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "6" as any,
    title: "寒假期间实验室安全须知",
    content: "为确保寒假期间实验室安全，请各位同学注意以下事项...",
    authorName: "实验室管理",
    category: "通知公告",
    publishedAt: "2023-12-15",
    createdAt: Date.now() - 31 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "7" as any,
    title: "通班学生参加NeurIPS 2023并做口头报告",
    content: "通班学生XXX受邀参加NeurIPS 2023会议并做口头报告，分享了最新研究成果...",
    authorName: "王老师",
    category: "学术成果",
    publishedAt: "2023-12-10",
    createdAt: Date.now() - 36 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "8" as any,
    title: "2024年寒假放假安排",
    content: "根据学校安排，2024年寒假自1月20日起至2月18日止...",
    authorName: "教务处",
    category: "通知公告",
    publishedAt: "2023-12-05",
    createdAt: Date.now() - 41 * 24 * 60 * 60 * 1000,
  },
]

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [selectedAuthor, setSelectedAuthor] = React.useState("all")

  // 实际项目中从 API 获取数据
  // const news = useQuery(api.news.list, {})
  const news = mockNews

  // 获取所有唯一作者
  const authors = Array.from(new Set(news.map((n) => n.authorName)))

  // 筛选新闻
  const filteredNews = news
    .filter((item) => {
      // 搜索筛选
      if (
        searchQuery &&
        !item.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      // 分类筛选
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false
      }
      // 作者筛选
      if (selectedAuthor !== "all" && item.authorName !== selectedAuthor) {
        return false
      }
      return true
    })
    .sort((a, b) => b.createdAt - a.createdAt)

  // 按时间轴分组
  const groupedNews = React.useMemo(() => {
    const groups: Record<string, typeof filteredNews> = {}
    filteredNews.forEach((item) => {
      const monthKey = item.publishedAt.substring(0, 7) // YYYY-MM
      if (!groups[monthKey]) {
        groups[monthKey] = []
      }
      groups[monthKey].push(item)
    })
    return groups
  }, [filteredNews])

  const sortedMonths = Object.keys(groupedNews).sort((a, b) => b.localeCompare(a))

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 border-b border-border">
        <div className="container-custom py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              新闻动态
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            了解通班的最新动态、学术成果、活动通知等信息。
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
                placeholder="搜索新闻标题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Author Filter */}
              <Select
                value={selectedAuthor}
                onValueChange={setSelectedAuthor}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="选择作者" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部作者</SelectItem>
                  {authors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {(selectedCategory !== "all" ||
                selectedAuthor !== "all" ||
                searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("all")
                    setSelectedAuthor("all")
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
            显示 {filteredNews.length} 条新闻
          </div>
        </div>
      </section>

      {/* News Timeline */}
      <section className="container-custom py-8">
        {filteredNews.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              未找到匹配新闻
            </h3>
            <p className="text-muted-foreground">
              尝试调整筛选条件或搜索关键词
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedMonths.map((month) => (
              <div key={month}>
                {/* Month Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Calendar className="h-5 w-5" />
                    {month}
                  </div>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">
                    {groupedNews[month].length} 条
                  </span>
                </div>

                {/* News List */}
                <div className="space-y-4">
                  {groupedNews[month].map((item) => (
                    <Link key={item._id} href={`/news/${item._id}`}>
                      <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                  {item.category}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {item.publishedAt}
                                </span>
                              </div>
                              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                                {item.title}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.content}
                          </p>
                          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{item.authorName}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
