const Joi = require("joi")

const userRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  phone: Joi.string()
    .pattern(/^[+]?[1-9][\d]{0,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
      "any.required": "Phone number is required",
    }),
  password: Joi.string().min(6).optional().messages({
    "string.min": "Password must be at least 6 characters long",
  }),
})

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const uploadSchema = Joi.object({
  filename: Joi.string().required(),
  mimeType: Joi.string().valid("image/png").required().messages({
    "any.only": "Only PNG files are allowed",
  }),
  fileSize: Joi.number()
    .max(10 * 1024 * 1024)
    .required()
    .messages({
      "number.max": "File size cannot exceed 10MB",
    }),
})

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      })
    }
    next()
  }
}

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  uploadSchema,
  validateRequest,
}
