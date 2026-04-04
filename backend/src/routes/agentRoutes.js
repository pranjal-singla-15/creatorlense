import express from "express";
import {
  chatWithAgent,
  compareCreators,
  getCatalog,
  getInsight,
  isExternalAgentAvailable,
  resetSession,
  searchCatalog,
} from "../services/creatorAgentService.js";

const router = express.Router();

router.get("/health", async (_req, res) => {
  const externalAvailable = await isExternalAgentAvailable();

  res.json({
    ok: true,
    message: "CreatorLens agent gateway is running",
    externalAvailable,
  });
});

router.get("/catalog", (req, res) => {
  const query = req.query.q || "";
  const creators = query ? searchCatalog(query) : getCatalog();
  res.json({ creators });
});

router.post("/insights", async (req, res, next) => {
  try {
    const { creatorId } = req.body;
    if (!creatorId) {
      return res.status(400).json({ message: "creatorId is required" });
    }

    const result = await getInsight({ creatorId });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/compare", async (req, res, next) => {
  try {
    const { creatorIds = [] } = req.body;
    if (!Array.isArray(creatorIds) || creatorIds.length < 2) {
      return res.status(400).json({ message: "At least two creatorIds are required" });
    }

    const result = await compareCreators({ creatorIds });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/chat", async (req, res, next) => {
  try {
    const { sessionId, message, selectedCreatorIds = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    const result = await chatWithAgent({
      sessionId,
      message,
      selectedCreatorIds,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/session/:sessionId/reset", async (req, res, next) => {
  try {
    const removed = await resetSession(req.params.sessionId);
    res.json({
      ok: removed,
      message: removed ? "Session cleared" : "Session not found",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
