import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/index.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Root check
app.get("/", (req, res) => res.send("🚀 API is running..."));

// ✅ All API routes
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
