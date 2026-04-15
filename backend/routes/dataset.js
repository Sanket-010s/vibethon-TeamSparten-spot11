import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const points = Array.from({ length: 24 }).map((_, idx) => ({
    id: idx + 1,
    feature: Number((Math.random() * 10).toFixed(2)),
    label: Math.random() > 0.5 ? "Class A" : "Class B",
  }));

  res.json({
    source: "mock-ml-dataset-api",
    generatedAt: new Date().toISOString(),
    points,
  });
});

export default router;
