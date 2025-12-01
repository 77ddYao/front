"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Anchor, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { registerAPI } from "@/api/userApi";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "viewer", // 默认角色
    avatar: null, // 新增头像字段
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (credentials.password !== credentials.confirmPassword) {
      alert("两次输入的密码不一致");
      setIsLoading(false);
      return;
    }

    if (!credentials.avatar) {
      alert("请上传头像");
      setIsLoading(false);
      return;
    }

    try {
      const res = await registerAPI({
        username: credentials.username,
        password: credentials.password,
        avatar: credentials.avatar,
      });
      if (res.code === 200) {
        alert("注册成功！");
        router.push("/login");
      } else {
        alert(res.message || "注册失败");
      }
    } catch (err) {
      alert("请求异常：" + err);
    } finally {
      setIsLoading(false);
    }
  };

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
          <CardTitle className="text-2xl text-center">注册新账户</CardTitle>
          <CardDescription className="text-center">创建一个新账户以访问仪表板</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  placeholder="输入您的用户名"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={credentials.confirmPassword}
                  onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">角色</Label>
                <Select
                  value={credentials.role}
                  onValueChange={(value) => setCredentials({ ...credentials, role: value })}
                >
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
              <div className="space-y-2">
                <Label htmlFor="avatar">头像</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setCredentials({ ...credentials, avatar: e.target.files?.[0] || null })}
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "注册中..." : "注册"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">Protected by advanced security protocols</div>
          <div className="text-sm text-center">
            已有账号？
            <a
              href="/login"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              去登录
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}