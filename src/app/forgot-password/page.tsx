"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>重置密码</CardTitle>
          <CardDescription>输入你的注册邮箱，我们会发送重置说明。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {submitted ? (
            <p className="text-sm text-green-700 bg-green-50 rounded-md p-3">
              如果该邮箱已注册，重置邮件将会发送到 {email}。
            </p>
          ) : (
            <>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="学号邮箱"
              />
              <Button className="w-full" onClick={() => setSubmitted(true)} disabled={!email}>
                发送重置邮件
              </Button>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/login" className="text-sm text-primary hover:underline">
            返回登录
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
