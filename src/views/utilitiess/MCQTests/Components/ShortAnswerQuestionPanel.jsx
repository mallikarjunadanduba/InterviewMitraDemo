import { Box, Typography, TextField, Paper, Divider } from '@mui/material';

const ShortAnswerQuestionPanel = ({ questionData, selectedAnswer, onAnswerChange, showAnswers }) => {
  return (
    <Box p={3} bgcolor="white" borderRadius={2} boxShadow={1}>
      <Typography variant="h6" gutterBottom>
        Question
      </Typography>
      <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
        (Write your answer in the text box below)
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
        {questionData.question}
      </Typography>
      
      <TextField
        fullWidth
        multiline
        rows={6}
        variant="outlined"
        placeholder="Type your answer here..."
        value={selectedAnswer}
        onChange={onAnswerChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '1rem',
            lineHeight: 1.5,
          },
        }}
      />

      {showAnswers && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              bgcolor: '#e8f5e8', 
              border: '1px solid #4caf50',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" color="success.main" gutterBottom>
              Correct Answer:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {questionData.expectedAnswer}
            </Typography>
            {questionData.wordLimit && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Suggested word limit: {questionData.wordLimit} words
              </Typography>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ShortAnswerQuestionPanel;
