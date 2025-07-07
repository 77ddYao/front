"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Anchor, Ship } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { loginAPI } from "@/api/userApi"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "analyst", // 默认值
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
        const res = await loginAPI(credentials);
        if (res.code === "200") {
          console.log("登录成功", res.code, res.data);
        } else {
          alert(res.message || "登录失败");
        }
      } catch (err) {
        alert("请求异常");
      } finally {
        setIsLoading(false);
    }

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <div className="relative h-16 w-16 mr-2">
              <Ship className="h-16 w-16 text-blue-600 dark:text-blue-400" />
              <Anchor className="h-8 w-8 text-blue-800 dark:text-blue-300 absolute bottom-0 right-0" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">船舶AIS仪表板</CardTitle>
          <CardDescription className="text-center">请输入您的凭据以访问仪表板</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input id="username" placeholder="输入您的用户名" required value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input id="password" type="password" placeholder="••••••••" required value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">角色</Label>
                <Select value={credentials.role} onValueChange={(value) => setCredentials({ ...credentials, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">管理员</SelectItem>
                    <SelectItem value="analyst">数据分析师</SelectItem>
                    <SelectItem value="viewer">查看者</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">Protected by advanced security protocols</div>
        </CardFooter>
      </Card>
    </div>
  )
}
