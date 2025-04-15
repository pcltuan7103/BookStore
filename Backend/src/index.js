import express from "express";
import "dotenv/config";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import booksRoutes from "./routes/booksRoutes.js";

import { connectToDatabase } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToDatabase()
});