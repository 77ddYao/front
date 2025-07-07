"use client"

import type React from "react"

import { useState } from "react"
import { Anchor, DownloadIcon, FilterIcon, PlusIcon, SearchIcon, SortAsc, SortDesc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for ports
const mockPorts = Array.from({ length: 20 }, (_, i) => ({
  id: `port-${i}`,
  name: `Port ${i}`,
  code: `P${i.toString().padStart(3, "0")}`,
  country: ["China", "Singapore", "United States", "Netherlands", "United Arab Emirates"][
    Math.floor(Math.random() * 5)
  ],
  location: {
    lat: (Math.random() * 180 - 90).toFixed(4),
    lng: (Math.random() * 360 - 180).toFixed(4),
  },
  capacity: Math.floor(Math.random() * 1000) + 100,
  status: ["Active", "Maintenance", "Limited Operations", "Closed"][Math.floor(Math.random() * 4)],
  lastUpdate: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
}))

export default function PortsPage() {
  const [ports, setPorts] = useState(mockPorts)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedPorts, setSelectedPorts] = useState<string[]>([])
  const [isAddPortOpen, setIsAddPortOpen] = useState(false)
  const [newPort, setNewPort] = useState({
    name: "",
    code: "",
    country: "China",
    lat: "",
    lng: "",
    capacity: "",
    status: "Active",
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredPorts = ports.filter(
    (port) =>
      port.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      port.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      port.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedPorts = [...filteredPorts].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a]
    const bValue = b[sortField as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPorts(sortedPorts.map((port) => port.id))
    } else {
      setSelectedPorts([])
    }
  }

  const handleSelectPort = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPorts((prev) => [...prev, id])
    } else {
      setSelectedPorts((prev) => prev.filter((portId) => portId !== id))
    }
  }

  const handleAddPort = () => {
    const newPortEntry = {
      id: `port-${ports.length}`,
      name: newPort.name,
      code: newPort.code,
      country: newPort.country,
      location: {
        lat: newPort.lat,
        lng: newPort.lng,
      },
      capacity: Number.parseInt(newPort.capacity),
      status: newPort.status,
      lastUpdate: new Date().toISOString(),
    }

    setPorts((prev) => [newPortEntry, ...prev])
    setIsAddPortOpen(false)
    setNewPort({
      name: "",
      code: "",
      country: "China",
      lat: "",
      lng: "",
      capacity: "",
      status: "Active",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Maintenance":
        return "bg-yellow-500"
      case "Limited Operations":
        return "bg-orange-500"
      case "Closed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">港口</h1>
        <p className="text-muted-foreground">管理和监控港口信息</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative w-full sm:w-[300px]">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search ports..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <FilterIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>按国家过滤</DropdownMenuItem>
                <DropdownMenuItem>按状态过滤</DropdownMenuItem>
                <DropdownMenuItem>按容量过滤</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <DownloadIcon className="mr-2 h-4 w-4" />
              导出
            </Button>
            <Dialog open={isAddPortOpen} onOpenChange={setIsAddPortOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  添加港口
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新港口</DialogTitle>
                  <DialogDescription>输入新港口的详细信息以添加到系统中。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      名称
                    </Label>
                    <Input
                      id="name"
                      value={newPort.name}
                      onChange={(e) => setNewPort({ ...newPort, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      代码
                    </Label>
                    <Input
                      id="code"
                      value={newPort.code}
                      onChange={(e) => setNewPort({ ...newPort, code: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="country" className="text-right">
                      国家
                    </Label>
                    <Select
                      value={newPort.country}
                      onValueChange={(value) => setNewPort({ ...newPort, country: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="China">中国</SelectItem>
                        <SelectItem value="Singapore">新加坡</SelectItem>
                        <SelectItem value="United States">美国</SelectItem>
                        <SelectItem value="Netherlands">荷兰</SelectItem>
                        <SelectItem value="United Arab Emirates">阿联酋</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lat" className="text-right">
                      纬度
                    </Label>
                    <Input
                      id="lat"
                      value={newPort.lat}
                      onChange={(e) => setNewPort({ ...newPort, lat: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lng" className="text-right">
                      经度
                    </Label>
                    <Input
                      id="lng"
                      value={newPort.lng}
                      onChange={(e) => setNewPort({ ...newPort, lng: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="capacity" className="text-right">
                      容量
                    </Label>
                    <Input
                      id="capacity"
                      value={newPort.capacity}
                      onChange={(e) => setNewPort({ ...newPort, capacity: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      状态
                    </Label>
                    <Select value={newPort.status} onValueChange={(value) => setNewPort({ ...newPort, status: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">活跃</SelectItem>
                        <SelectItem value="Maintenance">维护</SelectItem>
                        <SelectItem value="Limited Operations">有限运营</SelectItem>
                        <SelectItem value="Closed">关闭</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddPortOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleAddPort}>添加港口</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedPorts.length === sortedPorts.length && sortedPorts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">
                    姓名
                    {sortField === "name" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("code")}>
                  <div className="flex items-center gap-1">
                    代码
                    {sortField === "code" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("country")}>
                  <div className="flex items-center gap-1">
                    国家
                    {sortField === "country" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead>位置</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("capacity")}>
                  <div className="flex items-center gap-1">
                    容量
                    {sortField === "capacity" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1">
                    状态
                    {sortField === "status" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPorts.length > 0 ? (
                sortedPorts.map((port) => (
                  <TableRow key={port.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPorts.includes(port.id)}
                        onCheckedChange={(checked) => handleSelectPort(port.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Anchor className="h-4 w-4 text-muted-foreground" />
                        {port.name}
                      </div>
                    </TableCell>
                    <TableCell>{port.code}</TableCell>
                    <TableCell>{port.country}</TableCell>
                    <TableCell>
                      {port.location.lat}, {port.location.lng}
                    </TableCell>
                    <TableCell>{port.capacity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(port.status)}`} />
                        {port.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            修改
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>查看详情</DropdownMenuItem>
                          <DropdownMenuItem>编辑</DropdownMenuItem>
                          <DropdownMenuItem>在地图上查看</DropdownMenuItem>
                          <DropdownMenuItem>流量分析</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No ports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{sortedPorts.length}</strong> of <strong>{ports.length}</strong> ports
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              上一页
            </Button>
            <Button variant="outline" size="sm">
              下一页
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
