import React, { useRef, useState } from 'react';

const AudioPlayer = ({ src, title = "Audio Player", onPlay, onPause }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (onPause) onPause();
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
        if (onPlay) onPlay();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />
      
      <div className="audio-controls">
        <button 
          className="play-button" 
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        
        <div className="audio-progress">
          <span>{formatTime(currentTime)}</span>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${duration ? (currentTime / duration) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {title && <p className="audio-title">{title}</p>}
    </div>
  );
};

export default AudioPlayer;