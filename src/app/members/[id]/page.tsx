"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Mail, ExternalLink, BookOpen, FileText, School, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserById, usePublicationsByUser } from "@/lib/api"
import { normalizeUrl } from "@/lib/utils"
import type { Publication } from "@/types"

export default function MemberDetailPage() {
  const params = useParams<{ id: string }>()
  const memberId = params.id

  // Fetch user and publications from Convex
  const userData = useUserById(memberId as string)
  const publicationsData = usePublicationsByUser(memberId as string)
  
  const member = userData ? { ...userData, id: userData._id } : null
  const publications: Publication[] = publicationsData || []
  
  const loading = userData === undefined || publicationsData === undefined

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Member not found</div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <Button variant="ghost" asChild className="mb-6 -ml-3 gap-2">
        <Link href="/members">
          <ArrowLeft className="h-4 w-4" />
          返回成员列表
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm sticky top-24">
            <CardHeader className="text-center pb-4">
              <div className="h-24 w-24 mx-auto rounded-full overflow-hidden bg-primary/10 mb-4">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.englishName} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-primary font-bold text-3xl">
                    {member.englishName.charAt(0)}
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl">{member.englishName}</CardTitle>
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                {member.organization === "pku" ? <School className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                {member.organization === "pku" ? "北大通班" : "清华通班"} · {member.cohort}级
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {member.email}
                </a>
                {member.personalEmail && (
                  <a
                    href={`mailto:${member.personalEmail}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    {member.personalEmail}
                  </a>
                )}
              </div>

              {member.researchInterests && member.researchInterests.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    研究兴趣
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {member.researchInterests.map((interest: string) => (
                      <span
                        key={interest}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/5 text-primary"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {member.titles && member.titles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    链接
                  </h4>
                  <div className="space-y-2">
                    {member.titles.map((item: { title: string; link: string }) => (
                      <a
                        key={item.title}
                        href={normalizeUrl(item.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors text-sm"
                      >
                        <span>{item.title}</span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {member.bio && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">关于</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
              </CardContent>
            </Card>
          )}

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                学术成果
              </CardTitle>
            </CardHeader>
            <CardContent>
              {publications.length > 0 ? (
                <div className="space-y-4">
                  {publications.map((pub) => (
                    <Link
                      key={pub._id}
                      href={`/publications/${pub._id}`}
                      className="block p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      <h4 className="font-semibold text-foreground mb-1 line-clamp-2">{pub.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {pub.authors.map((author, index) => {
                          const isCurrentUser = author === member.englishName
                          return (
                            <React.Fragment key={index}>
                              {index > 0 && ", "}
                              <span className={isCurrentUser ? "font-bold text-muted-foreground" : ""}>{author}</span>
                            </React.Fragment>
                          )
                        })}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium text-primary">{pub.venue}</span>
                        <span>·</span>
                        <span>{pub.year}</span>
                        <span>·</span>
                        <span>{pub.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">暂无学术成果</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
