// src/components/AvatarBox.tsx
import { CSSProperties } from 'react';

interface AvatarBoxProps {
  imageUrl?: string;
  name: string;
  color?: string;
  size?: number;
}

export const AvatarBox = ({ 
  imageUrl, 
  name, 
  color = '#4CAF50',
  size = 40
}: AvatarBoxProps) => {
  const initials = name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  const style: CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color,
    color: 'white',
    fontWeight: 'bold',
    fontSize: size * 0.4,
    overflow: 'hidden'
  };

  return (
    <div style={style}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        initials
      )}
    </div>
  );
};