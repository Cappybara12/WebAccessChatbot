import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import CodeIcon from '@mui/icons-material/Code';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MicIcon from '@mui/icons-material/Mic'; // Add microphone icon
import MicOffIcon from '@mui/icons-material/MicOff'; // Add microphone off icon
import { Link } from '@mui/material';
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    IconButton, 
    Paper, 
    Grid, 
    Button, 
    FormControlLabel, 
    Checkbox, 
    CircularProgress, 
    Menu, 
    MenuItem, 
    Modal, 
    List, 
    ListItem, 
    ListItemText, 
    InputBase,
    useMediaQuery
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    // Theme configuration remains the same
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
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    '@media (max-width:600px)': {
                        fontSize: '0.9rem',
                    },
                },
                body2: {
                    '@media (max-width:600px)': {
                        fontSize: '0.8rem',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    '@media (max-width:600px)': {
                        fontSize: '0.8rem',
                        padding: '6px 12px',
                    },
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    typography: {
        fontFamily: "'Titillium Web', 'Roboto Condensed', sans-serif",
    },
});

const suggestions = [
    { text: "Help me draft a business plan to secure funding", icon: <AttachMoneyIcon /> },
    { text: "Recommend growth strategies for a startup, including pros & cons", icon: <TrendingUpIcon /> },
    { text: "Give me phrases to learn a new language", icon: <TravelExploreIcon /> },
    { text: "Improve the readability of the following code", icon: <CodeIcon /> }
];
    // Function to send recorded audio to backend
// Function to send recorded audio to backend

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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [isRedirecting, setIsRedirecting] = useState(false);
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
    
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState('');
    const abortControllerRef = useRef(null);
    
    // Add new state variables for microphone functionality
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordingStatus, setRecordingStatus] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleInputFocus = () => {
        if (!currentUser && !isRedirecting) {
            setIsRedirecting(true);
            navigate('/auth/signin');
        }
    };

    const handleLanguageSelect = (lang) => {
        setLanguage(lang);
        translateHey(lang);
        setModalOpen(false);
    };

    const [isGettingResponse, setIsGettingResponse] = useState(false);
    const shouldContinueStreaming = useRef(true);

    // Function to start recording audio
    const startRecording = async () => {
        if (!currentUser) {
            handleInputFocus();
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsRecording(true);
            setRecordingStatus('Recording...');
            
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                setAudioBlob(audioBlob);
                setIsRecording(false);
                setRecordingStatus('Processing audio...');
                sendAudioToBackend(audioBlob);
                
                // Stop all tracks in the stream to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorder.start();
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setRecordingStatus('Error accessing microphone. Please check permissions.');
            setIsRecording(false);
        }
    };

    // Function to stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
    };

    // Function to send recorded audio to backend
