import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../../utils/firebase/firebase.utils';
import { UserContext } from '../../contexts/user.context';
import './sign-up.styles.scss';

const defaultFormFields = { displayName: '', email: '', password: '', confirmPassword: '' };

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const { user } = await createAuthUserWithEmailAndPassword(email, password);
      await createUserDocumentFromAuth(user, { displayName });
      setCurrentUser(user);
      setFormFields(defaultFormFields);
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Cannot create user, email already in use');
      } else {
        console.log('error', error);
      }
    }
  };

  return (
    <div className="auth-container">
      <img src="/heybee2.svg" alt="HeyBee Logo" className="logo" />
      <h2>Create an Account</h2>
      <p>Sign up to get started</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          required
          onChange={handleChange}
          name="displayName"
          value={displayName}
          placeholder="Display Name"
          className="auth-input"
        />
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
        <input
          type="password"
          required
          onChange={handleChange}
          name="confirmPassword"
          value={confirmPassword}
          placeholder="Confirm Password"
          className="auth-input"
        />
        <button type="submit" className="auth-button">Sign Up</button>
      </form>
      <p className="auth-link">
        Already have an account? <Link to="/auth/signin">Sign in</Link>
      </p>
    </div>
  );
};

export default SignUpForm;