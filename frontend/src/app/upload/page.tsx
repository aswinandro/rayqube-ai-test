"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [downloadLink, setDownloadLink] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "image/png") {
        setSelectedFile(file)
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a PNG image file.",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      // Call the upload API
      const formData = new FormData()
      formData.append("photo", selectedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setDownloadLink(result.downloadUrl)

        const qrResponse = await fetch(`/api/qr?url=${encodeURIComponent(result.downloadUrl)}`)
        const qrBlob = await qrResponse.blob()
        const qrUrl = URL.createObjectURL(qrBlob)
        setQrCodeUrl(qrUrl)

        toast({
          title: "Upload Successful!",
          description: "Your photo has been uploaded and QR code generated.",
        })
      } else {
        throw new Error(result.error || "Upload failed")
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your photo.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">PH</span>
              </div>
              <h1 className="text-2xl font-bold">Photo Upload</h1>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="hover:text-blue-200">
                Home
              </Link>
              <Link href="/api-docs" className="hover:text-blue-200">
                API Docs
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Upload Your Photo</CardTitle>
              <CardDescription>Upload a PNG image and get a QR code for easy sharing and downloading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="photo">Select PNG Image</Label>
                <Input id="photo" type="file" accept=".png" onChange={handleFileSelect} className="mt-2" />
              </div>

              {uploadedImage && (
                <div>
                  <Label>Preview</Label>
                  <div className="mt-2 border rounded-lg p-4">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-full h-auto max-h-64 mx-auto"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? "Uploading..." : "Upload Photo"}
              </Button>

              {qrCodeUrl && downloadLink && (
                <div className="space-y-4">
                  <div className="text-center">
                    <Label className="text-lg font-semibold">QR Code for Download</Label>
                    <div className="mt-2 flex justify-center">
                      <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="border rounded-lg" />
                    </div>
                  </div>

                  <div>
                    <Label>Download Link</Label>
                    <div className="mt-2 p-3 bg-gray-100 rounded-lg break-all text-sm">{downloadLink}</div>
                  </div>

                  <Button
                    onClick={() => navigator.clipboard.writeText(downloadLink)}
                    variant="outline"
                    className="w-full"
                  >
                    Copy Download Link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
