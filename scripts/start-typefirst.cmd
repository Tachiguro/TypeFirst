@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%.."
if errorlevel 1 (
    echo [ERROR] Failed to navigate to repository root.
    pause
    exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not found in PATH.
    echo Please install Node.js from https://nodejs.org/ to run TypeFirst locally.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [ERROR] node_modules directory was not found.
    echo Please install dependencies first with: pnpm install
    pause
    exit /b 1
)

echo Starting TypeFirst local development server...
echo Base URL: /TypeFirst/
echo.

where pnpm >nul 2>&1
if not errorlevel 1 (
    call pnpm run dev --open
    goto :handle_exit
)

where corepack >nul 2>&1
if not errorlevel 1 (
    call corepack pnpm run dev --open
    goto :handle_exit
)

where npm >nul 2>&1
if not errorlevel 1 (
    call npm run dev -- --open
    goto :handle_exit
)

echo [ERROR] Neither pnpm nor npm was found in PATH.
pause
exit /b 1

:handle_exit
if errorlevel 1 (
    echo.
    echo [ERROR] Development server exited with code %errorlevel%.
    pause
    exit /b %errorlevel%
)
