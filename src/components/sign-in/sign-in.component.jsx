import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/user.context';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithGooglePopup, signInAuthWithEmailAndPassword } from '../../utils/firebase/firebase.utils';
import { FcGoogle } from 'react-icons/fc';
import './sign-in.styles.scss';

const defaultFormFields = { email: '', password: '' };

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { user } = await signInAuthWithEmailAndPassword(email, password);
      setCurrentUser(user);
      setFormFields(defaultFormFields);
      navigate('/');
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-credential':
          alert('Incorrect password for email');
          break;
        case 'auth/user-not-found':
          alert('No user associated with this email');
          break;
        default:
          console.log(error);
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithGooglePopup();
      setCurrentUser(user);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-container">
      <img src="/Heybee.svg" alt="HeyBee Logo" className="logo" />
      <h2>Welcome Back</h2>
      <p>Sign in to your account</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          required
          onChange={handleChange}
          name="email"
          value={email}
          placeholder="Email"
          className="auth-input"
        />
        <input
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
          placeholder="Password"
          className="auth-input"
        />
        <button type="submit" className="auth-button">Sign In</button>
      </form>
      <button onClick={signInWithGoogle} className="auth-button google-button">
        <FcGoogle className="google-icon" /> Sign in with Google
      </button>
      <p className="auth-link">
        Don't have an account? <Link to="/auth/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default SignInForm;
