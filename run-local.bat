@echo off

echo Starting Full Stack Notes Application...

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js not found. Install Node.js first.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo npm not found. Install npm first.
    pause
    exit /b 1
)

echo Installing dependencies...

cd backend
if not exist node_modules (
    call npm install
)

cd ..\frontend
if not exist node_modules (
    call npm install
)

cd ..

echo Setting up database...
cd backend
call npm run setup-db

echo Starting servers...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173

cd backend
start "Backend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

cd ..\frontend
start "Frontend" cmd /k "npm run dev"

echo Applications started. Open http://localhost:5173
pause
