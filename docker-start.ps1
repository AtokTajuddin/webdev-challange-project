#!/usr/bin/env pwsh
# Quick Docker Start Script for ChainPub
# This script starts the entire application with one command

Write-Host "🚀 Starting ChainPub with Docker..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Create .env if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✓ .env file created" -ForegroundColor Green
}

# Ask user if they want blockchain features
Write-Host ""
$useBlockchain = Read-Host "Do you want to enable blockchain features (Anvil)? (y/N)"

if ($useBlockchain -eq "y" -or $useBlockchain -eq "Y") {
    Write-Host ""
    Write-Host "🔗 Starting with blockchain support..." -ForegroundColor Cyan
    docker-compose --profile blockchain up -d --build
} else {
    Write-Host ""
    Write-Host "📦 Starting without blockchain..." -ForegroundColor Cyan
    docker-compose up -d --build
}

# Wait for services to be ready
Write-Host ""
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service status
Write-Host ""
Write-Host "📊 Service Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "✨ ChainPub is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access the application at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3000" -ForegroundColor White
Write-Host "   MongoDB:  mongodb://localhost:27017" -ForegroundColor White
if ($useBlockchain -eq "y" -or $useBlockchain -eq "Y") {
    Write-Host "   Anvil:    http://localhost:8545" -ForegroundColor White
}
Write-Host ""
Write-Host "📝 To view logs: docker-compose logs -f" -ForegroundColor Yellow
Write-Host "🛑 To stop:      docker-compose down" -ForegroundColor Yellow
Write-Host ""
