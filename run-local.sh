#!/bin/bash

echo "Starting Full Stack Notes Application..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Install Node.js first."
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "npm not found. Install npm first."
    exit 1
fi

echo "Installing dependencies..."

# Backend
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Frontend
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

cd ..

echo "Setting up database..."
cd backend
npm run setup-db

echo "Starting servers..."
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173"

cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
cd backend
npm run dev &
BACKEND_PID=$!

sleep 3

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Applications started. Open http://localhost:5173"
echo "Press Ctrl+C to stop"

wait $BACKEND_PID $FRONTEND_PID
