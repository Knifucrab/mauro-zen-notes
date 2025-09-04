# Zen Notes Backend

A REST API for the Zen Notes application built with Node.js, Express, and Prisma. Designed for serverless deployment on Vercel.

## Features

- 🚀 **RESTful API** - Clean and consistent API design
- 🔐 **Authentication** - JWT-based authentication system
- 📝 **Notes Management** - Full CRUD operations for notes
- 🏷️ **Tag System** - Organize notes with customizable tags
- 🔍 **Search & Filter** - Advanced search and filtering capabilities
- 🗄️ **Database** - MySQL database with Prisma ORM
- 📊 **Statistics** - Usage statistics and insights
- 🛡️ **Security** - Rate limiting, CORS, and security headers
- ☁️ **Serverless Ready** - Optimized for Vercel deployment

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (Railway)
- **ORM**: Prisma
- **Authentication**: JWT
- **Deployment**: Vercel (Serverless)

## Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL database (provided Railway connection)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="mysql://root:uHrxMyHkYVCEXRBFwAhyhWfLdubMeJSO@switchyard.proxy.rlwy.net:34332/railway"
JWT_SECRET="your-super-secret-jwt-key"
FRONTEND_URL="https://mauro-zen-notes-frontend.vercel.app"
```

4. Generate Prisma client:
```bash
npm run db:generate
```

5. Push database schema:
```bash
npm run db:push
```

6. Seed the database (optional):
```bash
npm run db:seed
```

### Development

Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### API Documentation

#### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/create-default-user` - Create default admin user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

#### Notes

- `POST /api/notes` - Create a new note
- `GET /api/notes` - Get all user notes (with pagination)
- `GET /api/notes/search` - Search notes
- `GET /api/notes/stats` - Get notes statistics
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/tags/:tagId` - Add tag to note
- `DELETE /api/notes/:id/tags/:tagId` - Remove tag from note
- `GET /api/notes/by-tag/:tagId` - Get notes by tag

#### Tags

- `GET /api/tags` - Get all tags
- `GET /api/tags/colors` - Get color options
- `GET /api/tags/search` - Search tags
- `GET /api/tags/stats` - Get tag statistics
- `GET /api/tags/:id` - Get specific tag
- `POST /api/tags` - Create new tag (authenticated)
- `PUT /api/tags/:id` - Update tag (authenticated)
- `DELETE /api/tags/:id` - Delete tag (authenticated)
- `GET /api/tags/user/my-tags` - Get user's tags
- `GET /api/tags/user/most-used` - Get most used tags

### Database Schema

The application uses the following main entities:

- **User**: Authentication and user management
- **Note**: Main content entity with title, content, and timestamps
- **Tag**: Categorization system with name and color
- **Note-Tag Relation**: Many-to-many relationship

### Default Credentials

After seeding the database, you can login with:
- **Username**: `admin`
- **Password**: `password123`

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Set up environment variables in Vercel:
```bash
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add FRONTEND_URL
```

3. Deploy:
```bash
vercel
```

### Environment Variables for Vercel

Set these in your Vercel dashboard:

- `DATABASE_URL`: Your MySQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Your frontend URL for CORS

## Project Structure

```
backend/
├── api/
│   └── index.js              # Vercel serverless entry point
├── src/
│   ├── config/
│   │   └── database.js       # Database configuration
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware
│   ├── repositories/         # Data access layer
│   ├── routes/              # API routes
│   └── services/            # Business logic
├── scripts/
│   └── seed.js              # Database seeding
├── prisma/
│   └── schema.prisma        # Database schema
├── vercel.json              # Vercel configuration
└── package.json
```

## API Response Format

All API responses follow this consistent format:

```json
{
  "message": "Success message",
  "data": { ... },
  "pagination": { ... } // For paginated endpoints
}
```

Error responses:
```json
{
  "error": "Error Type",
  "message": "Error description"
}
```

## Features in Detail

### Authentication
- JWT-based stateless authentication
- Secure password hashing with bcrypt
- Token refresh mechanism
- Profile management

### Notes Management
- Rich text content support
- Tagging system
- Search and filtering
- Pagination
- Statistics and insights

### Tag System
- Customizable colors
- Usage statistics
- Bulk operations
- Search functionality

### Security
- Rate limiting
- CORS protection
- Security headers with Helmet
- Input validation
- SQL injection protection with Prisma

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
