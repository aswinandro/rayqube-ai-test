const { pool } = require("../connection")

const createUploadsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS uploads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      filename VARCHAR(255) NOT NULL,
      original_filename VARCHAR(255) NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      file_url TEXT NOT NULL,
      qr_code_url TEXT,
      s3_bucket VARCHAR(255),
      s3_key VARCHAR(500),
      upload_status VARCHAR(50) DEFAULT 'completed',
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `

  const createIndexQuery = `
    CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON uploads(user_id);
    CREATE INDEX IF NOT EXISTS idx_uploads_created_at ON uploads(created_at);
    CREATE INDEX IF NOT EXISTS idx_uploads_filename ON uploads(filename);
  `

  try {
    await pool.query(createTableQuery)
    await pool.query(createIndexQuery)
    console.log("Uploads table created successfully")
  } catch (error) {
    console.error("Error creating uploads table:", error)
    throw error
  }
}

module.exports = { createUploadsTable }
