🌱 EcoPay - Backend API (Assignment 4)
[![Node.js](https://img.shields.io/badge/Node.js](https://img.shields.io/badge/Express.js-4.x-black?](https://img.shields.io/b](https://img.shields.io/badge/Docs-Swagger_UI-green? the backend implementation for EcoPay, built according to the API contract.
It uses Node.js (Express) with in-memory data storage (no database required for now) and includes Swagger/OpenAPI interactive documentation.

📑 Table of Contents
Project Structure

How to Run Locally

API Endpoints

Testing Flow in Swagger UI

Submission Info

📂 Project Structure
text
backend/
├── index.js        # Main Express server
├── package.json    # Dependencies and scripts
├── swagger.json    # OpenAPI specification
├── README.md       # Documentation (this file)
└── .gitignore
🚀 How to Run Locally
1️⃣ Clone the Repository

bash
git clone https://github.com/RB-projects-15/EcoPay-Team_Luffy.git
cd EcoPay-Team_Luffy/backend
2️⃣ Install Dependencies

bash
npm install
3️⃣ Start the Server

bash
npm start
✅ If successful, you will see:

text
Server listening on http://localhost:3000
4️⃣ Open API Documentation
Go to:

text
http://localhost:3000/api-docs
You will see Swagger UI, where you can test all API endpoints.

🛠 API Endpoints
🔑 Authentication
POST /api/auth/register – Register a new user

POST /api/auth/login – Login and get JWT token

♻ Waste Management
POST /api/waste/scan – Scan waste QR code (simulated)

POST /api/waste/upload – Upload waste image (simulated)

POST /api/waste/submit – Submit waste entry and earn points

💳 Transactions
GET /api/transactions/{user_id} – Get user transaction history

🎁 Rewards
POST /api/rewards/redeem – Redeem reward using points

🧪 Testing Flow in Swagger UI
1. Register a User

json
{
  "name": "Rohan Kumar",
  "email": "rohan@example.com",
  "password": "123456"
}
2. Login

json
{
  "email": "rohan@example.com",
  "password": "123456"
}
3. Scan Waste QR

json
{
  "qr_code_data": "plastic"
}
4. Submit Waste

json
{
  "user_id": "your-user-id",
  "waste_type": "Plastic",
  "weight": 2,
  "image_url": "https://example.com/image.jpg"
}
5. View Transactions
No request body — just visit endpoint:

text
GET /api/transactions/{user_id}
6. Redeem Reward

json
{
  "user_id": "your-user-id",
  "reward_id": "r1"
}
📌 Submission Info
🔗 GitHub Repository:
https://github.com/RB-projects-15/EcoPay-Team_Luffy

📄 API Documentation:
Open http://localhost:3000/api-docs after running the backend locally.
