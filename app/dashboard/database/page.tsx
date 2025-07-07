"use client"

import type React from "react"

import { useState } from "react"
import { Database, Play, Save, TableIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock database tables
const mockTables = [
  { name: "vessels", rows: 12345, size: "1.2 GB", lastUpdated: "2023-06-15" },
  { name: "ports", rows: 987, size: "120 MB", lastUpdated: "2023-06-10" },
  { name: "trajectories", rows: 45678, size: "3.5 GB", lastUpdated: "2023-06-17" },
  { name: "weather_data", rows: 8765, size: "450 MB", lastUpdated: "2023-06-12" },
  { name: "users", rows: 56, size: "2 MB", lastUpdated: "2023-06-01" },
  { name: "system_logs", rows: 23456, size: "800 MB", lastUpdated: "2023-06-18" },
]

// Mock query results
const mockQueryResults = [
  { id: 1, name: "Vessel Alpha", mmsi: 123456789, type: "Cargo", flag: "Panama" },
  { id: 2, name: "Vessel Beta", mmsi: 234567890, type: "Tanker", flag: "Liberia" },
  { id: 3, name: "Vessel Gamma", mmsi: 345678901, type: "Passenger", flag: "Marshall Islands" },
  { id: 4, name: "Vessel Delta", mmsi: 456789012, type: "Fishing", flag: "Hong Kong" },
  { id: 5, name: "Vessel Epsilon", mmsi: 567890123, type: "Other", flag: "Singapore" },
]

export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState("query")
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM vessels LIMIT 5;")
  const [queryResults, setQueryResults] = useState<any[] | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [selectedTable, setSelectedTable] = useState("vessels")
  const [tableData, setTableData] = useState<any[] | null>(null)

  const handleExecuteQuery = () => {
    setIsExecuting(true)

    // Simulate query execution
    setTimeout(() => {
      setQueryResults(mockQueryResults)
      setIsExecuting(false)
    }, 1000)
  }

  const handleViewTable = (tableName: string) => {
    setSelectedTable(tableName)
    setTableData(mockQueryResults) // In a real app, this would fetch the actual table data
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Database</h1>
        <p className="text-muted-foreground">Manage and query the Marine AIS database</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Database Tables</CardTitle>
            <CardDescription>Available tables in the database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockTables.map((table) => (
                <div
                  key={table.name}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${
                    selectedTable === table.name ? "bg-muted" : ""
                  }`}
                  onClick={() => handleViewTable(table.name)}
                >
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{table.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{table.rows.toLocaleString()} rows</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">Last database update: 2023-06-18 14:30</div>
          </CardFooter>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="query" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="query">SQL Query</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
            </TabsList>

            <TabsContent value="query">
              <Card>
                <CardHeader>
                  <CardTitle>SQL Query Editor</CardTitle>
                  <CardDescription>Write and execute SQL queries against the database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      className="font-mono min-h-[150px]"
                      placeholder="Enter your SQL query here..."
                    />
                    <div className="flex items-center gap-2">
                      <Button onClick={handleExecuteQuery} disabled={isExecuting}>
                        <Play className="mr-2 h-4 w-4" />
                        {isExecuting ? "Executing..." : "Execute Query"}
                      </Button>
                      <Button variant="outline">
                        <Save className="mr-2 h-4 w-4" />
                        Save Query
                      </Button>
                    </div>

                    {queryResults && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Query Results</h3>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {Object.keys(queryResults[0]).map((key) => (
                                  <TableHead key={key}>{key}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {queryResults.map((row, index) => (
                                <TableRow key={index}>
                                  {Object.values(row).map((value, i) => (
                                    <TableCell key={i}>{value as React.ReactNode}</TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Table View: {selectedTable}</CardTitle>
                      <CardDescription>Browse and manage table data</CardDescription>
                    </div>
                    <Select value={selectedTable} onValueChange={setSelectedTable}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select table" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTables.map((table) => (
                          <SelectItem key={table.name} value={table.name}>
                            {table.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {tableData ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(tableData[0]).map((key) => (
                              <TableHead key={key}>{key}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tableData.map((row, index) => (
                            <TableRow key={index}>
                              {Object.values(row).map((value, i) => (
                                <TableCell key={i}>{value as React.ReactNode}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Database className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>Select a table to view its data</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing 5 of {mockTables.find((t) => t.name === selectedTable)?.rows.toLocaleString()} rows
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="schema">
              <Card>
                <CardHeader>
                  <CardTitle>Database Schema</CardTitle>
                  <CardDescription>View the structure of database tables</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select defaultValue="vessels">
                      <SelectTrigger>
                        <SelectValue placeholder="Select table" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTables.map((table) => (
                          <SelectItem key={table.name} value={table.name}>
                            {table.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Column Name</TableHead>
                            <TableHead>Data Type</TableHead>
                            <TableHead>Nullable</TableHead>
                            <TableHead>Key</TableHead>
                            <TableHead>Default</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>INTEGER</TableCell>
                            <TableCell>NO</TableCell>
                            <TableCell>PK</TableCell>
                            <TableCell>NULL</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>name</TableCell>
                            <TableCell>VARCHAR(255)</TableCell>
                            <TableCell>NO</TableCell>
                            <TableCell></TableCell>
                            <TableCell>NULL</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>mmsi</TableCell>
                            <TableCell>BIGINT</TableCell>
                            <TableCell>NO</TableCell>
                            <TableCell>UQ</TableCell>
                            <TableCell>NULL</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>type</TableCell>
                            <TableCell>VARCHAR(50)</TableCell>
                            <TableCell>YES</TableCell>
                            <TableCell></TableCell>
                            <TableCell>NULL</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>flag</TableCell>
                            <TableCell>VARCHAR(50)</TableCell>
                            <TableCell>YES</TableCell>
                            <TableCell></TableCell>
                            <TableCell>NULL</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Table Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Table Name:</div>
                        <div>vessels</div>
                        <div className="text-muted-foreground">Engine:</div>
                        <div>InnoDB</div>
                        <div className="text-muted-foreground">Row Format:</div>
                        <div>Dynamic</div>
                        <div className="text-muted-foreground">Created:</div>
                        <div>2023-01-15</div>
                        <div className="text-muted-foreground">Collation:</div>
                        <div>utf8mb4_general_ci</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
