const pool = require("../config/database")

const connectDatabase = async () => {
  try {
    const client = await pool.connect()
    console.log("Connected to PostgreSQL database")
    client.release()
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    throw error
  }
}

const query = async (text, params) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Query error:", error)
    throw error
  }
}

module.exports = {
  connectDatabase,
  query,
  pool,
}
