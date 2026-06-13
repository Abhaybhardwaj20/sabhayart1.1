# 🎨 Painting Store — Full Stack Setup Guide

## Project Structure
```
your-project/
├── backend/           ← Express + MongoDB API
│   ├── src/
│   │   ├── config/env.js
│   │   ├── controllers/
│   │   ├── database/mongodb.js
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── uploads/       ← auto-created
│   ├── .env
│   └── package.json
├── frontend/          ← React + Vite
│   ├── src/
│   │   └── services/api.js  ← ADD THIS FILE
│   ├── .env           ← ADD THIS FILE
│   └── vite.config.js ← REPLACE THIS FILE
└── package.json       ← root (optional convenience scripts)
```

---

## ✅ Step 1 — Prerequisites

Make sure you have installed:
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) OR use MongoDB Atlas (free cloud)

---

## ✅ Step 2 — Install Dependencies

```bash
# Install root deps (for concurrently)
npm install

# Install backend deps
cd backend
npm install

# Install frontend deps (already done)
cd ../frontend
npm install
```

---

## ✅ Step 3 — Configure Backend Environment

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/painting-store
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> **Using MongoDB Atlas?**  
> Replace MONGODB_URI with your Atlas connection string:  
> `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/painting-store`

---

## ✅ Step 4 — Configure Frontend Environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ Step 5 — Add Frontend API Service

Copy `api.js` into `frontend/src/services/api.js`

This file handles all backend calls with automatic token injection.

**Usage in your components:**
```javascript
import { paintingAPI, authAPI, orderAPI, userAPI } from '../services/api';

// Fetch paintings
const { data } = await paintingAPI.getAll({ category: 'Abstract', page: 1 });

// Login
const { data } = await authAPI.login({ email, password });
localStorage.setItem('token', data.data.token);

// Place order
const { data } = await orderAPI.create({ orderItems, shippingAddress });
```

---

## ✅ Step 6 — Replace vite.config.js

Replace `frontend/vite.config.js` with the provided file. This adds a proxy so API calls work seamlessly during development.

---

## ✅ Step 7 — Seed the Database (Optional)

```bash
cd backend
npm run seed
```

This creates:
- **Admin:** admin@paintingstore.com / admin123
- **User:** test@example.com / test123
- **8 sample paintings**

---

## ✅ Step 8 — Run the App

**Option A — Run both together (from root folder):**
```bash
npm run dev
```

**Option B — Run separately:**
```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open: **http://localhost:5173**  
API: **http://localhost:5000/api/health**

---

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Login |
| POST | /api/auth/google | Public | Google Auth |
| GET | /api/auth/me | Private | Get profile |
| GET | /api/paintings | Public | All paintings |
| GET | /api/paintings/:id | Public | Single painting |
| GET | /api/paintings/featured | Public | Featured paintings |
| POST | /api/paintings | Admin | Create painting |
| PUT | /api/paintings/:id | Admin | Update painting |
| DELETE | /api/paintings/:id | Admin | Delete painting |
| POST | /api/paintings/:id/reviews | Private | Add review |
| POST | /api/orders | Private | Place order |
| GET | /api/orders/my | Private | My orders |
| GET | /api/orders/:id | Private | Order detail |
| PUT | /api/orders/:id/cancel | Private | Cancel order |
| GET | /api/orders | Admin | All orders |
| PUT | /api/orders/:id/status | Admin | Update status |
| GET | /api/orders/admin/stats | Admin | Dashboard stats |
| GET | /api/users/profile | Private | User profile |
| PUT | /api/users/profile | Private | Update profile |
| GET | /api/users/wishlist | Private | Get wishlist |
| POST | /api/users/wishlist/:id | Private | Toggle wishlist |

---

## 🔧 Connecting Your Redux Store

In your Redux slices, replace hardcoded fetch calls with the API service:

```javascript
// Example: paintingSlice.js
import { paintingAPI } from '../../services/api';

export const fetchPaintings = createAsyncThunk('paintings/fetchAll', async (params, thunkAPI) => {
  try {
    const { data } = await paintingAPI.getAll(params);
    return data.data; // { paintings, pagination }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch');
  }
});
```

---

## 🚨 Common Issues

**CORS error?**  
Make sure backend is running on port 5000 and frontend on 5173.

**MongoDB connection failed?**  
Make sure MongoDB is running: `mongod` (local) or check Atlas connection string.

**Token not working?**  
Clear localStorage and log in again.

**Images not showing?**  
The backend serves uploads at `/uploads/filename`. Use full URL: `http://localhost:5000/uploads/filename`.