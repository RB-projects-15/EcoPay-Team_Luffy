# EcoPay - Backend API (Assignment 4)

This is the backend implementation for **EcoPay**, built according to the API contract.  
It uses **Node.js (Express)** with in-memory data storage (no database required for now) and includes **Swagger/OpenAPI** interactive documentation.

---

## 📂 Project Structure

---

## 🚀 How to Run Locally

backend/
├── index.js # Main Express server
├── package.json # Dependencies and scripts
├── swagger.json # OpenAPI specification
├── README.md # Documentation (this file)
└── .gitignore

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/RB-projects-15/EcoPay-Team_Luffy.git
cd EcoPay-Team_Luffy/backend

2️⃣ Install Dependencies
npm install

3️⃣ Start the Server
npm start
If successful, you will see:
Server listening on http://localhost:3000

4️⃣ Open API Documentation
Go to:
http://localhost:3000/api-docs
You will see Swagger UI, where you can test all API endpoints.

🛠 API Endpoints
Authentication
POST /api/auth/register – Register a new user

POST /api/auth/login – Login and get JWT token

Waste Management
POST /api/waste/scan – Scan waste QR code (simulated)

POST /api/waste/upload – Upload waste image (simulated)

POST /api/waste/submit – Submit waste entry and earn points

Transactions
GET /api/transactions/{user_id} – Get user transaction history

Rewards
POST /api/rewards/redeem – Redeem reward using points

🧪 Testing Sequence in Swagger UI
Register a user
Endpoint: POST /api/auth/register
Example:

json
Copy
Edit
{
  "name": "Rohan Kumar",
  "email": "rohan@example.com",
  "password": "123456"
}
Login
Endpoint: POST /api/auth/login
Example:

json
Copy
Edit
{
  "email": "rohan@example.com",
  "password": "123456"
}
Scan waste QR
Endpoint: POST /api/waste/scan
Example:

json
Copy
Edit
{
  "qr_code_data": "plastic"
}
Submit waste
Endpoint: POST /api/waste/submit
Example:

json
Copy
Edit
{
  "user_id": "your-user-id",
  "waste_type": "Plastic",
  "weight": 2,
  "image_url": "https://example.com/image.jpg"
}
View transactions
Endpoint: GET /api/transactions/{user_id}

Redeem reward
Endpoint: POST /api/rewards/redeem
Example:

json
Copy
Edit
{
  "user_id": "your-user-id",
  "reward_id": "r1"
}
📌 Submission Info
GitHub Repository:
https://github.com/RB-projects-15/EcoPay-Team_Luffy

API Documentation:
Open http://localhost:3000/api-docs after running the backend locally.

```
