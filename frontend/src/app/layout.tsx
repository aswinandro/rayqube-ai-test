import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rayqube AI Test",
  description: "File upload and management application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ...existing code...
  // Use cn utility to combine Inter font and Tailwind base classes
  // bg-background and text-foreground use your CSS variables for theming
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-background text-foreground min-h-screen")}> 
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
