#!/usr/bin/env pwsh
# Simple Docker Run Script for ChainPub
# Works with Docker CLI (no Docker Desktop needed)

Write-Host "🚀 Starting ChainPub with Docker..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is available
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    $null = docker --version
    Write-Host "✓ Docker CLI is available" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Docker:" -ForegroundColor Yellow
    Write-Host "  Windows: https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor White
    Write-Host "  Linux:   https://docs.docker.com/engine/install/" -ForegroundColor White
    exit 1
}

# Check if Docker daemon is running
Write-Host "Checking Docker daemon..." -ForegroundColor Yellow
try {
    $null = docker ps 2>&1
    Write-Host "✓ Docker daemon is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker daemon is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start Docker:" -ForegroundColor Yellow
    Write-Host "  Windows: Start Docker Desktop" -ForegroundColor White
    Write-Host "  Linux:   sudo systemctl start docker" -ForegroundColor White
    exit 1
}

# Create .env if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✓ .env file created" -ForegroundColor Green
}

# Build and start containers
Write-Host ""
Write-Host "📦 Building and starting containers..." -ForegroundColor Cyan
Write-Host "This may take a few minutes on first run..." -ForegroundColor Yellow
Write-Host ""

docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✨ ChainPub is starting!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
    
    Write-Host ""
    Write-Host "📊 Service Status:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host ""
    Write-Host "🌐 Access the application:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:3000" -ForegroundColor White
    Write-Host "   MongoDB:  mongodb://localhost:27017" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Useful commands:" -ForegroundColor Yellow
    Write-Host "   View logs:    docker-compose logs -f" -ForegroundColor White
    Write-Host "   Stop:         docker-compose down" -ForegroundColor White
    Write-Host "   Restart:      docker-compose restart" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Failed to start containers" -ForegroundColor Red
    Write-Host "Check the error messages above" -ForegroundColor Yellow
    exit 1
}
