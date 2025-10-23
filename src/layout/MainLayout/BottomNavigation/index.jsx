import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme, Avatar, ButtonBase } from '@mui/material';
import { Home, Person } from '@mui/icons-material';
import { IconMenu2, IconSearch, IconBell } from '@tabler/icons-react';
import SearchSection from '../Header/SearchSection';
import NotificationSection from '../Header/NotificationSection';
import ProfileSection from '../Header/ProfileSection';
import SwitchSection from '../Header/SwitchSection';

const BottomNavigation = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navigation when scrolling down, hide when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false);
      } else {
        // Scrolling up or at top
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  if (!isMobile) return null;

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: isVisible ? 0 : '-100px',
      left: 0, 
      right: 0, 
      backgroundColor: 'white', 
      borderRadius: '20px 20px 0 0',
      px: 2,
      py: 1,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      border: '1px solid rgba(0,0,0,0.1)',
      transition: 'bottom 0.3s ease-in-out',
      transform: isVisible ? 'translateY(0)' : 'translateY(100px)'
    }}>
      {/* Home */}
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
        >
          <Home />
        </Avatar>
      </ButtonBase>
      
      {/* Search - using actual SearchSection component */}
      <SearchSection />
      
      {/* Notifications - using actual NotificationSection component */}
      <NotificationSection />
      
      {/* Menu */}
      <ButtonBase
        onClick={handleLeftDrawerToggle}
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
        >
          <IconMenu2 stroke={1.5} size="1.3rem" />
        </Avatar>
      </ButtonBase>
      
      {/* Profile - with full functionality (moved to rightmost position) */}
      <ProfileSection />
    </Box>
  );
};

export default BottomNavigation;
