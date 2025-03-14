import React, { useState, useRef, useContext,useEffect,useCallback } from 'react';
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
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
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
const SPEECH_LANG_CODES = {
    "English": "en-US",
    "Spanish": "es-ES",
    "French": "fr-FR",
    "German": "de-DE",
    "Hindi": "hi-IN",
    // Add more as needed
  };
  
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
    const safariIntervalRef = useRef(null);

    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState('');
    const abortControllerRef = useRef(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
const speechSynthesisRef = useRef(null);
    // Add new state variables for microphone functionality
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordingStatus, setRecordingStatus] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const resumeTimerRef = useRef(null);
    const detectBrowserDetails = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        let browser = 'unknown';
        let version = 'unknown';
        
        if (userAgent.indexOf('safari') !== -1) { 
          if (userAgent.indexOf('chrome') > -1) {
            browser = 'chrome';
            const match = userAgent.match(/chrome\/(\d+)/);
            version = match ? match[1] : 'unknown';
          } else {
            browser = 'safari';
            const match = userAgent.match(/version\/(\d+)/);
            version = match ? match[1] : 'unknown';
          }
        } else if (userAgent.indexOf('firefox') !== -1) {
          browser = 'firefox';
          const match = userAgent.match(/firefox\/(\d+)/);
          version = match ? match[1] : 'unknown';
        } else if (userAgent.indexOf('edge') !== -1 || userAgent.indexOf('edg') !== -1) {
          browser = 'edge';
          const match = userAgent.match(/edge\/(\d+)/) || userAgent.match(/edg\/(\d+)/);
          version = match ? match[1] : 'unknown';
        }
        
        const isIOS = /ipad|iphone|ipod/.test(userAgent) && !window.MSStream;
        const isMacOS = /macintosh|mac os x/.test(userAgent);
        
        return {
          browser,
          version,
          isIOS,
          isMacOS,
          isSafariOrIOS: browser === 'safari' || isIOS
        };
      };
      
