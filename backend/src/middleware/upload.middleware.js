import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

// Ensure temporary upload directory exists
const tmpDir = path.resolve("tmp");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Store uploads in a temporary folder "tmp" inside backend root
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "tmp"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = crypto.randomBytes(8).toString("hex") + ext;
    cb(null, name);
  },
});

// Accept only image files (you can extend mime types if needed)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB limit
