import express from "express";
import { mongo } from "./db/mongoConnection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import pkg from "body-parser";
import apiRouter from "./routes/api.js";
import helment from "helmet";
import compression from "compression";

const { urlencoded, json } = pkg;
const PORT = process.env.PORT || 8080;

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cookieParser());
app.use(helment());
app.use(compression());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Replace with your client’s URL
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//Routing
app.use("/", apiRouter);

// app.use(
//   cors({
//     origin: "http://localhost:5173", // Replace with your client’s URL
//     methods: ["GET", "POST", "PUT", "DELETE"], // Adjust methods as needed
//     allowedHeaders: ["Content-Type", "application/json"], // Adjust headers as needed
//   })
// );

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
