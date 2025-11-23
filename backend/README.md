# Web Gallery Backend

Secure Express + MongoDB backend with authentication, file uploads, and CRUD operations.

## Features

- ✅ JWT Authentication (Register/Login)
- ✅ Password hashing with bcrypt
- ✅ File upload with multer (images/PDFs)
- ✅ MongoDB data persistence
- ✅ Security headers (Helmet)
- ✅ Rate limiting (DDoS protection)
- ✅ Input validation (Zod)
- ✅ TypeScript support

## Setup

### Prerequisites

- Bun installed
- MongoDB running on `localhost:27017`

### Installation

```bash
cd backend
bun install
```

### Configuration

Create `.env` file (already exists):

```
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/webdev
PORT=3000
UPLOAD_DIR=uploads
```

### Run

```bash
bun run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Works (Protected)

- `GET /api/works` - List all works
- `POST /api/works` - Create work (requires auth + file)
- `DELETE /api/works/:id` - Delete work (owner only)

### Static Files

- `GET /uploads/:filename` - Serve uploaded files

## Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Max 100 requests per 15 min
- **Input Validation**: Zod schemas
- **SQL Injection Prevention**: Mongoose parameterized queries
- **JWT Expiry**: Tokens expire after 1 hour
- **File Upload Limits**: Max 100MB, type filtering

## Testing

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create Work (with token from login)
curl -X POST http://localhost:3000/api/works \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=My Artwork" \
  -F "description=This is my research" \
  -F "file=@/path/to/image.jpg"
```
