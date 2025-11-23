#!/usr/bin/env pwsh
# Stop ChainPub Docker containers

Write-Host "🛑 Stopping ChainPub..." -ForegroundColor Yellow
docker-compose --profile blockchain down

Write-Host "✓ All services stopped" -ForegroundColor Green
Write-Host ""
Write-Host "To remove all data (MongoDB, uploads), run:" -ForegroundColor Yellow
Write-Host "docker-compose down -v" -ForegroundColor White
