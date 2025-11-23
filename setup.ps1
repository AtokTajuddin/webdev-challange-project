#!/usr/bin/env pwsh
# ChainPub Setup Script for Windows (PowerShell)
# This script sets up the entire ChainPub development environment

Write-Host "🚀 ChainPub Setup Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if Bun is installed
Write-Host "📦 Checking prerequisites..." -ForegroundColor Yellow
if (!(Get-Command bun -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Bun is not installed!" -ForegroundColor Red
    Write-Host "Please install Bun from: https://bun.sh" -ForegroundColor Yellow
    exit 1
}

# Check if MongoDB is running
Write-Host "🔍 Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoTest = mongosh --eval "db.version()" --quiet 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  MongoDB is not running or not installed" -ForegroundColor Yellow
        Write-Host "Please start MongoDB or install it from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
        Write-Host "Continuing anyway..." -ForegroundColor Yellow
    } else {
        Write-Host "✅ MongoDB is running" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not detect MongoDB" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow

# Install backend dependencies
Write-Host "  → Backend dependencies..." -ForegroundColor Cyan
Set-Location backend
bun install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "  → Frontend dependencies..." -ForegroundColor Cyan
Set-Location ../frontend
bun install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Setup environment files
Write-Host "⚙️  Setting up environment files..." -ForegroundColor Yellow

# Backend .env
if (!(Test-Path "backend/.env")) {
    Write-Host "  → Creating backend/.env" -ForegroundColor Cyan
    @"
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/chainpub

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=3000

# CORS Origin
CORS_ORIGIN=http://localhost:5173
"@ | Out-File -FilePath "backend/.env" -Encoding UTF8
    Write-Host "✅ Created backend/.env" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  backend/.env already exists, skipping" -ForegroundColor Gray
}

# Create uploads directory
if (!(Test-Path "backend/uploads")) {
    Write-Host "  → Creating uploads directory" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path "backend/uploads" | Out-Null
    Write-Host "✅ Created backend/uploads" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "  2. Run: ./start.ps1 (to start both backend and frontend)" -ForegroundColor White
Write-Host "  3. Open: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Edit backend/.env to configure MongoDB connection and JWT secret" -ForegroundColor Cyan
Write-Host ""
