<h1 align="center">🌱 EcoPay - Backend API </h1>

<p align="center">
  <b>Backend implementation for EcoPay</b>, built according to the API contract.<br>
  Uses <b>Node.js (Express.js)</b> with in-memory data storage (no database required for now) and includes <b>Swagger interactive documentation</b>.
</p>

---

<h2>🚀 How to Run Locally</h2>

<pre>
1️⃣ Clone the Repository
$ git clone https://github.com/RB-projects-15/EcoPay-Team_Luffy.git
$ cd EcoPay-Team_Luffy/backend

2️⃣ Install Dependencies
$ npm install

3️⃣ Start the Server
$ npm start
✅ Server listening on http://localhost:3000

4️⃣ Open Swagger API Documentation:
➡ http://localhost:3000/api-docs
</pre>

---

<h2>📡 API Endpoints</h2>

<ul>
  <li>🔑 <b>Authentication:</b> POST /api/auth/register → Register a new user | POST /api/auth/login → Login & get JWT token</li>
  <li>♻ <b>Waste Management:</b> POST /api/waste/scan → Scan waste QR code | POST /api/waste/upload → Upload waste image | POST /api/waste/submit → Submit waste entry & earn points</li>
  <li>💳 <b>Transactions:</b> GET /api/transactions/{user_id} → Get user transaction history</li>
  <li>🎁 <b>Rewards:</b> POST /api/rewards/redeem → Redeem reward using points</li>
</ul>

---

<h2>🧪 Testing Flow in Swagger UI</h2>

<pre>
1️⃣ Register a User:
{
  "name": "Rohan Kumar",
  "email": "rohan@example.com",
  "password": "123456"
}

2️⃣ Login:
{
  "email": "rohan@example.com",
  "password": "123456"
}

3️⃣ Scan Waste QR:
{
  "qr_code_data": "plastic"
}

4️⃣ Submit Waste:
{
  "user_id": "your-user-id",
  "waste_type": "Plastic",
  "weight": 2,
  "image_url": "https://example.com/image.jpg"
}

5️⃣ View Transactions:
GET /api/transactions/{user_id}

6️⃣ Redeem Reward:
{
  "user_id": "your-user-id",
  "reward_id": "r1"
}
</pre>

---

<h2>📌 Submission Info</h2>

<p>🔗 <b>GitHub Repository:</b> <a href="https://github.com/RB-projects-15/EcoPay-Team_Luffy">EcoPay-Team_Luffy</a><br>
📄 <b>API Documentation:</b> Open <code>http://localhost:3000/api-docs</code> after running the backend locally</p>
