import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { getVideoMetadata, updateWatchHistory, getWatchHistory } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AuthProvider from "../context/AuthContext"; 
import io from "socket.io-client";
import playIcon from "../assets/icons/play-icon.svg";
import pauseIcon from "../assets/icons/pause-icon.svg";
import fastForwardIcon from "../assets/icons/fast-forward.svg";
import speedIcon from "../assets/icons/speed-icon.svg";
import emojiIcon from "../assets/icons/emoji-icon.svg";
import VideoPlayer from "../components/VideoPlayer";
import LiveChat from "../components/LiveChat";

const socket = io(process.env.REACT_APP_SOCKET_SERVER);

const Watch = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [reactions, setReactions] = useState([]);
  const videoRef = useRef(null);
  const { videoId } = useParams();

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const videoData = await getVideoMetadata(id);
        setVideo(videoData);

        if (user) {
          const historyData = await getWatchHistory(user.id, id);
          setPlaybackTime(historyData.lastPosition || 0);
        }
      } catch (err) {
        setError("Error loading video");
        console.error("Video fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();

    if (user) {
      socket.emit("startWatching", { userId: user.id, videoId: id });
      socket.emit("requestSync", { videoId: id });
    }

    socket.on("syncPlayback", ({ time, playing }) => {
      if (videoRef.current) {
        if (Math.abs(videoRef.current.currentTime - time) > 2) {
          videoRef.current.currentTime = time;
        }
        setPlaying(playing);
        playing ? videoRef.current.play() : videoRef.current.pause();
      }
    });

    socket.on("receiveComment", (newComment) => {
      setComments((prev) => [...prev, newComment]);
    });

    socket.on("receiveReaction", (newReaction) => {
      setReactions((prev) => [...prev, newReaction]);
    });

    return () => {
      if (user) {
        socket.emit("stopWatching", { userId: user.id, videoId: id });
      }
      socket.off("syncPlayback");
      socket.off("receiveComment");
      socket.off("receiveReaction");
    };
  }, [id, user]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
      socket.emit("videoPlay", { videoId: id, time: videoRef.current.currentTime });
    } else {
      videoRef.current.pause();
      setPlaying(false);
      socket.emit("videoPause", { videoId: id, time: videoRef.current.currentTime });
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || !user) return;
    const currentTime = videoRef.current.currentTime;
    setPlaybackTime(currentTime);
    socket.emit("seekUpdate", { videoId: id, time: currentTime });
    if (Math.abs(currentTime - playbackTime) > 10) {
      updateWatchHistory(user.id, id, currentTime);
    }
  };

  const skipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const changePlaybackSpeed = () => {
    if (videoRef.current) {
      const newSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
      setPlaybackSpeed(newSpeed);
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const sendComment = () => {
    if (comment.trim()) {
      const newComment = { user: user.name, text: comment };
      socket.emit("sendComment", newComment);
      setComment("");
    }
  };

  const sendReaction = (emoji) => {
    const newReaction = { user: user.name, emoji };
    socket.emit("sendReaction", newReaction);
  };

  if (loading) return <p>Loading video...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="watch-container">
      <h2>{video.title}</h2>
      <div className="video-wrapper">
        <video
          ref={videoRef}
          src={video.streamUrl}
          controls
          autoPlay
          onLoadedMetadata={() => (videoRef.current.currentTime = playbackTime)}
          onPlay={() => socket.emit("videoPlay", { videoId: id })}
          onPause={() => socket.emit("videoPause", { videoId: id })}
          onTimeUpdate={handleTimeUpdate}
        />
        <div className="controls">
          <button className="play-pause-btn" onClick={togglePlayPause}>
            <img src={playing ? pauseIcon : playIcon} alt="Play/Pause" />
          </button>
          <button className="skip-btn" onClick={skipIntro}>
            <img src={fastForwardIcon} alt="Skip Intro" />
          </button>
          <button className="speed-btn" onClick={changePlaybackSpeed}>
            <img src={speedIcon} alt="Speed" /> x{playbackSpeed}
          </button>
        </div>
      </div>
      <p>{video.description}</p>

      <div className="comments-section">
        <h3>Live Comments</h3>
        <div className="comments-list">
          {comments.map((c, index) => (
            <p key={index}><strong>{c.user}:</strong> {c.text}</p>
          ))}
        </div>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={sendComment}>Send</button>
      </div>

      <div className="reactions-section">
        <h3>Reactions</h3>
        <button onClick={() => sendReaction("👍")}>👍</button>
        <button onClick={() => sendReaction("❤️")}>❤️</button>
        <button onClick={() => sendReaction("😂")}>😂</button>
      </div>

      <div className="watch-page">
      <VideoPlayer videoId={videoId} />
      <LiveChat />
    </div>
    </div>
  );
};

export default Watch;