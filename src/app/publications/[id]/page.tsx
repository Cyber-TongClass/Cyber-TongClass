"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ExternalLink, User, Calendar, BookOpen, FileText, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePublicationById } from "@/lib/api"
import type { Publication } from "@/types"

function AuthorsList({ authors }: { authors: string[] }) {
  return (
    <span>
      {authors.map((author, index) => (
        <span key={index}>
          <Link href="/members" className="text-foreground hover:text-primary">
            {author}
          </Link>
          {index < authors.length - 1 && ", "}
        </span>
      ))}
    </span>
  )
}

export default function PublicationDetailPage() {
  const params = useParams<{ id: string }>()
  const publicationId = params.id

  const publication = usePublicationById(publicationId)
  const isLoading = publication === undefined
  const [showCopiedToast, setShowCopiedToast] = React.useState(false)
  const [toastOpacity, setToastOpacity] = React.useState(0)
  const lastCopyTime = React.useRef(0)

  const handleShare = React.useCallback(() => {
    const now = Date.now()
    if (now - lastCopyTime.current < 1000) {
      return
    }
    lastCopyTime.current = now

    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setShowCopiedToast(true)
      setToastOpacity(1)
      setTimeout(() => setToastOpacity(0), 1000)
      setTimeout(() => setShowCopiedToast(false), 2000)
    })
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!publication) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-custom py-8 md:py-12">
          <Button variant="ghost" asChild className="mb-6 -ml-3 gap-2">
            <Link href="/publications">
              <ArrowLeft className="h-4 w-4" />
              返回成果列表
            </Link>
          </Button>
          <div className="max-w-3xl mx-auto text-center py-16">
            <h2 className="text-2xl font-semibold text-foreground mb-2">成果不存在</h2>
            <p className="text-muted-foreground">该成果可能已被删除。</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {showCopiedToast && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div 
            className="bg-black/70 text-white px-6 py-3 rounded-lg text-lg transition-opacity duration-500"
            style={{ opacity: toastOpacity }}
          >
            已拷贝链接至剪贴板
          </div>
        </div>
      )}
      <div className="container-custom py-8 md:py-12">
        <Button variant="ghost" asChild className="mb-6 -ml-3 gap-2">
          <Link href="/publications">
            <ArrowLeft className="h-4 w-4" />
            返回成果列表
          </Link>
        </Button>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/5 text-primary border border-primary/10">
                {publication.category}
              </span>
              {publication.subCategory && (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-muted text-muted-foreground">
                  {publication.subCategory}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6">{publication.title}</h1>

            <div className="flex items-start gap-2 mb-4">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-lg text-foreground">
                <AuthorsList authors={publication.authors} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="font-medium text-primary">{publication.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{publication.year}</span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {publication.url && (
                  <Button asChild>
                    <a href={publication.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      查看原文
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  分享
                </Button>
              </div>
            </div>
          </header>

          <Card className="border-0 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Abstract
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{publication.abstract}</p>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/publications">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回成果列表
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  )
}
