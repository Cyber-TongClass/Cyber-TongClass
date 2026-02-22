"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, BookOpen, Users, Calendar, FileText, Award, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const featuredSlides = [
  {
    title: "通班学术周启动：跨校联合研究论坛",
    description: "聚焦多模态模型与具身智能，邀请北大与清华导师联合分享最新研究进展。",
    category: "学术活动",
    href: "/news/1",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "课程评测系统升级上线",
    description: "支持按课程聚合、评分排序与检索，帮助成员快速筛选课程经验。",
    category: "系统更新",
    href: "/resources",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "最新成果发布：高效推理系统获顶会录用",
    description: "通班学生在AI Systems方向取得新突破，论文入选OSDI相关研讨会。",
    category: "成果发布",
    href: "/publications",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
  },
]

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredSlides.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[360px] md:h-[480px] overflow-hidden border-b border-border">
        {featuredSlides.map((slide, idx) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === activeSlide ? "opacity-100" : "opacity-0"}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
            <div className="container-custom relative h-full flex items-center">
              <div className="max-w-2xl text-white">
                <p className="inline-flex mb-4 text-xs tracking-wide uppercase bg-white/20 px-3 py-1 rounded-full">
                  {slide.category}
                </p>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">{slide.title}</h1>
                <p className="text-white/90 text-base md:text-lg mb-6">{slide.description}</p>
                <Button asChild size="lg" className="gap-2">
                  <Link href={slide.href}>
                    查看详情 <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between">
          <div className="flex gap-2">
            {featuredSlides.map((slide, idx) => (
              <button
                key={slide.title}
                onClick={() => setActiveSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${idx === activeSlide ? "w-8 bg-white" : "w-2.5 bg-white/50"}`}
                aria-label={`切换到第 ${idx + 1} 张`}
              />
            ))}
          </div>
          <div className="hidden sm:flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/20 text-white hover:bg-white/30 border border-white/30"
              onClick={() => setActiveSlide((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/20 text-white hover:bg-white/30 border border-white/30"
              onClick={() => setActiveSlide((prev) => (prev + 1) % featuredSlides.length)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">人工智能创新人才培养</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">北京大学 & 清华大学 联合培养项目</p>
            <p className="text-muted-foreground">致力于培养具有国际视野的下一代人工智能领军人才</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/about">
                  了解更多 <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/members">查看成员</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "成员", value: "100+", icon: Users },
              { label: "学术成果", value: "200+", icon: FileText },
              { label: "课程资源", value: "50+", icon: BookOpen },
              { label: "学术奖项", value: "30+", icon: Award },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">项目特色</h2>
            <p className="text-muted-foreground mt-2">跨学科培养，国际视野，创新实践</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>双校联合培养</CardTitle>
                <CardDescription>汇聚北大清华优质教育资源，打造全方位人才培养体系</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>学术成果丰硕</CardTitle>
                <CardDescription>在顶级会议发表论文，参与前沿科研项目</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle>丰富学术活动</CardTitle>
                <CardDescription>定期举办学术讲座、研讨会和学术交流活动</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">最新动态</h2>
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/news">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "通班学生获ICML最佳论文奖",
                category: "学术成果",
                date: "2024-01-15",
                description: "恭喜通班学生XXX在ICML 2024获得最佳论文奖...",
              },
              {
                title: "2024年春季学期课程安排发布",
                category: "课程安排",
                date: "2024-01-10",
                description: "2024年春季学期课程安排已发布，请同学们查看...",
              },
              {
                title: "通班学术沙龙圆满结束",
                category: "活动回顾",
                date: "2024-01-05",
                description: "上周举办的通班学术沙龙活动圆满结束...",
              },
            ].map((news) => (
              <Card key={news.title} className="border-0 shadow-sm hover:shadow-md transition-shadow card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span className="text-primary font-medium">{news.category}</span>
                    <span>{news.date}</span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
                </CardHeader>
                <CardDescription className="px-6 pb-6">{news.description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
