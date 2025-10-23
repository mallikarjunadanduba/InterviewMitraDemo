import React from 'react';
import { Typography } from '@mui/material';

const QuestionDisplay = ({ category, question }) => (
  <Typography sx={{ fontWeight: 600, fontSize: '18px', mt: 2 }}>
    {category && `[${category}]`} {question}
  </Typography>
);

export default QuestionDisplay;
