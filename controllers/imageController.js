const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    const originalname = image.originalname;
    
    // Use the buffer property directly
    const buffer = image.buffer;
    console.log(buffer);
    const filename = `${Date.now()}-${originalname}`;
    const originalPath = path.join(__dirname, "../../images/original/", filename);
    const optimizedPath = path.join(__dirname, "../../images/optimized/", filename);

    await fs.promises.writeFile(originalPath, Buffer.from(buffer));

    await sharp(originalPath).resize(800).toFile(optimizedPath);

    fs.unlinkSync(originalPath); // problem here, permission related

    const imageUrl = `/images/optimized/${filename}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.log(error);
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
