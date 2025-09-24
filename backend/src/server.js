const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const swaggerSetup = require("./config/swagger")
const errorHandler = require("./middleware/errorHandler")
const { connectDatabase, pool } = require("./database/connection")

// Import routes
const authRoutes = require("./routes/auth")
const uploadRoutes = require("./routes/upload")
const userRoutes = require("./routes/users")
const reportRoutes = require("./routes/reports")

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use("/api/", limiter)

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Logging
app.use(morgan("combined"))

// Swagger documentation
swaggerSetup(app)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/users", userRoutes)
app.use("/api/reports", reportRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  })
})

// Error handling middleware
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

const gracefulShutdown = () => {
  console.log("\nShutting down gracefully...")
  pool.end(() => {
    console.log("Database pool has been closed.")
    process.exit(0)
  })
}

process.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", gracefulShutdown)

module.exports = app
