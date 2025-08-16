<h1 align="center">🌱 EcoPay - Backend API </h1>

<p align="center">
  <b>Backend implementation for EcoPay</b>, built with <b>Node.js (Express.js)</b>.<br>
  Provides APIs for authentication, waste pickup requests, transactions, and rewards.<br>
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
✅ Server listening on http://localhost:3000

4️⃣ Open Swagger API Documentation:
➡ http://localhost:3000/api-docs
</pre>

---

<h2>📡 API Endpoints</h2>

<ul>
  <li>🔑 <b>Authentication:</b> 
    <ul>
      <li>POST <code>/api/auth/register</code> → Register a new user</li>
      <li>POST <code>/api/auth/login</code> → Login & get JWT token</li>
    </ul>
  </li>

  <li>♻ <b>Waste Management:</b> 
    <ul>
      <li>POST <code>/api/waste/upload</code> → Upload waste image (returns type, points, image URL)</li>
      <li>POST <code>/api/waste/submit</code> → Submit a waste pickup request</li>
      <li>GET <code>/api/waste/requests</code> → Get all pickup requests (Admin)</li>
      <li>POST <code>/api/waste/requests/{id}/approve</code> → Approve a pickup request (Admin)</li>
      <li>POST <code>/api/waste/requests/{id}/complete</code> → Mark a request as completed & award points</li>
    </ul>
  </li>

  <li>💳 <b>Transactions:</b> 
    <ul>
      <li>GET <code>/api/transactions/{user_id}</code> → Get transaction history for a user</li>
    </ul>
  </li>

  <li>🎁 <b>Rewards:</b> 
    <ul>
      <li>POST <code>/api/rewards/redeem</code> → Redeem reward using points</li>
    </ul>
  </li>
</ul>

---

<h2>🧪 Example Testing Flow in Swagger UI</h2>

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

3️⃣ Submit Waste Pickup Request:
{
  "user_id": "your-user-id",
  "waste_type": "Plastic",
  "weight": 2,
  "image_url": "https://example.com/image.jpg",
  "location": "Delhi, India"
}

4️⃣ Admin Approves Request:
POST /api/waste/requests/{id}/approve
{
  "collector_info": "Collector A assigned"
}

5️⃣ Mark Request as Completed:
POST /api/waste/requests/{id}/complete

6️⃣ View Transactions:
GET /api/transactions/{user_id}

7️⃣ Redeem Reward:
{
  "user_id": "your-user-id",
  "reward_id": "r1"
}
</pre>

---

<h2>📌 Submission Info</h2>

<p>🔗 <b>GitHub Repository:</b> <a href="https://github.com/RB-projects-15/EcoPay-Team_Luffy">EcoPay-Team_Luffy</a><br>
📄 <b>API Documentation:</b> Open <code>http://localhost:3000/api-docs</code> after running the backend locally</p>
