
# EcoPay API Contract

This document defines the API contract for the EcoPay application.  
It serves as the single source of truth for all frontend-backend communication.

---

## Core Features
1. User Registration & Login (Authentication)
2. Waste Scanning (QR Code / Image Upload)
3. Waste Submission & Points Tracking
4. Transaction History
5. Reward Redemption

---

## Data Models

### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "password": "hashed string",
  "points": "number"
}
```

### Waste Submission
```json
{
  "id": "string",
  "user_id": "string",
  "waste_type": "string",
  "weight": "number",
  "image_url": "string",
  "points_awarded": "number",
  "submitted_at": "datetime"
}
```

### Transaction
```json
{
  "id": "string",
  "user_id": "string",
  "type": "credit/debit",
  "points": "number",
  "date": "datetime",
  "description": "string"
}
```

---

## API Endpoints

### 1. Register User
- **Feature:** User registration
- **Method:** POST
- **Endpoint:** `/api/auth/register`
- **Description:** Registers a new user.
- **Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
- **Success Response (200 OK):**
```json
{
  "message": "User registered successfully",
  "user_id": "string"
}
```
- **Error Responses:**
```json
{
  "error": "Email already exists"
}
```

### 2. Login User
- **Feature:** User login
- **Method:** POST
- **Endpoint:** `/api/auth/login`
- **Description:** Logs in a user and returns an authentication token.
- **Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
- **Success Response (200 OK):**
```json
{
  "token": "jwt_token",
  "user_id": "string"
}
```
- **Error Responses:**
```json
{
  "error": "Invalid credentials"
}
```

### 3. Scan Waste QR
- **Feature:** Waste QR scanning
- **Method:** POST
- **Endpoint:** `/api/waste/scan`
- **Description:** Scans a QR code to identify waste type.
- **Request Body:**
```json
{
  "qr_code_data": "string"
}
```
- **Success Response (200 OK):**
```json
{
  "waste_type": "string",
  "points": "number"
}
```
- **Error Responses:**
```json
{
  "error": "Invalid QR code"
}
```

### 4. Upload Waste Image
- **Feature:** Waste image upload
- **Method:** POST
- **Endpoint:** `/api/waste/upload`
- **Description:** Uploads an image to identify waste type and calculate points.
- **Request Body (multipart/form-data):**
```
file: image
```
- **Success Response (200 OK):**
```json
{
  "waste_type": "string",
  "points": "number"
}
```
- **Error Responses:**
```json
{
  "error": "Invalid image format"
}
```

### 5. Submit Waste
- **Feature:** Waste submission
- **Method:** POST
- **Endpoint:** `/api/waste/submit`
- **Description:** Submits waste details for point allocation.
- **Request Body:**
```json
{
  "user_id": "string",
  "waste_type": "string",
  "weight": "number",
  "image_url": "string"
}
```
- **Success Response (200 OK):**
```json
{
  "message": "Waste submitted successfully",
  "points_awarded": "number"
}
```
- **Error Responses:**
```json
{
  "error": "Invalid waste data"
}
```

### 6. Get User Transactions
- **Feature:** View transaction history
- **Method:** GET
- **Endpoint:** `/api/transactions/{user_id}`
- **Description:** Retrieves a user's transaction history.
- **Success Response (200 OK):**
```json
[
  {
    "id": "string",
    "type": "credit/debit",
    "points": "number",
    "date": "datetime",
    "description": "string"
  }
]
```
- **Error Responses:**
```json
{
  "error": "User not found"
}
```

### 7. Redeem Rewards
- **Feature:** Reward redemption
- **Method:** POST
- **Endpoint:** `/api/rewards/redeem`
- **Description:** Redeems user points for rewards.
- **Request Body:**
```json
{
  "user_id": "string",
  "reward_id": "string"
}
```
- **Success Response (200 OK):**
```json
{
  "message": "Reward redeemed successfully"
}
```
- **Error Responses:**
```json
{
  "error": "Insufficient points"
}
```
