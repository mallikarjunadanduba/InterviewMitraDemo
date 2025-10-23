// TabErrorPage.jsx
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TabErrorPage = () => {
  const navigate = useNavigate();
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" color="error" gutterBottom>
        Multiple Tabs Detected
      </Typography>
      <Typography>
        You have already opened this exam in another tab. Please use only one tab to continue.
      </Typography>
      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => navigate("/")}>
        Return Home
      </Button>
    </Box>
  );
};

export default TabErrorPage;
