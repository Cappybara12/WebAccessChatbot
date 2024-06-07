import React, { useState } from 'react';
import { Container, Box, Typography, TextField, IconButton, Paper, Grid, Button, FormControlLabel, Checkbox, CircularProgress, Menu, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoodIcon from '@mui/icons-material/Mood';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import CodeIcon from '@mui/icons-material/Code';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
    { text: "Help me craft a polite message based on a few details", icon: <MoodIcon /> },
    { text: "Recommend new types of water sports, including pros & cons", icon: <FitnessCenterIcon /> },
    { text: "Give me phrases to learn a new language", icon: <TravelExploreIcon /> },
    { text: "Improve the readability of the following code", icon: <CodeIcon /> }
];

const ChatbotUI = () => {
    const [input, setInput] = useState('');
    const [includeWebAccess, setIncludeWebAccess] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentSources, setCurrentSources] = useState([]);

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
                newMessages[newMessages.length - 1].sources = parsedResponse.sources;
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

    const handleMenuClick = (event, sources) => {
        setAnchorEl(event.currentTarget);
        setCurrentSources(sources);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentSources([]);
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
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexDirection: 'column' }}>
                    <img src={`${process.env.PUBLIC_URL}/Heybee.svg`} alt="Chatbot Logo" style={{ height: '50px', marginRight: '-8px' }} />
                    <Typography variant="subtitle1" sx={{ color: '#000000', marginTop: '10px', fontWeight: 'bold' }}>"A Knowledge Engine for the World"</Typography>
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
                        maxHeight: '38vh',
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
                            <Typography variant="body1">
                                <img src={`${process.env.PUBLIC_URL}/Heybee.svg`} alt="Bee Icon" style={{ height: '27px', marginRight: '0px', marginBottom: '-10px' }} /><span>:</span> {msg.bot}
                            </Typography>
                            {msg.sources && (
                                <Box sx={{ marginTop: 1 }}>
                                    <Typography variant="body2"><strong>Sources and Learn More:</strong></Typography>
                                    <Button
                                        aria-controls={`sources-menu-${index}`}
                                        aria-haspopup="true"
                                        onClick={(event) => handleMenuClick(event, msg.sources)}
                                        endIcon={<ExpandMoreIcon />}
                                        sx={{ textTransform: 'none', color: '#000000' }} // Changed link color to black
                                    >
                                        {msg.sources[0].title}
                                    </Button>
                                    <Menu
                                        id={`sources-menu-${index}`}
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        PaperProps={{
                                            style: {
                                                maxHeight: '100px', // Display only 2 links at a time
                                                width: '400px',
                                                borderRadius: '30px', // Rounded edges
                                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                            },
                                        }}
                                    >
                                        {currentSources.map((source, sourceIndex) => (
                                            <MenuItem key={sourceIndex} onClick={handleMenuClose}>
                                                <Typography variant="body2" component="a" href={source.url} target="_blank" sx={{ textDecoration: 'underline', textDecorationColor: '#3ABEF9', color: '#3ABEF9' }}>
                                                    {sourceIndex + 1}. {source.title}
                                                </Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                            )}
                        </Box>
                    ))}
                    {isLoading && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress size={20} sx={{ marginRight: 1 }} />
                            <Typography variant="body1"><strong></strong> Getting the best response..</Typography>
                        </Box>
                    )}
                </Paper>
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        maxWidth: '800px',
                        bgcolor: '#FFFFFF',
                        padding: '10px',
                        borderRadius: '20px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #000000', // Border around the input and button container
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Ask a question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }}
                        sx={{
                            bgcolor: '#F9F9F9',
                            borderRadius: '10px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'transparent',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'transparent',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'transparent',
                                },
                            },
                        }}
                    />
                    <IconButton
                        onClick={handleSend}
                        disabled={!input.trim()}
                        sx={{
                            ml: 1,
                            bgcolor: input.trim() ? '#000000' : '#B0B0B0',
                            color: '#FFFFFF',
                            '&:hover': {
                                bgcolor: input.trim() ? '#333333' : '#B0B0B0',
                            },
                            borderRadius: '10px',
                            border: '1px solid #000000', // Black border for 3D effect
                        }}
                    >
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
                    label="Web Sources"
                    sx={{ marginTop: 0 }}
                />
            </Container>
                    {/* <FormControlLabel
                        control={
                            <Checkbox
                                checked={includeWebAccess}
                                onChange={(e) => setIncludeWebAccess(e.target.checked)}
                                sx={{ color: '#FFFFFF' }}
                            />
                        }
                        label="Include web access"
                        sx={{ ml: 1 }}
                    /> */}
        </ThemeProvider>
    );
};

export default ChatbotUI;
