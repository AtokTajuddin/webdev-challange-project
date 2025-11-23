#!/usr/bin/env pwsh
# ChainPub Start Script for Windows (PowerShell)
# Starts backend and frontend development servers

Write-Host "🚀 Starting ChainPub..." -ForegroundColor Cyan
Write-Host ""

# Check if setup was run
if (!(Test-Path "backend/node_modules") -or !(Test-Path "frontend/node_modules")) {
    Write-Host "❌ Dependencies not installed!" -ForegroundColor Red
    Write-Host "Please run: ./setup.ps1 first" -ForegroundColor Yellow
    exit 1
}

# Check if MongoDB is running
Write-Host "🔍 Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoTest = mongosh --eval "db.version()" --quiet 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  MongoDB is not running!" -ForegroundColor Red
        Write-Host "Please start MongoDB before continuing" -ForegroundColor Yellow
        $response = Read-Host "Continue anyway? (y/N)"
        if ($response -ne "y" -and $response -ne "Y") {
            exit 1
        }
    } else {
        Write-Host "✅ MongoDB is running" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not detect MongoDB" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Starting servers..." -ForegroundColor Yellow
Write-Host ""

# Function to start a process and keep it running
function Start-DevServer {
    param (
        [string]$Name,
        [string]$Path,
        [string]$Command,
        [string]$Color
    )
    
    Write-Host "  → Starting $Name server..." -ForegroundColor $Color
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Path'; Write-Host '🚀 $Name Server' -ForegroundColor $Color; $Command"
}

# Start backend server
Start-DevServer -Name "Backend" -Path "$PWD/backend" -Command "bun run dev" -Color "Green"
Start-Sleep -Seconds 2

# Start frontend server
Start-DevServer -Name "Frontend" -Path "$PWD/frontend" -Command "bun run dev" -Color "Cyan"

Write-Host ""
Write-Host "✅ Servers started!" -ForegroundColor Green
Write-Host ""
Write-Host "📡 Backend:  http://localhost:3000" -ForegroundColor Green
Write-Host "🎨 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tip: Close the PowerShell windows to stop the servers" -ForegroundColor Yellow
Write-Host ""
