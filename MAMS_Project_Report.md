# Military Asset Management System (MAMS) - Project Report

## 1. Project Overview
**Description**
The Military Asset Management System (MAMS) is a web-based application designed to track the inventory, movement, and assignment of military assets across various bases. It provides real-time visibility into logistics, ensuring accountability and operational readiness.

**Key Features**
- **Dashboard**: High-level view of asset balances (Opening, Closing) and movement flows (Net Movement).
- **Logistics Operations**: Facilitates the procurement (Purchase) and relocation (Transfer) of assets.
- **Tactical Assignments**: Tracks assets assigned to personnel or units, and records expenditures (e.g., ammunition used).
- **Audit Trails**: Every action that affects inventory is recorded as a immutable transaction.

**Assumptions & Limitations**
- **Assumption**: Users belong to a specific "Base" (except Admins who oversee all).
- **Limitation**: The current deployment uses SQLite for simplicity, which is suitable for small-to-medium datasets but should be upgraded to PostgreSQL for enterprise scale.
- **Limitation**: Authentication token storage uses browser LocalStorage, which is standard for single-page apps (SPAs) but requires strict XSS protection measures.

---

## 2. Tech Stack & Architecture

### **frontend**
- **Framework**: **React 18** (via Vite). chosen for its component-based architecture and fast rendering, essential for a dynamic dashboard.
- **Styling**: **Tailwind CSS**. chosen for rapid UI development and "Military Tech" aesthetic consistency.
- **Routing**: **React Router**. Handles client-side navigation.
- **Charts**: **Recharts**. Renders data visualization for trends.

### **Backend**
- **Framework**: **Flask** (Python). Chosen for its lightweight flexibility and powerful extension ecosystem.
- **ORM**: **SQLAlchemy**. Provides a robust Object-Relational Mapper to interact with the database securely.
- **Authentication**: **Flask-JWT-Extended**. Handles stateless authentication via JSON Web Tokens (JWT).

### **Database**
- **Engine**: **SQLite** (Dev) / **PostgreSQL** (Prod).
- **Why**: Relational data integrity is critical for inventory systems where User -> Base -> Inventory links must be consistent.

---

## 3. Login & Authentication Flow (Deep Dive)

The system uses **JWT (JSON Web Token)** for stateless, secure authentication.

### **A. Backend (Flask)**
- **Library**: `flask-jwt-extended`
- **Model**: Users store a `password_hash`. We never store raw passwords.
- **Process**:
    1. Tenant sends `username` + `password`.
    2. Server verifies hash.
    3. Server signs a JWT `access_token` containing the `user_id`.
    4. Token is valid for a set duration (e.g., 1 hour).

### **B. Frontend (React)**
- **Storage**: Token is saved in browser `localStorage`.
- **Interceptors**: An Axios interceptor automatically attaches `Authorization: Bearer <token>` to every request header.
- **Context**: `AuthContext` manages the global "Logged In" state.

---

## 4. Data Models / Schema

The system relies on five core entities:

1.  **User**: System actors.
    *   Fields: `id`, `username`, `password_hash`, `role`, `base_id`
2.  **Base**: Physical locations (e.g., "Alpha Base").
    *   Fields: `id`, `name`, `location`
3.  **Asset**: Catalog of item types (e.g., "M4 Rifle").
    *   Fields: `id`, `name`, `type`, `description`
4.  **Inventory**: The link table tracking quantity of an Asset at a Base.
    *   Fields: `id`, `asset_id`, `base_id`, `quantity`
5.  **Transaction**: The immutable ledger of all changes.
    *   Fields: `id`, `type` (PURCHASE, TRANSFER, etc.), `quantity`, `from_base_id`, `to_base_id`, `timestamp`, `user_id`

---

## 5. RBAC Explanation (Role-Based Access Control)

Access is enforced via the custom `@role_required` decorator in the backend.

| Role | Description | Access Level |
| :--- | :--- | :--- |
| **Admin** | System Overseer | **Full Access**. Can manage all bases, view global stats, and perform any action. |
| **Commander** | Base Leader | **Tactical Access**. Can view Dashboard stats for their base and Assign/Expend assets. Read-only for Global settings. |
| **Logistics** | Supply Officer | **Operational Access**. Can Purchase new stock and Transfer assets between bases. Cannot assigning to personnel. |

---

## 6. API Logging

Transaction logging is not just a text file; it is a structural part of the database.
- **Automatic Recording**: Every API call that modifies inventory (Purchase, Transfer, Assign) automatically creates a `Transaction` record properly inside the same database commit.
- **Traceability**: Each transaction records *Who* (User ID), *When* (Timestamp), *What* (Asset & Quantity), and *Where* (From/To Base).
- **History Endpoint**: The system exposes `/api/assets/history` to view these logs in the UI.

---

## 7. Setup Instructions

### **1. Backend Setup**
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r ../requirements.txt

# Initialize Database
$env:PYTHONPATH="."
python backend/seed.py

# Run Server
python -m backend.app
```

### **2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

The application will launch at **http://localhost:5173**.

---

## 8. Key API Endpoints

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticates user & returns JWT | Public |
| `GET` | `/api/dashboard/stats` | Returns Opening/Closing balances | Any Role |
| `POST` | `/api/assets/purchase` | Records new asset procurement | Admin, Logistics |
| `POST` | `/api/assets/transfer` | Moves assets between bases | Admin, Logistics |
| `POST` | `/api/assets/assignment` | Assigns assets to personnel | Admin, Commander |
| `GET` | `/api/assets/history` | Returns list of recent transactions | Any Role |

---

## 9. Login Credentials

Use these credentials to verify the RBAC implementation:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `password` |
| **Commander** | `commander_a` | `password` |
| **Logistics** | `logistics_a` | `password` |
