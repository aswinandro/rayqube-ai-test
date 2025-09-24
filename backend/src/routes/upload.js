const express = require("express")
const { s3 } = require("../config/aws")
const { upload, generateFileName } = require("../utils/fileUpload")
const { generateQRCode } = require("../utils/qrCode")
const Upload = require("../models/Upload")
const { protect } = require("../middleware/auth")
const { v4: uuidv4 } = require("uuid")

const router = express.Router()

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a PNG file to S3 and generate QR code
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PNG file to upload (max 10MB)
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 upload:
 *                   $ref: '#/components/schemas/Upload'
 *       400:
 *         description: Bad request - invalid file or missing file
 *       401:
 *         description: Unauthorized
 *       413:
 *         description: File too large
 */
router.post("/", protect, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      })
    }

    const file = req.file
    const fileName = generateFileName(file.originalname)
    const s3Key = `uploads/${req.user.id}/${fileName}`

    // Upload file to S3
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
      Metadata: {
        userId: req.user.id,
        originalName: file.originalname,
      },
    }

    const s3Result = await s3.upload(uploadParams).promise()

    // Generate QR code with file URL
    const uploadId = uuidv4()
    const qrData = s3Result.Location
    const { qrCodeUrl } = await generateQRCode(qrData, uploadId)

    // Save upload record to database
    const uploadRecord = await Upload.create({
      userId: req.user.id,
      filename: fileName,
      originalFilename: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      fileUrl: s3Result.Location,
      qrCodeUrl: qrCodeUrl,
      s3Bucket: process.env.AWS_S3_BUCKET,
      s3Key: s3Key,
      metadata: {
        uploadId: uploadId,
        userAgent: req.get("User-Agent"),
        ipAddress: req.ip,
      },
    })

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      upload: uploadRecord,
    })
  } catch (error) {
    console.error("Upload error:", error)
    next(error)
  }
})

/**
 * @swagger
 * /api/upload/my-uploads:
 *   get:
 *     summary: Get current user's uploads
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of uploads per page
 *     responses:
 *       200:
 *         description: Uploads retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 uploads:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Upload'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 */
router.get("/my-uploads", protect, async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const offset = (page - 1) * limit

    const uploads = await Upload.findByUserId(req.user.id, limit, offset)

    res.json({
      success: true,
      uploads,
      pagination: {
        page,
        limit,
        total: uploads.length,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/upload/{id}:
 *   get:
 *     summary: Get upload by ID
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Upload ID
 *     responses:
 *       200:
 *         description: Upload retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 upload:
 *                   $ref: '#/components/schemas/Upload'
 *       404:
 *         description: Upload not found
 *       403:
 *         description: Access denied
 */
router.get("/:id", protect, async (req, res, next) => {
  try {
    const upload = await Upload.findById(req.params.id)

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: "Upload not found",
      })
    }

    // Check if user owns this upload or is admin
    if (upload.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    res.json({
      success: true,
      upload,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/upload/{id}/download:
 *   get:
 *     summary: Generate signed URL for file download
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Upload ID
 *       - in: query
 *         name: expires
 *         schema:
 *           type: integer
 *           default: 3600
 *         description: URL expiration time in seconds
 *     responses:
 *       200:
 *         description: Download URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 downloadUrl:
 *                   type: string
 *                 expiresIn:
 *                   type: integer
 *       404:
 *         description: Upload not found
 *       403:
 *         description: Access denied
 */
router.get("/:id/download", protect, async (req, res, next) => {
  try {
    const upload = await Upload.findById(req.params.id)

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: "Upload not found",
      })
    }

    // Check if user owns this upload or is admin
    if (upload.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    const expiresIn = Number.parseInt(req.query.expires) || 3600 // 1 hour default

    // Generate signed URL for download
    const downloadUrl = s3.getSignedUrl("getObject", {
      Bucket: upload.s3_bucket,
      Key: upload.s3_key,
      Expires: expiresIn,
      ResponseContentDisposition: `attachment; filename="${upload.original_filename}"`,
    })

    res.json({
      success: true,
      downloadUrl,
      expiresIn,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/upload/{id}:
 *   delete:
 *     summary: Delete upload and associated files
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Upload ID
 *     responses:
 *       200:
 *         description: Upload deleted successfully
 *       404:
 *         description: Upload not found
 *       403:
 *         description: Access denied
 */
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const upload = await Upload.findById(req.params.id)

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: "Upload not found",
      })
    }

    // Check if user owns this upload or is admin
    if (upload.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    // Delete files from S3
    const deleteParams = [
      {
        Key: upload.s3_key,
      },
    ]

    // Add QR code to deletion if it exists
    if (upload.qr_code_url) {
      const qrKey = upload.qr_code_url.split("/").pop()
      deleteParams.push({
        Key: `qr-codes/${qrKey}`,
      })
    }

    await s3
      .deleteObjects({
        Bucket: upload.s3_bucket,
        Delete: {
          Objects: deleteParams,
        },
      })
      .promise()

    // Delete upload record from database
    await Upload.delete(req.params.id)

    res.json({
      success: true,
      message: "Upload deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/upload/stats:
 *   get:
 *     summary: Get upload statistics
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Upload statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     total_uploads:
 *                       type: string
 *                     uploads_30d:
 *                       type: string
 *                     total_storage_bytes:
 *                       type: string
 *                     avg_file_size:
 *                       type: string
 */
router.get("/stats", protect, async (req, res, next) => {
  try {
    const stats = await Upload.getStats()

    res.json({
      success: true,
      stats: {
        ...stats,
        total_storage_mb: Math.round(stats.total_storage_bytes / (1024 * 1024)),
        avg_file_size_mb: Math.round(stats.avg_file_size / (1024 * 1024)),
      },
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
