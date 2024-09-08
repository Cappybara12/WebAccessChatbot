import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <AppBar position="static" sx={{ color: '#000000', bgcolor: '#FFFFFF', borderBottom: '2px solid #000000' }}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <img src={`${process.env.PUBLIC_URL}/heybee2.svg`} alt="Chatbot Logo" style={{ height: '58px', marginRight: '2px' }} />
                    <img src={`${process.env.PUBLIC_URL}/newheybee.svg`} alt="Chatbot Logo" style={{ height: '40px', marginRight: '8px' }} />
                </Box>
                <Button component={Link} to="/" sx={{ color: '#000000', textTransform: 'none' }}>Home</Button>
                <Button component={Link} to="/about" sx={{ color: '#000000', textTransform: 'none' }}>About</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
