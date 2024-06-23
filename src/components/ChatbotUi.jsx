import React, { useState } from 'react';
import { Container, Box, Typography, TextField, IconButton, Paper, Grid, Button, FormControlLabel, Checkbox, CircularProgress, Menu, MenuItem, Modal, List, ListItem, ListItemText, InputBase } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoodIcon from '@mui/icons-material/Mood';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import CodeIcon from '@mui/icons-material/Code';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
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

const languages = [
    "Auto-detect",
    "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Assamese", "Aymara", "Azerbaijani", 
    "Bambara", "Basque", "Belarusian", "Bengali", "Bhojpuri", "Bosnian", "Bulgarian", "Catalan", "Cebuano", 
    "Chinese (Simplified)", "Chinese (Traditional)", "Corsican", "Croatian", "Czech", "Danish", "Dhivehi", 
    "Dogri", "Dutch", "English", "Esperanto", "Estonian", "Ewe", "Filipino (Tagalog)", "Finnish", "French", 
    "Frisian", "Galician", "Georgian", "German", "Greek", "Guarani", "Gujarati", "Haitian Creole", "Hausa", 
    "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian", "Icelandic", "Igbo", "Ilocano", "Indonesian", 
    "Irish", "Italian", "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer", "Kinyarwanda", "Konkani", 
    "Korean", "Krio", "Kurdish", "Kurdish (Sorani)", "Kyrgyz", "Lao", "Latin", "Latvian", "Lingala", 
    "Lithuanian", "Luganda", "Luxembourgish", "Macedonian", "Maithili", "Malagasy", "Malay", "Malayalam", 
    "Maltese", "Maori", "Marathi", "Meiteilon (Manipuri)", "Mizo", "Mongolian", "Myanmar (Burmese)", 
    "Nepali", "Norwegian", "Nyanja (Chichewa)", "Odia (Oriya)", "Oromo", "Pashto", "Persian", "Polish", 
    "Portuguese (Portugal, Brazil)", "Punjabi", "Quechua", "Romanian", "Russian", "Samoan", "Sanskrit", 
    "Scots Gaelic", "Sepedi", "Serbian", "Sesotho", "Shona", "Sindhi", "Sinhala (Sinhalese)", "Slovak", 
    "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish", "Tagalog (Filipino)", "Tajik", 
    "Tamil", "Tatar", "Telugu", "Thai", "Tigrinya", "Tsonga", "Turkish", "Turkmen", "Twi (Akan)", 
    "Ukrainian", "Urdu", "Uyghur", "Uzbek", "Vietnamese", "Welsh", "Xhosa", "Yiddish", "Yoruba", "Zulu"
];

