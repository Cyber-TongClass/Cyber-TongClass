import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 模拟数据 - 实际项目中从 API 获取
const mockNews = {
  _id: "1",
  title: "通班学生获ICML 2024最佳论文奖",
  content: `恭喜通班学生XXX在ICML 2024获得最佳论文奖！这是在机器学习领域顶级会议上获得的殊荣。

## 研究背景

近年来，随着深度学习技术的快速发展，如何提高模型的效率和鲁棒性成为了研究的热点问题。通班学生在此领域进行了深入的研究，并取得了突破性进展。

## 研究成果

本研究提出了一种新的方法来提高深度学习模型在资源受限设备上的效率。通过结合神经架构搜索和知识蒸馏技术，我们的方法在保持高精度的同时，显著降低了计算成本。

## 获奖感言

能够获得ICML最佳论文奖，我感到非常荣幸。感谢导师的悉心指导，感谢通班提供的优质研究环境，感谢同学们的帮助和支持。这个奖项不仅是对我个人的肯定，更是对整个通班研究团队的认可。

## 未来计划

我们将继续在人工智能领域深耕，努力产出更多高水平的研究成果，为人工智能技术的发展贡献力量。`,
  authorName: "王老师",
  category: "学术成果",
  publishedAt: "2024-01-15",
  createdAt: Date.now(),
}

export default function NewsDetailPage({
  params,
}: {
  params: { id: string }
}) {
  // 实际项目中: useQuery(api.news.getById, { id: params.id })
  const news = mockNews

  // 解析 markdown 内容为段落（简化版本）
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      // 处理标题
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-semibold mt-8 mb-4 text-foreground">
            {paragraph.replace('## ', '')}
          </h2>
        )
      }
      // 处理普通段落
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-4">
          {paragraph}
        </p>
      )
    })
  }

  return (
    <div className="container-custom py-8 md:py-12">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-6 -ml-3 gap-2">
        <Link href="/news">
          <ArrowLeft className="h-4 w-4" />
          返回新闻列表
        </Link>
      </Button>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="space-y-4 mb-8">
          {/* Category & Date */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
              {news.category}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {news.publishedAt}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            {news.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{news.authorName}</span>
          </div>
        </div>

        {/* Content */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="prose prose-gray max-w-none">
              {renderContent(news.content)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
