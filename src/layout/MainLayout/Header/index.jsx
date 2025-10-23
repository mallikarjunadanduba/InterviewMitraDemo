import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Avatar from '@mui/material/Avatar';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import NotificationSection from './NotificationSection';
import ProfileSection from './ProfileSection';
import SwitchSection from './SwitchSection';

// assets
import { IconMenu2 } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      {/* logo section - visible on all screen sizes */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          alignItems: 'center',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ flexGrow: 1 }}>
          <LogoSection />
        </Box>
      </Box>

      {/* header search - positioned in center - hidden on mobile */}
      <Box sx={{ 
        flexGrow: 1, 
        display: { xs: 'none', md: 'flex' }, 
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <SearchSection />
      </Box>

      {/* right side icons container - desktop */}
      <Box sx={{ 
        display: { xs: 'none', md: 'flex' }, 
        alignItems: 'center',
        gap: 1
      }}>
        {/* menu button */}
        <ButtonBase
          sx={{
            borderRadius: '8px',
            overflow: 'hidden',
            '&:hover': {
              background: 'none'
            }
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: "#2a9d8f",
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: "#2a9d8f"
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>

        {/* switch, notification & profile */}
        <SwitchSection sx={{ position: 'relative', left: '-10px' }} />
        <NotificationSection />
        <ProfileSection />
      </Box>
      
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
