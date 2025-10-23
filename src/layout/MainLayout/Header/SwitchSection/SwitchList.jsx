import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const ListItemWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        p: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'primary.light'
        }
      }}
    >
      {children}
    </Box>
  );
};

ListItemWrapper.propTypes = {
  children: PropTypes.node
};

const SwitchList = ({ setSelectedSwitch, setOpen }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const handelJobs = () => {
    setSelectedSwitch('Interviews');
    navigate('/jobs');
    setOpen(false);
  };

  const handleBackgroundverfication = () => {
    setSelectedSwitch('BackgroundVerfication');
    // navigate('/verfication');
    setOpen(false);
  };
  const handleDashboard = () => {
    setSelectedSwitch('Dashboard');
    navigate('/jobs');
    setOpen(false);
  };

  const handleUpSkills = () => {
    setSelectedSwitch('UpSkills');
    navigate('/upSkills');
    setOpen(false);
  };

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 330,
        py: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
          maxWidth: 300
        },
        '& .MuiListItemSecondaryAction-root': {
          top: 22
        },
        '& .MuiDivider-root': {
          my: 0
        },
        '& .list-container': {
          pl: 7
        }
      }}
    >
      {/* <ListItemWrapper>
        <ListItem alignItems="center" onClick={handleMcq}>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </ListItemWrapper>
      <Divider /> */}
      {/* <ListItemWrapper>
        <ListItem alignItems="center" onClick={handleDashboard} >
          <ListItemText primary="Dashboard" />
        </ListItem>
      </ListItemWrapper> */}
      {/* <ListItemWrapper>
        <ListItem alignItems="center" onClick={handleUpSkills}>
          <ListItemText primary="UpSkills" />
        </ListItem>
      </ListItemWrapper>
      <Divider /> */}
      <ListItemWrapper>
        <ListItem alignItems="center" onClick={handelJobs}>
          <ListItemText primary="Interviews" />
        </ListItem>
      </ListItemWrapper>
      <Divider />
     
      
  
      {/* <ListItemWrapper>
        <ListItem alignItems="center" onClick={handleBackgroundverfication} >
          <ListItemText primary="BackGround Verfications" />
        </ListItem>
      </ListItemWrapper>
      <Divider /> */}
      {/* <ListItemWrapper>
        <ListItem alignItems="center">
          <ListItemText primary="BackGround Verfications" />
        </ListItem>
      </ListItemWrapper>
      <Divider />
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          onClick={handleEcom}
        >
          <ListItemText primary="Ecommerce" />
        </ListItem>
      </ListItemWrapper>
      <Divider />

      <Divider />
      <ListItemWrapper>
        <ListItem alignItems="center">
          <ListItemText primary="My Product" />
        </ListItem>
      </ListItemWrapper>
      <Divider />

      <ListItemWrapper>
        <ListItem alignItems="center">
          <ListItemText primary="Services" />
        </ListItem>
      </ListItemWrapper>
      <Divider />
      <ListItemWrapper>
        <ListItem alignItems="center">
          <ListItemText primary="Document" />
        </ListItem>
      </ListItemWrapper> */}
    </List>
  );
};

SwitchList.propTypes = {
  onSwitchSelect: PropTypes.func.isRequired
};

export default SwitchList;
