# ChainPub - Blockchain Publication Registry

# Latar Belakang Pengembangan Sistem

Dalam ekosistem digital yang serba terbuka saat ini, kemudahan akses informasi membawa dampak ganda. Di satu sisi, distribusi pengetahuan menjadi sangat cepat, namun di sisi lain, perlindungan terhadap Hak Kekayaan Intelektual (HKI) menjadi semakin rentan. Masalah mendasar yang sering dihadapi oleh peneliti, seniman, dan kreator independen adalah sulitnya membuktikan otentisitas dan waktu kepemilikan (proof of ownership) sebuah karya ketika terjadi sengketa atau plagiarisme.

Mekanisme pendaftaran hak cipta konvensional seringkali terkendala oleh proses birokrasi yang panjang, biaya yang relatif tinggi, serta sistem validasi yang bersifat terpusat (sentralis). Hal ini menciptakan celah di mana sebuah ide atau temuan dapat diklaim oleh pihak lain yang memiliki akses legalitas lebih cepat, bukan oleh mereka yang menemukannya pertama kali. Selain itu, dalam budaya riset dan pengembangan (R&D), inovasi seringkali lahir dari pengembangan karya sebelumnya. Sayangnya, referensi terhadap karya induk seringkali terputus atau sengaja dihilangkan, sehingga kredit terhadap inisiator awal menjadi kabur.

Berdasarkan permasalahan tersebut, proyek ini dikembangkan dengan pendekatan teknologi Web3 dan Blockchain, bukan sebagai alat transaksi finansial, melainkan sebagai infrastruktur pembuktian digital (Digital Provenance).

Filosofi teknis yang diangkat dalam sistem ini berlandaskan pada dua prinsip utama:

Immutability sebagai Bukti Waktu:

Blockchain dimanfaatkan fungsinya sebagai Timestamp Server yang bersifat kekal dan tidak dapat dimanipulasi. Dengan menyimpan sidik jari digital (cryptographic hash) dari sebuah dokumen ke dalam jaringan blockchain, kita menciptakan bukti matematis yang tak terbantahkan bahwa sebuah dokumen eksis pada waktu tertentu dan dimiliki oleh entitas tertentu. Ini menghilangkan kebutuhan akan pihak ketiga (middleman) untuk memvalidasi keaslian.

Transparansi Silsilah Karya (Chain of Custody):

Sistem ini mengadopsi mekanisme Forking (percabangan) untuk memfasilitasi inovasi berkelanjutan. Pengembangan sebuah karya diperbolehkan dan didukung, selama rekam jejak yang menghubungkan karya turunan dengan karya aslinya tetap tercatat dalam smart contract. Hal ini memastikan bahwa orisinalitas tetap dihargai tanpa menghambat laju inovasi, menciptakan ekosistem kekayaan intelektual yang lebih transparan, berkeadilan, dan terdesentralisasi.

---

## Quick Start (Docker - 1 Command!)

### Windows

```powershell
.\docker-start.ps1
```

### Linux/Mac

```bash
chmod +x docker-start.sh
./docker-start.sh
```

**That's it!** Open http://localhost in your browser.

> **No installation needed** - Docker handles MongoDB, Backend, and Frontend automatically!
>
> See [DOCKER-QUICKSTART.md](./DOCKER-QUICKSTART.md) for detailed Docker instructions.

### Manual Docker Start (Recommended)

```bash
# Without blockchain (recommended for testing)
docker-compose up -d --build

# With blockchain support (Anvil)
docker-compose --profile blockchain up -d --build

# For check docker status
docker-compose ps
docker-compose logs -f

# For stop docker compose
docker-compose down
```

**Access:**

- Frontend: http://localhost
- Backend API: http://localhost:3000
- MongoDB: mongodb://localhost:27017

### Option 2: Local Development Setup

**Prerequisites:**

