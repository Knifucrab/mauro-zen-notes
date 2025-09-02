# Notes Application Backend

A TypeScript Express backend for a notes application with tagging functionality and user authentication.

## Features

- User authentication with JWT tokens
- CRUD operations for notes
- Tag system with color coding
- Note archiving/unarchiving
- SQLite database with TypeORM

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. The server will run on `http://localhost:3000`

### Default User Credentials

For testing purposes, a default user is available:

- **Username:** `admin`
- **Password:** `password123`

To create the default user, make a POST request to `/auth/setup-default-user` or it will be created automatically on first run.

## API Endpoints

### Authentication

- `POST /auth/login` - Login with username and password
- `POST /auth/setup-default-user` - Create default user (admin/password123)

### Notes (Protected Routes - Require Authentication)

- `GET /notes` - Get all notes with tags
- `GET /notes/:id` - Get specific note
- `POST /notes` - Create note (optional tagIds array, max 4 tags)
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note
- `POST /notes/:id/archive` - Archive note
- `POST /notes/:id/unarchive` - Unarchive note
- `POST /notes/:id/tags` - Add tag to note
- `DELETE /notes/:id/tags/:tagId` - Remove tag from note

### Tags (Protected Routes - Require Authentication)

- `GET /tags` - Get all tags
- `GET /tags/:id` - Get specific tag
- `POST /tags` - Create tag (name max 20 chars, color required)
- `PUT /tags/:id` - Update tag
- `DELETE /tags/:id` - Delete tag

## Authentication

All note and tag routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Database

Uses SQLite with TypeORM. Database file: `notes.sqlite`

## Build

```bash
npm run build
```

The built files will be in the `dist/` directory.
