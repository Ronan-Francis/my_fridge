// src/components/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import NavbarComponent from './components/Navbar';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import FeaturedRecipes from './components/FeaturedRecipes';
import RecipeForm from './components/RecipeForm';
import LoginPage from './components/LoginPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Function to check authentication by username and password
  const checkAuthentication = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/user/check-auth', {
        username,
        password,
      });

      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  useEffect(() => {
    // Example: Check authentication with a default user
    checkAuthentication('exampleUsername', 'examplePassword');
  }, []);

  return (
    <Router>
      {isLoggedIn ? (
        <div className="App">
          <NavbarComponent />
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/featured" element={<FeaturedRecipes />} />
            <Route path="/create" element={<RecipeForm />} />
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/login" />}
          />
          <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
