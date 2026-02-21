"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery } from "@convex-dev/react"
import { api } from "@/convex/_generated/api"
import { Search, FileText, ExternalLink, Filter, BookOpen, User, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
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

// Category definitions from prompt.md
const categories = [
  { value: "all", label: "全部领域" },
  { value: "ML", label: "Machine Learning" },
  { value: "CV", label: "Computer Vision" },
  { value: "NLP", label: "Natural Language Processing" },
  { value: "MM", label: "Multimodal AI" },
  { value: "GEN", label: "Generative Modeling" },
  { value: "RL", label: "Reinforcement Learning" },
  { value: "MAS", label: "Multi-Agent Systems" },
  { value: "ROB", label: "Robotics" },
  { value: "SYS", label: "AI Systems" },
  { value: "SAFE", label: "AI Safety" },
  { value: "KA", label: "Knowledge & Reasoning" },
  { value: "SCI", label: "AI for Science" },
  { value: "HCI", label: "Human-AI Interaction" },
  { value: "APP", label: "Applications" },
]

// Mock data - will be replaced with Convex API
const mockPublications = [
  {
    _id: "1" as any,
    title: "Efficient Deep Learning for Image Classification",
    authors: ["Wei Zhang", "Ming Li", "Lei Wang"],
    venue: "CVPR",
    year: 2024,
    category: "CV",
    subCategory: "image understanding",
    abstract: "We present a novel efficient deep learning method for image classification...",
    url: "https://arxiv.org",
    userId: "1" as any,
  },
  {
    _id: "2" as any,
    title: "Robust Neural Networks against Adversarial Attacks",
    authors: ["Wei Zhang", "Hao Chen"],
    venue: "ICML",
    year: 2024,
    category: "ML",
    subCategory: "robustness",
    abstract: "We propose a new training method to improve neural network robustness...",
    url: "https://arxiv.org",
    userId: "1" as any,
  },
  {
    _id: "3" as any,
    title: "Large Language Models for Code Generation",
    authors: ["Jie Liu", "Wei Zhang", "Xin Yang"],
    venue: "NeurIPS",
    year: 2024,
    category: "NLP",
    subCategory: "language modeling",
    abstract: "We investigate the capability of large language models in code generation...",
    url: "https://arxiv.org",
    userId: "2" as any,
  },
  {
    _id: "4" as any,
    title: "Multi-Modal Learning for Vision-Language Tasks",
    authors: ["Fang Zhou", "Ming Li"],
    venue: "ICLR",
    year: 2023,
    category: "MM",
    subCategory: "vision-language",
    abstract: "We propose a unified framework for vision-language tasks...",
    url: "https://arxiv.org",
    userId: "3" as any,
  },
  {
    _id: "5" as any,
    title: "Diffusion Models for Text-to-Image Synthesis",
    authors: ["Kai Wu", "Lei Wang", "Wei Zhang"],
    venue: "SIGGRAPH",
    year: 2023,
    category: "GEN",
    subCategory: "diffusion",
    abstract: "We present a novel diffusion model architecture for high-quality text-to-image synthesis...",
    url: "https://arxiv.org",
    userId: "4" as any,
  },
  {
    _id: "6" as any,
    title: "Deep Reinforcement Learning for Robotics",
    authors: ["Hao Liu", "Jie Chen"],
    venue: "CoRL",
    year: 2023,
    category: "RL",
    subCategory: "policy learning",
    abstract: "We develop a new deep RL algorithm for robotic manipulation...",
    url: "https://arxiv.org",
    userId: "5" as any,
  },
  {
    _id: "7" as any,
    title: "Efficient Inference for Large Language Models",
    authors: ["Xin Yang", "Wei Zhang"],
    venue: "OSDI",
    year: 2022,
    category: "SYS",
    subCategory: "efficient inference",
    abstract: "We propose techniques to accelerate inference for large language models...",
    url: "https://arxiv.org",
    userId: "6" as any,
  },
  {
    _id: "8" as any,
    title: "Interpretability in Deep Neural Networks",
    authors: ["Kai Wu", "Fang Zhou"],
    venue: "ICML",
    year: 2022,
    category: "SAFE",
    subCategory: "interpretability",
    abstract: "We investigate methods to interpret decisions made by deep neural networks...",
    url: "https://arxiv.org",
    userId: "4" as any,
  },
]

// Get category label
function getCategoryLabel(category: string) {
  const cat = categories.find(c => c.value === category)
  return cat?.label || category
}

// Highlight current user in authors list
function AuthorsList({ authors, currentUserId }: { authors: string[], currentUserId?: string }) {
  return (
    <span>
      {authors.map((author, index) => (
        <span key={index}>
          <span className={author === "Wei Zhang" ? "font-semibold text-foreground" : ""}>
            {author}
          </span>
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
  
  // 实际项目中从 API 获取数据
  // const publications = useQuery(api.publications.list, {})
  const publications = mockPublications

  // Filter and sort publications
  const filteredPublications = React.useMemo(() => {
    let result = [...publications]
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (pub) =>
          pub.title.toLowerCase().includes(query) ||
          pub.authors.some(a => a.toLowerCase().includes(query))
      )
    }
    
    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((pub) => pub.category === selectedCategory)
    }
    
    // Sort
    result.sort((a, b) => {
      if (sortBy === "year") {
        return sortOrder === "desc" ? b.year - a.year : a.year - b.year
      } else {
        return sortOrder === "desc" 
          ? b.title.localeCompare(a.title) 
          : a.title.localeCompare(b.title)
      }
    })
    
    return result
  }, [publications, searchQuery, selectedCategory, sortBy, sortOrder])

  // Split into latest and archive
  const latestPublications = filteredPublications.filter(pub => pub.year >= 2024)
  const archivePublications = filteredPublications.filter(pub => pub.year < 2024)

  const displayPublications = activeTab === "latest" ? latestPublications : archivePublications

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 border-b border-border">
        <div className="container-custom py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              学术成果
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            展示通班师生的学术论文、研究成果与学术贡献。
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
                placeholder="搜索作者或题目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择领域" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "year" | "title")}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">按年份</SelectItem>
                  <SelectItem value="title">按标题</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "desc" | "asc")}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="顺序" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">降序</SelectItem>
                  <SelectItem value="asc">升序</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
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

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            共 {filteredPublications.length} 篇论文
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-border">
        <div className="container-custom">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("latest")}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === "latest"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Latest Works
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-xs">
                {latestPublications.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("archive")}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === "archive"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Archive
              <span className="ml-2 px-2 py-0.5 rounded-full bg-muted text-xs">
                {archivePublications.length}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Publications List */}
      <section className="container-custom py-8">
        {displayPublications.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              未找到相关成果
            </h3>
            <p className="text-muted-foreground">
              尝试调整筛选条件或搜索关键词
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayPublications.map((pub) => (
              <Link key={pub._id} href={`/publications/${pub._id}`}>
                <Card className="group hover:shadow-md transition-all border-border/50 hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Category badge */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/5 text-primary border border-primary/10">
                            {getCategoryLabel(pub.category)}
                          </span>
                          {pub.subCategory && (
                            <span className="text-xs text-muted-foreground">
                              {pub.subCategory}
                            </span>
                          )}
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {pub.title}
                        </h3>
                        
                        {/* Authors */}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <User className="h-4 w-4" />
                          <AuthorsList authors={pub.authors} />
                        </div>
                        
                        {/* Venue & Year */}
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-medium text-primary">{pub.venue}</span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground">{pub.year}</span>
                        </div>
                      </div>
                      
                      {/* External Link */}
                      {pub.url && (
                        <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      )}
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
