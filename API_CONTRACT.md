
# Waste Image Upload & Scanning Feature

## Overview
This feature allows users to upload images of waste materials for scanning and identification.  
It enhances the EcoPay platform by enabling automated waste type recognition, making the recycling process faster and more accurate.

---

## Core Functionalities
1. **Upload Waste Image**
   - Users can choose an image from their device's gallery or take a picture directly from the camera.
   - Supported file formats: `.jpg`, `.jpeg`, `.png`.
   - Maximum file size: 5 MB.

2. **Scan Waste Image**
   - After uploading, the system uses AI-based image recognition to identify the type of waste.
   - Recognized waste categories (initial version):
     - Plastic Bottle
     - Paper Waste
   - The system will display the detected category, estimated weight, and potential reward points.

---

## User Flow
1. **Open Upload Page**
2. **Select Image Upload Method:**
   - Option 1: *Take a Photo* (opens device camera)
   - Option 2: *Choose from Gallery* (opens file selector)
3. **Preview Image**
4. **Click "Scan" Button**
5. **System Processes Image**
6. **Results Displayed:**
   - Waste Type
   - Estimated Weight
   - Reward Points Earned
   - Suggestions for disposal/recycling

---

## Technical Details

### Frontend Implementation
- **HTML/CSS/JavaScript**
  - File input field with `accept="image/*"`
  - Camera capture option for mobile devices using `<input type="file" capture="camera">`
  - Preview section to show the selected image before scanning
- **UI Elements:**
  - "Upload" and "Scan" buttons styled with EcoPay theme (#27AE60 primary color)
  - Progress bar or loader during scanning process

### Backend Implementation
- **API Endpoint:**
  - `POST /api/waste/scan`
  - Accepts multipart/form-data containing the image file
- **Processing:**
  - Image is passed to a machine learning model trained on waste image datasets
  - The model returns:
    - Waste category
    - Confidence percentage
    - Estimated weight
- **Response Example (JSON):**
```json
{
  "status": "success",
  "category": "Plastic Bottle",
  "confidence": 0.94,
  "estimated_weight": "0.5 kg",
  "reward_points": 10
}
```

---

## Security & Validation
- Validate file type and size before upload
- Sanitize file name to prevent injection attacks
- Use HTTPS to secure image upload
- Store images in secure cloud storage with expiration

---

## Future Enhancements
- Support for additional waste types (glass, metal, organic waste)
- Real-time camera scanning without manual upload
- Integration with location-based recycling center suggestions
- Gamification (badges, levels) based on the amount of waste scanned

---

## Example UI Mockup (Text-based)
```
-----------------------------------
|      EcoPay Waste Scanner       |
-----------------------------------
[ Take a Photo ]   [ Upload Image ]
-----------------------------------
[ Image Preview Here ]
-----------------------------------
[ Scan Waste ]
-----------------------------------
Results:
Type: Plastic Bottle
Weight: 0.5 kg
Reward: 10 Points
-----------------------------------
```

---

## Conclusion
This feature aligns with EcoPay’s mission to promote eco-friendly waste management by making waste identification simple, accurate, and rewarding for users.
