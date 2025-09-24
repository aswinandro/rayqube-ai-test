const express = require("express")
const Upload = require("../models/Upload")
const User = require("../models/User")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 dashboard:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: object
 *                     uploads:
 *                       type: object
 *                     storage:
 *                       type: object
 */
router.get("/dashboard", protect, authorize("admin"), async (req, res, next) => {
  try {
    const [userStats, uploadStats] = await Promise.all([User.getStats(), Upload.getStats()])

    const dashboard = {
      users: {
        total: Number.parseInt(userStats.total_users),
        new_30d: Number.parseInt(userStats.new_users_30d),
        active: Number.parseInt(userStats.active_users),
      },
      uploads: {
        total: Number.parseInt(uploadStats.total_uploads),
        new_30d: Number.parseInt(uploadStats.uploads_30d),
        avg_size_mb: Math.round(uploadStats.avg_file_size / (1024 * 1024)),
      },
      storage: {
        total_bytes: Number.parseInt(uploadStats.total_storage_bytes),
        total_mb: Math.round(uploadStats.total_storage_bytes / (1024 * 1024)),
        total_gb: Math.round(uploadStats.total_storage_bytes / (1024 * 1024 * 1024)),
      },
    }

    res.json({
      success: true,
      dashboard,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/reports/uploads-by-date:
 *   get:
 *     summary: Get uploads grouped by date (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Upload statistics by date retrieved successfully
 */
router.get("/uploads-by-date", protect, authorize("admin"), async (req, res, next) => {
  try {
    const startDate =
      req.query.start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const endDate = req.query.end_date || new Date().toISOString().split("T")[0]

    const uploadsByDate = await Upload.getUploadsByDateRange(startDate, endDate)

    res.json({
      success: true,
      data: uploadsByDate,
      period: {
        start_date: startDate,
        end_date: endDate,
      },
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
