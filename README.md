# 🌍 BookIt — Experiences & Slot Booking Platform

A fullstack web application where users can explore experiences, view details, select time slots, and complete bookings seamlessly — built with **React + TypeScript (Vite)** for the frontend and **Node.js + Express + MySQL** for the backend.

---

## 🚀 Live Demo

- **Frontend:** [https://bookit-frontend-jnt4.vercel.app](https://bookit-frontend-jnt4.vercel.app)
- **Backend (API):** [https://bookit-backend-production-6a3c.up.railway.app](https://bookit-backend-production-6a3c.up.railway.app)

---

## 📸 Project Overview

**BookIt** is a full-stack travel experience booking system.  
Users can:
- Browse curated experiences
- View detailed information & pricing
- Select available dates and time slots
- Apply promo codes for discounts
- Confirm and complete bookings

Admins (or testers) can view bookings directly from the backend API or database.

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + TypeScript (Vite) |
| **Styling** | TailwindCSS + ShadCN UI |
| **State Management** | React Hooks |
| **API Calls** | Axios |
| **Backend** | Node.js + Express |
| **Database** | MySQL (Hosted on Railway) |
| **Hosting** | Frontend → Vercel / Backend → Railway |
| **Version Control** | GitHub |

---

## 🧩 Folder Structure

```
BookIt/
├── Backend/
│   ├── src/
│   │   ├── config/db.ts
│   │   ├── controllers/
│   │   │   └── bookingController.ts
│   │   ├── routes/
│   │   │   ├── bookingRoutes.ts
│   │   │   └── experienceRoutes.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
└── Frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Details.tsx
    │   │   ├── Checkout.tsx
    │   │   └── Result.tsx
    │   ├── components/
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## ⚙️ Environment Variables

### Frontend (`.env`)
```
VITE_API_BASE_URL=https://bookit-backend-production-6a3c.up.railway.app
```

### Backend (`.env`)
```
DB_HOST=containers-us-west-99.railway.app
DB_USER=root
DB_PASSWORD=********
DB_NAME=railway
PORT=8000
```

---

## 🖥️ Local Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Sandyleo13/Bookit-frontend.git
git clone https://github.com/Sandyleo13/Bookit-backend.git
```

### 2️⃣ Install dependencies
```bash
# Frontend
cd Frontend
npm install

# Backend
cd ../Backend
npm install
```

### 3️⃣ Configure environment
Create `.env` files as shown above.

### 4️⃣ Run locally
```bash
# Run backend
npm run dev

# Run frontend
cd ../Frontend
npm run dev
```
Frontend will run on `http://localhost:5173` and backend on `http://localhost:8000`.

---

## 🧠 API Documentation

### **Base URL**
```
https://bookit-backend-production-6a3c.up.railway.app/api
```

---

### **GET /experiences**

**Description:** Fetch all available experiences.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Skydiving Adventure",
    "description": "Experience the thrill of freefall.",
    "image": "https://images.unsplash.com/...",
    "price": 2500
  }
]
```

---

### **GET /experiences/:id**

**Description:** Fetch detailed info for a single experience.

**Response:**
```json
{
  "id": 1,
  "title": "Skydiving Adventure",
  "description": "Experience the thrill of freefall.",
  "price": 2500,
  "slots": ["9:00 AM", "11:00 AM", "1:00 PM"]
}
```

---

### **POST /bookings**

**Description:** Create a new booking.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "promo_code": "hd10",
  "experience_id": 1,
  "total_price": 2500,
  "date": "2025-11-01",
  "time": "09:00 AM"
}
```

**Response:**
```json
{
  "message": "✅ Booking created successfully!",
  "bookingId": "BKG-1761929096246",
  "insertedId": 5
}
```

---

### **GET /bookings**

**Description:** Fetch all bookings (for admin/testing).

**Response:**
```json
[
  {
    "id": 1,
    "booking_id": "BKG-1761929096246",
    "name": "John Doe",
    "email": "john@example.com",
    "experience_id": 1,
    "total_price": 2500,
    "experience_title": "Skydiving Adventure"
  }
]
```

---

### **POST /promo/validate**

**Description:** Validate a promo code (e.g. `hd10` → 10% off).

**Request:**
```json
{ "code": "hd10" }
```

**Response:**
```json
{ "valid": true, "discount": 10 }
```

---

## 💾 Database Schema (MySQL)

```sql
CREATE TABLE experiences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  image VARCHAR(255),
  price DECIMAL(10,2)
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id VARCHAR(50),
  name VARCHAR(255),
  email VARCHAR(255),
  promo_code VARCHAR(50),
  experience_id INT,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  date DATE,
  time VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (experience_id) REFERENCES experiences(id)
);
```

---

## 🧾 Booking Flow

1. **Home Page** → Fetch experiences dynamically  
2. **Details Page** → Select slot/date  
3. **Checkout Page** → Enter details, apply promo, confirm  
4. **Result Page** → Show confirmation or failure message  

Data flow:
```
Frontend → Backend API → MySQL Database → Success Message
```

---

## 🧪 Testing with cURL

```bash
curl -X POST https://bookit-backend-production-6a3c.up.railway.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"name":"Tester","email":"test@example.com","experience_id":1,"total_price":1500}'
```

---

## 🧰 Deployment Summary

| Layer | Platform | URL |
|--------|-----------|------|
| **Frontend** | Vercel | [https://bookit-frontend-jnt4.vercel.app](https://bookit-frontend-jnt4.vercel.app) |
| **Backend** | Railway | [https://bookit-backend-production-6a3c.up.railway.app](https://bookit-backend-production-6a3c.up.railway.app) |
| **Database** | Railway MySQL | Connected to backend |

---

## 🏆 Highlights

- ✅ Fully responsive, mobile-friendly UI  
- ✅ End-to-end dynamic data flow (Frontend → Backend → DB)  
- ✅ Environment variables securely managed  
- ✅ Cloud deployment (Railway + Vercel)  
- ✅ Form validation, promo codes, and booking confirmation  
- ✅ Organized code structure with TypeScript

---

## 🧑‍💻 Author

**Sandipan Das**  
BSc IT Graduate | Fullstack Developer Intern  
- 💼 [GitHub](https://github.com/Sandyleo13)  
- ✉️ sandipandas0816@gmail.com

---

## 🏁 License
This project is for educational and internship assessment purposes.  
All images used are royalty-free from Unsplash and Pexels.
