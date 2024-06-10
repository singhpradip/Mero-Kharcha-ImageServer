const express = require("express");
const app = express();
const imageController = require("./controllers/imageController.js");
const multer = require("multer");
const path = require("path");

const PORT = 5001;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images/original/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), imageController.uploadImage);
app.get("/:filename", imageController.getImage);
app.delete("/:filename", imageController.deleteImage);

app.listen(PORT, () => {
  console.log(`Image server is running on port ${PORT}`);
});
