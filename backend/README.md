<h1 align="center">🌱 EcoPay - Backend API </h1>

<p align="center">
  <b>Backend implementation for EcoPay</b>, built with <b>Node.js (Express.js)</b>.<br>
  Provides APIs for authentication, waste pickup workflow, transactions, rewards, and admin operations.<br>
  Includes <b>Swagger interactive documentation</b>.
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
✅ Server listening on http://localhost:5000

4️⃣ Open Swagger API Documentation:
➡ http://localhost:5000/api-docs
</pre>

---

<h2>📡 API Endpoints (v2.0.1)</h2>

<ul>
  <li>🔑 <b>User Authentication:</b> 
    <ul>
      <li>POST <code>/api/user/register</code> → Register a new user (with phone validation)</li>
      <li>POST <code>/api/user/login</code> → Login user & get JWT token</li>
    </ul>
  </li>

  <li>♻ <b>User Waste Management:</b> 
    <ul>
      <li>POST <code>/api/user/waste/upload</code> → Upload waste image (PNG/JPG only)</li>
      <li>POST <code>/api/user/waste/submit</code> → Submit waste pickup request</li>
      <li>GET <code>/api/user/waste/{id}</code> → Get a specific waste pickup request (User)</li>
    </ul>
  </li>

  <li>💳 <b>User Transactions:</b> 
    <ul>
      <li>GET <code>/api/user/transactions/{user_id}</code> → Get transaction history for a user</li>
    </ul>
  </li>

  <li>🎁 <b>User Rewards:</b> 
    <ul>
      <li>POST <code>/api/user/rewards/redeem</code> → Redeem reward using points</li>
    </ul>
  </li>

  <li>👨‍💼 <b>Admin Endpoints:</b> 
    <ul>
      <li>GET <code>/api/user/all</code> → Get all users</li>
      <li>GET <code>/api/admin/requests</code> → Get all waste pickup requests</li>
      <li>POST <code>/api/admin/requests/{id}/approve</code> → Approve a waste pickup request</li>
      <li>POST <code>/api/admin/requests/{id}/complete</code> → Complete a request & award points</li>
    </ul>
  </li>
</ul>

---

<h2>🧪 Example Testing Flow in Swagger UI</h2>

<pre>
1️⃣ Register a User:
POST /api/user/register
{
  "name": "Rohan",
  "email": "rohan@example.com",
  "password": "123456",
  "confirmPassword": "123456",
  "phone": "+919876543210"
}

2️⃣ Login:
POST /api/user/login
{
  "email": "rohan@example.com",
  "password": "123456"
}

3️⃣ Upload Waste Image:
POST /api/user/waste/upload
Form-Data: { "file": (PNG/JPG image) }

Response:
{ "image_url": "/uploads/test.png" }

4️⃣ Submit Waste Pickup Request:
POST /api/user/waste/submit
{
  "user_id": "66c2e7b1b9a8f8e2d6543210",
  "waste_type": "Plastic",
  "weight": 5,
  "image_url": "/uploads/test.png",
  "location": "Lovely building Baina, Vasco Goa",
  "phone": "+919876543210"
}

5️⃣ Get Request by ID (User):
GET /api/user/waste/{id}

6️⃣ Admin - Approve Request:
POST /api/admin/requests/{id}/approve
{
  "collector_info": "Collector Ram - +919876543210"
}

7️⃣ Admin - Complete Request:
POST /api/admin/requests/{id}/complete

8️⃣ Get Transactions (User):
GET /api/user/transactions/{user_id}

9️⃣ Redeem Reward:
POST /api/user/rewards/redeem
{
  "user_id": "66c2e7b1b9a8f8e2d6543210",
  "reward_id": "r1"
}
</pre>

---

<h2>📌 Project Info</h2>

<p>🔗 <b>GitHub Repository:</b> <a href="https://github.com/RB-projects-15/EcoPay-Team_Luffy">EcoPay-Team_Luffy</a><br>
📄 <b>API Documentation:</b> Open <code>http://localhost:5000/api-docs</code> after running the backend locally</p>
