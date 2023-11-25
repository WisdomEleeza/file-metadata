require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  } catch (error) {
    console.error("Failed to connect to Database", error);
  }
};

connectDB();

const imageFileSchema = new Schema({
  upfile: {
    type: String,
  },
});

const Image = mongoose.model("Image", imageFileSchema);

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Handling file upload
app.post("/api/fileanalyse", upload.single("upfile"), async (req, res) => {
  try {
    // Access uploaded file details
    const { filename, originalname, size, mimetype } = req.file;

    // Create a new document in the Image model
    const newImage = new Image({
      upfile: filename,
    });

    // Save the document to MongoDB
    await newImage.save();

    // Respond with JSON containing file details
    res.json({
      name: filename,
      type: mimetype,
      size: size,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
