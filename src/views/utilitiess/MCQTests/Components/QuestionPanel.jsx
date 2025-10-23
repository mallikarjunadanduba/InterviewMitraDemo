import { Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const QuestionPanel = ({ questionData, selectedOption, onSelect }) => {
  return (
    <Box p={3} bgcolor="white" borderRadius={2} boxShadow={1}>
      <Typography variant="h6" gutterBottom>
        Question
      </Typography>
      <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
        (Correct Answer: 1 Mark, Wrong Answer: -0.25 Mark)
      </Typography>
      <Typography variant="body1" gutterBottom>
        {questionData.question}
      </Typography>
      <RadioGroup value={selectedOption} onChange={onSelect}>
        {questionData.options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={`${index + 1}. ${option}`}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default QuestionPanel;