import { Server } from "socket.io";
import { createServer } from "http";
import mongoose from "mongoose";

// Bidding Strategy Schema
const BiddingStrategySchema = new mongoose.Schema({
  strategyId: String,
  campaignId: String,
  biddingType: {
    type: String,
    enum: ["automatic", "manual"],
    default: "manual",
  },
  currentBid: {
    type: Number,
    default: 5.0,
  },
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    spend: { type: Number, default: 0 },
  },
  targetMetrics: {
    ctr: { type: Number, default: 2.0 },
    conversionRate: { type: Number, default: 5.0 },
    roas: { type: Number, default: 2.0 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BiddingStrategy = mongoose.model(
  "BiddingStrategy",
  BiddingStrategySchema
);

// Add this to your existing Express app setup
export function setupBiddingServer(app) {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Bidding calculations
  const calculateMetrics = (metrics) => {
    const impressionsInThousands = metrics.impressions / 1000;
    return {
      ctr:
        metrics.impressions > 0
          ? (metrics.clicks / metrics.impressions) * 100
          : 0,
      cpc: metrics.clicks > 0 ? metrics.spend / metrics.clicks : 0,
      cpm: metrics.impressions > 0 ? metrics.spend / impressionsInThousands : 0,
      conversionRate:
        metrics.clicks > 0 ? (metrics.conversions / metrics.clicks) * 100 : 0,
      cpa: metrics.conversions > 0 ? metrics.spend / metrics.conversions : 0,
      roas: metrics.spend > 0 ? (metrics.conversions * 100) / metrics.spend : 0,
    };
  };

  const calculateOptimalBid = (metrics, currentBid, targetMetrics) => {
    let bidMultiplier = 1;
    const calculatedMetrics = calculateMetrics(metrics);

    if (calculatedMetrics.ctr < targetMetrics.ctr) {
      bidMultiplier *= 0.95;
    } else if (calculatedMetrics.ctr > targetMetrics.ctr * 1.2) {
      bidMultiplier *= 1.05;
    }

    if (calculatedMetrics.conversionRate < targetMetrics.conversionRate) {
      bidMultiplier *= 0.95;
    } else if (
      calculatedMetrics.conversionRate >
      targetMetrics.conversionRate * 1.2
    ) {
      bidMultiplier *= 1.05;
    }

    if (calculatedMetrics.roas < targetMetrics.roas) {
      bidMultiplier *= 0.9;
    } else if (calculatedMetrics.roas > targetMetrics.roas * 1.2) {
      bidMultiplier *= 1.1;
    }

    return Math.max(currentBid * bidMultiplier, 0.01);
  };

  // Socket.IO event handlers
  io.on("connection", async (socket) => {
    console.log("Client connected to bidding server");

    socket.on("joinStrategy", async (strategyId) => {
      socket.join(strategyId);
      try {
        let strategy = await BiddingStrategy.findOne({ strategyId });
        if (!strategy) {
          strategy = await BiddingStrategy.create({ strategyId });
        }
        socket.emit("currentBid", {
          strategyId,
          bid: strategy.currentBid,
          metrics: calculateMetrics(strategy.metrics),
        });
      } catch (error) {
        console.error("Error joining strategy:", error);
      }
    });

    socket.on("updateBid", async ({ strategyId, bid, isAutomatic }) => {
      try {
        const strategy = await BiddingStrategy.findOne({ strategyId });
        if (!strategy) return;

        strategy.currentBid = bid;
        strategy.biddingType = isAutomatic ? "automatic" : "manual";
        strategy.updatedAt = new Date();
        await strategy.save();

        io.to(strategyId).emit("bidUpdated", {
          strategyId,
          bid,
          metrics: calculateMetrics(strategy.metrics),
        });

        if (isAutomatic) {
          const interval = setInterval(async () => {
            const updatedStrategy = await BiddingStrategy.findOne({
              strategyId,
            });
            if (
              !updatedStrategy ||
              updatedStrategy.biddingType !== "automatic"
            ) {
              clearInterval(interval);
              return;
            }

            const optimalBid = calculateOptimalBid(
              updatedStrategy.metrics,
              updatedStrategy.currentBid,
              updatedStrategy.targetMetrics
            );

            updatedStrategy.currentBid = optimalBid;
            await updatedStrategy.save();

            io.to(strategyId).emit("bidUpdated", {
              strategyId,
              bid: optimalBid,
              metrics: calculateMetrics(updatedStrategy.metrics),
            });
          }, 5000);

          socket.on("disconnect", () => {
            clearInterval(interval);
          });
        }
      } catch (error) {
        console.error("Error updating bid:", error);
      }
    });

    socket.on("trackEvent", async ({ strategyId, eventType, data }) => {
      try {
        const strategy = await BiddingStrategy.findOne({ strategyId });
        if (!strategy) return;

        switch (eventType) {
          case "impression":
            strategy.metrics.impressions++;
            strategy.metrics.spend += data.cost || 0;
            break;
          case "click":
            strategy.metrics.clicks++;
            break;
          case "conversion":
            strategy.metrics.conversions++;
            break;
        }

        await strategy.save();
        io.to(strategyId).emit("metricsUpdated", {
          strategyId,
          metrics: calculateMetrics(strategy.metrics),
        });
      } catch (error) {
        console.error("Error tracking event:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from bidding server");
    });
  });

  // Add these routes to your existing Express app
  app.post("/api/bidding/track", async (req, res) => {
    try {
      const { strategyId, eventType, data } = req.body;
      const strategy = await BiddingStrategy.findOne({ strategyId });
      if (!strategy) {
        return res.status(404).json({ error: "Strategy not found" });
      }

      switch (eventType) {
        case "impression":
          strategy.metrics.impressions++;
          strategy.metrics.spend += data.cost || 0;
          break;
        case "click":
          strategy.metrics.clicks++;
          break;
        case "conversion":
          strategy.metrics.conversions++;
          break;
      }

      await strategy.save();
      io.to(strategyId).emit("metricsUpdated", {
        strategyId,
        metrics: calculateMetrics(strategy.metrics),
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking event:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/bidding/metrics/:strategyId", async (req, res) => {
    try {
      const { strategyId } = req.params;
      const strategy = await BiddingStrategy.findOne({ strategyId });
      if (!strategy) {
        return res.status(404).json({ error: "Strategy not found" });
      }

      res.json(calculateMetrics(strategy.metrics));
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}

// Test the setup
console.log(
  "Bidding server integration is ready to be added to your Express app"
);
