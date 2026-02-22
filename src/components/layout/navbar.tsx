"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Search, Menu, User, LogOut, Settings, BookOpen, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const navigation = [
  { name: "动态", href: "/news" },
  { name: "成员", href: "/members" },
  { name: "成果", href: "/publications" },
  { name: "资源", href: "/resources", auth: true },
  { name: "活动", href: "/events" },
  { name: "关于", href: "/about" },
]

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const resolveHref = (href: string, auth?: boolean) => {
    if (auth && !isAuthenticated) {
      return `/login?next=${encodeURIComponent(href)}`
    }
    return href
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-custom flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Tong Class logo" width={36} height={36} className="h-9 w-9 rounded-md" priority />
          <div className="hidden sm:block leading-tight">
            <p className="text-base font-semibold text-foreground">通用人工智能实验班</p>
            <p className="text-xs text-muted-foreground">Tong Class</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={resolveHref(item.href, item.auth)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <div className="hidden md:block relative">
            <form onSubmit={handleSearch}>
              <Input
                type="search"
                placeholder="搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 h-9 bg-muted/50 border-0 focus:bg-muted focus:ring-1 focus:ring-primary"
              />
              {!searchQuery && (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              )}
            </form>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen((open) => !open)}>
            <Search className="h-5 w-5" />
          </Button>

          {isAuthenticated && currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground"
                >
                  {currentUser.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.englishName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    (currentUser.englishName || currentUser.username || "U").slice(0, 1).toUpperCase()
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/members/${currentUser._id}`}>
                    <User className="h-4 w-4 mr-2" />
                    个人主页
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-publications">
                    <BookOpen className="h-4 w-4 mr-2" />
                    个人学术
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    账户设置
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Shield className="h-4 w-4 mr-2" />
                      管理后台
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm" className="hidden md:flex gap-2">
              <Link href="/login">
                <User className="h-4 w-4" />
                登录
              </Link>
            </Button>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-left">菜单</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-2 mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={resolveHref(item.href, item.auth)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium rounded-md transition-colors",
                      pathname === item.href
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}

                {isAuthenticated && currentUser ? (
                  <>
                    <Link
                      href={`/members/${currentUser._id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                      个人主页
                    </Link>
                    <Link
                      href="/my-publications"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                      个人学术
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                      账户设置
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-3 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      >
                        管理后台
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      退出登录
                    </Button>
                  </>
                ) : (
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      登录
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isSearchOpen && (
        <div className="md:hidden border-t border-border p-4 bg-background">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="search"
                placeholder="搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pr-10"
                autoFocus
              />
              {!searchQuery && (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              )}
            </div>
          </form>
        </div>
      )}
    </header>
  )
}
