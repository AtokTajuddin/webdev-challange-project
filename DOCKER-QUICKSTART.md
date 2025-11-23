# Docker Quick Start Guide

Get ChainPub running in **under 2 minutes** with Docker!

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Nothing else needed! No Node.js, MongoDB, or Bun required.

## 🚀 One-Command Start

### Windows (PowerShell)

```powershell
.\docker-start.ps1
```

### Linux/Mac

```bash
chmod +x docker-start.sh
./docker-start.sh
```

### Manual Start

```bash
# Without blockchain (recommended for first-time users)
docker-compose up -d --build

# With blockchain support (Anvil)
docker-compose --profile blockchain up -d --build
```

## Access the Application

Once started, open your browser:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017
- **Anvil** (if enabled): http://localhost:8545

## Useful Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongodb
```

### Check Status

```bash
docker-compose ps
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Or use the script
.\docker-stop.ps1
```

### Restart Services

```bash
docker-compose restart
```

### Clean Everything (including data)

```bash
# Stop and remove volumes (MongoDB data, uploads)
docker-compose down -v

# Remove all images
docker-compose down --rmi all
```

## Configuration

Edit `.env` file to customize settings:

```env
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=80
```

## Troubleshooting

### Port Already in Use

If port 80 is already in use, change it in `docker-compose.yml`:

```yaml
frontend:
  ports:
    - "8080:80" # Change to any available port
```

### Services Won't Start

```bash
# Check Docker is running
docker info

# View detailed logs
docker-compose logs

# Rebuild everything
docker-compose down
docker-compose up -d --build --force-recreate
```

### Clear Everything and Start Fresh

```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## What's Running?

The Docker setup includes:

1. **MongoDB** - Database for storing publications
2. **Backend** - Express API (Bun runtime)
3. **Frontend** - React app served by Nginx
4. **Anvil** (optional) - Local blockchain testnet

All services are connected via `chainpub-network` and persist data in Docker volumes.

## First-Time User Flow

1. Run `.\docker-start.ps1` (or `docker-compose up -d`)
2. Wait ~30 seconds for services to start
3. Open http://localhost
4. Register a new account
5. Upload your first publication
6. Done!

## Blockchain Features (Optional)

To enable blockchain features:

1. Start with blockchain profile:

   ```bash
   docker-compose --profile blockchain up -d
   ```

2. Deploy the smart contract:

   ```bash
   # Install Foundry (one-time)
   curl -L https://foundry.paradigm.xyz | bash
   foundryup

   # Deploy contract
   forge script script/DeployIPRegistry.s.sol:DeployIPRegistry \
     --rpc-url http://localhost:8545 \
     --broadcast \
     --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

3. Update `frontend/src/pages/Upload.jsx` with the deployed contract address

## Tips

- **First start** takes longer (building images)
- **Subsequent starts** are much faster
- Data persists in Docker volumes
- Use `docker-compose logs -f` to debug issues
- Containers auto-restart unless stopped

## Need Help?

Check the main [README.md](./README.md) for detailed documentation.
