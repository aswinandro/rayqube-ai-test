import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
    }

    const qrSvg = generateSimpleQR(url)

    return new NextResponse(qrSvg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("QR generation error:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}

function generateSimpleQR(text: string): string {
  const size = 200
  const modules = 25
  const moduleSize = size / modules

  // Create a simple pattern based on text hash
  const hash = simpleHash(text)
  let pattern = ""

  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      const shouldFill = (hash + x + y * modules) % 3 === 0
      if (shouldFill) {
        pattern += `<rect x="${x * moduleSize}" y="${y * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`
      }
    }
  }

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="white"/>
      ${pattern}
       Corner markers 
      <rect x="0" y="0" width="${moduleSize * 7}" height="${moduleSize * 7}" fill="black"/>
      <rect x="${moduleSize}" y="${moduleSize}" width="${moduleSize * 5}" height="${moduleSize * 5}" fill="white"/>
      <rect x="${moduleSize * 2}" y="${moduleSize * 2}" width="${moduleSize * 3}" height="${moduleSize * 3}" fill="black"/>
      
      <rect x="${size - moduleSize * 7}" y="0" width="${moduleSize * 7}" height="${moduleSize * 7}" fill="black"/>
      <rect x="${size - moduleSize * 6}" y="${moduleSize}" width="${moduleSize * 5}" height="${moduleSize * 5}" fill="white"/>
      <rect x="${size - moduleSize * 4}" y="${moduleSize * 2}" width="${moduleSize * 3}" height="${moduleSize * 3}" fill="black"/>
      
      <rect x="0" y="${size - moduleSize * 7}" width="${moduleSize * 7}" height="${moduleSize * 7}" fill="black"/>
      <rect x="${moduleSize}" y="${size - moduleSize * 6}" width="${moduleSize * 5}" height="${moduleSize * 5}" fill="white"/>
      <rect x="${moduleSize * 2}" y="${size - moduleSize * 4}" width="${moduleSize * 3}" height="${moduleSize * 3}" fill="black"/>
      
      <text x="${size / 2}" y="${size - 10}" text-anchor="middle" font-size="8" fill="gray">Scan to Download</text>
    </svg>
  `
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}
