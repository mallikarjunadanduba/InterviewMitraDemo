import React from 'react';
import { Typography } from '@mui/material';

const ReportHeader = ({ sessionId }) => (
  <Typography variant="h4" fontWeight="bold" gutterBottom>
    Interview Report for Session: {sessionId}
  </Typography>
);

export default ReportHeader;
