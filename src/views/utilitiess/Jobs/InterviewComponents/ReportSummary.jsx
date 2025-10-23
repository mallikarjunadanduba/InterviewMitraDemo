import React from 'react';
import { Typography } from '@mui/material';

const ReportSummary = ({ score }) => (
  <>
    <Typography variant="h5" gutterBottom>
      Summary
    </Typography>
    <Typography variant="body1" mb={3}>
      Overall Score: {score}%
    </Typography>
  </>
);

export default ReportSummary;
