const { Pool } = require("pg")

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // AWS RDS requires SSL. Setting rejectUnauthorized to false is common for development
  // to avoid issues with certificate verification. For production, consider a more
  // secure setup with the AWS RDS CA certificate.
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Increased from 2000ms to 5000ms
})

// Log all queries in development for easier debugging
if (process.env.NODE_ENV !== "production") {
  pool.on("connect", (client) => {
    client.on("query", (query) => {
      console.log("[DB_QUERY]", { sql: query.text, params: query.values })
    })
  })
}

module.exports = pool
