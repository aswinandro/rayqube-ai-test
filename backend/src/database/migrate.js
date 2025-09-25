require("dotenv").config()
const { connectDatabase } = require("./connection")
const { createUsersTable } = require("./migrations/001_create_users_table")
const { createUploadsTable } = require("./migrations/002_create_uploads_table")
const { createSessionsTable } = require("./migrations/003_create_sessions_table")

const runMigrations = async () => {
  try {
    console.log("Starting database migrations...")

    await connectDatabase()
    console.log("Connected to database")

    // Run migrations in order
    await createUsersTable()
    await createUploadsTable()
    await createSessionsTable()

    console.log("All migrations completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
}

module.exports = { runMigrations }
