import { Box, Typography, TextField, Paper, Divider, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const CodingQuestionPanel = ({ questionData, selectedAnswer, onAnswerChange, showAnswers }) => {
  return (
    <Box p={3} bgcolor="white" borderRadius={2} boxShadow={1}>
      <Typography variant="h6" gutterBottom>
        Coding Question
      </Typography>
      <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
        {questionData.questionType === 'output' ? 'Guess the output of the following code:' : 'Find the error in the following code:'}
      </Typography>
      
      {/* Code Snippet */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          bgcolor: '#f5f5f5', 
          border: '1px solid #ddd',
          borderRadius: 1,
          mb: 3,
          fontFamily: 'monospace'
        }}
      >
        <Typography 
          variant="body2" 
          component="pre" 
          sx={{ 
            whiteSpace: 'pre-wrap',
            fontSize: '0.9rem',
            lineHeight: 1.4,
            margin: 0
          }}
        >
          {questionData.codeSnippet}
        </Typography>
      </Paper>

      {/* Answer Options */}
      <Typography variant="subtitle2" gutterBottom>
        Select your answer:
      </Typography>
      
      <RadioGroup value={selectedAnswer} onChange={onAnswerChange}>
        {questionData.options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={
              <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                {option}
              </Box>
            }
          />
        ))}
      </RadioGroup>

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
            <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem', mb: 2 }}>
              {questionData.correctAnswer}
            </Box>
            
            <Typography variant="h6" color="success.main" gutterBottom>
              Explanation:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {questionData.explanation}
            </Typography>
            
            {questionData.concept && (
              <>
                <Typography variant="h6" color="success.main" gutterBottom sx={{ mt: 2 }}>
                  Key Concept:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {questionData.concept}
                </Typography>
              </>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default CodingQuestionPanel;
