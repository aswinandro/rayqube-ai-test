# Rayqube AI Test Backend API

A comprehensive backend API built with Express.js, PostgreSQL, and AWS S3 integration.

## Features

- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 📁 **File Upload** - PNG file upload to AWS S3 with 10MB limit
- 🔗 **QR Code Generation** - Automatic QR code generation for uploaded files
- 👥 **User Management** - Complete user CRUD operations
- 📊 **Statistics & Reporting** - Comprehensive analytics and reporting
- 📚 **API Documentation** - Complete Swagger/OpenAPI documentation
- 🛡️ **Security** - Rate limiting, CORS, helmet, and input validation
- 🗄️ **Database** - PostgreSQL with proper migrations and models

## Quick Start

### Prerequisites

- Node.js 16+ 
- PostgreSQL 12+
- AWS S3 bucket
- Environment variables configured

### Installation

1. **Install dependencies**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

2. **Configure environment variables**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Run database migrations**
   \`\`\`bash
   npm run migrate
   \`\`\`

4. **Start the server**
   \`\`\`bash
   # Development
   npm run dev
   
   # Production
   npm start
   \`\`\`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:5000/api-docs
- **API Info**: http://localhost:5000/api/info
- **Health Check**: http://localhost:5000/health

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment | No | development |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRE` | JWT expiration time | No | 7d |
| `DB_HOST` | PostgreSQL host | Yes | - |
| `DB_PORT` | PostgreSQL port | No | 5432 |
| `DB_NAME` | Database name | Yes | - |
| `DB_USER` | Database user | Yes | - |
| `DB_PASSWORD` | Database password | Yes | - |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes | - |
| `AWS_REGION` | AWS region | No | us-east-1 |
| `AWS_S3_BUCKET` | S3 bucket name | Yes | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:3000 |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update user profile
- `POST /api/auth/verify-token` - Verify JWT token

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Upload
- `POST /api/upload` - Upload PNG file
- `GET /api/upload/my-uploads` - Get current user's uploads
- `GET /api/upload/:id` - Get upload by ID
- `GET /api/upload/:id/download` - Generate download URL
- `DELETE /api/upload/:id` - Delete upload
- `GET /api/upload/stats` - Get upload statistics

### Reports (Admin only)
- `GET /api/reports/dashboard` - Get dashboard statistics
- `GET /api/reports/uploads-by-date` - Get uploads by date range

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Required)
- `email` (VARCHAR, Unique, Required)
- `phone` (VARCHAR, Required)
- `password_hash` (VARCHAR)
- `role` (VARCHAR, Default: 'user')
- `is_active` (BOOLEAN, Default: true)
- `email_verified` (BOOLEAN, Default: false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Uploads Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `filename` (VARCHAR, Required)
- `original_filename` (VARCHAR, Required)
- `file_size` (INTEGER, Required)
- `mime_type` (VARCHAR, Required)
- `file_url` (TEXT, Required)
- `qr_code_url` (TEXT)
- `s3_bucket` (VARCHAR)
- `s3_key` (VARCHAR)
- `upload_status` (VARCHAR, Default: 'completed')
- `metadata` (JSONB)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Sessions Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `token_hash` (VARCHAR, Required)
- `expires_at` (TIMESTAMP, Required)
- `ip_address` (INET)
- `user_agent` (TEXT)
- `is_active` (BOOLEAN, Default: true)
- `created_at` (TIMESTAMP)

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **JWT Authentication**: Secure token-based auth
- **File Validation**: PNG files only, 10MB limit
- **SQL Injection Protection**: Parameterized queries

## File Upload Process

1. **Validation**: Check file type (PNG only) and size (max 10MB)
2. **S3 Upload**: Upload file to AWS S3 with unique filename
3. **QR Generation**: Generate QR code containing file URL
4. **Database Record**: Save upload metadata to PostgreSQL
5. **Response**: Return upload details including QR code URL

## Error Handling

All endpoints return consistent error responses:

\`\`\`json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
\`\`\`

## Testing

\`\`\`bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
\`\`\`

## Deployment

### Docker
\`\`\`bash
# Build image
docker build -t rayqube-backend .

# Run container
docker run -p 5000:5000 --env-file .env rayqube-backend
\`\`\`

### Manual Deployment
1. Set environment variables
2. Run database migrations
3. Start the application with `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
