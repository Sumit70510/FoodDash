import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
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
  const isImage = file.mimetype.startsWith("image/");
  const isVideo = file.mimetype.startsWith("video/");

  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image and video files are allowed"),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 64 * 1024 * 1024,
  },
  fileFilter,
});

export default upload;