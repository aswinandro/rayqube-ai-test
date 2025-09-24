# Rayqube AI Test - Full Stack Application

A complete full-stack application with separate backend and frontend, featuring file upload to AWS S3, QR code generation, and user management.

## Architecture

\`\`\`
rayqube-ai-test/
├── backend/          # Express.js API server
├── frontend/         # Next.js React application
├── docker-compose.yml
└── README.md
\`\`\`

## Features

### Backend (Express.js + PostgreSQL)
- 🔐 JWT Authentication
- 📁 File Upload to AWS S3 (PNG only, 10MB max)
- 🔗 Automatic QR Code Generation
- 👥 User Management
- 📊 Statistics & Analytics
- 📚 Swagger API Documentation
- 🛡️ Security (Rate limiting, CORS, Helmet)

### Frontend (Next.js + React)
- ⚡ Modern React with TypeScript
- 🎨 Tailwind CSS for styling
- 🔄 React Query for data fetching
- 🗄️ Zustand for state management
- 📱 Responsive design
- 🔐 Protected routes

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- AWS S3 bucket
- Docker (optional)

### Option 1: Docker Compose (Recommended)

1. **Clone and setup**
   \`\`\`bash
   git clone <repository>
   cd rayqube-ai-test
   \`\`\`

2. **Configure environment**
   \`\`\`bash
   cp backend/.env.example backend/.env.local
   cp frontend/.env.example frontend/.env.local
   # Edit the .env.local files with your AWS credentials
   \`\`\`

3. **Start with Docker**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

4. **Run database migrations**
   \`\`\`bash
   docker-compose exec backend npm run migrate
   \`\`\`

### Option 2: Manual Setup

#### Backend Setup
\`\`\`bash
cd backend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run migrate
npm run dev
\`\`\`

#### Frontend Setup
\`\`\`bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
\`\`\`

## Environment Variables

### Backend (.env.local)
\`\`\`env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-jwt-secret
DB_HOST=localhost
DB_NAME=rayqube_dev
DB_USER=postgres
DB_PASSWORD=your-password
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-bucket-name
\`\`\`

### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Rayqube AI Test
NEXT_PUBLIC_AWS_S3_BUCKET=your-bucket-name
\`\`\`

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:5000/api-docs
- **API Info**: http://localhost:5000/api/info
- **Health Check**: http://localhost:5000/health

## Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

## Database Schema

### Users
- Authentication and profile management
- Role-based access control (user/admin)

### Uploads
- File metadata and S3 references
- QR code URLs and metadata
- User associations

### Sessions
- JWT token management
- Session tracking and security

## Development

### Backend Development
\`\`\`bash
cd backend
npm run dev          # Start development server
npm run migrate      # Run database migrations
npm test            # Run tests
\`\`\`

### Frontend Development
\`\`\`bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run lint        # Run linting
\`\`\`

## Production Deployment

### Backend
1. Set production environment variables
2. Run database migrations
3. Build and deploy to your server
4. Configure reverse proxy (nginx)

### Frontend
1. Set production environment variables
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or your hosting provider

### Docker Production
\`\`\`bash
# Build production images
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## Security Features

- JWT token authentication
- Rate limiting (100 requests/15min)
- CORS protection
- Input validation with Joi
- SQL injection protection
- File type validation
- Secure headers with Helmet

## File Upload Process

1. **Frontend**: User selects PNG file (max 10MB)
2. **Validation**: File type and size validation
3. **Upload**: File sent to backend API
4. **S3 Storage**: File uploaded to AWS S3
5. **QR Generation**: QR code created with file URL
6. **Database**: Upload metadata saved
7. **Response**: File URL and QR code returned

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile

### File Upload
- `POST /api/upload` - Upload file
- `GET /api/upload/my-uploads` - Get user uploads
- `GET /api/upload/:id/download` - Get download URL
- `DELETE /api/upload/:id` - Delete upload

### Admin (Admin only)
- `GET /api/users` - Get all users
- `GET /api/reports/dashboard` - Dashboard stats

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