const ChatbotUI = () => {
    const [input, setInput] = useState('');
    const [includeWebAccess, setIncludeWebAccess] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentSources, setCurrentSources] = useState([]);
    const [language, setLanguage] = useState('Auto-detect');
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [heyText, setHeyText] = useState('hey');

    const handleLanguageSelect = (lang) => {
        setLanguage(lang);
        translateHey(lang);
        setModalOpen(false);
    };
    
    const handleSend = async () => {
        if (!input.trim()) return;

        try {
            const requestData = { query: input, include_web_access: includeWebAccess, language: language };
            const requestBody = JSON.stringify({ body: JSON.stringify(requestData) });
            console.log('Request body:', requestBody);

            setMessages([...messages, { user: input, bot: 'Typing...' }]);
            setInput('');
            setIsLoading(true);

            const response = await fetch('https://iu91dk9rh3.execute-api.ap-south-1.amazonaws.com/prod/query', {
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
    const translations = {
        "Afrikaans": "hallo",
        "Albanian": "hej",
        "Amharic": "ሰላም",
        "Arabic": "يا",
        "Armenian": "բարև",
        "Assamese": "হাই",
        "Aymara": "jichha",
        "Azerbaijani": "salam",
        "Bambara": "ka kɛnɛ",
        "Basque": "kaixo",
        "Belarusian": "прывітанне",
        "Bengali": "ওহে",
        "Bhojpuri": "प्रणाम",
        "Bosnian": "zdravo",
        "Bulgarian": "здрасти",
        "Catalan": "hola",
        "Cebuano": "hello",
        "Chinese (Simplified)": "嘿",
        "Chinese (Traditional)": "嘿",
        "Corsican": "bonghjornu",
        "Croatian": "hej",
        "Czech": "ahoj",
        "Danish": "hej",
        "Dhivehi": "ހެޔެ",
        "Dogri": "नमस्कार",
        "Dutch": "hallo",
        "English": "hey",
        "Esperanto": "saluton",
        "Estonian": "tere",
        "Ewe": "e",
        "Filipino (Tagalog)": "hello",
        "Finnish": "hei",
        "French": "salut",
        "Frisian": "hallo",
        "Galician": "ola",
        "Georgian": "გამარჯობა",
        "German": "hallo",
        "Greek": "γειά",
        "Guarani": "mba’éichapa",
        "Gujarati": "હાય",
        "Haitian Creole": "alo",
        "Hausa": "sannu",
        "Hawaiian": "aloha",
        "Hebrew": "היי",
        "Hindi": "नमस्ते",
        "Hmong": "nyob zoo",
        "Hungarian": "szia",
        "Icelandic": "hæ",
        "Igbo": "ndewo",
        "Ilocano": "hello",
        "Indonesian": "halo",
        "Irish": "dia dhuit",
        "Italian": "ciao",
        "Japanese": "こんにちは",
        "Javanese": "halo",
        "Kannada": "ಹಾಯ್",
        "Kazakh": "сәлем",
        "Khmer": "សួស្ដី",
        "Kinyarwanda": "muraho",
        "Konkani": "नमस्कार",
        "Korean": "안녕하세요",
        "Krio": "hello",
        "Kurdish": "slav",
        "Kurdish (Sorani)": "slav",
        "Kyrgyz": "салам",
        "Lao": "ສະບາຍດີ",
        "Latin": "salve",
        "Latvian": "sveiki",
        "Lingala": "mbote",
        "Lithuanian": "labas",
        "Luganda": "ki kati",
        "Luxembourgish": "moien",
        "Macedonian": "здраво",
        "Maithili": "नमस्ते",
        "Malagasy": "salama",
        "Malay": "hai",
        "Malayalam": "ഹായ്",
        "Maltese": "ħej",
        "Maori": "kia ora",
        "Marathi": "नमस्कार",
        "Meiteilon (Manipuri)": "ꯍꯌ",
        "Mizo": "hei",
        "Mongolian": "сайн уу",
        "Myanmar (Burmese)": "ဟေး",
        "Nepali": "नमस्ते",
        "Norwegian": "hei",
        "Nyanja (Chichewa)": "moni",
        "Odia (Oriya)": "ନମସ୍କାର",
        "Oromo": "akkam",
        "Pashto": "سلام",
        "Persian": "سلام",
        "Polish": "cześć",
        "Portuguese (Portugal, Brazil)": "oi",
        "Punjabi": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
        "Quechua": "napaykullayki",
        "Romanian": "salut",
        "Russian": "привет",
        "Samoan": "talofa",
        "Sanskrit": "नमस्ते",
        "Scots Gaelic": "halò",
        "Sepedi": "dumelang",
        "Serbian": "здраво",
        "Sesotho": "lumela",
        "Shona": "mhoro",
        "Sindhi": "هيلو",
        "Sinhala (Sinhalese)": "ආයුබෝවන්",
        "Slovak": "ahoj",
        "Slovenian": "živjo",
        "Somali": "hello",
        "Spanish": "hola",
        "Sundanese": "halo",
        "Swahili": "habari",
        "Swedish": "hej",
        "Tagalog (Filipino)": "hello",
        "Tajik": "салом",
        "Tamil": "வணக்கம்",
        "Tatar": "сәлам",
        "Telugu": "హలో",
        "Thai": "สวัสดี",
        "Tigrinya": "ሰላም",
        "Tsonga": "avuxeni",
        "Turkish": "merhaba",
        "Turkmen": "salam",
        "Twi (Akan)": "akwaaba",
        "Ukrainian": "привіт",
        "Urdu": "ہیلو",
        "Uyghur": "ياخشىمۇسىز",
        "Uzbek": "salom",
        "Vietnamese": "chào",
        "Welsh": "helo",
        "Xhosa": "molo",
        "Yiddish": "העלא",
        "Yoruba": "bawo",
        "Zulu": "sawubona"
    };
    const translateHey = (lang) => {
        if (lang === 'Auto-detect' || lang === 'English') {
            setHeyText('hey');
        } else {
            setHeyText(translations[lang] || 'hey');
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

    const handleLanguageClick = () => {
        setModalOpen(true);
    };

    // const handleLanguageSelect = (lang) => {
    //     setLanguage(lang);
    //     setModalOpen(false);
    // };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const filteredLanguages = languages.filter((lang) =>
        lang.toLowerCase().includes(search.toLowerCase())
    );

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
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '30px', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}> 
                    <Typography variant="h2" sx={{ fontWeight: 700, fontFamily: "'Playwrite NO', cursive;" }}>{heyText}</Typography>
                    <img src={`${process.env.PUBLIC_URL}/Heybee.svg`} alt="Heybee Logo" style={{ position:'relative' ,top:'5px'  , marginLeft: '-31px', width: '150px', height: '70px' }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: '#000000', marginTop: '30px', fontWeight: 'bold', fontFamily: "Roboto Condensed, sans-serif" }}>"Ask anything, it just works"</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', py: 1, pr: 2 }}>
                    <IconButton
                        onClick={handleLanguageClick}
                        sx={{
                            color: '#000000',
                            backgroundColor: 'transparent',
                            border: '1px solid black',
                            borderRadius: '4px',
                            padding: '8px',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            },
                        }}
                    >
                        <SettingsIcon />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            Select Language ({language})
                        </Typography>
                    </IconButton>
                </Box>
                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Paper sx={{ width: 300, maxHeight: '80vh', overflowY: 'auto', padding: 2, borderRadius: '10px' }}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>Select Language</Typography>
                        <InputBase
                            placeholder="Search languages..."
                            value={search}
                            onChange={handleSearchChange}
                            sx={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '10px',
                                bgcolor: '#F1F1F1',
                                borderRadius: '10px',
                            }}
                        />
                        <List>
                            {filteredLanguages.map((lang, index) => (
                                <ListItem button onClick={() => handleLanguageSelect(lang)} key={index}>
                                    <ListItemText primary={lang} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Modal>
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
                                <Typography variant="body2" sx={{ marginTop: '10px', fontFamily: "Roboto Condensed, sans-serif" }}>{suggestion.text}</Typography>
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
        </ThemeProvider>
    );
};

export default ChatbotUI;
