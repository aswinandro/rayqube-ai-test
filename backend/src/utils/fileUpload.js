const multer = require("multer")
const { v4: uuidv4 } = require("uuid")
const path = require("path")

// Configure multer for memory storage
const storage = multer.memoryStorage()

// File filter to only allow PNG files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png") {
    cb(null, true)
  } else {
    cb(new Error("Only PNG files are allowed"), false)
  }
}

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

// Generate unique filename
const generateFileName = (originalName) => {
  const ext = path.extname(originalName)
  const name = path.basename(originalName, ext)
  const timestamp = Date.now()
  const uuid = uuidv4().split("-")[0]
  return `${name}-${timestamp}-${uuid}${ext}`
}

module.exports = {
  upload,
  generateFileName,
}
