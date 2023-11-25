var express = require("express");
var cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
require("dotenv").config();
const Schema = mongoose.Schema;

const connectDB = async () => {
  const mongoose = require("mongoose");

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
};

connectDB();

const imageFileSchema = new mongoose.Schema({
  image: {
    type: String, 
  },
});

const Image = mongoose.model("Image", imageFileSchema); 
module.exports = Image;

var app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
