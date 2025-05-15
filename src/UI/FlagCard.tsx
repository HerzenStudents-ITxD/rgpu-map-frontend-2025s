import React from 'react';
import { Card, CardActionArea, CardMedia } from '@mui/material';

interface FlagCardProps {
  flagImage: string;
  alt: string;
  selected: boolean;
  onClick: () => void;
}

const FlagCard: React.FC<FlagCardProps> = ({ flagImage, alt, selected, onClick }) => {
  return (
    <Card
      sx={{
        marginBottom: '10px',
        borderRadius: '8px',
        border: selected ? '2px solid #1976d2' : '1px solid #ccc',
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          height="60"
          image={flagImage}
          alt={alt}
          sx={{ objectFit: 'cover' }}
        />
      </CardActionArea>
    </Card>
  );
};

export default FlagCard;