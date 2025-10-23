import { Box, Typography, Grid, Paper } from '@mui/material';

const SidebarNavigation = ({ totalQuestions, currentQuestion, onNavigate, questionStatus = [] }) => {
  const getStatusColor = (index) => {
    const question = questionStatus.find((q) => q.id === index + 1);
    if (currentQuestion === index + 1) return { bg: '#1976d2', color: '#fff' };         // current
    if (question?.status === 'answered') return { bg: '#4caf50', color: '#fff' };       // green
    if (question?.status === 'review') return { bg: '#9c27b0', color: '#fff' };         // purple
    return { bg: '#fff', color: '#000' };                                               // default
  };

  const renderButtons = () => {
    return Array.from({ length: totalQuestions }, (_, i) => {
      const { bg, color } = getStatusColor(i);
      return (
        <Grid item xs={3} sm={2} md={2} key={i}>
          <Paper
            onClick={() => onNavigate(i + 1)}
            elevation={currentQuestion === i + 1 ? 4 : 1}
            sx={{
              padding: '6px 0',
              textAlign: 'center',
              bgcolor: bg,
              color: color,
              cursor: 'pointer',
              borderRadius: '6px',
              fontWeight: 500,
            }}
          >
            {i + 1}
          </Paper>
        </Grid>
      );
    });
  };

  return (
    <Box p={2}  bgcolor="rgba(102, 225, 228, 0.3)"  height="100%">
      <Typography variant="h6" mb={2}>Sections</Typography>
      <Typography variant="subtitle1" gutterBottom>Technical  - 1</Typography>
      <Grid container spacing={1}>
        {renderButtons()}
      </Grid>
    </Box>
  );
};

export default SidebarNavigation;
