require("dotenv").config();
var express = require("express");
var cors = require("cors");
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
    console.log("Failed to connect to Database", error);
  }
};

connectDB();

const imageFileSchema = new Schema({
  upfile: {
    type: String,
  },
});

const Image = mongoose.model("Image", imageFileSchema);
module.exports = Image;

//Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;

var app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/upload", upload.single("upfile"), async (req, res) => {
  try {
    const { filename, originalname, size } = req.file;

    const newImage = new Image({
      upfile: filename,
    });

    await newImage.save();

    res.json({ filename, originalname, size });
  } catch (error) {
    console.error("Error uploading file", error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