// 2. If using with language selection, map your language name to language code first
const speakResponse = (text, language) => {
    // Get language code from selected language
    const languageCode = SPEECH_LANG_CODES[language] || 'en-US';
    
    // Call the Safari-compatible function
    speakTextSafariCompatible(text, languageCode)
      .then(success => {
        if (success) {
          console.log("Speaking started successfully");
        } else {
          console.warn("Could not start speech");
        }
      });
  };
    const handleInputFocus = () => {
        if (!currentUser && !isRedirecting) {
            setIsRedirecting(true);
            navigate('/auth/signin');
        }
    };
    useEffect(() => {
        const logVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`));
        };
        
        window.speechSynthesis.onvoiceschanged = logVoices;
        
        // Try immediate loading too
        logVoices();
      }, []);
      useEffect(() => {
        return () => {
          window.speechSynthesis.cancel();
          if (safariIntervalRef.current) {
            clearInterval(safariIntervalRef.current);
          }
        };
      }, []);
    
      // Simplified voice loading - works better across browsers
      const loadVoices = useCallback(() => {
        return new Promise((resolve) => {
          let hasResolved = false;
          
          const checkVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices && voices.length > 0 && !hasResolved) {
              hasResolved = true;
              resolve(voices);
            }
          };
          
          // Try immediately
          checkVoices();
          
          // Set up event for Chrome
          if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = checkVoices;
          }
          
          // Safari fallback with polling
          let attempts = 0;
          const interval = setInterval(() => {
            attempts++;
            checkVoices();
            
            if (attempts >= 10 || hasResolved) {
              clearInterval(interval);
              if (!hasResolved) {
                console.warn("Voice loading timed out");
                hasResolved = true;
                resolve(window.speechSynthesis.getVoices() || []);
              }
            }
          }, 100);
        });
      }, []);
    
    // Add this to your useEffect section
useEffect(() => {
    // Define global state to track if voices are loaded
    window.speechSynthesisVoicesLoaded = false;
  
    // Function to load voices and resolve when ready
    const loadVoices = () => {
        return new Promise((resolve) => {
          // Get current voices
          let voices = window.speechSynthesis.getVoices();
          
          // If voices already available, mark as loaded and resolve
          if (voices && voices.length > 0) {
            window.speechSynthesisVoicesLoaded = true;
            console.log(`${voices.length} voices loaded successfully`);
            resolve(voices);
            return;
          }
          
          // Handle voice loading differences across browsers
          if (window.speechSynthesis.onvoiceschanged !== undefined) {
            // For Chrome and others that use onvoiceschanged event
            window.speechSynthesis.onvoiceschanged = () => {
              voices = window.speechSynthesis.getVoices();
              if (voices.length > 0) {
                window.speechSynthesisVoicesLoaded = true;
                console.log(`${voices.length} voices loaded via onvoiceschanged`);
                resolve(voices);
              }
            };
          } else {
            // For Safari and others without the event, try polling
            const checkVoicesInterval = setInterval(() => {
              voices = window.speechSynthesis.getVoices();
              if (voices.length > 0) {
                clearInterval(checkVoicesInterval);
                window.speechSynthesisVoicesLoaded = true;
                console.log(`${voices.length} voices loaded via polling`);
                resolve(voices);
              }
            }, 100);
            
            // Set a timeout to prevent infinite polling
            setTimeout(() => {
              clearInterval(checkVoicesInterval);
              console.warn("Voice loading timed out after 5 seconds");
              resolve(window.speechSynthesis.getVoices() || []);
            }, 5000);
          }
          
          // Force an initial getVoices call to trigger loading
          window.speechSynthesis.getVoices();
        });
      };
    
    
    // Call the function and log results
    loadVoices().then(voices => {
        // Log all available voices for debugging
        console.log("Available voices:");
        voices.forEach((voice, index) => {
          console.log(`${index + 1}. ${voice.name} (${voice.lang})${voice.default ? ' - DEFAULT' : ''}`);
          
          // Detect likely male voices based on name
          const maleKeywords = ['male', 'david', 'thomas', 'daniel', 'james', 'john', 'alex'];
          const isMale = maleKeywords.some(keyword => voice.name.toLowerCase().includes(keyword.toLowerCase()));
          if (isMale) {
            console.log(`   Likely MALE voice: ${voice.name}`);
          }
        });
      });    
    // Browser-specific handling
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isEdge = /Edge/.test(navigator.userAgent);
    
    console.log(`Browser detected: ${isChrome ? 'Chrome' : isSafari ? 'Safari' : isEdge ? 'Edge' : 'Other'}`);
    
    // Clean up on component unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);
  const SPEECH_LANG_CODES = {
    "English": "en-US",
    "Spanish": "es-ES",
    "French": "fr-FR",
    "German": "de-DE",
    "Hindi": "hi-IN",
    "Chinese (Simplified)": "zh-CN",
    "Chinese (Traditional)": "zh-TW",
    "Japanese": "ja-JP",
    "Korean": "ko-KR",
    "Russian": "ru-RU",
    "Arabic": "ar-SA",
    "Portuguese (Portugal, Brazil)": "pt-BR",
    "Italian": "it-IT",
    "Dutch": "nl-NL",
    "Polish": "pl-PL",
    "Turkish": "tr-TR",
    "Swedish": "sv-SE",
    "Danish": "da-DK",
    "Finnish": "fi-FI",
    "Norwegian": "no-NO",
    "Thai": "th-TH",
    "Vietnamese": "vi-VN",
    "Indonesian": "id-ID",
    "Greek": "el-GR",
    "Czech": "cs-CZ",
    "Hebrew": "he-IL",
    "Hungarian": "hu-HU",
    "Romanian": "ro-RO",
    "Ukrainian": "uk-UA",
    // Add additional languages as needed
  };
  
  // Known male voices by browser
  const BROWSER_MALE_VOICES = {
    chrome: [
      { pattern: "Google US English Male", lang: "en-US" },
      { pattern: "Microsoft David", lang: "en-US" },
      { pattern: "Microsoft Mark", lang: "en-US" },
      { pattern: "Microsoft George", lang: "en-GB" },
      { pattern: "Google UK English Male", lang: "en-GB" },
      // Spanish male voices
      { pattern: "Microsoft Pablo", lang: "es" },
      // French male voices
      { pattern: "Google français Male", lang: "fr" },
      { pattern: "Microsoft Paul", lang: "fr" },
      // German male voices
      { pattern: "Google Deutsch Male", lang: "de" },
      { pattern: "Microsoft Stefan", lang: "de" },
      // Add other languages as needed
    ],
    safari: [
      { pattern: "Alex", lang: "en-US" }, // macOS system voice
      { pattern: "Fred", lang: "en-US" },
      { pattern: "Daniel", lang: "en-GB" },
      { pattern: "Diego", lang: "es" },
      { pattern: "Thomas", lang: "fr" },
      { pattern: "Yannick", lang: "fr" },
      { pattern: "Markus", lang: "de" },
      // Add other languages as needed
    ],
    edge: [
      { pattern: "Microsoft David", lang: "en-US" },
      { pattern: "Microsoft Mark", lang: "en-US" },
      { pattern: "Microsoft George", lang: "en-GB" },
      { pattern: "Microsoft Pablo", lang: "es" },
      { pattern: "Microsoft Paul", lang: "fr" },
      { pattern: "Microsoft Stefan", lang: "de" },
      // Edge often uses the same voices as Chrome
      { pattern: "Google US English Male", lang: "en-US" },
      { pattern: "Google UK English Male", lang: "en-GB" },
      // Add other languages as needed
    ],
    firefox: [
      // Firefox typically uses system voices
      { pattern: "male", lang: "en" }, // Generic match for any "male" voice
      { pattern: "Alex", lang: "en-US" }, // on macOS
      { pattern: "Microsoft David", lang: "en-US" }, // on Windows
      // Add other languages as needed
    ]
  };
  useEffect(() => {
    const browser = detectBrowserDetails();
    console.log("Browser information:", browser);
    // You can conditionally apply Safari-specific fixes here if needed
    if (browser.isSafariOrIOS) {
      console.log("Safari detected, applying special handling");
    }
  }, []);
  const detectBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('edge') > -1 || userAgent.indexOf('edg') > -1) {
      return 'edge';
    } else if (userAgent.indexOf('chrome') > -1) {
      return 'chrome';
    } else if (userAgent.indexOf('safari') > -1) {
      return 'safari';
    } else if (userAgent.indexOf('firefox') > -1) {
      return 'firefox';
    }
    return 'other';
  };
  const getBestMaleVoice = (voices, languagePreference) => {
    if (!voices || voices.length === 0) return null;
    
    const browser = detectBrowser();
    const langCode = SPEECH_LANG_CODES[languagePreference] || 'en-US';
    const langBase = langCode.split('-')[0]; // e.g., "en" from "en-US"
    
    console.log(`Finding male voice for ${browser} browser in language ${langCode}`);
    
    // Get the list of known male voices for this browser
    const knownMaleVoices = BROWSER_MALE_VOICES[browser] || [];
    
    // First try: exact matches from our known list with exact language match
    for (const maleVoice of knownMaleVoices) {
      if (maleVoice.lang === langCode) {
        const exactMatch = voices.find(v => v.name.includes(maleVoice.pattern) && v.lang === langCode);
        if (exactMatch) {
          console.log(`Found exact match: ${exactMatch.name} (${exactMatch.lang})`);
          return exactMatch;
        }
      }
    }
    
    // Second try: language base matches (e.g., "en" instead of "en-US")
    for (const maleVoice of knownMaleVoices) {
      if (maleVoice.lang.startsWith(langBase)) {
        const baseMatch = voices.find(v => 
          v.name.includes(maleVoice.pattern) && v.lang.startsWith(langBase)
        );
        if (baseMatch) {
          console.log(`Found language base match: ${baseMatch.name} (${baseMatch.lang})`);
          return baseMatch;
        }
      }
    }
    
    // Third try: any male voice in our preferred language
    const maleKeywords = ['male', 'man', 'guy', 'david', 'thomas', 'daniel', 'james', 'john', 'alex'];
    const languageMatch = voices.find(v => 
      v.lang === langCode && 
      maleKeywords.some(keyword => v.name.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    if (languageMatch) {
      console.log(`Found male keyword match with exact language: ${languageMatch.name} (${languageMatch.lang})`);
      return languageMatch;
    }
    
    // Fourth try: any male voice in the language base
    const baseLanguageMatch = voices.find(v => 
      v.lang.startsWith(langBase) && 
      maleKeywords.some(keyword => v.name.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    if (baseLanguageMatch) {
      console.log(`Found male keyword match with language base: ${baseLanguageMatch.name} (${baseLanguageMatch.lang})`);
      return baseLanguageMatch;
    }
    
    // Fifth try: any of our known male voices, regardless of language
    for (const maleVoice of knownMaleVoices) {
      const anyMatch = voices.find(v => v.name.includes(maleVoice.pattern));
      if (anyMatch) {
        console.log(`Found male pattern match ignoring language: ${anyMatch.name} (${anyMatch.lang})`);
        return anyMatch;
      }
    }
    
    // Last resort: any voice with male keywords
    const anyMaleVoice = voices.find(v => 
      maleKeywords.some(keyword => v.name.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    if (anyMaleVoice) {
      console.log(`Found any male voice: ${anyMaleVoice.name} (${anyMaleVoice.lang})`);
      return anyMaleVoice;
    }
    
    // If all else fails, just return the first voice (or a default one if available)
    const defaultVoice = voices.find(v => v.default) || voices[0];
    console.log(`No male voice found, using default: ${defaultVoice.name} (${defaultVoice.lang})`);
    return defaultVoice;
  };
  // Replace your speakText function with this one
  const speakText = useCallback(async (text) => {
    // Always cancel any existing speech
    window.speechSynthesis.cancel();
    if (safariIntervalRef.current) {
      clearInterval(safariIntervalRef.current);
      safariIntervalRef.current = null;
    }
    
    if (!text) return;
    
    try {
      setIsSpeaking(true);
      
      // Get language code from selected language
      const langCode = SPEECH_LANG_CODES[language] || 'en-US';
      
      // Load voices reliably
      const voices = await loadVoices();
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language
      utterance.lang = langCode;
      
      // Try to find a voice in the selected language
      // Be less strict for Safari - just match the language base
      const langBase = langCode.split('-')[0];
      let selectedVoice = voices.find(v => v.lang.startsWith(langBase));
      
      // If no matching voice found, use default or first available
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices.find(v => v.default) || voices[0];
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      }
      
      // Apply male-like characteristics
      utterance.pitch = 0.9;
      utterance.rate = 0.95;
      
      // Event handlers
      utterance.onend = () => {
        setIsSpeaking(false);
        if (safariIntervalRef.current) {
          clearInterval(safariIntervalRef.current);
          safariIntervalRef.current = null;
        }
      };
      
      utterance.onerror = (error) => {
        console.error("Speech error:", error);
        setIsSpeaking(false);
        if (safariIntervalRef.current) {
          clearInterval(safariIntervalRef.current);
          safariIntervalRef.current = null;
        }
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      
      // Safari workaround for the 15-second limit
      // This keeps speech going by periodically pausing and resuming
      safariIntervalRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else {
          clearInterval(safariIntervalRef.current);
          safariIntervalRef.current = null;
        }
      }, 5000);
      
    } catch (error) {
      console.error("Speech error:", error);
      setIsSpeaking(false);
    }
  }, [language, loadVoices,SPEECH_LANG_CODES]);
  
const applyMaleVoice = (utterance, voices) => {
    // Log available voices for debugging
    console.log(`Found ${voices.length} available voices`);
    
    // Get the best male voice based on current browser and language
    const maleVoice = getBestMaleVoice(voices, language);
    
    if (maleVoice) {
      utterance.voice = maleVoice;
      console.log(`Selected voice: ${maleVoice.name} (${maleVoice.lang})`);
    } else {
      console.log("No suitable male voice found, using default voice with male characteristics");
    }
    
    // Set language based on selected language or fallback to English
    const langCode = SPEECH_LANG_CODES[language] || 'en-US';
    utterance.lang = langCode;
    
    // Apply male voice characteristics regardless of voice selection
    utterance.pitch = 0.8; // Lower pitch (0.1 to 2) - makes voice sound more masculine
    utterance.rate = 0.9;  // Slightly slower rate can help with male voice perception
    
    // Store reference to allow stopping speech later
    speechSynthesisRef.current = utterance;
    
    // Set event handlers
    utterance.onstart = () => setIsSpeaking(true);
    // Add this function to stop speech
    // Start speaking
    window.speechSynthesis.speak(utterance);
    
    // Bug fix for Chrome's 15-second limit
    if (!resumeTimerRef.current) {
      resumeTimerRef.current = setInterval(() => {
        if (!speechSynthesisRef.current) {
          clearInterval(resumeTimerRef.current);
          resumeTimerRef.current = null;
          return;
        }
        
        if (window.speechSynthesis.speaking) {
          // Pause and resume to keep the speech going
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else {
          clearInterval(resumeTimerRef.current);
          resumeTimerRef.current = null;
        }
      }, 10000); // Check every 10 seconds
    }
  };
  
        // Clear interval when speech ends
        const stopSpeaking = useCallback(() => {
            window.speechSynthesis.cancel();
            if (safariIntervalRef.current) {
              clearInterval(safariIntervalRef.current);
              safariIntervalRef.current = null;
            }
            setIsSpeaking(false);
          }, []);
          const debugAndTestSpeech = () => {
            const browser = detectBrowserDetails();
            console.log("Browser details:", browser);
            
            // Force a direct user-initiated speech attempt
            const testText = "This is a direct user interaction test. Speech in Safari requires direct user interaction.";
            
            // Cancel any existing speech
            window.speechSynthesis.cancel();
            
            // Simple approach - try with minimal code
            try {
              const utterance = new SpeechSynthesisUtterance(testText);
              utterance.lang = 'en-US';
              utterance.rate = 0.9;
              utterance.pitch = 0.9;
              
              utterance.onstart = () => console.log("Speech started successfully");
              utterance.onend = () => console.log("Speech ended");
              utterance.onerror = (e) => console.error("Speech error:", e);
              
              window.speechSynthesis.speak(utterance);
              
              // Safari workaround for the 15-second limit
              const keepAlive = setInterval(() => {
                if (window.speechSynthesis.speaking) {
                  console.log("Keeping speech alive...");
                  window.speechSynthesis.pause();
                  window.speechSynthesis.resume();
                } else {
                  clearInterval(keepAlive);
                }
              }, 5000);
              
              return "Test initiated - check console for details";
            } catch (error) {
              console.error("Speech test error:", error);
              return "Test failed - see console error";
            }
          };
          
          // Add a simple function for Safari that avoids all complexity
          const safariSpeakSimple = (text) => {
            // Cancel any existing speech
            window.speechSynthesis.cancel();
            
            // Clear any existing timers
            if (safariIntervalRef.current) {
              clearInterval(safariIntervalRef.current);
              safariIntervalRef.current = null;
            }
            
            // Create a simple utterance - no voice selection
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 0.9;
            
            // Set event handlers
            utterance.onstart = () => {
              console.log("Speech started");
              setIsSpeaking(true);
            };
            
            utterance.onend = () => {
              console.log("Speech ended");
              setIsSpeaking(false);
              if (safariIntervalRef.current) {
                clearInterval(safariIntervalRef.current);
                safariIntervalRef.current = null;
              }
            };
            
            utterance.onerror = (error) => {
              console.error("Speech error:", error);
              setIsSpeaking(false);
            };
            
            // Speak the text
            window.speechSynthesis.speak(utterance);
            
            // Start the keep-alive interval
            safariIntervalRef.current = setInterval(() => {
              if (window.speechSynthesis.speaking) {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
              } else {
                clearInterval(safariIntervalRef.current);
                safariIntervalRef.current = null;
              }
            }, 5000);
          };
    
      // Add this function to stop speech
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
            
            // Choose the right speech method based on browser
            const browser = detectBrowserDetails();
            if (browser.browser === 'safari' || browser.isIOS) {
                console.log("Using simplified Safari speech approach for voice response");
                safariSpeakSimple(parsedResponse.answer);
            } else {
                console.log("Using standard speech approach for voice response");
                speakText(parsedResponse.answer);
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

        // Now use browser detection to choose the right speech approach
        const browser = detectBrowserDetails();
        if (browser.browser === 'safari' || browser.isIOS) {
            console.log("Using simplified Safari speech approach");
            safariSpeakSimple(parsedResponse.answer);
        } else {
            console.log("Using standard speech approach");
            speakText(parsedResponse.answer);
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
    const loadVoicesForSafari = () => {
        return new Promise((resolve) => {
          // Variable to track if we've already resolved
          let hasResolved = false;
          
          // Function to check voices and resolve if they're available
          const checkAndResolve = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices && voices.length > 0 && !hasResolved) {
              hasResolved = true;
              console.log(`Loaded ${voices.length} voices successfully`);
              resolve(voices);
            }
          };
          
          // First attempt - might work immediately in some browsers
          checkAndResolve();
          
          // Set up the onvoiceschanged event (mainly for Chrome)
          if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = checkAndResolve;
          }
          
          // Safari fallback - poll a few times
          const maxAttempts = 10;
          let attempts = 0;
          const safariInterval = setInterval(() => {
            attempts++;
            checkAndResolve();
            
            // Stop trying after max attempts
            if (attempts >= maxAttempts || hasResolved) {
              clearInterval(safariInterval);
              
              // If we still don't have voices, resolve with empty array
              if (!hasResolved) {
                console.warn("Could not load voices after multiple attempts");
                hasResolved = true;
                resolve(window.speechSynthesis.getVoices() || []);
              }
            }
          }, 100);
        });
      };
      
      
      const speakTextSafariCompatible = async (text, preferredLanguage = 'en-US') => {
        // Always cancel any existing speech first
        window.speechSynthesis.cancel();
        
        // Create utterance object
        const utterance = new SpeechSynthesisUtterance(text);
        
        try {
          // Load voices with our reliable function
          const voices = await loadVoicesForSafari();
          
          // Set language from preferred language
          utterance.lang = preferredLanguage;
          
          // For Safari, we need to be less picky about voice selection
          // First try: find a voice matching our preferred language
          let selectedVoice = voices.find(voice => voice.lang.startsWith(preferredLanguage.split('-')[0]));
          
          // If that fails, just use the default voice
          if (!selectedVoice && voices.length > 0) {
            selectedVoice = voices.find(v => v.default) || voices[0];
            console.log(`No matching voice for ${preferredLanguage}, using ${selectedVoice.name}`);
          }
          
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
          
          // Apply male-like characteristics
          utterance.pitch = 0.9; // Slightly lower pitch
          utterance.rate = 0.9;  // Slightly slower rate
          
          // Safari requires user interaction before allowing speech
          // This function should only be called from a user-initiated event handler
      
          // Speaking event handlers
          utterance.onstart = () => console.log("Speech started");
          utterance.onend = () => console.log("Speech ended");
          utterance.onerror = (e) => console.error("Speech error:", e);
          
          // Speak the text
          window.speechSynthesis.speak(utterance);
          
          // Safari bug workaround - needs periodic resume
          clearInterval(window.safariWorkaroundInterval);
          window.safariWorkaroundInterval = setInterval(() => {
            if (window.speechSynthesis.speaking) {
              // This forces Safari to continue speaking
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            } else {
              clearInterval(window.safariWorkaroundInterval);
            }
          }, 5000); // Check every 5 seconds
          
          return true;
        } catch (error) {
          console.error("Speech synthesis error:", error);
          return false;
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
                    {isSpeaking && (
  <IconButton
    onClick={stopSpeaking}
    sx={{
      mx: 1,
      bgcolor: '#FF8C00',
      color: '#FFFFFF',
      '&:hover': {
        bgcolor: '#E67300',
      },
      borderRadius: '10px',
      border: '1px solid #000000',
    }}
  >
    <VolumeOffIcon />
  </IconButton>
)}
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
                <Button 
  onClick={debugAndTestSpeech} 
  variant="outlined" 
  size="small"
  sx={{ marginTop: 1, marginLeft: 1 }}
>
  Test Speech
</Button>
            </Container>
        </ThemeProvider>
    );
};

export default ChatbotUI;
