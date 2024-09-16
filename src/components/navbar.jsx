import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';
import { signOutUser } from '../utils/firebase/firebase.utils'; // Adjust the path based on your folder structure

const Navbar = () => {
    const { currentUser } = useContext(UserContext);
    const location = useLocation();
    
    const isAuthPage = location.pathname === '/auth';

    return (
        <AppBar position="static" sx={{ bgcolor: '#FFFFFF', color: '#000000' ,borderBottom: '2px solid #000000'}}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <img src={`${process.env.PUBLIC_URL}/heybee2.svg`} alt="Chatbot Logo" style={{ height: '55px', marginRight: '8px' }} />
                    <img src={`${process.env.PUBLIC_URL}/newheybee.svg`} alt="Chatbot Logo" style={{ height: '40px', marginRight: '8px' }} />
                </Box>
                {!isAuthPage && (
                    <>
                        <Button component={Link} to="/" sx={{ color: '#000000', textTransform: 'none' }}>Home</Button>
                        <Button component={Link} to="/about" sx={{ color: '#000000', textTransform: 'none' }}>About</Button>
                    </>
                )}
                {currentUser ? (
                    <Button onClick={signOutUser} sx={{ color: '#000000', textTransform: 'none' }}>Sign Out</Button>
                ) : (
                    <Button component={Link} to="/auth" sx={{ color: '#000000', textTransform: 'none' }}>Sign In</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
