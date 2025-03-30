import React from 'react';
import { Button } from '@mui/material';

interface PrimaryButtonProps {
  label: string;
  onClick: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        width: '100%',
        borderRadius: '8px',
        backgroundColor: '#1976d2',
        color: '#fff',
        textTransform: 'none',
        padding: '10px 0',
      }}
    >
      {label}
    </Button>
  );
};

export default PrimaryButton;