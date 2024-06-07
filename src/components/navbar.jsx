import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <AppBar position="static" sx={{ bgcolor: '#000000', color: '#FFFFFF' }}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <img src={`${process.env.PUBLIC_URL}/heybooFav.jpg`} alt="Chatbot Logo" style={{ height: '40px', marginRight: '8px' }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: "'Lobster Two', sans-serif;" }}>heybee</Typography>
                </Box>
                <Button component={Link} to="/" sx={{ color: '#FFFFFF', textTransform: 'none' }}>Home</Button>
                <Button component={Link} to="/about" sx={{ color: '#FFFFFF', textTransform: 'none' }}>About</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
