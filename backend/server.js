import "dotenv/config";
import express from "express";
import cors from "cors";
import aiTutorRouter from "./routes/aiTutor.js";
import datasetRouter from "./routes/dataset.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use("/api/ai-tutor", aiTutorRouter);
app.use("/api/dataset", datasetRouter);

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
