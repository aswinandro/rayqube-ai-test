const pool = require("../config/database")

/**
 * Establishes and verifies the database connection.
 */
const connectDatabase = async () => {
  console.log("Attempting to connect to the database...")
  try {
    // Use pool.query to test the connection. It will automatically
    // acquire a client, run the query, and release it.
    const result = await pool.query("SELECT NOW()")
    console.log("✅ Database connected successfully.")
    console.log(`   PostgreSQL server time: ${result.rows[0].now}`)
  } catch (error) {
    console.error("❌ Failed to connect to the database.")
    console.error("   Please check the following:")
    console.error("   1. Is the PostgreSQL server running?")
    console.error(`   2. Are the database credentials in your .env file correct for host: ${process.env.DB_HOST}?`)
    console.error("   3. Is the server reachable (check firewalls, network configuration)?")
    console.error("\nOriginal Error:", error.message)

    // Re-throw the error to ensure the server startup process fails as intended.
    throw new Error("Database connection failed. Server cannot start.")
  }
}

module.exports = { pool, connectDatabase }