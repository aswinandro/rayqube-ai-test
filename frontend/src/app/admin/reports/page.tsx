"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

interface Registration {
  id: number
  name: string
  email: string
  phone: string
  timestamp: string
}

export default function AdminReportsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])

  useEffect(() => {
    // Load registrations from localStorage
    const stored = localStorage.getItem("registrations")
    if (stored) {
      setRegistrations(JSON.parse(stored))
    }
  }, [])

  const downloadCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Registration Date"]
    const csvContent = [
      headers.join(","),
      ...registrations.map((reg) =>
        [reg.id, `"${reg.name}"`, reg.email, reg.phone, new Date(reg.timestamp).toLocaleString()].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-purple-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xl">AR</span>
              </div>
              <h1 className="text-2xl font-bold">Admin Reports</h1>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="hover:text-purple-200">
                Home
              </Link>
              <Link href="/upload" className="hover:text-purple-200">
                Upload
              </Link>
              <Link href="/api-docs" className="hover:text-purple-200">
                API Docs
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Reports</h2>
              <p className="text-gray-600">View and export user registration data</p>
            </div>
            <Button
              onClick={downloadCSV}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={registrations.length === 0}
            >
              Download CSV Report
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Registrations</CardTitle>
              <CardDescription>Total registrations: {registrations.length}</CardDescription>
            </CardHeader>
            <CardContent>
              {registrations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No registrations found.</p>
                  <p className="text-sm text-gray-400 mt-2">Users need to register on the home page first.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Registration Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>{registration.id}</TableCell>
                        <TableCell className="font-medium">{registration.name}</TableCell>
                        <TableCell>{registration.email}</TableCell>
                        <TableCell>{registration.phone}</TableCell>
                        <TableCell>{new Date(registration.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{registrations.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">Today's Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {
                    registrations.filter((reg) => new Date(reg.timestamp).toDateString() === new Date().toDateString())
                      .length
                  }
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {
                    registrations.filter((reg) => {
                      const regDate = new Date(reg.timestamp)
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return regDate >= weekAgo
                    }).length
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
