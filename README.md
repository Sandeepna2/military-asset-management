# 🛡️ Military Asset Management System (MAMS)
  
A **secure, role-based full-stack web application** designed to manage, track, and audit military assets across multiple bases with full transparency and accountability.
 
--- 
        
## 🌐 Live Deployment

- **Frontend (Web App)**: [https://military-asset-management-three.vercel.app](https://military-asset-management-three.vercel.app)  
- **Backend (REST API)**: [https://mams-backend-oq0b.onrender.com](https://mams-backend-oq0b.onrender.com)  

> ⚠️ Note: The backend is hosted on a free-tier Render service. The first request may take a few seconds due to cold start.
 

## 📋 Project Overview

The **Military Asset Management System (MAMS)** is a web-based application designed to track the inventory, movement, and assignment of military assets across various bases. It provides real-time visibility into logistics, ensuring accountability and operational readiness.

### Key Features
- **Dashboard**: Real-time overview of asset balances (Opening, Closing) and movement flows (Net Movement).
- **RBAC**: Strict Role-Based Access Control (Admin, Commander, Logistics).
- **Logistics Operations**: Facilitates the procurement (Purchase) and relocation (Transfer) of assets.
- **Tactical Assignments**: Tracks assets assigned to personnel or units, and records expenditures.
- **Audit Trails**: Every action that affects inventory is recorded as a immutable transaction.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Charts**: Recharts
- **State**: React Context API

### Backend
- **Framework**: Flask (Python)
- **Auth**: Flask-JWT-Extended
- **Database**: SQL(SQLite) 

---

## 🚀 Local Setup

### Perquisites
- Node.js & npm
- Python 3.8+

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install Dependencies
pip install -r ../requirements.txt

# Seed Database (Run from project root)
# Windows Powershell
$env:PYTHONPATH="."; python backend/seed.py
# Bash
PYTHONPATH="." python backend/seed.py

# Run Server
python app.py
```
Server will start at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Client will start at `http://localhost:5173`.

---

## 🔐 Login Credentials

Use these credentials to verify the RBAC implementation:

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `password` | **Full Access**. Manage all bases, view global stats. |
| **Commander** | `commander_a` | `password` | **Tactical**. View Base stats, Assign/Expend assets. |
| **Logistics** | `logistics_a` | `password` | **Operational**. Purchase & Transfer assets. |

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticates user & returns JWT |
| `GET` | `/api/dashboard/stats` | Returns Opening/Closing balances |
| `POST` | `/api/assets/purchase` | Records new asset procurement |
| `POST` | `/api/assets/transfer` | Moves assets between bases |
| `GET` | `/api/assets/history` | Returns list of recent transactions |

---

## 🛡️ License
Proprietary - Military Asset Management System.
