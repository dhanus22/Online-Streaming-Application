import express from "express";
import WatchHistory from "../models/WatchHistory.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Update watch progress
router.post("/update", authenticate, async (req, res) => {
  try {
    const { videoId, progress } = req.body;
    const userId = req.user.id; 

    let history = await WatchHistory.findOne({ userId, videoId });

    if (!history) {
      history = new WatchHistory({ userId, videoId, progress });
    } else {
      history.progress = progress;
      history.lastUpdated = Date.now();
    }

    await history.save();
    res.json({ success: true, message: "Watch history updated" });
  } catch (error) {
    console.error("Error updating watch history:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get user watch history
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await WatchHistory.find({ userId }).populate("videoId", "title thumbnailUrl");
    
    res.json({ success: true, history });
  } catch (error) {
    console.error("Error fetching watch history:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
