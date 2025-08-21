const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Always put uploads in backend/uploads
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only .png and .jpg are allowed"), false);
};

module.exports = multer({ storage, fileFilter });
