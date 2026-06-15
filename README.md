# ElderCare Connect

**ElderCare Connect** is a full-stack MERN healthcare platform that connects families with verified caregivers, nurses, and healthcare professionals for in-home elderly care services.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

---

## Features

- **7 Complete Pages**: Home, Services, Caregivers, Booking, User Dashboard, Admin Dashboard, Contact
- **JWT Authentication** with Role-Based Access Control (User / Admin)
- **Booking System** with multi-step form and status tracking
- **Admin Panel** with analytics, user/caregiver/booking management
- **Responsive UI** with professional blue & white healthcare theme
- **Sample Seed Data** for quick demo setup

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js, Vite, Tailwind CSS, Axios |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB with Mongoose               |
| Auth       | JWT + bcrypt password hashing       |

---

## Project Structure

```
eldercare-connect/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── api/               # Axios API layer
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth context (state management)
│   │   ├── pages/             # All 7 pages + auth pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Express Backend
│   ├── config/                # Database connection
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Auth, admin, error middleware
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── utils/                 # Seed data script
│   ├── server.js              # Entry point
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas)

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Setup

**Backend** — copy and configure:
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eldercare-connect
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

**Frontend** — copy and configure:
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database

```bash
cd server
npm run seed
```

### 4. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## Demo Accounts

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@eldercare.com    | admin123  |
| User  | user@eldercare.com     | user123   |

---

## API Endpoints

### Authentication
| Method | Endpoint              | Access    | Description        |
|--------|-----------------------|-----------|--------------------|
| POST   | /api/auth/register    | Public    | Register user      |
| POST   | /api/auth/login       | Public    | Login user         |
| GET    | /api/auth/profile     | Private   | Get profile        |
| PUT    | /api/auth/profile     | Private   | Update profile     |

### Services
| Method | Endpoint              | Access    | Description        |
|--------|-----------------------|-----------|--------------------|
| GET    | /api/services         | Public    | List all services  |
| GET    | /api/services/:id     | Public    | Get service        |

### Caregivers
| Method | Endpoint              | Access    | Description        |
|--------|-----------------------|-----------|--------------------|
| GET    | /api/caregivers       | Public    | List caregivers    |
| GET    | /api/caregivers/:id   | Public    | Get caregiver      |

### Bookings
| Method | Endpoint                  | Access  | Description       |
|--------|---------------------------|---------|-------------------|
| POST   | /api/bookings             | Private | Create booking    |
| GET    | /api/bookings/my          | Private | User's bookings   |
| PUT    | /api/bookings/:id/cancel  | Private | Cancel booking    |

### Admin
| Method | Endpoint                    | Access | Description          |
|--------|-----------------------------|--------|----------------------|
| GET    | /api/admin/stats            | Admin  | Dashboard analytics  |
| GET    | /api/admin/users            | Admin  | List users           |
| GET    | /api/admin/bookings         | Admin  | List all bookings    |
| PUT    | /api/admin/bookings/:id     | Admin  | Update booking status|
| GET    | /api/admin/caregivers       | Admin  | List all caregivers  |

---

## Deployment

### Frontend — Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `client`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend — Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repo, set root directory to `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `server/.env.example`
6. Use MongoDB Atlas for `MONGO_URI`

---

## License

MIT License — free to use for educational and internship projects.
