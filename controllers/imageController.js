const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

const uploadImage = async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../images/original/",
      req.file.filename
    );
    const optimizedPath = path.join(
      __dirname,
      "../../images/optimized/",
      req.file.filename
    );

    await sharp(filePath).resize(800).toFile(optimizedPath);

    fs.unlinkSync(filePath);

    const imageUrl = `/images/optimized/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing image" });
  }
};

const getImage = (req, res) => {
  const filePath = path.join(
    __dirname,
    "../../images/optimized/",
    req.params.filename
  );
  res.sendFile(filePath);
};

const deleteImage = (req, res) => {
  const filePath = path.join(
    __dirname,
    "../../images/optimized/",
    req.params.filename
  );
  try {
    fs.unlinkSync(filePath);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting image" });
  }
};

module.exports = { uploadImage, getImage, deleteImage };
