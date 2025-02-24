import mongoose from "mongoose";

const WatchHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  progress: { type: Number, default: 0 }, // Time in seconds
  lastUpdated: { type: Date, default: Date.now }
});

const WatchHistory = mongoose.model("WatchHistory", WatchHistorySchema);
export default WatchHistory;
