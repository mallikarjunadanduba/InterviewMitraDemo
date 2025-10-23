// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import { gridSpacing } from 'store/constant';

const Settings = () => {
  const theme = useTheme();

  return (
    <MainCard title="UpSkills Settings">
      <Grid container spacing={gridSpacing}></Grid>
    </MainCard>
  );
};

export default Settings;
