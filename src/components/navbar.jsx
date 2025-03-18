import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';
import { signOutUser } from '../utils/firebase/firebase.utils';

const Navbar = () => {
    const { currentUser } = useContext(UserContext);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={{ bgcolor: '#FFFFFF', color: '#000000', borderBottom: '2px solid #000000' }}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <img src={`${process.env.PUBLIC_URL}/Heybee.svg`} alt="Chatbot Logo" style={{ height: '40px', marginRight: '1px' }} />
                    <img src={`${process.env.PUBLIC_URL}/Heybee1.jpg`} alt="Chatbot Logo" style={{ height: '30px', marginRight: '8px' }} />
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Button component={Link} to="/" sx={{ color: '#000000', textTransform: 'none' }}>Home</Button>
                    {currentUser && (
                        <Button component={Link} to="/about" sx={{ color: '#000000', textTransform: 'none' }}>About</Button>
                    )}
                    {currentUser ? (
                        <Button onClick={signOutUser} sx={{ color: '#000000', textTransform: 'none' }}>Sign Out</Button>
                    ) : (
                        <Button component={Link} to="/auth/signin" sx={{ color: '#000000', textTransform: 'none' }}>Sign In</Button>
                    )}
                </Box>
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenu}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose} component={Link} to="/">Home</MenuItem>
                        {currentUser && (
                            <MenuItem onClick={handleClose} component={Link} to="/about">About</MenuItem>
                        )}
                        {currentUser ? (
                            <MenuItem onClick={() => { handleClose(); signOutUser(); }}>Sign Out</MenuItem>
                        ) : (
                            <MenuItem onClick={handleClose} component={Link} to="/auth/signin">Sign In</MenuItem>
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
