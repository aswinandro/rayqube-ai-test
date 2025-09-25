"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })
  const [isRegistered, setIsRegistered] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Store registration data in localStorage (since no DB integration)
    const registrations = JSON.parse(localStorage.getItem("registrations") || "[]")
    const newRegistration = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    }
    registrations.push(newRegistration)
    localStorage.setItem("registrations", JSON.stringify(registrations))

    setIsRegistered(true)
    toast({
      title: "Registration Successful!",
      description: "Welcome to Pizza Hut! Enjoy your exclusive video content.",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-8">Welcome to Pizza Hut!</h1>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Exclusive Video Content</CardTitle>
                <CardDescription>Thank you for registering! Enjoy this exclusive Pizza Hut experience.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold">Pizza Hut Brand Video</p>
                    <p className="text-gray-600">Click to play exclusive content</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Link href="/upload">
                <Button className="bg-red-600 hover:bg-red-700">Upload Photo</Button>
              </Link>
              <Link href="/api-docs">
                <Button variant="outline">View API Documentation</Button>
              </Link>
              <Link href="/admin/reports">
                <Button variant="secondary">Admin Reports</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-red-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-xl">PH</span>
              </div>
              <h1 className="text-2xl font-bold">Pizza Hut</h1>
            </div>
            <nav className="flex space-x-6">
              <Link href="/upload" className="hover:text-red-200">
                Upload
              </Link>
              <Link href="/api-docs" className="hover:text-red-200">
                API Docs
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Welcome to Pizza Hut</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join our exclusive community and get access to special content, offers, and more!
          </p>

          {/* Registration Form */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-red-600">Register Now</CardTitle>
              <CardDescription>Fill out the form below to access exclusive Pizza Hut content</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                  />
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Register & Watch Video
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">What You'll Get</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Exclusive Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Access to behind-the-scenes content and exclusive Pizza Hut videos.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Photo Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Upload and share your Pizza Hut moments with QR code downloads.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Special Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get notified about exclusive deals and promotions.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
