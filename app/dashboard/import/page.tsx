"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, ArrowRight, CheckCircle2, FileText, FileUp, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState("file")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jsonData, setJsonData] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [dataType, setDataType] = useState("vessel")
  const [processingOptions, setProcessingOptions] = useState({
    cleanData: true,
    validateCoordinates: true,
    removeDuplicates: true,
    interpolateMissingValues: false,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setUploadStatus("idle")
      setUploadProgress(0)
    }
  }

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value)
    setUploadStatus("idle")
    setUploadProgress(0)
  }

  const simulateUpload = () => {
    setUploadStatus("uploading")
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStatus("success")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleUpload = () => {
    if (activeTab === "file" && !selectedFile) {
      setUploadStatus("error")
      return
    }

    if (activeTab === "json" && !jsonData) {
      setUploadStatus("error")
      return
    }

    simulateUpload()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">上传数据</h1>
        <p className="text-muted-foreground">上传和处理船舶与港口数据以进行分析</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>上传数据</CardTitle>
            <CardDescription>从 CSV 或 JSON 文件导入数据以供 Spark 后端处理</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="file" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="file">文件上传</TabsTrigger>
                <TabsTrigger value="json">JSON 数据</TabsTrigger>
              </TabsList>
              <TabsContent value="file" className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
                  <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">将文件拖放到此处</h3>
                  <p className="text-sm text-muted-foreground mb-4">支持 CSV 和 JSON 文件，大小限制为 50MB</p>
                  <Input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept=".csv,.json"
                    onChange={handleFileChange}
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" className="mb-2">
                      <Upload className="mr-2 h-4 w-4" />
                      浏览文件
                    </Button>
                  </Label>
                  {selectedFile && (
                    <div className="mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{selectedFile.name}</span>
                        <span className="text-muted-foreground">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="json" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="json-data">Paste JSON Data</Label>
                  <Textarea
                    id="json-data"
                    placeholder='{"vessels": [{"mmsi": 123456789, "name": "Example Vessel", ...}]}'
                    className="min-h-[200px] font-mono"
                    value={jsonData}
                    onChange={handleJsonChange}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {uploadStatus === "uploading" && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {uploadStatus === "success" && (
              <Alert className="mt-4 bg-green-50 dark:bg-green-950 border-green-500">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Upload Successful</AlertTitle>
                <AlertDescription>Your data has been uploaded and is ready for processing.</AlertDescription>
              </Alert>
            )}

            {uploadStatus === "error" && (
              <Alert className="mt-4 bg-red-50 dark:bg-red-950 border-red-500" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Upload Failed</AlertTitle>
                <AlertDescription>
                  {activeTab === "file" ? "Please select a file to upload." : "Please enter valid JSON data."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleUpload}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Data
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Options</CardTitle>
              <CardDescription>Configure data type and processing options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-type">Data Type</Label>
                <Select value={dataType} onValueChange={setDataType}>
                  <SelectTrigger id="data-type">
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vessel">Vessel Data</SelectItem>
                    <SelectItem value="port">Port Data</SelectItem>
                    <SelectItem value="trajectory">Trajectory Data</SelectItem>
                    <SelectItem value="weather">Weather Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Processing Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="clean-data"
                      checked={processingOptions.cleanData}
                      onChange={(e) => setProcessingOptions({ ...processingOptions, cleanData: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="clean-data">Clean data</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="validate-coordinates"
                      checked={processingOptions.validateCoordinates}
                      onChange={(e) =>
                        setProcessingOptions({ ...processingOptions, validateCoordinates: e.target.checked })
                      }
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="validate-coordinates">Validate coordinates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remove-duplicates"
                      checked={processingOptions.removeDuplicates}
                      onChange={(e) =>
                        setProcessingOptions({ ...processingOptions, removeDuplicates: e.target.checked })
                      }
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="remove-duplicates">Remove duplicates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="interpolate-missing"
                      checked={processingOptions.interpolateMissingValues}
                      onChange={(e) =>
                        setProcessingOptions({ ...processingOptions, interpolateMissingValues: e.target.checked })
                      }
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="interpolate-missing">Interpolate missing values</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processing Pipeline</CardTitle>
              <CardDescription>How your data will be processed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileUp className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Upload</p>
                    <p className="text-xs text-muted-foreground">Data is uploaded to secure storage</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 border-t border-dashed mx-6"></div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Validation</p>
                    <p className="text-xs text-muted-foreground">Data is validated and cleaned</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 border-t border-dashed mx-6"></div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Processing</p>
                    <p className="text-xs text-muted-foreground">Spark backend processes the data</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
