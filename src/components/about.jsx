import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const About = () => {
    return (
        <Container
            maxWidth={false}
            sx={{
                bgcolor: '#FFFFFF',
                color: '#000000',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                boxSizing: 'border-box',
                fontFamily: "'Titillium Web', sans-serif"
            }}
        >
            {/* <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', position: 'absolute', top: '20px', left: '20px' }}>
                <img src={`${process.env.PUBLIC_URL}/heybooFa.jpg`} alt="Chatbot Logo" style={{ height: '40px', marginRight: '-8px' }} />
                <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: "'Lobster Two', sans-serif;" }}>heybee</Typography>
            </Box> */}
            <Typography variant="h2" sx={{ fontWeight: 700, fontFamily: "'Lobster Two', sans-serif;", textAlign: 'center' }}>About</Typography>
            <Typography variant="body1" sx={{ marginTop: '20px', textAlign: 'center', maxWidth: '800px' }}>
                HEYBEE.AI IS AN AI-CHATBOT-POWERED RESEARCH AND CONVERSATIONAL SEARCH ENGINE THAT RESPONDS TO QUERIES USING NATURAL LANGUAGE AND PREDICTIVE TEXT. LAUNCHED IN 2024, HEYBEE GENERATES ANSWERS USING THE SOURCES FROM THE WEB WITHIN THE TEXT RESPONSE. HEYBEE AI IS FREE AND ALWAYS WILL BE FREE; THE PRODUCT USES BUMBLEBEE LABS STANDALONE LARGE LANGUAGE MODEL (LLM) THAT INCORPORATES NATURAL LANGUAGE (NLP) CAPABILITIES.
            </Typography>
        </Container>
    );
};

export default About;
