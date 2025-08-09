# EcoPay - Team Luffy

Full-stack project (frontend + backend) for EcoPay — a green wallet for recyclables.

## Quick start (development)

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET (optional)
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Notes
- Backend will use MongoDB if `MONGO_URI` is provided in `.env`. If not provided, it will run with an in-memory fallback for demo purposes.
- API docs (Swagger) are available at `http://localhost:5000/api-docs` when the backend runs.
- The frontend expects the backend API at `http://localhost:5000` by default.
