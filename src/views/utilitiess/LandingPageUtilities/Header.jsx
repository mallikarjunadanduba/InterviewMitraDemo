import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from 'assets/images/logo/logo.png';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Practice', href: '#features' },
    { label: 'Insights', href: '#about' }
  ];


  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', color: '#05276d', boxShadow: 'none', zIndex: 1200 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 2, minHeight: '100px', px: 0, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img 
              src={logo} 
              alt="Interview Mitra Logo" 
              style={{ height: '60px', width: 'auto' }}
            />
          </Box>
          
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
                sx={{ color: '#05276d' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {navItems.map((item) => (
                  <MenuItem key={item.label} onClick={handleMenuClose}>
                    {item.label === 'Home' ? (
                      <Button
                        component={RouterLink}
                        to="/"
                        sx={{ textTransform: 'none', color: '#05276d', '&:hover': { color: '#1bb9ea' } }}
                      >
                        {item.label}
                      </Button>
                    ) : (
                      <Button
                        component="a"
                        href={item.href}
                        sx={{ 
                          textTransform: 'none', 
                          color: '#05276d',
                          fontFamily: '"Poppins", sans-serif',
                          fontWeight: 400,
                          fontSize: '22px',
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          '&:hover': { color: '#2A9D8F' } 
                        }}
                      >
                        {item.label}
                      </Button>
                    )}
                  </MenuItem>
                ))}
                <MenuItem onClick={handleMenuClose}>
                  <Button 
                    component={RouterLink}
                    to="/login"
                    variant="contained" 
                    sx={{ 
                      textTransform: 'none',
                      backgroundColor: '#FFB366',
                      color: 'white',
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 400,
                      fontSize: '22px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      '&:hover': { backgroundColor: '#FFA500' }
                    }}
                  >
                    Join us
                  </Button>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 8, ml: 'auto' }}>
              <Box sx={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {navItems.map((item) => (
                  item.label === 'Home' ? (
                    <Button
                      key={item.label}
                      component={RouterLink}
                      to="/"
                      sx={{ 
                        textTransform: 'none', 
                        color: '#05276d',
                        fontFamily: '"Poppins", sans-serif',
                        fontWeight: 400,
                        fontSize: '22px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        px: 0,
                        py: 1,
                        '&:hover': { 
                          backgroundColor: 'transparent',
                          color: '#2A9D8F'
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  ) : (
                    <Button
                      key={item.label}
                      component="a"
                      href={item.href}
                      sx={{ 
                        textTransform: 'none', 
                        color: '#05276d',
                        fontFamily: '"Poppins", sans-serif',
                        fontWeight: 400,
                        fontSize: '22px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        px: 0,
                        py: 1,
                        '&:hover': { 
                          backgroundColor: 'transparent',
                          color: '#2A9D8F'
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  )
                ))}
              </Box>
              <Button 
                component={RouterLink}
                to="/login"
                variant="contained" 
                sx={{ 
                  textTransform: 'none',
                  backgroundColor: '#FFB366',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '25px',
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 400,
                  fontSize: '22px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  '&:hover': { 
                    backgroundColor: '#FFA500'
                  }
                }}
              >
                Join us
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;