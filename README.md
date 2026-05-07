# Military Asset Management System (MAMS)

Review and manage military assets, transfers, and personnel assignments with a robust, clear, and secure platform.

![MAMS Dashboard](https://placehold.co/800x400?text=MAMS+Dashboard+Preview)

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
- **ORM**: SQLAlchemy
- **Auth**: Flask-JWT-Extended
- **Database**: SQLite (Dev) / PostgreSQL (Prod)

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

## 🌐 Deployment

### Backend (Render)
1. Push code to GitHub.
2. Create a **Web Service** on Render.
3. Connect your repository.
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `gunicorn backend.app:create_app()`
6. Add Environment Variable: `Current Directory` set to `.`

### Frontend (Netlify/Vercel)
1. Push code to GitHub.
2. Create a new site from Git.
3. **Build Command**: `npm run build`
4. **Publish Directory**: `frontend/dist`
5. Add Environment Variable: `VITE_API_URL` -> URL of your Render backend.

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
