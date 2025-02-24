import React from 'react';

const Player = ({ src }) => {
  return (
    <div>
      <video controls width="100%">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Player;
