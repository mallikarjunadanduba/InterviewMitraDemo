import React from 'react';
import { Box, Typography, Switch } from '@mui/material';

const ModeToggle = ({ mode, setMode }) => {
  const handleChange = (event) => {
    setMode(event.target.checked ? 'dynamic' : 'predefined');
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Switch
        checked={mode === 'dynamic'}
        onChange={handleChange}
        color="primary"
      />
      <Typography fontWeight="bold" sx={{ color: '#5f5f5f' }}>
        {mode === 'dynamic' ? 'Dynamic (GPT)' : 'Predefined'}
      </Typography>
    </Box>
  );
};

export default ModeToggle;
