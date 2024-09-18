import express from "express";
import { mongo } from "./db/mongoConnection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import pkg from "body-parser";
import apiRouter from "./routes/api.js";
import helmet from "helmet";
import compression from "compression";
import payment from "./routes/payment.js";
import multer from "multer";
import pkg2 from "cloudinary";
const { v2: cloudinary } = pkg2;
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cron from "node-cron";
import Bidder from "./models/bidder.js";
import hypervergeRouter from "./routes/hyperverge.js";

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
function formatDateToCustomString(date) {
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}
const updateStatus = async () => {
  try {
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().split("T")[0]; // Format current date to 'YYYY-MM-DD'

    const result = await Bidder.updateMany(
      { endDate: { $lt: formattedCurrentDate } },
      { $set: { status: "Inactive" } }
    );

    console.log(`${result.modifiedCount} documents were updated to inactive.`);
  } catch (err) {
    console.error("Error updating documents:", err);
  }
};

cron.schedule("0 0 * * *", updateStatus);
updateStatus();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
});
const { urlencoded, json } = pkg;
const PORT = process.env.PORT || 8080;

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routing
app.get("/", (req, res) => {
  res.json({ message: "Hello World from backend" });
});
app.use("/", apiRouter);
app.use("/api/payment", payment);
app.use("/api/hyperverge", hypervergeRouter);

app.post("/upload_video", upload.single("video"), (req, res) => {
  if (req.file && req.file.path) {
    console.log("File uploaded:", req.file);
    res.json({ url: req.file.path });
  } else {
    console.error("File upload failed:", req.file);
    res.status(400).json({ error: "Video upload failed" });
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
