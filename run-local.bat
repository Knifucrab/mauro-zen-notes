@echo off
setlocal enabledelayedexpansion

title Starting Notes Application

echo.
echo ========================================
echo   STARTING NOTES APPLICATION
echo ========================================
echo.

REM Get the directory where the batch file is located
set "PROJECT_DIR=%~dp0"

REM Check Node.js
echo [1/5] Checking Node.js installation...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js first.
    echo Download from: https://nodejs.org
    echo Press any key to continue...
    pause >nul
    goto :eof
)
echo Node.js found!

REM Check npm
echo [2/5] Checking npm installation...
where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found. Please install npm first.
    echo Press any key to continue...
    pause >nul
    goto :eof
)
echo npm found!

echo.
echo [3/5] Installing dependencies...

REM Install backend dependencies
echo Installing backend dependencies...
cd /d "%PROJECT_DIR%backend"
if not exist node_modules (
    echo Running npm install in backend...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install backend dependencies
        pause
        goto :eof
    )
) else (
    echo Backend dependencies already installed
)

REM Install frontend dependencies
echo Installing frontend dependencies...
cd /d "%PROJECT_DIR%frontend"
if not exist node_modules (
    echo Running npm install in frontend...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies
        pause
        goto :eof
    )
) else (
    echo Frontend dependencies already installed
)

echo.
echo [4/5] Setting up database...
cd /d "%PROJECT_DIR%backend"
if exist "package.json" (
    findstr /c:"setup-db" package.json >nul
    if not errorlevel 1 (
        echo Setting up database...
        call npm run setup-db
    ) else (
        echo No database setup script found, skipping...
    )
)

echo.
echo [5/5] Starting servers...
echo.
echo Backend will be available at: http://localhost:3000
echo Frontend will be available at: http://localhost:5173
echo.

REM Start backend server
echo Starting backend server...
cd /d "%PROJECT_DIR%backend"
start "Notes App - Backend Server" cmd /k "echo Backend Server Starting... && npm run dev"

REM Wait 3 seconds for backend to start
echo Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak >nul

REM Start frontend server
echo Starting frontend server...
cd /d "%PROJECT_DIR%frontend"
start "Notes App - Frontend Server" cmd /k "echo Frontend Server Starting... && npm run dev"

echo.
echo ========================================
echo   APPLICATIONS STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Open your browser and go to: http://localhost:5173
echo.
echo To stop the servers, close the terminal windows that opened.
echo.
echo Press any key to exit this launcher...
pause >nul
