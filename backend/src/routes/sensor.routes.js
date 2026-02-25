import { Router } from "express";
import {
  getLatestReading,
  getHistory,
} from "../services/sensorData.service.js";

const router = Router();

// Dynamic endpoints: /api/sensor/:entityId/latest and /api/sensor/:entityId/history

router.get("/:entityId/latest", async (req, res, next) => {
  try {
    const eid = req.params.entityId;
    const reading = await getLatestReading(eid);
    if (!reading) {
      return res.status(404).json({ error: "No readings found" });
    }
    res.json({
      value: reading.value,
      unit: reading.unit,
      timestamp: reading.timestamp,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:entityId/history", async (req, res, next) => {
  try {
    const eid = req.params.entityId;
    const from = req.query.from ? new Date(req.query.from) : undefined;
    const to = req.query.to ? new Date(req.query.to) : undefined;
    const limit = Math.min(parseInt(req.query.limit || "100", 10) || 100, 500);
    const rangeMinutes = parseInt(req.query.rangeMinutes || "60", 10) || 60;
    const readings = await getHistory({ entityId: eid, from, to, limit, rangeMinutes });
    res.json(readings);
  } catch (err) {
    next(err);
  }
});

export default router;
