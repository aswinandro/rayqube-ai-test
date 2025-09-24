import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-xl">API</span>
              </div>
              <h1 className="text-2xl font-bold">API Documentation</h1>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="hover:text-green-200">
                Home
              </Link>
              <Link href="/upload" className="hover:text-green-200">
                Upload
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Rayqube AI API Documentation</h2>
            <p className="text-lg text-gray-600">Complete API reference for photo upload and management system</p>
          </div>

          {/* Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>API Overview</CardTitle>
              <CardDescription>
                Base URL:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}
                </code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Authentication</h4>
                  <p className="text-gray-600">Currently no authentication required for demo purposes.</p>
                </div>
                <div>
                  <h4 className="font-semibold">Content Type</h4>
                  <p className="text-gray-600">
                    All requests should use <code>multipart/form-data</code> for file uploads.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Response Format</h4>
                  <p className="text-gray-600">All responses are in JSON format.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Endpoint */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-blue-600">POST</Badge>
                /api/upload
              </CardTitle>
              <CardDescription>Upload a PNG image and receive a download URL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Request Parameters</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Parameter</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Required</th>
                        <th className="text-left py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2">
                          <code>photo</code>
                        </td>
                        <td>File</td>
                        <td>Yes</td>
                        <td>PNG image file to upload</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Request</h4>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  {`curl -X POST \\
  ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/upload \\
  -F "photo=@image.png"`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Success Response (200)</h4>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  {`{
  "success": true,
  "downloadUrl": "http://localhost:3000/api/download/1234567890-image.png",
  "message": "Photo uploaded successfully"
}`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Error Responses</h4>
                <div className="space-y-2">
                  <div>
                    <Badge variant="destructive">400</Badge>
                    <span className="ml-2">Bad Request - No photo provided or invalid file type</span>
                  </div>
                  <div>
                    <Badge variant="destructive">500</Badge>
                    <span className="ml-2">Internal Server Error</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Endpoint */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-green-600">GET</Badge>
                /api/download/[filename]
              </CardTitle>
              <CardDescription>Download an uploaded image using the provided filename</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">URL Parameters</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Parameter</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2">
                          <code>filename</code>
                        </td>
                        <td>String</td>
                        <td>The filename returned from the upload endpoint</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Request</h4>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  {`curl -X GET \\
  ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/download/1234567890-image.png`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Success Response (200)</h4>
                <p className="text-gray-600 mb-2">Returns the binary image data with appropriate headers.</p>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  {`Content-Type: image/png
Content-Disposition: attachment; filename="image.png"

[Binary image data]`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Error Response</h4>
                <div>
                  <Badge variant="destructive">404</Badge>
                  <span className="ml-2">File not found</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>Implementation examples in different languages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">JavaScript (Fetch API)</h4>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  {`const formData = new FormData();
formData.append('photo', fileInput.files[0]);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.downloadUrl);`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Python (requests)</h4>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  {`import requests

with open('image.png', 'rb') as f:
    files = {'photo': f}
    response = requests.post('${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/upload', files=files)
    
result = response.json()
print(result['downloadUrl'])`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
