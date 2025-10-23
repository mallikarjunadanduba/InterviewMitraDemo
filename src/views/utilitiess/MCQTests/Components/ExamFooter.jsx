import { Box, Button, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ExamFooter = ({ onMarkReview, onClear, onSave, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box px={3} py={2} bgcolor="white" borderTop={1} borderColor="divider">
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={6} sm="auto">
          <Button
            fullWidth={isMobile}
            variant="contained"
            onClick={onMarkReview}
            sx={{
              backgroundColor: "#fbc02d",
              color: "#000",
              '&:hover': { backgroundColor: "#f9a825" },
            }}
          >
            Mark for Review
          </Button>
        </Grid>

        <Grid item xs={6} sm="auto">
          <Button
            fullWidth={isMobile}
            variant="contained"
            onClick={onClear}
            sx={{
              backgroundColor: "#e53935",
              '&:hover': { backgroundColor: "#c62828" },
            }}
          >
            Clear
          </Button>
        </Grid>

        <Grid item xs={6} sm="auto">
          <Button
            fullWidth={isMobile}
            variant="contained"
            onClick={onSave}
            sx={{
              backgroundColor: "#1e88e5",
              '&:hover': { backgroundColor: "#1565c0" },
            }}
          >
            Save & Next
          </Button>
        </Grid>

        <Grid item xs={6} sm="auto">
          <Button
            fullWidth={isMobile}
            variant="contained"
            onClick={onSubmit}
            sx={{
              backgroundColor: "#43a047",
              '&:hover': { backgroundColor: "#2e7d32" },
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExamFooter;
