# API_CONTRACT.md - EcoPay

**Project:** EcoPay  
**Team:** Team Luffy  
**Team Members:** Rohankumar Bind, Velino Alex Leitao, Pritam Dhamaskar, Roshan Rajan Gawas, Ashwin Pawar


---

## 1. Overview

This document defines the contract between the **frontend** and **backend** for the EcoPay application. It lists all core features, data models, and API endpoints. Use this as the single source of truth for backend/frontend integration.

---

## 2. Core Features

1. User Authentication
   - Signup / Register
   - Login / Logout
   - Password Reset
2. User Profile
   - View Profile
   - Update Profile
3. Waste Scanning & Upload
   - Upload Waste Image (gallery or camera)
   - Live Camera Scan
4. Transaction Management
   - View Points Balance
   - View Transaction History
5. Rewards & Redemption
   - View Available Rewards
   - Redeem Reward
6. Pickup Scheduling
   - Schedule Pickup
   - View Pickup Status
7. Admin (Optional)
   - View all submissions
   - Manage rewards
8. Language Preferences
   - Get available languages
   - Update preferred language
9. (Optional) Blockchain Sync
   - Record transactions immutably

---

## 3. Data Models

### User
```json
{
  "id": "string (UUID)",
  "name": "string",
  "email": "string",
  "password_hash": "string",
  "phone": "string",
  "address": "string",
  "points": "integer",
  "preferredLanguage": "string",
  "userType": "string (user/admin)",
  "createdAt": "ISO 8601 timestamp"
}
```

### WasteScan
```json
{
  "id": "string (UUID)",
  "userId": "string (UUID)",
  "wasteType": "string (plastic/paper/other)",
  "imageUrl": "string (URL)",
  "confidence": "float (0.0 - 1.0)",
  "estimatedWeightKg": "float",
  "pointsEarned": "integer",
  "status": "string (pending/approved/rejected)",
  "scanDate": "ISO 8601 timestamp"
}
```

### Reward
```json
{
  "id": "string (UUID)",
  "title": "string",
  "description": "string",
  "pointsRequired": "integer",
  "expiryDate": "ISO 8601 timestamp"
}
```

### Transaction
```json
{
  "id": "string (UUID)",
  "userId": "string (UUID)",
  "type": "string (earn/redeem)",
  "points": "integer",
  "date": "ISO 8601 timestamp",
  "description": "string"
}
```

### PickupRequest
```json
{
  "id": "string (UUID)",
  "userId": "string (UUID)",
  "wasteScanId": "string (UUID) optional",
  "pickupDate": "ISO 8601 date",
  "address": "string",
  "status": "string (scheduled/completed/cancelled)",
  "createdAt": "ISO 8601 timestamp"
}
```

---

## 4. API Endpoints

> **Notes:**  
> - All endpoints accept and return JSON unless otherwise specified.  
> - Use appropriate HTTP status codes.  
> - Secure endpoints require an `Authorization: Bearer <token>` header (JWT).

---

### Authentication

#### 1. Register (Signup)
- **Feature:** Create new user account  
- **Method:** `POST`  
- **Path:** `/api/auth/signup`  
- **Description:** Registers a new user and returns user id.  
- **Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "address": "string"
}
```
- **Success (201 Created):**
```json
{ "message": "User registered successfully", "userId": "uuid" }
```
- **Error (409 Conflict):**
```json
{ "error": "Email already exists" }
```

#### 2. Login
- **Feature:** Authenticate user  
- **Method:** `POST`  
- **Path:** `/api/auth/login`  
- **Description:** Returns auth token and basic user data.  
- **Request Body:**
```json
{ "email": "string", "password": "string" }
```
- **Success (200 OK):**
```json
{ "token": "jwt_token", "user": { "id": "uuid", "name": "string", "email": "string", "points": 120 } }
```
- **Error (401 Unauthorized):**
```json
{ "error": "Invalid credentials" }
```

#### 3. Logout
- **Feature:** End user session  
- **Method:** `POST`  
- **Path:** `/api/auth/logout`  
- **Description:** Invalidates token (if token tracking used).  
- **Success (200):**
```json
{ "message": "Logged out successfully" }
```

#### 4. Password Reset (Request)
- **Method:** `POST`  
- **Path:** `/api/auth/password-reset`  
- **Description:** Sends password reset email/link.  
- **Request:**
```json
{ "email": "string" }
```
- **Success (200):**
```json
{ "message": "Password reset email sent" }
```

---

### User Profile

#### Get Profile
- **Method:** `GET`  
- **Path:** `/api/user/profile`  
- **Headers:** `Authorization: Bearer <token>`  
- **Success (200):**
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "points": 120,
  "preferredLanguage": "en"
}
```

#### Update Profile
- **Method:** `PUT`  
- **Path:** `/api/user/profile`  
- **Headers:** `Authorization: Bearer <token>`  
- **Request Body:**
```json
{
  "name": "string",
  "phone": "string",
  "address": "string",
  "preferredLanguage": "string"
}
```
- **Success (200):**
```json
{ "message": "Profile updated successfully" }
```

---

### Waste Scanning & Upload

#### 1. Upload (Gallery) / Live Scan (Camera)
- **Feature:** Upload or capture an image for waste detection  
- **Method:** `POST`  
- **Path:** `/api/waste/scan`  
- **Description:** Accepts `multipart/form-data` (image file) or base64 image. Returns classification and points.  
- **Request (multipart/form-data):**
```
image: (file)
userId: (string)
source: "gallery" | "camera"
```
- **Success (200 OK):**
```json
{
  "status": "success",
  "scanId": "uuid",
  "wasteType": "Plastic Bottle",
  "confidence": 0.92,
  "estimatedWeightKg": 0.5,
  "pointsEarned": 10
}
```
- **Error (400 Bad Request):**
```json
{ "error": "Invalid image or unsupported format" }
```

