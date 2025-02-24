import React, { useEffect, useState, useRef } from "react";
import { getVideoMetadata, updateWatchHistory } from "../services/api";
import playIcon from "../assets/icons/play-icon.svg";
import pauseIcon from "../assets/icons/pause-icon.svg";
import fullscreenIcon from "../assets/icons/fullscreen-icon.svg";
import volumeIcon from "../assets/icons/volume-icon.svg";
import muteIcon from "../assets/icons/mute-icon.svg";
import { joinVideoRoom, syncPlayback, onPlaybackUpdate, disconnectSocket } from "../services/websocket";

const VideoPlayer = ({ videoId, userId }) => {
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  // Fetch video metadata on initial load
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await getVideoMetadata(videoId);
        setVideo(response);
      } catch (error) {
        console.error("Error fetching video metadata:", error);
      }
    };

    fetchVideo();
  }, [videoId]);

  // Join video room when userId and videoId are available
  useEffect(() => {
    if (videoId && userId) {
      joinVideoRoom(videoId, userId);
    }

    return () => {
      // Cleanup when the component unmounts
      disconnectSocket();
    };
  }, [videoId, userId]);

  // Handle playback updates from WebSocket
  useEffect(() => {
    const handlePlaybackUpdate = ({ action, currentTime }) => {
      if (videoRef.current) {
        if (action === "play") {
          videoRef.current.play();
          setIsPlaying(true);
        } else if (action === "pause") {
          videoRef.current.pause();
          setIsPlaying(false);
        } else if (action === "seek") {
          videoRef.current.currentTime = currentTime;
          setProgress(currentTime);
        }
      }
    };

    onPlaybackUpdate(handlePlaybackUpdate);

    return () => {
      disconnectSocket();
    };
  }, []);

  // Update the video progress and save to watch history
  const handleProgressUpdate = async (currentTime) => {
    setProgress(currentTime);
    try {
      await updateWatchHistory(userId, videoId, currentTime);
    } catch (error) {
      console.error("Error updating watch history:", error);
    }

    if (progressRef.current) {
      progressRef.current.value = (currentTime / videoRef.current.duration) * 100;
    }
  };

  // Toggle play/pause state and synchronize playback
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        syncPlayback(videoId, "pause", videoRef.current.currentTime);
      } else {
        videoRef.current.play();
        syncPlayback(videoId, "play", videoRef.current.currentTime);
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  // Toggle mute/unmute state
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? volume : 0;
      setIsMuted(!isMuted);
    }
  };

  // Handle seeking through the video
  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setProgress(seekTime);
    syncPlayback(videoId, "seek", seekTime);
  };

  // Handle fullscreen mode
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  return (
    <div className="video-player-container">
      {video ? (
        <div className="video-wrapper">
          <h2>{video.title}</h2>
          <video
            ref={videoRef}
            controls
            src={video.url}
            onTimeUpdate={(e) => handleProgressUpdate(e.target.currentTime)}
            onEnded={() => {
              setIsPlaying(false);
              setProgress(0);
            }}
          />
          <div className="video-controls">
            <button onClick={togglePlayPause}>
              <img src={isPlaying ? pauseIcon : playIcon} alt="Play/Pause" />
            </button>
            <input
              type="range"
              ref={progressRef}
              min="0"
              max="100"
              step="0.1"
              value={(progress / videoRef.current?.duration) * 100}
              onChange={handleSeek}
              className="progress-bar"
            />
            <button onClick={toggleMute}>
              <img src={isMuted ? muteIcon : volumeIcon} alt="Volume" />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
            <button onClick={handleFullscreen}>
              <img src={fullscreenIcon} alt="Fullscreen" />
            </button>
          </div>
        </div>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default VideoPlayer;
