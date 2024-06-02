import React, { useState } from 'react';
import { Container, Box, Typography, TextField, IconButton, Paper, Grid, Button, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoodIcon from '@mui/icons-material/Mood';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import CodeIcon from '@mui/icons-material/Code';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    '&.Mui-checked': {
                        color: '#FFFFFF',
                        '& .MuiSvgIcon-root': {
                            backgroundColor: '#000000',
                            borderRadius: '30%',
                        }
                    }
                }
            }
        }
    }
});
const suggestions = [
    { text: "Help me craft an OOO message based on a few details", icon: <MoodIcon /> },
    { text: "Recommend new types of water sports, including pros & cons", icon: <FitnessCenterIcon /> },
    { text: "Give me phrases to learn a new language", icon: <TravelExploreIcon /> },
    { text: "Improve the readability of the following code", icon: <CodeIcon /> }
];

const ChatbotUI = () => {
    const [input, setInput] = useState('');
    const [includeWebAccess, setIncludeWebAccess] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        try {
            const requestData = { query: input, include_web_access: includeWebAccess };
            const requestBody = JSON.stringify({ body: JSON.stringify(requestData) });
            console.log('Request body:', requestBody);

            setMessages([...messages, { user: input, bot: 'Typing...' }]);
            setInput('');
            setIsLoading(true);

            const response = await fetch('https://mxewm1uisc.execute-api.ap-south-1.amazonaws.com/prod/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response:', data);
            const parsedResponse = JSON.parse(data.body);

            setIsLoading(false);
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages];
                newMessages[newMessages.length - 1].bot = parsedResponse.answer;
                return newMessages;
            });
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message. Please try again later.');
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
    };

    return (
        <ThemeProvider theme={theme}>

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
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <img src={`${process.env.PUBLIC_URL}/Heybee.svg`}  alt="Chatbot Logo" style={{ height: '40px', marginRight: '0px' }} />
                <Typography variant="h4" sx={{fontWeight: 700, fontFamily: "'Lobster Two', sans-serif;" }}>heybee</Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginBottom: 2, maxWidth: '800px' }}>
                {suggestions.map((suggestion, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                bgcolor: '#F1F1F1',
                                color: '#000000',
                                textTransform: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '10px',
                                borderRadius: '10px',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    bgcolor: '#E1E1E1',
                                }
                            }}
                            onClick={() => handleSuggestionClick(suggestion.text)}
                        >
                            {suggestion.icon}
                            <Typography variant="body2" sx={{ marginTop: '10px' }}>{suggestion.text}</Typography>
                        </Button>
                    </Grid>
                ))}
            </Grid>
            <Paper
                sx={{
                    flex: 1,
                    width: '100%',
                    maxWidth: '800px',
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    marginBottom: 2,
                    padding: 2,
                    bgcolor: '#F1F1F1',
                    color: '#000000',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                {messages.map((msg, index) => (
                    <Box key={index} sx={{ marginBottom: 2 }}>
                        <Typography variant="body1"><strong>You:</strong> {msg.user}</Typography>
                        <Typography variant="body1"><strong>Bee:</strong> {msg.bot}</Typography>
                    </Box>
                ))}
                {isLoading && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={20} sx={{ marginRight: 1 }} />
                        <Typography variant="body1"><strong></strong> Getting the best response..</Typography>
                    </Box>
                )}
            </Paper>
            <Box sx={{ display: 'flex', width: '100%', maxWidth: '800px', bgcolor: '#F1F1F1', padding: '10px', borderRadius: '20px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter a prompt here"
                    InputProps={{
                        style: { color: '#000000' },
                    }}
                    sx={{
                        input: { color: '#000000' },
                        '.MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#CCCCCC',
                                borderRadius: '20px'
                            },
                            '&:hover fieldset': {
                                borderColor: '#AAAAAA',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#888888',
                            },
                        },
                    }}
                />

                <IconButton color="primary" onClick={handleSend} sx={{ color: '#000000' }}>
                    <SendIcon />
                </IconButton>
            </Box>
            <FormControlLabel
                    control={
                        <Checkbox
                            checked={includeWebAccess}
                            onChange={(e) => setIncludeWebAccess(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Include web access"
                    sx={{ marginTop: 0 }}
                />
        </Container>
        </ThemeProvider>

    );
};

export default ChatbotUI;
