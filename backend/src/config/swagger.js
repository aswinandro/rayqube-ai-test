const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rayqube AI Test API",
      version: "1.0.0",
      description: `
        Complete API documentation for Rayqube AI Test application.
        
        ## Features
        - User authentication with JWT tokens
        - File upload to AWS S3 (PNG files only)
        - QR code generation for uploaded files
        - User management and statistics
        - Comprehensive error handling
        
        ## Authentication
        Most endpoints require authentication. Include the JWT token in the Authorization header:
        \`Authorization: Bearer <your-jwt-token>\`
        
        ## File Upload
        - Only PNG files are supported
        - Maximum file size: 10MB
        - Files are stored in AWS S3
        - QR codes are automatically generated for each upload
      `,
      contact: {
        name: "API Support",
        email: "support@rayqube.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://api.rayqube.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token obtained from login endpoint",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "phone"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "User unique identifier",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            name: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              description: "User full name",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "john.doe@example.com",
            },
            phone: {
              type: "string",
              pattern: "^[+]?[1-9][\\d]{0,15}$",
              description: "User phone number",
              example: "+1234567890",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "User role",
              example: "user",
            },
            is_active: {
              type: "boolean",
              description: "Whether the user account is active",
              example: true,
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "User registration timestamp",
              example: "2024-01-15T10:30:00Z",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
              example: "2024-01-15T10:30:00Z",
            },
          },
        },
        Upload: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Upload unique identifier",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            user_id: {
              type: "string",
              format: "uuid",
              description: "ID of the user who uploaded the file",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            filename: {
              type: "string",
              description: "Generated filename",
              example: "image-1642248600000-abc123.png",
            },
            original_filename: {
              type: "string",
              description: "Original filename",
              example: "my-image.png",
            },
            file_size: {
              type: "integer",
              description: "File size in bytes",
              example: 1048576,
            },
            mime_type: {
              type: "string",
              description: "File MIME type",
              example: "image/png",
            },
            file_url: {
              type: "string",
              format: "uri",
              description: "S3 file URL",
              example: "https://my-bucket.s3.amazonaws.com/uploads/user-id/image.png",
            },
            qr_code_url: {
              type: "string",
              format: "uri",
              description: "Generated QR code URL",
              example: "https://my-bucket.s3.amazonaws.com/qr-codes/qr-code.png",
            },
            s3_bucket: {
              type: "string",
              description: "S3 bucket name",
              example: "my-rayqube-bucket",
            },
            s3_key: {
              type: "string",
              description: "S3 object key",
              example: "uploads/user-id/image.png",
            },
            upload_status: {
              type: "string",
              enum: ["pending", "completed", "failed"],
              description: "Upload status",
              example: "completed",
            },
            metadata: {
              type: "object",
              description: "Additional metadata",
              example: {
                uploadId: "abc123",
                userAgent: "Mozilla/5.0...",
                ipAddress: "192.168.1.1",
              },
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Upload timestamp",
              example: "2024-01-15T10:30:00Z",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
              example: "2024-01-15T10:30:00Z",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Login successful",
            },
            token: {
              type: "string",
              description: "JWT authentication token",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Error message",
              example: "Something went wrong",
            },
            errors: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Detailed error messages (for validation errors)",
              example: ["Email is required", "Password must be at least 6 characters"],
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
          },
        },
        PaginationResponse: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              description: "Current page number",
              example: 1,
            },
            limit: {
              type: "integer",
              description: "Number of items per page",
              example: 20,
            },
            total: {
              type: "integer",
              description: "Total number of items",
              example: 100,
            },
          },
        },
        UserStats: {
          type: "object",
          properties: {
            total_users: {
              type: "string",
              description: "Total number of users",
              example: "150",
            },
            new_users_30d: {
              type: "string",
              description: "New users in last 30 days",
              example: "25",
            },
            active_users: {
              type: "string",
              description: "Number of active users",
              example: "140",
            },
          },
        },
        UploadStats: {
          type: "object",
          properties: {
            total_uploads: {
              type: "string",
              description: "Total number of uploads",
              example: "500",
            },
            uploads_30d: {
              type: "string",
              description: "Uploads in last 30 days",
              example: "75",
            },
            total_storage_bytes: {
              type: "string",
              description: "Total storage used in bytes",
              example: "1073741824",
            },
            avg_file_size: {
              type: "string",
              description: "Average file size in bytes",
              example: "2097152",
            },
            total_storage_mb: {
              type: "number",
              description: "Total storage used in MB",
              example: 1024,
            },
            avg_file_size_mb: {
              type: "number",
              description: "Average file size in MB",
              example: 2,
            },
          },
        },
        DashboardStats: {
          type: "object",
          properties: {
            users: {
              type: "object",
              properties: {
                total: {
                  type: "integer",
                  example: 150,
                },
                new_30d: {
                  type: "integer",
                  example: 25,
                },
                active: {
                  type: "integer",
                  example: 140,
                },
              },
            },
            uploads: {
              type: "object",
              properties: {
                total: {
                  type: "integer",
                  example: 500,
                },
                new_30d: {
                  type: "integer",
                  example: 75,
                },
                avg_size_mb: {
                  type: "integer",
                  example: 2,
                },
              },
            },
            storage: {
              type: "object",
              properties: {
                total_bytes: {
                  type: "integer",
                  example: 1073741824,
                },
                total_mb: {
                  type: "integer",
                  example: 1024,
                },
                total_gb: {
                  type: "integer",
                  example: 1,
                },
              },
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Authentication information is missing or invalid",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Not authorized to access this route",
              },
            },
          },
        },
        ForbiddenError: {
          description: "Access denied - insufficient permissions",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "User role user is not authorized to access this route",
              },
            },
          },
        },
        NotFoundError: {
          description: "The requested resource was not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Resource not found",
              },
            },
          },
        },
        ValidationError: {
          description: "Request validation failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Validation error",
                errors: ["Email is required", "Password must be at least 6 characters long"],
              },
            },
          },
        },
        ServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Internal server error",
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication and profile management",
      },
      {
        name: "Users",
        description: "User management operations (Admin only)",
      },
      {
        name: "Upload",
        description: "File upload and management operations",
      },
      {
        name: "Reports",
        description: "Statistics and reporting (Admin only)",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"],
}

const specs = swaggerJsdoc(options)

const swaggerSetup = (app) => {
  // Custom CSS for better styling
  const customCss = `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0 }
    .swagger-ui .info .title { color: #3b82f6 }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0 }
    .swagger-ui .auth-wrapper { margin: 20px 0 }
  `

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss,
      customSiteTitle: "Rayqube AI API Documentation",
      customfavIcon: "/favicon.ico",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "none",
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
      },
    }),
  )

  // JSON endpoint for the OpenAPI spec
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.send(specs)
  })

  // Health check with API info
  app.get("/api/info", (req, res) => {
    res.json({
      name: "Rayqube AI Test API",
      version: "1.0.0",
      description: "Backend API for Rayqube AI Test application",
      documentation: `${req.protocol}://${req.get("host")}/api-docs`,
      endpoints: {
        health: "/health",
        auth: "/api/auth",
        users: "/api/users",
        upload: "/api/upload",
        reports: "/api/reports",
      },
      features: [
        "JWT Authentication",
        "File Upload to AWS S3",
        "QR Code Generation",
        "User Management",
        "Statistics & Reporting",
      ],
    })
  })
}

module.exports = swaggerSetup
