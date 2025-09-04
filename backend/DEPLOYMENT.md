# Deployment Guide

## Environment Modes

The API supports two deployment modes:

### 🛠️ Development Mode
- **Environment**: `NODE_ENV=development`
- **Server**: Traditional Express server on localhost
- **Database**: Full logging enabled
- **CORS**: Permissive (allows localhost origins)
- **Command**: `npm run dev` or `npm run dev:watch`

### ☁️ Production Mode (Vercel Serverless)
- **Environment**: `NODE_ENV=production` + `VERCEL=true`
- **Server**: Serverless functions
- **Database**: Minimal logging
- **CORS**: Restrictive (production origins only)
- **Deployment**: Automatic via Vercel

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Start Development Server
```bash
# Regular development
npm run dev

# With auto-restart on file changes
npm run dev:watch
```

### 5. Test the API
```bash
npm test
```

## Vercel Deployment Steps

### 1. Environment Variables Setup

Set these in your Vercel project dashboard or via CLI:

```bash
# Required Environment Variables
vercel env add DATABASE_URL production
# Enter: mysql://root:uHrxMyHkYVCEXRBFwAhyhWfLdubMeJSO@switchyard.proxy.rlwy.net:34332/railway

vercel env add JWT_SECRET production  
# Enter: your-super-secret-jwt-key-change-in-production-very-long-and-secure

vercel env add FRONTEND_URL production
# Enter: https://mauro-zen-notes-frontend.vercel.app
```

### 2. Deploy to Vercel

#### Option A: Automatic Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Push changes to main branch
3. Vercel automatically deploys

#### Option B: Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### 3. Post-Deployment Steps

1. **Test the deployment**:
   ```bash
   # Health check
   curl https://your-api-url.vercel.app/health
   ```

2. **Create default user** (if needed):
   ```bash
   curl -X POST https://your-api-url.vercel.app/api/auth/create-default-user
   ```

## API Endpoints

### Base URLs
- **Development**: `http://localhost:3000`
- **Production**: `https://your-project-name.vercel.app`

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/create-default-user` - Create admin user
- `GET /api/auth/profile` - Get user profile (authenticated)

### Notes (All require authentication)
- `GET /api/notes` - List notes with pagination
- `POST /api/notes` - Create note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/search?q=query` - Search notes

### Tags
- `GET /api/tags` - List all tags
- `POST /api/tags` - Create tag (authenticated)
- `PUT /api/tags/:id` - Update tag (authenticated)
- `DELETE /api/tags/:id` - Delete tag (authenticated)

## Environment Detection

The API automatically detects the environment:

```javascript
// In your code
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
const isVercel = process.env.VERCEL;
const isDevelopment = !isProduction && !isVercel;
```

## CORS Configuration

### Development
- Allows: `localhost:3000`, `localhost:3001`, `localhost:5173`
- Purpose: Frontend development servers

### Production  
- Allows: `https://mauro-zen-notes-frontend.vercel.app`
- Purpose: Production frontend only

## Database Configuration

### Development
- Full query logging
- Connection pooling
- Hot reload support

### Production/Vercel
- Minimal logging (errors only)
- Optimized for serverless
- Automatic connection management

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Environment-specific origins
- **Helmet Security Headers**: XSS protection, etc.
- **JWT Authentication**: Stateless auth for serverless
- **Input Validation**: All endpoints validated
- **Password Hashing**: bcrypt with salt rounds

## Monitoring & Debugging

### Development
- Detailed console logs
- Database query logging
- Error stack traces

### Production
- Error logging only
- Vercel function logs
- Performance metrics

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check environment variables
   - Verify frontend URL in CORS config

2. **Database Connection**
   - Ensure DATABASE_URL is correct
   - Check network connectivity
   - Verify database credentials

3. **Environment Variables**
   - Check Vercel dashboard
   - Ensure all required vars are set
   - Use `vercel env ls` to list

4. **Serverless Timeouts**
   - Functions timeout at 10 seconds
   - Optimize database queries
   - Use connection pooling

### Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Database accessible from external networks
- [ ] CORS configured for production frontend
- [ ] JWT secret is secure and long
- [ ] Database schema is up to date
- [ ] Health check endpoint works
- [ ] Authentication flow tested

## Performance Optimization

### Database
- Use connection pooling
- Optimize query performance
- Limit result sets with pagination

### Serverless
- Minimize cold start time
- Use environment-specific configs
- Keep functions under 10-second limit

## Default Credentials

After deployment, create the default user:

```bash
curl -X POST https://your-api-url.vercel.app/api/auth/create-default-user
```

**Credentials**: 
- Username: `admin`
- Password: `password123`

**⚠️ Important**: Change these credentials immediately after first login!
