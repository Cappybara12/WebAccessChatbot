import './App.css';
import ChatbotUI from './components/ChatbotUi';
import About from './components/about';
import AuthLayout from './routes/Auth/auth-layout.component';
import SignInForm from './components/sign-in/sign-in.component';
import SignUpForm from './components/sign-up/sign-up.component';
import Navbar from './components/navbar';
import { useUserContext } from './contexts/user.context';
import { Route, Routes, Navigate } from 'react-router-dom';

const App = () => {
  const { currentUser } = useUserContext();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ChatbotUI />} />
        <Route path="/about" element={currentUser ? <About /> : <Navigate to="/auth/signin" />} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth/signin" />} />
          <Route path="signin" element={currentUser ? <Navigate to="/" /> : <SignInForm />} />
          <Route path="signup" element={currentUser ? <Navigate to="/" /> : <SignUpForm />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;