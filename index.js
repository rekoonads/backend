import express from "express";
import { mongo } from "./db/mongoConnection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import pkg from "body-parser";
import apiRouter from "./routes/api.js";
import helment from "helmet";
import compression from "compression";
import payment from "./routes/payment.js";

import multer from "multer";
import pkg2 from "cloudinary";
const { v2: cloudinary } = pkg2;
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.mimetype.startsWith("video/")) {
      return {
        resource_type: "video",
      };
    } else {
      return {
        resource_type: "image",
      };
    }
  },
});

const upload = multer({ storage: storage });

const { urlencoded, json } = pkg;
const PORT = process.env.PORT || 8080;

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cookieParser());
app.use(helment());
app.use(compression());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Origin", "https://rekoon-ads.vercel.app");
  res.header(
    "Access-Control-Allow-Origin",
    "https://api.cashfree.com/verification/gstin"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://rekoon-ads.vercel.app"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);

//Routing
app.use("/", apiRouter);
app.use("/api/payment", payment);

app.post("/upload_video", upload.single("video"), (req, res) => {
  if (req.file && req.file.path) {
    res.json({ url: req.file.path });
  } else {
    res.status(400).json({ error: "Image upload failed" });
  }
});

// Save server loader function
let server;
Promise.all([mongo()])
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`The Server is running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    if (server) {
      server.close();
    }

    console.log("Restarting the server...");
    server = app.listen(PORT, () => {
      console.log(`The Server has been restarted on ${PORT}`);
    });
  });
