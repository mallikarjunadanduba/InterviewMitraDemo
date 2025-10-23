import React from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const SetPaper = () => {
  const theme = useTheme();

  return (
    <MainCard title=" Set Papers">
      <Grid container spacing={gridSpacing}></Grid>
    </MainCard>
  );
};

export default SetPaper;
