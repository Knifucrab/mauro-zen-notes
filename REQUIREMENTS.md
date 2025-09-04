# Runtime Requirements

## EASY SETUP

### Windows Users
Double-click `run-local.bat` to start both servers automatically.

### Unix/macOS/Linux Users
Run `./run-local.sh` to start both servers automatically.

The script will:
- Install all dependencies
- Set up the database
- Start backend server on port 3000
- Start frontend server on port 5173
- Open your browser to http://localhost:5173

## System Requirements

### Node.js
- Version: 18.0.0 or higher
- Download: https://nodejs.org

### npm
- Version: 8.0.0 or higher (comes with Node.js)
- Alternative: Use yarn or pnpm

## Backend Dependencies

### Core Runtime
- Node.js: >= 18.0.0
- Express.js: 4.18.2

### Database
- Prisma ORM: 5.7.1
- Prisma Client: 5.7.1
- SQLite (default)

### Security
- CORS: 2.8.5
- Helmet: 7.1.0
- Rate Limiting: 7.1.5
- bcryptjs: 2.4.3
- jsonwebtoken: 9.0.2

### Development Tools
- Nodemon: 3.0.2 (hot reload)

## Frontend Dependencies

### Core Framework
- React: 19.1.1
- React DOM: 19.1.1
- TypeScript: 5.8.3

### Build System
- Vite: 7.1.2
- Vite React Plugin: 5.0.0

### Styling
- Tailwind CSS: 4.1.12
- PostCSS: 8.5.6
- Autoprefixer: 10.4.21

### 3D Graphics
- Three.js: 0.179.1
- React Three Fiber: 9.3.0

### Icons
- React Icons: 5.5.0

### Development Tools
- ESLint: 9.33.0
- TypeScript ESLint: 8.39.1

## Installation Commands

```bash
# Backend
cd backend
npm install

# Frontend  
cd frontend
npm install
```

## Development Commands

```bash
# Start backend server (port 3000)
cd backend
npm run dev

# Start frontend server (port 5173)
cd frontend  
npm run dev
```

## Environment Setup

### Backend Environment Variables
Create `.env` file in backend directory:
```
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_jwt_secret_here
```

### Frontend Environment Variables
Create `.env` file in frontend directory:
```
VITE_API_URL=http://localhost:3000
```

## Browser Support

### Minimum Requirements
- Chrome: 88+
- Firefox: 85+
- Safari: 14+
- Edge: 88+

### Features Used
- ES2020 modules
- CSS Grid
- Fetch API
- WebGL (for 3D features)
