"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Play, Pause, SkipBack, SkipForward, Layers, Ship, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getMapData } from "@/api/mapApi"
import AMapLoader from "@amap/amap-jsapi-loader"

const AMAP_KEY = "2c2d7c99732a8cf2688ff0a58acedf0c"

// Mock data for ships
const mockShips = Array.from({ length: 50 }, (_, i) => ({
  id: `ship-${i}`,
  name: `Vessel ${i}`,
  mmsi: Math.floor(Math.random() * 1000000000),
  position: {
    lat: 22 + Math.random() * 10,
    lng: 113 + Math.random() * 10,
  },
  speed: Math.floor(Math.random() * 30),
  course: Math.floor(Math.random() * 360),
}))

type Ship = {
  id: string
  name: string
  mmsi: number
  position: { lat: number; lng: number }
  speed: number
  course: number
}

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeValue, setTimeValue] = useState(50)
  const [selectedShip, setSelectedShip] = useState<any>(null)
  const [mapView, setMapView] = useState("standard")
  const [filters, setFilters] = useState({
    cargo: true,
    tanker: true,
    passenger: true,
    fishing: true,
    other: true,
  })
  const [ships, setShips] = useState<Ship[]>([])
  const markersRef = useRef<AMap.Marker[]>([]) // 存储地图标记

  // Initialize map and render ships
  useEffect(() => {
    if (mapContainerRef.current) {
      const mapContainer = mapContainerRef.current
      mapContainer.innerHTML = ""

      const loadMap = async () => {
        if (!mapContainerRef.current) return

        try {
          const AMap = await AMapLoader.load({
            key: AMAP_KEY,
            version: "2.0",
          })

          const map = new AMap.Map(mapContainer, {
            zoom: 5,
            center: [113, 22],
          })

          console.log("Ships to be added to the map:", ships) // 调试日志

          // 添加船舶标记
          markersRef.current.forEach((marker) => marker.setMap(null)) // 清除旧标记
          markersRef.current = ships.map((ship) => {
            const marker = new AMap.Marker({
              position: [ship.position.lng, ship.position.lat],
              title: ship.name,
              content: `
                <div style="font-size: 24px; line-height: 24px; text-align: center;">
                  🚢
                </div>
              `,
            })

            marker.on("click", () => {
              setSelectedShip(ship) // 设置当前选中的船舶
              map.setCenter([ship.position.lng, ship.position.lat]) // 高亮并居中
            })

            marker.setMap(map)
            return marker
          })
        } catch (e) {
          console.error("Failed to load AMap:", e)
        }
      }

      loadMap()
    }
  }, [ships, mapView, filters])

  useEffect(() => {
    async function fetchShips() {
      try {
        const res = await getMapData()
        console.log("Fetched ships data:", res) // 调试日志
        if (res.code === 200 && Array.isArray(res.data)) {
          setShips(res.data)
        } else {
          console.error("Invalid ships data format:", res)
        }
      } catch (err) {
        console.error("Failed to fetch ships:", err)
      }
    }
    fetchShips()
  }, [])

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimeChange = (value: number[]) => {
    setTimeValue(value[0])
  }

  const handleFilterChange = (key: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: checked,
    }))
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
            <div className="flex items-center justify-between">
              <CardTitle>船舶追踪</CardTitle>
              <div className="flex items-center gap-2">
                <Tabs defaultValue="standard" onValueChange={setMapView}>
                  <TabsList>
                    <TabsTrigger value="standard">标准</TabsTrigger>
                    <TabsTrigger value="satellite">卫星</TabsTrigger>
                    <TabsTrigger value="heatmap">热力图</TabsTrigger>
                    <TabsTrigger value="cluster">集群</TabsTrigger>
                  </TabsList>
                </Tabs>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Layers className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>切换地图图层</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <CardDescription>实时船舶位置和运动数据</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div ref={mapContainerRef} className="w-full h-[500px] rounded-lg overflow-hidden border"></div>

              {/* Time control slider */}
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
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>过滤器</CardTitle>
              <CardDescription>按类型过滤船舶</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cargo"
                    checked={filters.cargo}
                    onCheckedChange={(checked) => handleFilterChange("cargo", checked as boolean)}
                  />
                  <Label htmlFor="cargo">货船</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tanker"
                    checked={filters.tanker}
                    onCheckedChange={(checked) => handleFilterChange("tanker", checked as boolean)}
                  />
                  <Label htmlFor="tanker">油轮</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="passenger"
                    checked={filters.passenger}
                    onCheckedChange={(checked) => handleFilterChange("passenger", checked as boolean)}
                  />
                  <Label htmlFor="passenger">客船</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fishing"
                    checked={filters.fishing}
                    onCheckedChange={(checked) => handleFilterChange("fishing", checked as boolean)}
                  />
                  <Label htmlFor="fishing">渔船</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="other"
                    checked={filters.other}
                    onCheckedChange={(checked) => handleFilterChange("other", checked as boolean)}
                  />
                  <Label htmlFor="other">其他船舶</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vessel Details</CardTitle>
              <CardDescription>Information about selected vessel</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedShip ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Ship className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">{selectedShip.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">MMSI:</div>
                    <div>{selectedShip.mmsi}</div>
                    <div className="text-muted-foreground">Speed:</div>
                    <div>{selectedShip.speed} knots</div>
                    <div className="text-muted-foreground">Course:</div>
                    <div>{selectedShip.course}°</div>
                    <div className="text-muted-foreground">Position:</div>
                    <div>
                      {selectedShip.position.lat.toFixed(4)}, {selectedShip.position.lng.toFixed(4)}
                    </div>
                  </div>
                  <Button className="w-full mt-2" variant="outline" size="sm">
                    <Info className="mr-2 h-4 w-4" />
                    View Full Details
                  </Button>
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
