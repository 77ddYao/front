"use client"

import { useState } from "react"
import Link from "next/link"
import { Activity, Anchor, ArrowRight, BarChart3, Clock, FileUp, Map, Ship, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const [activeVessels, setActiveVessels] = useState(1248)
  const [portsMonitored, setPortsMonitored] = useState(87)
  const [dataProcessed, setDataProcessed] = useState(78)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
        <p className="text-muted-foreground">
          欢迎使用船舶 AIS 仪表盘。监控船舶交通并分析海事数据。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">活跃船只</CardTitle>
            <Ship className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVessels}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
            <Progress className="mt-3" value={72} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">监控港口</CardTitle>
            <Anchor className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portsMonitored}</div>
            <p className="text-xs text-muted-foreground">+3 new ports added</p>
            <Progress className="mt-3" value={65} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">数据处理</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataProcessed}%</div>
            <p className="text-xs text-muted-foreground">处理效率</p>
            <Progress className="mt-3" value={dataProcessed} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">系统状态</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">正常</div>
            <p className="text-xs text-muted-foreground">所有系统正常运行</p>
            <Progress className="mt-3" value={100} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Vessel Traffic Overview</CardTitle>
            <CardDescription>Distribution of vessel types and traffic patterns</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
              <div className="text-center">
                <BarChart3 className="w-10 h-10 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Traffic visualization will appear here</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/dashboard/analytics">View detailed analytics</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/map">
                  <Map className="mr-2 h-4 w-4" />
                  View Live Map
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/ships">
                  <Ship className="mr-2 h-4 w-4" />
                  Manage Ships
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/ports">
                  <Anchor className="mr-2 h-4 w-4" />
                  Manage Ports
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/import">
                  <FileUp className="mr-2 h-4 w-4" />
                  Import Data
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Tabs defaultValue="recent">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold mr-4">Activity</h2>
            <TabsList>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="recent" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest events and updates in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-4 rounded-lg border p-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {i === 1
                            ? "New vessel data imported"
                            : i === 2
                              ? "Port traffic analysis completed"
                              : i === 3
                                ? "System maintenance scheduled"
                                : i === 4
                                  ? "New user account created"
                                  : "Anomaly detected in vessel movement"}
                        </p>
                        <p className="text-sm text-muted-foreground">{`${i * 10} minutes ago`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="alerts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Important notifications requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-3">
                  <p className="text-sm text-muted-foreground">No active alerts at this time</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="updates" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>System Updates</CardTitle>
                <CardDescription>Recent system changes and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-lg border p-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">System updated to version 2.3.0</p>
                      <p className="text-sm text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
