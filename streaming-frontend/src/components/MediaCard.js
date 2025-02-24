import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

const MediaCard = ({ title, description, image, onPlay }) => {
  return (
    <Card>
      <CardMedia component="img" height="140" image={image} alt={title} />
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Button variant="contained" color="primary" onClick={onPlay}>
          Play
        </Button>
      </CardContent>
    </Card>
  );
};

export default MediaCard;
