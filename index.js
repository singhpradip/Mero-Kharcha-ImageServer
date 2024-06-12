const express = require("express");
const app = express();
const imageController = require("./controllers/imageController.js");
const multer = require("multer");

const PORT = 4001;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json({ limit: '50mb' }));

app.post("/upload", upload.single('image'), imageController.uploadImage);
app.get("/:filename", imageController.getImage);
app.delete("/:filename", imageController.deleteImage);

app.listen(PORT, () => {
  console.log(`Image server is running on port ${PORT}`);
});
