import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb( 
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files are allowed"),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

export default upload;