"use client"

import Link from "next/link"
import { Github, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

const footerLinks = {
  project: [
    { name: "关于项目", href: "/about" },
    { name: "团队成员", href: "/members" },
    { name: "学术成果", href: "/publications" },
    { name: "活动日历", href: "/events" },
  ],
  resources: [
    { name: "课程评测", href: "/resources" },
    { name: "新闻动态", href: "/news" },
  ],
  external: [
    { name: "旧版网站", href: "https://nostalgic.tongclass.ac.cn" },
    { name: "北大AI院", href: "https://www.ai.pku.edu.cn" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Project */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">项目</h3>
            <ul className="space-y-3">
              {footerLinks.project.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">资源</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">链接</h3>
            <ul className="space-y-3">
              {footerLinks.external.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">联系我们</h3>
            <div className="flex flex-col space-y-3">
              <Link
                href="mailto:contact@tongclass.ac.cn"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                contact@tongclass.ac.cn
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-bold">通</span>
              </div>
              <span className="text-sm text-muted-foreground">
                北京大学 & 清华大学 人工智能创新人才培养项目
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Tong Class. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
