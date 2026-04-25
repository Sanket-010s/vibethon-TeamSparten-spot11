import "dotenv/config";
import express from "express";
import cors from "cors";
import aiTutorRouter from "./routes/aiTutor.js";
import datasetRouter from "./routes/dataset.js";

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get("/", (_, res) => res.json({ 
  status: "ok", 
  message: "AIML Nexus Backend API",
  version: "1.0.0"
}));

app.get("/health", (_, res) => res.json({ status: "ok" }));

// API routes
app.use("/api/ai-tutor", aiTutorRouter);
app.use("/api/dataset", datasetRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
