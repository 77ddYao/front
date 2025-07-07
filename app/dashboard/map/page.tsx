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

// Mock data for ships
const mockShips = Array.from({ length: 50 }, (_, i) => ({
  id: `ship-${i}`,
  name: `Vessel ${i}`,
  type: ["Cargo", "Tanker", "Passenger", "Fishing", "Other"][Math.floor(Math.random() * 5)],
  mmsi: Math.floor(Math.random() * 1000000000),
  position: {
    lat: 22 + Math.random() * 10,
    lng: 113 + Math.random() * 10,
  },
  speed: Math.floor(Math.random() * 30),
  course: Math.floor(Math.random() * 360),
  destination: ["Hong Kong", "Shanghai", "Singapore", "Tokyo", "Busan"][Math.floor(Math.random() * 5)],
}))

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

  // Simulate map initialization
  useEffect(() => {
    if (mapContainerRef.current) {
      // In a real application, you would initialize your map library here
      // For example: new mapboxgl.Map({ container: mapContainerRef.current, ... })

      // For this demo, we'll just add a placeholder
      const mapContainer = mapContainerRef.current
      mapContainer.innerHTML = ""

      // Create a mock map
      const mockMap = document.createElement("div")
      mockMap.className = "relative w-full h-full bg-blue-100 dark:bg-blue-950 rounded-lg"
      mockMap.innerHTML = `
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <p class="text-lg font-medium text-muted-foreground">Interactive Map View</p>
            <p class="text-sm text-muted-foreground">Map would be rendered here with Mapbox or similar</p>
          </div>
        </div>
      `

      // Add mock ships to the map
      mockShips.forEach((ship, index) => {
        const shipElement = document.createElement("div")
        shipElement.className = `absolute w-3 h-3 rounded-full bg-red-500 cursor-pointer transition-all duration-300 hover:scale-150`
        shipElement.style.left = `${(ship.position.lng - 113) * 10}%`
        shipElement.style.top = `${(ship.position.lat - 22) * 10}%`
        shipElement.title = ship.name
        shipElement.onclick = () => setSelectedShip(ship)
        mockMap.appendChild(shipElement)
      })

      mapContainer.appendChild(mockMap)
    }
  }, [mapView, filters])

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
                    <div className="text-muted-foreground">Type:</div>
                    <div>{selectedShip.type}</div>
                    <div className="text-muted-foreground">Speed:</div>
                    <div>{selectedShip.speed} knots</div>
                    <div className="text-muted-foreground">Course:</div>
                    <div>{selectedShip.course}°</div>
                    <div className="text-muted-foreground">Destination:</div>
                    <div>{selectedShip.destination}</div>
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
