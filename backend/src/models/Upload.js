const { pool } = require("../database/connection")
const { buildUpdateQuery } = require("../utils/db")

class Upload {
  static async create({
    userId,
    filename,
    originalFilename,
    fileSize,
    mimeType,
    fileUrl,
    qrCodeUrl,
    s3Bucket,
    s3Key,
    metadata = {},
  }) {
    const result = await pool.query(
      `INSERT INTO uploads (
        user_id, filename, original_filename, file_size, mime_type, 
        file_url, qr_code_url, s3_bucket, s3_key, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`,
      [
        userId,
        filename,
        originalFilename,
        fileSize,
        mimeType,
        fileUrl,
        qrCodeUrl,
        s3Bucket,
        s3Key,
        JSON.stringify(metadata),
      ],
    )

    return result.rows[0]
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM uploads WHERE id = $1", [id])
    return result.rows[0]
  }

  static async findByUserId(userId, limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM uploads 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    )
    return result.rows
  }

  static async countByUserId(userId) {
    const result = await pool.query("SELECT COUNT(*) FROM uploads WHERE user_id = $1", [userId])
    return parseInt(result.rows[0].count, 10)
  }

  static async findAll(limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT u.*, usr.name as user_name, usr.email as user_email
       FROM uploads u
       LEFT JOIN users usr ON u.user_id = usr.id
       ORDER BY u.created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    )
    return result.rows
  }

  static async update(id, updates) {
    const { setClause, values, nextParam } = buildUpdateQuery(updates)

    if (!setClause) {
      throw new Error("No fields to update")
    }

    const finalSetClause = `${setClause}, updated_at = CURRENT_TIMESTAMP`
    const finalValues = [...values, id]

    const result = await pool.query(
      `UPDATE uploads SET ${finalSetClause} WHERE id = $${nextParam} RETURNING *`,
      finalValues,
    )

    return result.rows[0]
  }

  static async delete(id) {
    const result = await pool.query("DELETE FROM uploads WHERE id = $1 RETURNING *", [id])
    return result.rows[0]
  }

  static async getStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_uploads,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as uploads_30d,
        SUM(file_size) as total_storage_bytes,
        AVG(file_size) as avg_file_size
      FROM uploads
    `)
    return result.rows[0]
  }

  static async getUploadsByDateRange(startDate, endDate) {
    const result = await pool.query(
      `SELECT 
        DATE(created_at) as upload_date,
        COUNT(*) as upload_count,
        SUM(file_size) as total_size
       FROM uploads 
       WHERE created_at >= $1 AND created_at <= $2
       GROUP BY DATE(created_at)
       ORDER BY upload_date DESC`,
      [startDate, endDate],
    )
    return result.rows
  }
}

module.exports = Upload
