# Notes Application

A note-taking web application built with React, TypeScript, Node.js, and Express. Create, edit, delete, and search notes with a clean interface.

## Features

- Create notes with title and description
- Edit and delete notes
- Archive and unarchive notes
- Search notes by title or description
- Expandable note view
- Database persistence

## Tech Stack

**Frontend**: React 18, TypeScript, Vite, Tailwind CSS
**Backend**: Node.js, Express, TypeScript, SQLite, TypeORM

## Quick Start

### Prerequisites

- Node.js v16+
- npm v7+

### Run Locally

**Unix/macOS/Linux:**
```bash
chmod +x run-local.sh
./run-local.sh
```

**Windows:**
```cmd
run-local.bat
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Use these build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`
   - **Root Directory**: Leave empty (uses vercel.json)
3. Or use the deploy script:
   ```bash
   chmod +x deploy-vercel.sh
   ./deploy-vercel.sh
   ```

### Manual Setup

1. Clone repository
2. Backend setup:
   ```bash
   cd backend
   npm install
   npm run setup-db
   npm run dev
   ```
3. Frontend setup:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Access at http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /notes | Get all notes |
| POST | /notes | Create note |
| PUT | /notes/:id | Update note |
| DELETE | /notes/:id | Delete note |
| POST | /notes/:id/archive | Archive note |
| POST | /notes/:id/unarchive | Unarchive note |

## Database Schema

**Notes Table:**
- id: Primary key
- title: Note title
- description: Note content
- creationDate: Creation timestamp
- archived: Archive status

## Troubleshooting

- **CORS errors**: Ensure backend is running
- **Port conflicts**: Check ports 3000 and 5173 are free
- **Database issues**: Run `npm run setup-db` in backend
- **Module errors**: Delete node_modules and reinstall

## Project Structure

```
frontend/          # React app
backend/           # Express API
run-local.sh       # Start script (Unix)
run-local.bat      # Start script (Windows)
```

Built with React, TypeScript, Node.js, and Express.