// Function to send recorded audio to backend
// Function to send recorded audio to backend
const sendAudioToBackend = async (blob) => {
    try {
        // Create a temporary placeholder for the voice input
        setMessages([...messages, { user: '🎤 Processing...', bot: '' }]);
        setIsLoading(true);
        setIsStreaming(true);
        setStreamingMessage('');
        setIsGettingResponse(true);
        shouldContinueStreaming.current = true;
        
        // Convert blob to base64 for sending to API
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
            const base64Audio = reader.result.split(',')[1]; // Remove the data URL prefix
            
            // Prepare request data with base64 audio
            const requestData = { 
                audio_data: base64Audio,
                audio_format: 'wav',
                include_web_access: includeWebAccess, 
                language: language 
            };
            
            // Prepare the request
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;
            
            const response = await fetch('https://ocjlkmkzvf.execute-api.us-east-1.amazonaws.com/prod/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    body: JSON.stringify(requestData)
                }),
                signal,
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const parsedResponse = JSON.parse(data.body);
            
            // Check if parsedResponse and parsedResponse.answer exist
            if (!parsedResponse || typeof parsedResponse.answer !== 'string') {
                throw new Error('Invalid response format');
            }
            
            // Get the transcribed text if available
            const transcribedText = parsedResponse.transcription || '🎤 [Voice Input]';
            
            // Update the user message with the transcribed text
            setMessages(prevMessages => {
                const newMessages = [...prevMessages];
                newMessages[newMessages.length - 1].user = transcribedText;
                return newMessages;
            });
            
            // Simulate streaming effect
            const words = parsedResponse.answer.split(' ');
            for (let i = 0; i < words.length; i++) {
                if (!shouldContinueStreaming.current) break;
                await new Promise(resolve => setTimeout(resolve, 50)); // Adjust delay as needed
                setStreamingMessage(prevMessage => {
                    const newMessage = prevMessage + ' ' + words[i];
                    if (i === 0) setIsGettingResponse(false);
                    return newMessage;
                });
            }
            
            setIsLoading(false);
            setIsStreaming(false);
            setRecordingStatus('');
            
            if (shouldContinueStreaming.current) {
                setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    newMessages[newMessages.length - 1].bot = parsedResponse.answer;
                    newMessages[newMessages.length - 1].sources = parsedResponse.sources;
                    return newMessages;
                });
            }
        };
    } catch (error) {
        console.error('Failed to send audio:', error);
        setIsLoading(false);
        setIsStreaming(false);
        setIsGettingResponse(false);
        setRecordingStatus('');
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1].bot = "Sorry, there was an error processing your audio. Please try again.";
            return newMessages;
        });
    }
};

    const handleSend = async () => {
        if (!currentUser) {
            handleInputFocus();
            return;
        }
        if (!input.trim()) return;
    
        try {
            const requestData = { query: input, include_web_access: includeWebAccess, language: language };
            const requestBody = JSON.stringify({ body: JSON.stringify(requestData) });
            setMessages([...messages, { user: input, bot: '' }]);
            setInput('');
            setIsLoading(true);
            setIsStreaming(true);
            setStreamingMessage('');
            setIsGettingResponse(true);
    
            shouldContinueStreaming.current = true;
    
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;
    
            const response = await fetch('https://ocjlkmkzvf.execute-api.us-east-1.amazonaws.com/prod/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
                signal,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            const parsedResponse = JSON.parse(data.body);
    
            // Check if parsedResponse and parsedResponse.answer exist
            if (!parsedResponse || typeof parsedResponse.answer !== 'string') {
                throw new Error('Invalid response format');
            }
    
            // Simulate streaming effect
            const words = parsedResponse.answer.split(' ');
            for (let i = 0; i < words.length; i++) {
                if (!shouldContinueStreaming.current) break;
                await new Promise(resolve => setTimeout(resolve, 50)); // Adjust delay as needed
                setStreamingMessage(prevMessage => {
                    const newMessage = prevMessage + ' ' + words[i];
                    if (i === 0) setIsGettingResponse(false);
                    return newMessage;
                });
            }
    
            setIsLoading(false);
            setIsStreaming(false);
            if (shouldContinueStreaming.current) {
                setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    newMessages[newMessages.length - 1].bot = parsedResponse.answer;
                    newMessages[newMessages.length - 1].sources = parsedResponse.sources;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setIsLoading(false);
            setIsStreaming(false);
            setIsGettingResponse(false);
            setMessages(prevMessages => {
                const newMessages = [...prevMessages];
                newMessages[newMessages.length - 1].bot = "Sorry, there was an error processing your request. Please try again.";
                return newMessages;
            });
        }
    };
    
    const formatMessage = (message) => {
        return message.split('\n').map((str, index) => (
            <React.Fragment key={index}>
                {str}
                <br />
            </React.Fragment>
        ));
    };
    
    const handleStop = () => {
        shouldContinueStreaming.current = false;
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setIsStreaming(false);
        setIsLoading(false);
        setIsGettingResponse(false);
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1].bot = streamingMessage.trim();
            return newMessages;
        });
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
                    justifyContent: 'flex-start',
                    padding: isMobile ? '10px' : '20px',
                    boxSizing: 'border-box',
                    fontFamily: "'Titillium Web', sans-serif",
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}> 
                        <img src={`${process.env.PUBLIC_URL}/Heybee.svg`} alt="Heybee Logo" style={{ position:'relative' ,top:'-27px', marginLeft: '-9px', width: '421px', height: '90px' }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: '#000000', marginTop: '-27px', fontWeight: 'bold', fontFamily: "Roboto Condensed, sans-serif" }}>"Ask any business question, it just works"</Typography>
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
                                padding: '5px',
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
                <Grid container spacing={isMobile ? 1 : 2} sx={{ marginBottom: 2, maxWidth: '800px', width: '100%' }}>
                    {suggestions.map((suggestion, index) => (
                        <Grid item xs={6} sm={6} md={3} key={index}>
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
                                    padding: isMobile ? '5px' : '10px',
                                    borderRadius: '10px',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                    height: isMobile ? '70px' : '100px',
                                    '&:hover': {
                                        bgcolor: '#E1E1E1',
                                    }
                                }}
                                onClick={() => handleSuggestionClick(suggestion.text)}
                            >
                                {suggestion.icon}
                                <Typography variant="body2" sx={{ 
                                    marginTop: isMobile ? '5px' : '10px',
                                    fontFamily: "Roboto Condensed, sans-serif",
                                    fontSize: isMobile ? '0.7rem' : '1rem'
                                }}>
                                    {suggestion.text}
                                </Typography>
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                <Paper
                    sx={{
                        flex: 1,
                        width: '90%',
                        maxWidth: '800px',
                        height: isMobile ? 'calc(100vh - 300px)' : 'calc(100vh - 400px)',
                        overflowY: 'auto',
                        marginBottom: 2,
                        padding: isMobile ? 1 : 2,
                        bgcolor: '#F1F1F1',
                        color: '#000000',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {messages.map((msg, index) => (
                        <Box key={index} sx={{ marginBottom: 2 }}>
                            <Typography style={{fontFamily:"Roboto Condensed, sans-serif" }}variant="body1"><strong>You:</strong> {msg.user}</Typography>
                            <Typography style={{fontFamily:"Roboto Condensed, sans-serif" }} variant="body1">
                            <img src={`${process.env.PUBLIC_URL}/Heybee.svg`} alt="Bee Icon" style={{ height: '37px', marginRight: '0px', marginBottom: '-10px' }} />
                                <span>:</span> {index === messages.length - 1 && isStreaming ? formatMessage(streamingMessage) : formatMessage(msg.bot)}
                            </Typography>
                            {msg.sources && (
                                <Box sx={{ marginTop: 1 }}>
                                    <Typography variant="body2"><strong>Sources and Learn More:</strong></Typography>
                                    <Button
                                        aria-controls={`sources-menu-${index}`}
                                        aria-haspopup="true"
                                        onClick={(event) => handleMenuClick(event, msg.sources)}
                                        endIcon={<ExpandMoreIcon />}
                                        sx={{ textTransform: 'none', color: '#000000' }}
                                    >
                                        View Sources
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        PaperProps={{
                                            style: {
                                                maxHeight: '135px',
                                                width: '300px',
                                                borderRadius: '10px',
                                            },
                                        }}
                                    >
                                        {currentSources.map((source, idx) => (
                                            <MenuItem key={idx} sx={{ padding: '8px 16px', minHeight: 'auto' }}>
                                                <Link
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        color: '#3FA2F6',
                                                        textDecoration: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        fontSize: '0.9rem',
                                                        lineHeight: 1.2,
                                                        width: '100%',
                                                        '&:hover': {
                                                            textDecoration: 'underline',
                                                        },
                                                    }}
                                                >
                                                    <span style={{ marginRight: '8px', flexShrink: 0 }}>🔗</span>
                                                    <span style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        flexGrow: 1,
                                                    }}>
                                                        {source.title}
                                                    </span>
                                                </Link>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                            )}
                        </Box>
                    ))}
                    {isGettingResponse && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress size={20} sx={{ marginRight: 1 }} />
                            <Typography variant="body1"><strong></strong> Getting the best response...</Typography>
                        </Box>
                    )}
                    {recordingStatus && (
                        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                            {isRecording && <span style={{ color: 'red', marginRight: '8px' }}>●</span>}
                            <Typography variant="body2">{recordingStatus}</Typography>
                        </Box>
                    )}
                </Paper>

                <Box
                    sx={{
                        display: 'flex',
                        width: '90%',
                        maxWidth: '800px',
                        bgcolor: '#FFFFFF',
                        padding: '10px',
                        borderRadius: '20px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #000000',
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Ask a question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={handleInputFocus}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && currentUser) {
                                handleSend();
                            } else if (e.key === 'Enter') {
                                handleInputFocus();
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
                    {/* Microphone button */}
                    <IconButton
                        onClick={isRecording ? stopRecording : startRecording}
                        sx={{
                            mx: 1,
                            bgcolor: isRecording ? '#FF0000' : '#F9F9F9',
                            color: isRecording ? '#FFFFFF' : '#000000',
                            '&:hover': {
                                bgcolor: isRecording ? '#CC0000' : '#E1E1E1',
                            },
                            borderRadius: '10px',
                            border: '1px solid #000000',
                        }}
                    >
                        {isRecording ? <MicOffIcon /> : <MicIcon />}
                    </IconButton>
                    
                    {/* Send/Stop button */}
                    {isStreaming ? (
                        <IconButton
                            onClick={handleStop}
                            sx={{
                                ml: 1,
                                bgcolor: '#FF0000',
                                color: '#FFFFFF',
                                '&:hover': {
                                    bgcolor: '#CC0000',
                                },
                                borderRadius: '10px',
                                border: '1px solid #000000',
                            }}
                        >
                            <StopIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            onClick={handleSend}
                            disabled={!input.trim() || !currentUser}
                            sx={{
                                ml: 1,
                                bgcolor: input.trim() ? '#000000' : '#B0B0B0',
                                color: '#FFFFFF',
                                '&:hover': {
                                    bgcolor: input.trim() ? '#333333' : '#B0B0B0',
                                },
                                borderRadius: '10px',
                                border: '1px solid #000000',
                            }}
                        >
                            <SendIcon />
                        </IconButton>
                    )}
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
