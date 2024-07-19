
import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Event Manager
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Add Event
        </Button>
        <Button color="inherit" component={Link} to="/events">
          View Events
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
