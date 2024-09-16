import React from 'react';
import { Outlet } from 'react-router-dom';
import './auth-layout.styles.scss';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;