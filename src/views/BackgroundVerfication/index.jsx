import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports

import { gridSpacing } from 'store/constant';
import Banner from 'views/dashboard/Banner';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const BackgroundVerfication = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Banner isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default  BackgroundVerfication;
