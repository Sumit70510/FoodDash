import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "./public/temp";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/",
    "video/",
  ];

  const isAllowed = allowedTypes.some((type) =>
    file.mimetype.startsWith(type)
  );

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image and video files are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 64 * 1024 * 1024, // 64MB per file
    files: 20, // max files per request
  },
  fileFilter,
});

export default upload;