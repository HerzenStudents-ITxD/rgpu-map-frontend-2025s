import { CSSProperties } from 'react';

interface AvatarBoxProps {
  imageUrl?: string | null;
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
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%'
  };

  const getImageUrl = () => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('data:')) return imageUrl;
    if (/^[A-Za-z0-9+/]+={0,2}$/.test(imageUrl)) {
      return `data:image/jpeg;base64,${imageUrl}`;
    }
    return imageUrl;
  };

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: color,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontSize: size * 0.4,
      fontWeight: 'bold'
    }}>
      {getImageUrl() ? (
        <img 
          src={getImageUrl()!} 
          alt={name}
          style={imageStyle}
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