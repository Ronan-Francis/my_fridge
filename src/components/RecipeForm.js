import React, { useState } from 'react';
import axios from 'axios';

const RecipeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    steps: [],
    timers: [],
    imageURL: '',
    originalURL: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/recipe', formData);
      console.log('Recipe created successfully');
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  // Implement form fields and onChange handlers

  return (
    <div>
      <h2>Create Recipe</h2>
      {/* Implement the form */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default RecipeForm;