#### 2. Get Scan Result
- **Method:** `GET`  
- **Path:** `/api/waste/scan/{scanId}`  
- **Headers:** `Authorization: Bearer <token>`  
- **Success (200):**
```json
{
  "scanId": "uuid",
  "wasteType": "Plastic",
  "confidence": 0.9,
  "pointsEarned": 10,
  "status": "approved"
}
```

---

### Transaction Management

#### Get Points Balance
- **Method:** `GET`  
- **Path:** `/api/points`  
- **Headers:** `Authorization: Bearer <token>`  
- **Success (200):**
```json
{ "userId": "uuid", "points": 220 }
```

#### Get Transaction History
- **Method:** `GET`  
- **Path:** `/api/transactions`  
- **Headers:** `Authorization: Bearer <token>`  
- **Success (200):**
```json
[
  { "id": "uuid", "type": "earn", "points": 10, "date": "2025-08-05", "description": "Scanned Plastic Bottle" },
  { "id": "uuid", "type": "redeem", "points": -50, "date": "2025-08-06", "description": "Redeemed Voucher" }
]
```

---

### Rewards & Redemption

#### List Rewards
- **Method:** `GET`  
- **Path:** `/api/rewards`  
- **Success (200):**
```json
[
  { "id": "uuid", "title": "10% Off at Partner Store", "pointsRequired": 100, "expiryDate": "2026-01-01" }
]
```

#### Redeem Reward
- **Method:** `POST`  
- **Path:** `/api/rewards/redeem`  
- **Headers:** `Authorization: Bearer <token>`  
- **Request Body:**
```json
{ "rewardId": "uuid" }
```
- **Success (200):**
```json
{ "message": "Reward redeemed successfully", "transactionId": "uuid" }
```
- **Error (400):**
```json
{ "error": "Insufficient points" }
```

---

### Pickup Scheduling

#### Schedule Pickup
- **Method:** `POST`  
- **Path:** `/api/pickups/schedule`  
- **Headers:** `Authorization: Bearer <token>`  
- **Request Body:**
```json
{
  "userId": "uuid",
  "address": "string",
  "pickupDate": "YYYY-MM-DD",
  "notes": "optional string"
}
```
- **Success (201):**
```json
{ "message": "Pickup scheduled", "pickupId": "uuid" }
```

#### Get Pickup Status
- **Method:** `GET`  
- **Path:** `/api/pickups/{pickupId}`  
- **Headers:** `Authorization: Bearer <token>`  
- **Success (200):**
```json
{
  "pickupId": "uuid",
  "status": "scheduled",
  "pickupDate": "YYYY-MM-DD",
  "address": "string"
}
```

---

### Admin Endpoints (Optional)

#### Get All Submissions
- **Method:** `GET`  
- **Path:** `/api/admin/submissions`  
- **Headers:** `Authorization: Bearer <token>` (admin)  
- **Success (200):**
```json
[
  { "scanId": "uuid", "userId": "uuid", "wasteType": "Plastic", "pointsEarned": 10, "status": "pending" }
]
```

#### Manage Rewards
- **Create Reward**
  - **Method:** `POST` `/api/admin/rewards`
  - **Request Body:** `{ "title": "string", "description":"string", "pointsRequired": 100 }`
- **Update Reward**
  - **Method:** `PUT` `/api/admin/rewards/{rewardId}`
- **Delete Reward**
  - **Method:** `DELETE` `/api/admin/rewards/{rewardId}`

---

### Language Preferences

#### List Languages
- **Method:** `GET`  
- **Path:** `/api/languages`  
- **Success (200):**
```json
[ { "code": "en", "name": "English" }, { "code": "hi", "name": "Hindi" } ]
```

#### Update Preferred Language
- **Method:** `PUT`  
- **Path:** `/api/user/language`  
- **Headers:** `Authorization: Bearer <token>`  
- **Request Body:**
```json
{ "preferredLanguage": "en" }
```
- **Success (200):**
```json
{ "message": "Language updated" }
```

---

### Blockchain Sync (Optional)

#### Sync Transaction to Blockchain
- **Method:** `POST`  
- **Path:** `/api/blockchain/sync`  
- **Request Body:**
```json
{ "transactionId": "uuid", "hash": "string" }
```
- **Success (200):**
```json
{ "message": "Transaction recorded on blockchain" }
```

---

## 5. Error Handling & Status Codes

- `200 OK` – Successful GET/POST where applicable  
- `201 Created` – Resource created successfully  
- `400 Bad Request` – Validation or malformed request  
- `401 Unauthorized` – Authentication failed or token missing  
- `403 Forbidden` – User is not authorized for this action  
- `404 Not Found` – Resource missing  
- `409 Conflict` – Duplicate resource (e.g., email already exists)  
- `500 Internal Server Error` – Server-side error

---

## 6. Security & Best Practices

- Use HTTPS in production.  
- Store passwords hashed (bcrypt/argon2).  
- Use JWT tokens for authentication and protect routes.  
- Validate and sanitize all inputs.  
- Limit upload file size and validate file types for images.  
- Implement rate limiting on sensitive endpoints.

---

## 7. Notes & Next Steps

- Add Swagger/OpenAPI documentation linked to backend code.  
- Create mock responses so frontend can start development in parallel.  
- Finalize exact response structures with backend implementation team during development.

---

## 8. Change Log
- 2025-08-09: Initial contract created covering all features and endpoints.
