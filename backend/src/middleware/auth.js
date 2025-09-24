const jwt = require("jsonwebtoken")
const { query } = require("../database/connection")

const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      const result = await query("SELECT id, name, email, created_at FROM users WHERE id = $1", [decoded.id])

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "No user found with this token",
        })
      }

      req.user = result.rows[0]
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      })
    }
  } catch (error) {
    next(error)
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      })
    }
    next()
  }
}

module.exports = { protect, authorize }
