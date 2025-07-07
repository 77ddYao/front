"use client"

import type React from "react"

import { useState } from "react"
import { DownloadIcon, FilterIcon, PlusIcon, SearchIcon, Ship, SortAsc, SortDesc } from "lucide-react"
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

// Mock data for ships
const mockShips = Array.from({ length: 20 }, (_, i) => ({
  id: `ship-${i}`,
  name: `Vessel ${i}`,
  mmsi: Math.floor(Math.random() * 1000000000),
  type: ["Cargo", "Tanker", "Passenger", "Fishing", "Other"][Math.floor(Math.random() * 5)],
  flag: ["Panama", "Liberia", "Marshall Islands", "Hong Kong", "Singapore"][Math.floor(Math.random() * 5)],
  length: Math.floor(Math.random() * 300) + 50,
  status: ["Active", "Anchored", "Moored", "Underway", "Not Available"][Math.floor(Math.random() * 5)],
  lastUpdate: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
}))

export default function ShipsPage() {
  const [ships, setShips] = useState(mockShips)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedShips, setSelectedShips] = useState<string[]>([])
  const [isAddShipOpen, setIsAddShipOpen] = useState(false)
  const [newShip, setNewShip] = useState({
    name: "",
    mmsi: "",
    type: "Cargo",
    flag: "Panama",
    length: "",
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

  const filteredShips = ships.filter(
    (ship) =>
      ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship.mmsi.toString().includes(searchTerm) ||
      ship.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship.flag.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedShips = [...filteredShips].sort((a, b) => {
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
      setSelectedShips(sortedShips.map((ship) => ship.id))
    } else {
      setSelectedShips([])
    }
  }

  const handleSelectShip = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedShips((prev) => [...prev, id])
    } else {
      setSelectedShips((prev) => prev.filter((shipId) => shipId !== id))
    }
  }

  const handleAddShip = () => {
    const newShipEntry = {
      id: `ship-${ships.length}`,
      name: newShip.name,
      mmsi: Number.parseInt(newShip.mmsi),
      type: newShip.type,
      flag: newShip.flag,
      length: Number.parseInt(newShip.length),
      status: newShip.status,
      lastUpdate: new Date().toISOString(),
    }

    setShips((prev) => [newShipEntry, ...prev])
    setIsAddShipOpen(false)
    setNewShip({
      name: "",
      mmsi: "",
      type: "Cargo",
      flag: "Panama",
      length: "",
      status: "Active",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Anchored":
        return "bg-yellow-500"
      case "Moored":
        return "bg-blue-500"
      case "Underway":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Ships</h1>
        <p className="text-muted-foreground">Manage and monitor vessel information</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative w-full sm:w-[300px]">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search vessels..."
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
                <DropdownMenuItem>Filter by Type</DropdownMenuItem>
                <DropdownMenuItem>Filter by Flag</DropdownMenuItem>
                <DropdownMenuItem>Filter by Status</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddShipOpen} onOpenChange={setIsAddShipOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Ship
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Vessel</DialogTitle>
                  <DialogDescription>Enter the details of the new vessel to add to the system.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newShip.name}
                      onChange={(e) => setNewShip({ ...newShip, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mmsi" className="text-right">
                      MMSI
                    </Label>
                    <Input
                      id="mmsi"
                      value={newShip.mmsi}
                      onChange={(e) => setNewShip({ ...newShip, mmsi: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select value={newShip.type} onValueChange={(value) => setNewShip({ ...newShip, type: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cargo">Cargo</SelectItem>
                        <SelectItem value="Tanker">Tanker</SelectItem>
                        <SelectItem value="Passenger">Passenger</SelectItem>
                        <SelectItem value="Fishing">Fishing</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="flag" className="text-right">
                      Flag
                    </Label>
                    <Select value={newShip.flag} onValueChange={(value) => setNewShip({ ...newShip, flag: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select flag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Panama">Panama</SelectItem>
                        <SelectItem value="Liberia">Liberia</SelectItem>
                        <SelectItem value="Marshall Islands">Marshall Islands</SelectItem>
                        <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                        <SelectItem value="Singapore">Singapore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="length" className="text-right">
                      Length (m)
                    </Label>
                    <Input
                      id="length"
                      value={newShip.length}
                      onChange={(e) => setNewShip({ ...newShip, length: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select value={newShip.status} onValueChange={(value) => setNewShip({ ...newShip, status: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Anchored">Anchored</SelectItem>
                        <SelectItem value="Moored">Moored</SelectItem>
                        <SelectItem value="Underway">Underway</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddShipOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddShip}>Add Vessel</Button>
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
                    checked={selectedShips.length === sortedShips.length && sortedShips.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">
                    Name
                    {sortField === "name" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("mmsi")}>
                  <div className="flex items-center gap-1">
                    MMSI
                    {sortField === "mmsi" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                  <div className="flex items-center gap-1">
                    Type
                    {sortField === "type" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("flag")}>
                  <div className="flex items-center gap-1">
                    Flag
                    {sortField === "flag" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("length")}>
                  <div className="flex items-center gap-1">
                    Length (m)
                    {sortField === "length" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1">
                    Status
                    {sortField === "status" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("lastUpdate")}>
                  <div className="flex items-center gap-1">
                    Last Update
                    {sortField === "lastUpdate" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedShips.length > 0 ? (
                sortedShips.map((ship) => (
                  <TableRow key={ship.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedShips.includes(ship.id)}
                        onCheckedChange={(checked) => handleSelectShip(ship.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Ship className="h-4 w-4 text-muted-foreground" />
                        {ship.name}
                      </div>
                    </TableCell>
                    <TableCell>{ship.mmsi}</TableCell>
                    <TableCell>{ship.type}</TableCell>
                    <TableCell>{ship.flag}</TableCell>
                    <TableCell>{ship.length}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(ship.status)}`} />
                        {ship.status}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(ship.lastUpdate).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View on Map</DropdownMenuItem>
                          <DropdownMenuItem>Track History</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No vessels found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{sortedShips.length}</strong> of <strong>{ships.length}</strong> vessels
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
