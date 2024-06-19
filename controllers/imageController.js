const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
require("dotenv").config();

const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    const { size } = req.params;

    // console.log(image);
    let buffer;
    let filename;

    if (image.buffer && image.originalname) {
      console.log("image buffer ");
      // Image buffer case
      const originalname = image.originalname;
      buffer = image.buffer;
      filename = `${Date.now()}-${originalname}`;
      console.log(filename, buffer);
    } else if (image.startsWith("data:image")) {
      console.log("base 64 image ");
      // Base64 image case
      const matches = image.match(/^data:image\/([a-zA-Z]+);base64,([^\s]+)$/);
      if (!matches) {
        return res.status(400).json({ error: "Invalid image data" });
      }
      const ext = matches[1];
      const data = matches[2];
      buffer = Buffer.from(data, "base64");
      filename = `${Date.now()}.${ext}`;
      console.log(filename, buffer);
    } else {
      return res.status(400).json({ error: "Invalid image data" });
    }

    const originalPath = path.join(
      __dirname,
      "../../images/original/",
      filename
    );
    const optimizedPath = path.join(
      __dirname,
      "../../images/optimized/",
      filename
    );

    // await fs.promises.writeFile(originalPath, Buffer.from(buffer));

    await sharp(Buffer.from(buffer))
      .resize(parseInt(size))
      .toFile(optimizedPath);

    // await fs.promises.unlink(originalPath);

    const imageUrl = `http://localhost:${process.env.PORT}/${filename}`;
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
  // console.log(filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: "Image not found" });
    }
  });
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
