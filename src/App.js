import logo from './logo.svg';
import './App.css';
import ChatbotUI from './components/ChatbotUi';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './components/about';
import Navbar from './components/navbar';
function App() {
  return (
    <Router>
    <Navbar />
    <Routes>
        <Route path="/" element={<ChatbotUI />} />
        <Route path="/about" element={<About />} />
    </Routes>
</Router>
);
}

export default App;
