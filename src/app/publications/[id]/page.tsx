"use client"

import Link from "next/link"
import { ArrowLeft, ExternalLink, User, Calendar, BookOpen, FileText, Share2, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data - will be replaced with Convex API
const mockPublicationData: Record<string, {
  _id: string
  title: string
  authors: string[]
  venue: string
  year: number
  category: string
  subCategory?: string
  abstract: string
  url?: string
  userId: string
}> = {
  "1": {
    _id: "1",
    title: "Efficient Deep Learning for Image Classification",
    authors: ["Wei Zhang", "Ming Li", "Lei Wang"],
    venue: "CVPR 2024",
    year: 2024,
    category: "Computer Vision",
    subCategory: "image understanding",
    abstract: "We present a novel efficient deep learning method for image classification that achieves state-of-the-art performance while significantly reducing computational costs. Our approach combines innovative architecture design with advanced training techniques to deliver a powerful yet efficient solution for image classification tasks. Extensive experiments on benchmark datasets demonstrate the effectiveness of our method.",
    url: "https://arxiv.org",
    userId: "1",
  },
  "2": {
    _id: "2",
    title: "Robust Neural Networks against Adversarial Attacks",
    authors: ["Wei Zhang", "Hao Chen"],
    venue: "ICML 2024",
    year: 2024,
    category: "Machine Learning",
    subCategory: "robustness",
    abstract: "We propose a new training method to improve neural network robustness against adversarial attacks. By introducing a novel regularization technique and adaptive augmentation strategy, our method significantly enhances the model's ability to withstand various types of adversarial perturbations. Empirical results show substantial improvements in robustness across multiple benchmark datasets.",
    url: "https://arxiv.org",
    userId: "1",
  },
  "3": {
    _id: "3",
    title: "Large Language Models for Code Generation",
    authors: ["Jie Liu", "Wei Zhang", "Xin Yang"],
    venue: "NeurIPS 2024",
    year: 2024,
    category: "Natural Language Processing",
    subCategory: "language modeling",
    abstract: "We investigate the capability of large language models in code generation tasks. Our study reveals key factors that influence code generation quality and proposes techniques to enhance the models' understanding of programming languages and logical structures. We demonstrate improvements through comprehensive evaluations on multiple programming benchmarks.",
    url: "https://arxiv.org",
    userId: "2",
  },
  "4": {
    _id: "4",
    title: "Multi-Modal Learning for Vision-Language Tasks",
    authors: ["Fang Zhou", "Ming Li"],
    venue: "ICLR 2023",
    year: 2023,
    category: "Multimodal AI",
    subCategory: "vision-language",
    abstract: "We propose a unified framework for vision-language tasks that effectively bridges the gap between visual and textual representations. Our model leverages cross-modal attention mechanisms to capture rich semantic connections between images and text, achieving impressive performance on various vision-language benchmarks.",
    url: "https://arxiv.org",
    userId: "3",
  },
  "5": {
    _id: "5",
    title: "Diffusion Models for Text-to-Image Synthesis",
    authors: ["Kai Wu", "Lei Wang", "Wei Zhang"],
    venue: "SIGGRAPH 2023",
    year: 2023,
    category: "Generative Modeling",
    subCategory: "diffusion",
    abstract: "We present a novel diffusion model architecture for high-quality text-to-image synthesis. By introducing innovative conditioning mechanisms and training strategies, our model generates photorealistic images that accurately reflect the semantic content of input text descriptions. Human evaluations demonstrate significant improvements in image quality and text alignment.",
    url: "https://arxiv.org",
    userId: "4",
  },
}

// Format authors with current user highlighted
function AuthorsList({ authors, highlightName }: { authors: string[], highlightName?: string }) {
  return (
    <span>
      {authors.map((author, index) => (
        <span key={index}>
          <Link 
            href="/members" 
            className={author === highlightName ? "font-semibold text-foreground hover:text-primary" : "text-foreground hover:text-primary"}
          >
            {author}
          </Link>
          {index < authors.length - 1 && ", "}
        </span>
      ))}
    </span>
  )
}

export default function PublicationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  // In real app: useQuery(api.publications.getById, { id: params.id })
  const pub = mockPublicationData[params.id] || mockPublicationData["1"]
  
  // Highlight Wei Zhang as the current user (mock)
  const currentUserName = "Wei Zhang"

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8 md:py-12">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6 -ml-3 gap-2">
          <Link href="/publications">
            <ArrowLeft className="h-4 w-4" />
            返回成果列表
          </Link>
        </Button>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            {/* Category badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/5 text-primary border border-primary/10">
                {pub.category}
              </span>
              {pub.subCategory && (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-muted text-muted-foreground">
                  {pub.subCategory}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6">
              {pub.title}
            </h1>

            {/* Authors */}
            <div className="flex items-start gap-2 mb-4">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-lg text-foreground">
                <AuthorsList authors={pub.authors} highlightName={currentUserName} />
              </div>
            </div>

            {/* Venue & Year */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="font-medium text-primary">{pub.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{pub.year}</span>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 ml-auto">
                {pub.url && (
                  <Button asChild>
                    <a href={pub.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      查看原文
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Share2 className="h-4 w-4" />
                  分享
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Bookmark className="h-4 w-4" />
                  收藏
                </Button>
              </div>
            </div>
          </header>

          {/* Abstract */}
          <Card className="border-0 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Abstract
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {pub.abstract}
              </p>
            </CardContent>
          </Card>

          {/* Navigation */}
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
