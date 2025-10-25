// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import pageRoutes from "./routes/pageRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import 'dotenv/config'

dotenv.config(); 

const app = express();

app.use(cors());
app.use(express.json());

connectDB();


app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/pages", pageRoutes);
app.use("/api/courses", courseRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

