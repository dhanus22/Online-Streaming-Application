import React, { useEffect, useState, useCallback } from "react";
import axios from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import debounce from "lodash.debounce";

const Browse = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch Videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/videos");
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();

    // Listen for new videos in real-time
    socket.on("newVideo", (newVideo) => {
      setVideos((prevVideos) => [newVideo, ...prevVideos]);
    });

    return () => {
      socket.off("newVideo");
    };
  }, []);

  // Debounced search function to improve performance
  const handleSearch = useCallback(
    debounce((query) => setSearch(query), 300),
    []
  );

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="browse-container">
      <h2>Browse Videos</h2>
      
      <input
        type="text"
        placeholder="Search videos..."
        onChange={(e) => handleSearch(e.target.value)}
      />

      {loading ? (
        <div className="loading-skeleton">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="skeleton-card"></div>
          ))}
        </div>
      ) : (
        <div className="video-list">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <div key={video._id} className="video-card">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  onClick={() => navigate(`/watch/${video._id}`)}
                />
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <Link to={`/watch/${video._id}`} className="watch-btn">
                  Watch Now
                </Link>
              </div>
            ))
          ) : (
            <p>No videos found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Browse;
