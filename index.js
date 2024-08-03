import express from "express";
import { mongo } from "./db/mongoConnection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import pkg from "body-parser";
import apiRouter from "./routes/api.js";
import helment from "helmet";
import compression from "compression";
import multer from "multer";
import Razorpay from "razorpay";

const { urlencoded, json } = pkg;
const PORT = process.env.PORT || 8080;

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cookieParser());
app.use(helment());
app.use(compression());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Origin", "https://rekoon-ads.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.post("/orders", async (req, res) => {
  const razorpay = new Razorpay({
    key_id: "rzp_live_Av2lUuqQk77kId",
    key_secret: "drJ9A1vjLMlGKS8rTwQgwTZZ",
  });

  const options = {
    amount: req.body.amount,
    currency: req.body.currency,
    receipt: "receipt#1",
    payment_capture: 1,
  };
  try {
    const response = await razorpay.orders.create(options);

    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });

    res.json({});
  } catch (error) {
    res.status(500).send("Internnal server error");
  }
});

app.get("/payment/:paymentId", async (req, res) => {
  const { paymentId } = req.params;

  const razorpay = new Razorpay({
    key_id: "rzp_live_Av2lUuqQk77kId",
    key_secret: "drJ9A1vjLMlGKS8rTwQgwTZZ",
  });

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    if (!payment) {
      return res.status(500).json("Error at razorpay loading");
    }

    res.json({
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency,
    });
  } catch (error) {
    res.status(500).json("failed  to fetch");
  }
});

// app.use(cors({
//   origin:['http://localhost:5173'],
//   methods: ['GET','POST','PATCH','PUT','DELETE']
// }))

//Routing
app.use("/", apiRouter);

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
