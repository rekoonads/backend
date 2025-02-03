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
import newRoute from "./routes/adserver.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import multer from "multer";
import pkg2 from "cloudinary";
const { v2: cloudinary } = pkg2;
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cron from "node-cron";
import Bidder from "./models/bidder.js";
import hypervergeRouter from "./routes/hyperverge.js";
import useragent from "express-useragent";
import fetch from "node-fetch";
import path from "path";
import { setupBiddingServer } from "./bidding-server.js";

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
        folder: "video_ads",
      };
    } else if (file.mimetype.startsWith("image/")) {
      return {
        resource_type: "image",
        folder: "banner_ads",
      };
    } else {
      throw new Error("Unsupported file type");
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

// Helper function to get client IP
function getRandomIp() {
  return Array(4)
    .fill(0)
    .map(() => Math.floor(Math.random() * 256))
    .join(".");
}

// Function to check if IP is localhost or reserved
function isReservedIP(ip) {
  if (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return true;
  }
  return false;
}

// Function to extract IPv4 from request
function getIPv4(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    for (const ip of ips) {
      if (!isReservedIP(ip)) {
        return ip;
      }
    }
  }

  if (!isReservedIP(req.ip)) {
    return req.ip;
  }

  return getRandomIp();
}

const { urlencoded, json } = pkg;
const PORT = process.env.PORT || 8080;

const app = express();
app.use(useragent.express());
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
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Hello World from backend" });
});
app.use("/", apiRouter);
app.use("/api/payment", payment);
app.use("/api/hyperverge", hypervergeRouter);
app.use(newRoute);
app.use("/api/campaigns", campaignRoutes);
app.post("/upload_video", upload.single("video"), (req, res) => {
  if (req.file && req.file.path) {
    console.log("File uploaded:", req.file);
    res.json({ url: req.file.path });
  } else {
    console.error("File upload failed:", req.file);
    res.status(400).json({ error: "Video upload failed" });
  }
});

// API endpoint for IP and geolocation
app.get("/api/track-ip", async (req, res) => {
  try {
    const ip = req.query.ip || getRandomIp();
    console.log(`Tracking IP: ${ip}`);

    // Fetch geolocation data
    const geoResponse = await fetch(`https://ipapi.com/ip_api.php?ip=${ip}`);
    const geoData = await geoResponse.json();

    if (geoData.error) {
      console.log(`Error from ipapi.com: ${JSON.stringify(geoData)}`);
      return res
        .status(404)
        .json({ error: "Geolocation information not found", ip });
    }

    // Fetch user agent data
    const uaResponse = await fetch(
      `http://ip-api.com/json/${ip}?fields=mobile`
    );
    const uaData = await uaResponse.json();

    res.json({
      ip: geoData.ip,
      country: geoData.country_name,
      region: geoData.region,
      city: geoData.city,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      timezone: geoData.timezone,
      isp: geoData.connection.isp || geoData.connection.org,
      deviceType: uaData.mobile ? "Mobile" : "Desktop",
    });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a test endpoint to check the current IP
app.get("/api/current-ip", (req, res) => {
  const ip = getIPv4(req);
  res.json({ ip });
});

app.get("/api/ip-lookup", async (req, res) => {
  try {
    const { ip } = req.query;
    if (!ip) {
      return res.status(400).json({ error: "IP address is required" });
    }

    const geoResponse = await fetch(`https://ipapi.com/ip_api.php?ip=${ip}`);
    const geoData = await geoResponse.json();

    if (geoData.error) {
      return res
        .status(404)
        .json({ error: "Geolocation information not found", ip });
    }

    res.json({
      ip: geoData.ip,
      country: geoData.country_name,
      region: geoData.region,
      city: geoData.city,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
    });
  } catch (error) {
    console.error("Error in IP lookup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/strategy", async (req, res) => {
  try {
    const { targetedAgeGroups, targetedIPs, ...otherData } = req.body;

    const strategyData = {
      ...otherData,
      targetedAgeGroups,
      targetedIPs,
    };

    const database = client.db("adtech"); // Replace 'adtech' with your actual database name
    const strategies = database.collection("strategies");

    const result = await strategies.insertOne(strategyData);

    res.json({
      message: "Strategy saved successfully",
      data: { ...strategyData, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error saving strategy:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/location-ips", async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    // This is a mock implementation. In a real-world scenario, you would use a
    // geolocation database or API to fetch actual IP ranges for the given location.
    const mockIPs = Array.from({ length: 10 }, () =>
      Array(4)
        .fill(0)
        .map(() => Math.floor(Math.random() * 256))
        .join(".")
    );

    res.json({ ips: mockIPs });
  } catch (error) {
    console.error("Error fetching location IPs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Save server loader function
let server;
Promise.all([mongo()])
  .then(() => {
    const httpServer = setupBiddingServer(app);
    server = httpServer.listen(PORT, () => {
      console.log(`The Server is running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    if (server) {
      server.close();
    }

    console.log("Restarting the server...");
    const httpServer = setupBiddingServer(app);
    server = httpServer.listen(PORT, () => {
      console.log(`The Server has been restarted on ${PORT}`);
    });
  });
