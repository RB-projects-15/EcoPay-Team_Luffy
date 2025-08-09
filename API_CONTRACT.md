
# 📘 API_CONTRACT.md - EcoPay Project

This document defines the API contract between the frontend and backend of the EcoPay application. It ensures both sides communicate properly and eliminates integration issues.

---

## 🔧 Purpose

This file acts as a single source of truth for all API communications in the EcoPay system. It outlines what each API does, what data it expects, and how it responds.

---

## 💡 Example Feature: User Registration

- **Feature:** User Registration
- **HTTP Method:** POST
- **Endpoint Path:** `/api/register`
- **Description:** Registers a new EcoPay user into the system.

### 🔽 Request Body:
```json
{
  "name": "Rohan",
  "email": "rohan@gmail.com",
  "password": "123456",
  "phone": "9876543210",
  "address": "Goa"
}
```

### ✅ Success Response (200 OK):
```json
{
  "message": "User registered successfully.",
  "user_id": 1
}
```

### ❌ Error Responses:
- **400 Bad Request:**
```json
{
  "error": "Missing required fields."
}
```

- **409 Conflict:**
```json
{
  "error": "User already exists."
}
```

---

## ✅ Other Core Features

| Feature              | Method | Endpoint               | Description                                  |
|---------------------|--------|------------------------|----------------------------------------------|
| Login               | POST   | /api/login             | Authenticates user and returns token         |
| Schedule Pickup     | POST   | /api/pickup            | Allows users to request waste collection     |
| View Rewards        | GET    | /api/rewards           | Retrieves user's reward points               |
| Redeem Rewards      | POST   | /api/redeem            | Lets user use reward points                  |
| Transaction History | GET    | /api/history           | Shows user's previous actions/transactions   |

---

## 🔐 Data Models

### User
```json
{
  "id": 1,
  "name": "Rohan",
  "email": "rohan@gmail.com",
  "password": "hashed",
  "phone": "9876543210",
  "address": "Goa"
}
```

### PickupRequest
```json
{
  "id": 101,
  "user_id": 1,
  "type": "Plastic",
  "date": "2025-08-10",
  "status": "Scheduled"
}
```

### Reward
```json
{
  "id": 10,
  "user_id": 1,
  "points": 50,
  "action": "Recycled Plastic Bottles",
  "date": "2025-08-05"
}
```

---

## 🔄 Optional: Blockchain Sync (Future Scope)
- Immutable transaction records
- Data sync to blockchain ledger

---

*This contract helps ensure smooth development and integration for your EcoPay project.*
