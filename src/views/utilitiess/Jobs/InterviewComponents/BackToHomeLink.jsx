import React from 'react';
import { Stack, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const BackToHomeLink = () => (
  <Stack mt={3}>
    <Link component={RouterLink} to="/" underline="hover">
      Back to Interview Home
    </Link>
  </Stack>
);

export default BackToHomeLink;
