"use client"

import * as React from "react"
import Link from "next/link"
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Mail, 
  MapPin, 
  Phone, 
  ExternalLink,
  ArrowRight,
  Clock,
  Award,
  Group
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 border-b border-border">
        <div className="container-custom py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              关于通班
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            了解北京大学与清华大学联合培养人工智能创新人才项目的更多信息。
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-custom py-8">
        <Tabs defaultValue="introduction" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto p-1">
            <TabsTrigger value="introduction" className="py-3">项目介绍</TabsTrigger>
            <TabsTrigger value="accounts" className="py-3">官方账号</TabsTrigger>
            <TabsTrigger value="campus" className="py-3">校园生活</TabsTrigger>
            <TabsTrigger value="council" className="py-3">学生会</TabsTrigger>
            <TabsTrigger value="merchandise" className="py-3">周边</TabsTrigger>
            <TabsTrigger value="contact" className="py-3">联系</TabsTrigger>
          </TabsList>

          {/* Introduction */}
          <TabsContent value="introduction" className="mt-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">项目介绍</h2>
              
              <div className="space-y-8">
                {/* Overview */}
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-4">关于我们</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      北京大学与清华大学联合培养人工智能创新人才项目（以下简称&quot;通班&quot;）于2020年启动，旨在培养具有国际视野、创新能力的人工智能领域领军人才。
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      项目汇聚两校优质教学资源，由顶尖学者指导，学生可在北大和清华两所顶尖学府完成学业，享受丰富的学术资源和实践机会。
                    </p>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground">100+</div>
                      <div className="text-sm text-muted-foreground">在读学生</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground">200+</div>
                      <div className="text-sm text-muted-foreground">学术成果</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground">50+</div>
                      <div className="text-sm text-muted-foreground">顶会论文</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Group className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground">30+</div>
                      <div className="text-sm text-muted-foreground">合作导师</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Features */}
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-6">项目特色</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-2">双校联合培养</h4>
                        <p className="text-sm text-muted-foreground">
                          整合北大和清华优质教育资源，享受两校学术氛围
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-2">顶尖导师指导</h4>
                        <p className="text-sm text-muted-foreground">
                          由两校顶尖学者组成导师团队，提供一对一指导
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-2">丰硕学术成果</h4>
                        <p className="text-sm text-muted-foreground">
                          学生已在顶级会议发表多篇论文，获得多项奖励
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Official Accounts */}
          <TabsContent value="accounts" className="mt-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">官方账号</h2>
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">官方微信公众号</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          关注获取最新动态、通知公告和活动信息
                        </p>
                        <p className="text-sm font-medium">ID: TongClass_PKU</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Bilibili 账号</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          观看学术讲座回放、分享研究心得
                        </p>
                        <p className="text-sm font-medium">UID: 123456789</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Discord 社区</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          加入社区与同学交流、分享资源
                        </p>
                        <a href="#" className="text-sm text-primary hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          加入社区
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campus Life */}
          <TabsContent value="campus" className="mt-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">校园生活</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      北大校区
                    </h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>昌平校区：主要教学地点，配备现代化教学楼和实验室</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>学习时间：周一至周五课程，周末可预约实验室</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      清华校区
                    </h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>FIT楼：人工智能研究院所在地，配备先进设备</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>学习时间：定期访问，可使用清华图书馆资源</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="md:col-span-2">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">学生活动</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-2">学术沙龙</h4>
                        <p className="text-sm text-muted-foreground">每周一次，分享最新研究成果</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-2">体育活动</h4>
                        <p className="text-sm text-muted-foreground">篮球、足球、羽毛球等</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-2">团建活动</h4>
                        <p className="text-sm text-muted-foreground">春秋季出游、节日聚会</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Student Council */}
          <TabsContent value="council" className="mt-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">学生会</h2>
              <Card>
                <CardContent className="p-8">
                  <p className="text-muted-foreground mb-6">
                    通班学生会是由学生自发组织的服务团体，致力于丰富同学课余生活、促进学术交流、维护同学权益。
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">学生会架构</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-primary" />
                          主席团：负责学生会整体工作
                        </li>
                        <li className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-primary" />
                          学术部：组织学术沙龙、讲座
                        </li>
                        <li className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-primary" />
                          宣传部：宣传、活动摄影
                        </li>
                        <li className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-primary" />
                          文体部：组织文体活动
                        </li>
                        <li className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-primary" />
                          外联部：对外交流合作
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">联系我们</h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <a href="mailto:council@tongclass.ac.cn" className="hover:text-primary">
                            council@tongclass.ac.cn
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Merchandise */}
          <TabsContent value="merchandise" className="mt-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">周边产品</h2>
              <Card>
                <CardContent className="p-8">
                  <p className="text-muted-foreground mb-6">
                    通班周边产品正在设计中，敬请期待！如有好的建议，欢迎联系我们。
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center p-6 rounded-lg border border-dashed">
                      <div className="h-32 bg-muted/50 rounded-lg mb-4 flex items-center justify-center">
                        <Award className="h-10 w-10 text-primary/70" />
                      </div>
                      <h4 className="font-medium">文化衫</h4>
                      <p className="text-sm text-muted-foreground mt-1">即将上线</p>
                    </div>
                    <div className="text-center p-6 rounded-lg border border-dashed">
                      <div className="h-32 bg-muted/50 rounded-lg mb-4 flex items-center justify-center">
                        <GraduationCap className="h-10 w-10 text-primary/70" />
                      </div>
                      <h4 className="font-medium">学位服</h4>
                      <p className="text-sm text-muted-foreground mt-1">即将上线</p>
                    </div>
                    <div className="text-center p-6 rounded-lg border border-dashed">
                      <div className="h-32 bg-muted/50 rounded-lg mb-4 flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-primary/70" />
                      </div>
                      <h4 className="font-medium">笔记本</h4>
                      <p className="text-sm text-muted-foreground mt-1">即将上线</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact */}
          <TabsContent value="contact" className="mt-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">联系我们</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">联系信息</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">邮箱</p>
                          <a href="mailto:info@tongclass.ac.cn" className="text-sm text-muted-foreground hover:text-primary">
                            info@tongclass.ac.cn
                          </a>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">地址</p>
                          <p className="text-sm text-muted-foreground">
                            北京市海淀区颐和园路5号<br />
                            北京大学昌平校区
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">电话</p>
                          <p className="text-sm text-muted-foreground">010-62751234</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">快速链接</h3>
                    <ul className="space-y-3">
                      <li>
                        <a 
                          href="https://www.ai.pku.edu.cn/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                          北京大学人工智能研究院
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://www.tsinghua.edu.cn/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                          清华大学
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://www.pku.edu.cn/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                          北京大学
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Back to old version */}
      <section className="border-t border-border bg-muted/30">
        <div className="container-custom py-8 text-center">
          <p className="text-muted-foreground mb-4">
            想要查看旧版网站？
          </p>
          <a href="https://nostalgic.tongclass.ac.cn/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              访问旧版网站
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
