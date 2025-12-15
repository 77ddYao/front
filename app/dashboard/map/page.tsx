'use client';

import dynamic from 'next/dynamic';
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Play, Pause, SkipBack, SkipForward, Layers, Ship, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getMapData } from "@/api/mapApi"

// 客户端地图组件，禁止 SSR
const MapClient = dynamic(() => import('@/components/MapClient'), { ssr: false })

type Ship = {
  id: string
  name: string
  mmsi: number
  position: { lat: number; lng: number }
  speed: number
  course: number
}

type TrackPoint = {
  base_date_time: string
  longitude: number
  latitude: number
  sog: number
  status: number
}

export default function MapPage() {
  const [ships, setShips] = useState<Ship[]>([])
  const [trackData, setTrackData] = useState<TrackPoint[]>([])
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null)
  const [mapView, setMapView] = useState("standard")
  const [filters, setFilters] = useState({
    cargo: true,
    tanker: true,
    passenger: true,
    fishing: true,
    other: true,
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeValue, setTimeValue] = useState(50)

  // 获取船舶数据
  useState(() => {
    async function fetchShips() {
      try {
        const res = await getMapData()
        if (res.code === 200 && Array.isArray(res.data)) {
          setShips(res.data)
        }
      } catch (err) {
        console.error("Failed to fetch ships:", err)
      }
    }
    fetchShips()
  })

  const togglePlayback = () => setIsPlaying(!isPlaying)
  const handleTimeChange = (value: number[]) => setTimeValue(value[0])
  const handleFilterChange = (key: string, checked: boolean) =>
    setFilters(prev => ({ ...prev, [key]: checked }))

  // 加载模拟轨迹数据
  const loadTrackFromFile = () => {
    const sampleData: TrackPoint[] = [
      { "base_date_time": "2025-06-30T00:00:03.000+08:00", "longitude": -80.18479, "latitude": 25.77272, "sog": 12.5, "status": 0 },
      { "base_date_time": "2025-06-30T00:03:05.000+08:00", "longitude": -80.18577, "latitude": 25.77374, "sog": 11.2, "status": 0 },
      { "base_date_time": "2025-06-30T00:06:06.000+08:00", "longitude": -80.18676, "latitude": 25.77476, "sog": 10.8, "status": 0 }
    ]
    setTrackData(sampleData)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">地图视图</h1>
        <p className="text-muted-foreground">
          显示船舶位置、轨迹和空间分析的交互式地图
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>船舶追踪</CardTitle>
                <CardDescription>实时船舶位置和运动数据</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Tabs defaultValue="standard" onValueChange={setMapView}>
                  <TabsList>
                    <TabsTrigger value="standard">标准</TabsTrigger>
                    <TabsTrigger value="satellite">卫星</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Layers className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>切换地图图层</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={loadTrackFromFile}>
                          <span className="text-xs font-bold">Load Track</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>加载轨迹数据</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* 客户端地图组件 */}
            <MapClient
              ships={ships}
              trackData={trackData}
              mapView={mapView}
              onSelectShip={setSelectedShip}
            />

            {/* 时间控制 */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">时间控制</div>
                <div className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setTimeValue(Math.max(0, timeValue - 10))}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={togglePlayback}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => setTimeValue(Math.min(100, timeValue + 10))}>
                  <SkipForward className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Slider value={[timeValue]} min={0} max={100} step={1} onValueChange={handleTimeChange} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>过滤器</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(filters).map(([key, val]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox checked={val} onCheckedChange={(checked) => handleFilterChange(key, checked as boolean)} />
                  <Label>{key}</Label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vessel Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedShip ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Ship className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">{selectedShip.name}</h3>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Ship className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select a vessel on the map to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
