import Redis from "ioredis";
const redis = new Redis();

export const getVideos = async (req, res) => {
  const cachedVideos = await redis.get("videos");

  if (cachedVideos) {
    return res.json(JSON.parse(cachedVideos));
  }

  const videos = await Video.find();
  await redis.set("videos", JSON.stringify(videos), "EX", 60 * 5); // Cache for 5 min
  res.json(videos);
};