- [Bun](https://bun.sh) (JavaScript runtime)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Foundry](https://getfoundry.sh) (optional, for blockchain features)

**Setup:**

```powershell
# 1. Run setup script
./setup.ps1

# 2. Start MongoDB (if not already running)
mongod

# 3. Start the application
./start.ps1

# Access the app at:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
```

**Manual Start:**

```powershell
# Terminal 1 - Backend
cd backend
bun install
bun run dev

# Terminal 2 - Frontend
cd frontend
bun install
bun run dev

# Terminal 3 - Blockchain (optional)
anvil
```

## 📁 Project Structure

```
webdev-challange/
├── backend/              # Express + MongoDB API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, upload, etc.
│   │   └── utils/        # Validators, helpers
│   ├── uploads/          # Uploaded files
│   └── Dockerfile
├── frontend/             # React + Vite app
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Route pages
│   │   ├── context/      # React context
│   │   └── services/     # API client
│   ├── nginx.conf
│   └── Dockerfile
├── contracts/            # Solidity smart contracts
│   └── IPRegistry.sol
├── script/               # Foundry deployment scripts
├── docker-compose.yml    # Docker orchestration
├── setup.ps1            # Setup script
└── start.ps1            # Start script
```

## Features

- **User Authentication** - JWT-based auth with secure password hashing
- **File Upload** - Upload documents/images with SHA-256 hashing
- **Blockchain Integration** - Register works on-chain (Anvil/testnet)
- **Public Gallery** - Browse all registered works
- **Beam Carousel** - Animated card viewer with scanner effect
- **Work Details** - View full information and blockchain proof
- **Fork Works** - Create derivative works with parent linking
- **Search** - Filter works by title, creator, or hash
- **Responsive UI** - Modern glassmorphism design with Tailwind CSS

## Configuration

### Backend (.env)

```env
MONGODB_URI=mongodb://localhost:27017/chainpub
JWT_SECRET=your-secret-key
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (src/services/api.js)

```javascript
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});
```

### Smart Contract (frontend/src/pages/Upload.jsx)

```javascript
const CONTRACT_ADDRESS = "0x..."; // After deployment
const DEMO_MODE = true; // Set false for real blockchain
```

## Docker Commands

```powershell
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Start with blockchain
docker-compose --profile blockchain up -d

# Remove all data (reset)
docker-compose down -v
```

## Testing Upload Feature

1. Go to http://localhost:5173/auth and register/login
2. Navigate to Upload page
3. Fill in:
   - Title (min 3 chars)
   - Description (min 3 chars)
   - Select a file
4. Click "Register to Blockchain"
5. View your work in the Gallery

## Security Features

- Helmet.js for HTTP security headers
- Rate limiting on auth endpoints
- JWT token authentication
- Password hashing with bcrypt
- Input validation with Zod
- File type restrictions
- CORS protection

## Development Scripts

**Backend:**

```powershell
cd backend
bun run dev          # Start dev server
bun run start        # Start production server
```

**Frontend:**

```powershell
cd frontend
bun run dev          # Start dev server
bun run build        # Build for production
bun run preview      # Preview production build
```

**Blockchain:**

```powershell
anvil                              # Start local blockchain
forge script script/Deploy...sol  # Deploy contract
```

## API Endpoints

### Auth

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Works

- `GET /api/works` - List all works
- `GET /api/works/:id` - Get single work
- `POST /api/works` - Upload new work (auth required)
- `POST /api/works/confirm` - Confirm blockchain tx (auth required)
- `DELETE /api/works/:id` - Delete work (auth required)

## Troubleshooting

**MongoDB connection failed:**

- Make sure MongoDB is running: `mongod`
- Check connection string in `.env`

**Port already in use:**

- Backend: Change `PORT` in backend/.env
- Frontend: Vite will auto-select another port

**Upload fails:**

- Check backend/uploads directory exists
- Verify file size < 10MB
- Check description is >= 3 characters

**Docker build fails:**

- Run: `docker-compose down -v`
- Delete node_modules folders
- Run: `docker-compose up -d --build`

## Production Deployment

1. Set strong `JWT_SECRET` in `.env`
2. Change `MONGODB_URI` to production database
3. Update `CORS_ORIGIN` to your domain
4. Set `NODE_ENV=production`
5. Build and deploy with Docker:
   ```powershell
   docker-compose -f docker-compose.yml up -d
   ```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Credits

- Beam animation inspired from BL/S® Studio [BL/S® Studio](https://codepen.io/blacklead-studio/pen/xbwaqxE)
- Built with React, Express, MongoDB, and Foundry
