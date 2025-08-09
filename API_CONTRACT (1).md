# 📄 API_CONTRACT.md - EcoPay Project

## 🌟 Core Features

- User Registration and Login
- Upload/Scan Waste Image (Manual & Live)
- Track EcoPoints
- View Transaction History
- Multilingual Support

---

## 📦 Data Models

### 🧑 User
```json
{
  "id": 1,
  "name": "Rohan",
  "email": "rohan@example.com",
  "password": "hashed_password",
  "language": "en"
}
```

### ♻️ WasteScan
```json
{
  "scan_id": 101,
  "user_id": 1,
  "waste_type": "Plastic",
  "eco_points": 5,
  "timestamp": "2025-08-07T12:00:00Z"
}
```

---

## 🔐 Feature: User Registration

- **HTTP Method:** POST
- **Endpoint Path:** `/api/register`
- **Description:** Registers a new user account.

### Request Body
```json
{
  "name": "Rohan",
  "email": "rohan@example.com",
  "password": "your_password"
}
```

### Success Response
```json
{
  "message": "User registered successfully",
  "user_id": 1
}
```

### Error Response
```json
{
  "error": "Email already exists"
}
```

---

## 🔐 Feature: User Login

- **HTTP Method:** POST
- **Endpoint Path:** `/api/login`
- **Description:** Authenticates user and returns token.

### Request Body
```json
{
  "email": "rohan@example.com",
  "password": "your_password"
}
```

### Success Response
```json
{
  "token": "jwt_token",
  "message": "Login successful"
}
```

### Error Response
```json
{
  "error": "Invalid credentials"
}
```

---

## 🔍 Feature: Upload Waste Image (Manual Upload)

- **HTTP Method:** POST
- **Endpoint Path:** `/api/scan/upload`
- **Description:** User uploads a waste image manually. The backend will analyze and return waste type and EcoPoints.

### Request Body
```json
{
  "user_id": 123,
  "image": "<base64_encoded_or_file_upload>"
}
```

### Success Response
```json
{
  "waste_type": "Plastic Bottle",
  "eco_points": 5,
  "message": "Scan successful"
}
```

### Error Response
```json
{
  "error": "Invalid image format"
}
```

---

## 📸 Feature: Live Scan via Camera

- **HTTP Method:** POST
- **Endpoint Path:** `/api/scan/live`
- **Description:** Captures photo from live camera input and analyzes it.

### Request Body
```json
{
  "user_id": 123,
  "image": "<captured_camera_image>"
}
```

### Success Response
```json
{
  "waste_type": "Paper",
  "eco_points": 3,
  "message": "Live scan successful"
}
```

### Error Response
```json
{
  "error": "Camera image not supported"
}
```

---

## 📊 Feature: View EcoPoint History

- **HTTP Method:** GET
- **Endpoint Path:** `/api/history/:user_id`
- **Description:** Gets user's past scanned records and earned points.

### Success Response
```json
[
  {
    "scan_id": 101,
    "waste_type": "Plastic",
    "eco_points": 5,
    "timestamp": "2025-08-07T12:00:00Z"
  },
  {
    "scan_id": 102,
    "waste_type": "Paper",
    "eco_points": 3,
    "timestamp": "2025-08-07T13:00:00Z"
  }
]
```

### Error Response
```json
{
  "error": "No history found"
}
```

---

## 🌐 Feature: Change Language

- **HTTP Method:** POST
- **Endpoint Path:** `/api/language`
- **Description:** Updates preferred language for the user.

### Request Body
```json
{
  "user_id": 1,
  "language": "hi"
}
```

### Success Response
```json
{
  "message": "Language updated successfully"
}
```

---