# API Testing Examples

Test these endpoints with tools like Postman, Insomnia, or curl.

## Base URL
- Local: `http://localhost:3000`
- Production: `https://your-api-url.vercel.app`

## 1. Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-21T10:30:00.000Z",
  "uptime": 1234.567
}
```

## 2. Create Default Admin User
```bash
POST /api/auth/create-default-user
```

Response:
```json
{
  "message": "Default admin user created successfully",
  "data": {
    "username": "admin",
    "id": "cm123456789",
    "createdAt": "2025-01-21T10:30:00.000Z"
  },
  "credentials": {
    "username": "admin",
    "password": "password123"
  }
}
```

## 3. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": "cm123456789",
      "username": "admin",
      "createdAt": "2025-01-21T10:30:00.000Z",
      "updatedAt": "2025-01-21T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 4. Get Notes (Authenticated)
```bash
GET /api/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
{
  "message": "Notes retrieved successfully",
  "data": [
    {
      "id": "cm123456789",
      "title": "Welcome to Zen Notes",
      "content": "This is your first note...",
      "createdAt": "2025-01-21T10:30:00.000Z",
      "updatedAt": "2025-01-21T10:30:00.000Z",
      "tags": [
        {
          "id": "cm123456789",
          "name": "Personal",
          "color": "#10B981"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

## 5. Create Note (Authenticated)
```bash
POST /api/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "My New Note",
  "content": "This is the content of my note.",
  "tagIds": ["cm123456789"]
}
```

## 6. Get Tags
```bash
GET /api/tags
```

Response:
```json
{
  "message": "Tags retrieved successfully",
  "data": [
    {
      "id": "cm123456789",
      "name": "Work",
      "color": "#3B82F6",
      "createdAt": "2025-01-21T10:30:00.000Z",
      "_count": {
        "notes": 2
      }
    }
  ]
}
```

## 7. Create Tag (Authenticated)
```bash
POST /api/tags
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Urgent",
  "color": "#EF4444"
}
```

## 8. Search Notes (Authenticated)
```bash
GET /api/notes/search?q=welcome&page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 9. Get Notes by Tag (Authenticated)
```bash
GET /api/notes/by-tag/cm123456789
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 10. Get User Profile (Authenticated)
```bash
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Title is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Access token is required"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Note not found"
}
```

### 409 Conflict
```json
{
  "error": "Conflict",
  "message": "Username already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

## cURL Examples

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### Create Note
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Note",
    "content": "Note content here"
  }'
```

### Get Notes
```bash
curl -X GET http://localhost:3000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
