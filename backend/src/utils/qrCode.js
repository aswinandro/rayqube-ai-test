const QRCode = require("qrcode")
const { s3Client } = require("../config/aws")
const { PutObjectCommand } = require("@aws-sdk/client-s3")
const { v4: uuidv4 } = require("uuid")

const generateQRCode = async (data, uploadId) => {
  try {
    // Generate QR code as buffer
    const qrCodeBuffer = await QRCode.toBuffer(data, {
      type: "png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 256,
    })

    // Upload QR code to S3
    const qrKey = `qr-codes/${uploadId}-${uuidv4()}.png`
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: qrKey,
      Body: qrCodeBuffer,
      ContentType: "image/png",
    })

    await s3Client.send(putObjectCommand)
    const qrCodeUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${qrKey}`

    return {
      qrCodeUrl: qrCodeUrl,
      s3Key: qrKey,
    }
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw new Error("Failed to generate QR code")
  }
}

module.exports = { generateQRCode }
