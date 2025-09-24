const QRCode = require("qrcode")
const { s3 } = require("../config/aws")
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
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: qrKey,
      Body: qrCodeBuffer,
      ContentType: "image/png",
      ACL: "public-read",
    }

    const result = await s3.upload(uploadParams).promise()

    return {
      qrCodeUrl: result.Location,
      s3Key: qrKey,
    }
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw new Error("Failed to generate QR code")
  }
}

module.exports = { generateQRCode }
