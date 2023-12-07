// src/components/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

const LoginPage = ({ onLogin }) => {
    const [usernameLogin, setUsername] = useState('');
    const [passwordLogin, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
          const response = await axios.post('http://localhost:4000/api/user/login', {
            usernameLogin,
            passwordLogin,
          });
    
          // Assuming the login is successful, call the onLogin callback
          onLogin(response.data.userId);
        } catch (error) {
          console.error('Error logging in:', error);
          // Handle login error and set the error state
          setError('Invalid username or password. Please try again.');
        }
      };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form>
                <label>
                    Username:
                    <input type="text" value={usernameLogin} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={passwordLogin} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <button type="button" onClick={handleLogin} className="login-button">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
