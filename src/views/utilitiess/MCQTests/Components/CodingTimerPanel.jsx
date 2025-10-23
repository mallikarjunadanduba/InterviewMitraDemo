import { Box, Typography, Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

const CodingTimerPanel = ({ initialTime, onSubmit, onExit, onShowAnswers, showAnswers }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const [h, m, s] = prev.split(':').map(Number);
        let totalSeconds = h * 3600 + m * 60 + s - 1;
        if (totalSeconds <= 0) {
          clearInterval(timer);
          onSubmit();
          return '00:00:00';
        }
        const newH = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const newM = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const newS = String(totalSeconds % 60).padStart(2, '0');
        return `${newH}:${newM}:${newS}`;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onSubmit]);

  return (
    <Box
      p={2}
      bgcolor="rgba(102, 225, 228, 0.3)"
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {/* Timer Display */}
      <Typography variant="h6" align="center" sx={{ mt: 2 }}>{timeLeft}</Typography>
      <Typography variant="caption" align="center" display="block" sx={{ mb: 3 }}>Time Remaining</Typography>

      {/* Action Buttons */}
      <Stack spacing={2} width="100%">
        <Button
          variant="contained"
          onClick={onShowAnswers}
          sx={{
            backgroundColor: showAnswers ? '#ff9800' : '#2196f3',
            '&:hover': { 
              backgroundColor: showAnswers ? '#f57c00' : '#1976d2' 
            }
          }}
        >
          {showAnswers ? 'Hide Answers' : 'Show Correct Answers'}
        </Button>
        
        <Button
          variant="contained"
          onClick={onSubmit}
          sx={{
            backgroundColor: '#43a047',
            '&:hover': { backgroundColor: '#2e7d32' }
          }}
        >
          Submit Practice
        </Button>
        
        <Button
          variant="contained"
          onClick={onExit}
          sx={{
            backgroundColor: '#e53935',
            '&:hover': { backgroundColor: '#c62828' }
          }}
        >
          Exit
        </Button>
      </Stack>
    </Box>
  );
};

export default CodingTimerPanel;
