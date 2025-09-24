const { pool } = require("../connection")

const createSessionsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      token_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      ip_address INET,
      user_agent TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `

  const createIndexQuery = `
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
  `

  try {
    await pool.query(createTableQuery)
    await pool.query(createIndexQuery)
    console.log("Sessions table created successfully")
  } catch (error) {
    console.error("Error creating sessions table:", error)
    throw error
  }
}

module.exports = { createSessionsTable }
