import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

app.use(cors({ origin: ["http://localhost:8080", "http://localhost:8081"] }));  // Frontend origins
app.use(express.json({ limit: "10mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // limit each IP to 100 requests
});
app.use(limiter);
// ✅ Connect to MongoDB
connectDB();

// ✅ Root check
app.get("/", (req, res) => res.send("🚀 API is running..."));

// ✅ All API routes
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
