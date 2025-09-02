#!/bin/bash

echo "Deploying to Vercel..."

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo "Installing dependencies..."

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

cd ..

echo "Building frontend..."
cd frontend
npm run build

echo "Deploying to Vercel..."
cd ..

# Deploy backend
echo "Deploying backend..."
cd backend
vercel --prod

# Deploy frontend
echo "Deploying frontend..."
cd ../frontend
vercel --prod

echo "Deployment completed. Check Vercel dashboard for URLs."
