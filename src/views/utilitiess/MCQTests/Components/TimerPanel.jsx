import { Box, Typography, Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const TimerPanel = ({ initialTime, onSubmit, onExit }) => {
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
      {/* Webcam Feed */}
      <Box
        sx={{
          width: 160,
          height: 120,
          borderRadius: '8px',
          overflow: 'hidden',
          border: '2px solid #66E1E4',
          mb: 2,
        }}
      >
        <Webcam
          audio={false}
          screenshotFormat="image/jpeg"
          width={160}
          height={120}
          videoConstraints={{ facingMode: 'user' }}
        />
      </Box>

      {/* Timer Display */}
      <Typography variant="h6" align="center">{timeLeft}</Typography>
      <Typography variant="caption" align="center" display="block">Time Remaining</Typography>

      {/* Action Buttons */}
      <Stack spacing={2} mt={3} width="100%">
        <Button
          variant="contained"
          onClick={onSubmit}
          sx={{
            backgroundColor: '#43a047',
            '&:hover': { backgroundColor: '#2e7d32' }
          }}
        >
          Submit
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

export default TimerPanel;
