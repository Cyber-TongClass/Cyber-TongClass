import Link from "next/link"
import { ArrowRight, Users, BookOpen, Calendar, Award, Mail, MapPin, GraduationCap, School, UsersRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
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
              关于通班
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            了解北京大学与清华大学联合培养人工智能创新人才项目。
          </p>
        </div>
      </section>

      <div className="container-custom py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                项目介绍
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-lg leading-relaxed mb-6">
                      北京大学与清华大学联合培养人工智能创新人才项目（以下简称"通班"）成立于2020年，旨在培养具有国际视野的人工智能领域领军人才。
                    </p>
                    
                    <h3 className="text-xl font-semibold mb-3">培养目标</h3>
                    <p className="text-muted-foreground mb-6">
                      培养掌握人工智能核心技术，具备跨学科视野和创新实践能力，能够在人工智能领域开展前沿研究和工程实践的领军人才。
                    </p>

                    <h3 className="text-xl font-semibold mb-3">培养特色</h3>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">
                          <strong>双校联合培养</strong>：整合北大清华优质教育资源
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">
                          <strong>前沿课程体系</strong>：涵盖机器学习、深度学习、计算机视觉等核心领域
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">
                          <strong>科研导向</strong>：鼓励学生参与高水平科研项目
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">
                          <strong>国际视野</strong>：提供海外交流与合作机会
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Universities */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <School className="h-6 w-6 text-primary" />
                参与高校
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-16 w-16 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        PKU
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">北京大学</h3>
                        <p className="text-sm text-muted-foreground">Peking University</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      北京大学作为中国顶尖学府，在人工智能领域拥有深厚的学术积累和科研实力。
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-16 w-16 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xl">
                        THU
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">清华大学</h3>
                        <p className="text-sm text-muted-foreground">Tsinghua University</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      清华大学在计算机科学和人工智能领域具有世界领先的研究水平。
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Student Council */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <UsersRound className="h-6 w-6 text-primary" />
                学生会
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    通班学生会是由通班同学自发组织的自治团体，负责组织各类学术和文体活动，为同学们提供服务和帮助。
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">学术部</h4>
                      <p className="text-sm text-muted-foreground">组织学术讲座、研讨会等活动</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">文体部</h4>
                      <p className="text-sm text-muted-foreground">组织文体活动，丰富课余生活</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">宣传部</h4>
                      <p className="text-sm text-muted-foreground">负责对外宣传和形象建设</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                联系方式
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">办公地点</h4>
                        <p className="text-muted-foreground">
                          北京大学昌平校区 / 清华大学FIT楼
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">电子邮箱</h4>
                        <p className="text-muted-foreground">contact@tongclass.edu.cn</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">快速链接</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/members">
                    <Users className="h-4 w-4 mr-2" />
                    团队成员
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/publications">
                    <BookOpen className="h-4 w-4 mr-2" />
                    学术成果
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/news">
                    <Calendar className="h-4 w-4 mr-2" />
                    新闻动态
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/events">
                    <Award className="h-4 w-4 mr-2" />
                    活动日程
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">项目数据</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">100+</div>
                    <div className="text-sm text-muted-foreground">在读学生</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">200+</div>
                    <div className="text-sm text-muted-foreground">学术论文</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">50+</div>
                    <div className="text-sm text-muted-foreground">课程资源</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">30+</div>
                    <div className="text-sm text-muted-foreground">学术奖项</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
