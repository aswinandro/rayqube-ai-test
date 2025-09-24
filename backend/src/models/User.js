const { pool } = require("../database/connection")
const bcrypt = require("bcryptjs")

class User {
  static async create({ name, email, phone, password }) {
    const hashedPassword = password ? await bcrypt.hash(password, 12) : null

    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, phone, created_at`,
      [name, email, phone, hashedPassword],
    )

    return result.rows[0]
  }

  static async findById(id) {
    const result = await pool.query("SELECT id, name, email, phone, role, is_active, created_at FROM users WHERE id = $1", [
      id,
    ])
    return result.rows[0]
  }

  static async findByEmail(email) {
    const result = await pool.query(
      "SELECT id, name, email, phone, password_hash, role, is_active FROM users WHERE email = $1",
      [email],
    )
    return result.rows[0]
  }

  static async findAll(limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT id, name, email, phone, role, is_active, created_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    )
    return result.rows
  }

  static async update(id, updates) {
    const fields = []
    const values = []
    let paramCount = 1

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`)
        values.push(updates[key])
        paramCount++
      }
    })

    if (fields.length === 0) {
      throw new Error("No fields to update")
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)

    const result = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramCount} 
       RETURNING id, name, email, phone, role, updated_at`,
      values,
    )

    return result.rows[0]
  }

  static async delete(id) {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id])
    return result.rows[0]
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }

  static async getStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_users_30d,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_users
      FROM users
    `)
    return result.rows[0]
  }
}

module.exports = User
