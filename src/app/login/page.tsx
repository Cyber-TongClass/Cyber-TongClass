"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(identifier, password)
      if (!result.ok) {
        setError(result.error || "邮箱/用户名或密码错误，请重试")
        return
      }
      
      // 登录成功，强制页面刷新以更新状态
      window.location.href = "/"
    } catch {
      setError("邮箱或密码错误，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary">通班</h1>
            <p className="text-muted-foreground mt-1">Tong Class 官方网站</p>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>登录</CardTitle>
            <CardDescription>
              使用您的学号邮箱和密码登录
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="identifier" className="text-sm font-medium">
                  邮箱或用户名
                </label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="学号邮箱或用户名"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  disabled={isLoading || authLoading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    密码
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    忘记密码?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || authLoading}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || authLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    登录中...
                  </>
                ) : (
                  "登录"
                )}
              </Button>
              
              <p className="text-sm text-center text-muted-foreground">
                还没有账号?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  立即注册
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/" className="hover:underline">
            ← 返回首页
          </Link>
        </p>
      </div>
    </div>
  )
}
