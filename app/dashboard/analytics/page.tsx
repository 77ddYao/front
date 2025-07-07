"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

// Mock data for vessel types
const vesselTypeData = [
  { name: "Cargo", value: 4000 },
  { name: "Tanker", value: 3000 },
  { name: "Passenger", value: 2000 },
  { name: "Fishing", value: 2780 },
  { name: "Other", value: 1890 },
]

// Mock data for vessel speeds
const vesselSpeedData = [
  { speed: "0-5", count: 120 },
  { speed: "5-10", count: 300 },
  { speed: "10-15", count: 450 },
  { speed: "15-20", count: 280 },
  { speed: "20-25", count: 150 },
  { speed: "25+", count: 50 },
]

// Mock data for port traffic
const portTrafficData = [
  { name: "Hong Kong", traffic: 4000 },
  { name: "Singapore", traffic: 3000 },
  { name: "Shanghai", traffic: 2000 },
  { name: "Busan", traffic: 2780 },
  { name: "Rotterdam", traffic: 1890 },
  { name: "Los Angeles", traffic: 2390 },
  { name: "Dubai", traffic: 3490 },
]

// Mock data for traffic over time
const trafficOverTimeData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  vessels: Math.floor(Math.random() * 100) + 50,
}))

// Colors for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("24h")
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">数据分析</h1>
        <p className="text-muted-foreground">可视化和分析船舶和港口数据</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Tabs defaultValue="overview" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="vessels">船舶</TabsTrigger>
            <TabsTrigger value="ports">港口</TabsTrigger>
            <TabsTrigger value="traffic">交通</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">过去 24 小时</SelectItem>
              <SelectItem value="7d">过去 7 天</SelectItem>
              <SelectItem value="30d">过去 30 天</SelectItem>
              <SelectItem value="90d">过去 90 天</SelectItem>
              <SelectItem value="1y">过去 1 年</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">总船舶数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">比上个周期增加 5.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">平均速度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.7 knots</div>
            <p className="text-xs text-muted-foreground">比上个周期减少 0.8 knots</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">港口访问量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,721</div>
            <p className="text-xs text-muted-foreground">比上个周期增加 12.3%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">数据点</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground">比上个周期增加 8.1%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>按类型划分的船舶分布</CardTitle>
            <CardDescription>按类别划分的船舶数量</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vesselTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vesselTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>船舶速度分布</CardTitle>
            <CardDescription>按速度范围（节）划分的船舶数量</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={vesselSpeedData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="speed" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Vessel Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>港口交通</CardTitle>
            <CardDescription>按主要港口划分的船舶交通</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={portTrafficData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="traffic" fill="#82ca9d" name="Vessel Traffic" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>按时间划分的交通</CardTitle>
            <CardDescription>船舶交通模式随时间变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trafficOverTimeData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" label={{ value: "Hour of Day", position: "insideBottomRight", offset: -10 }} />
                  <YAxis label={{ value: "Vessel Count", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="vessels" stroke="#8884d8" activeDot={{ r: 8 }} name="Active Vessels" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
