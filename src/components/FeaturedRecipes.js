import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeaturedRecipes = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/recipes/featured')
      .then(response => setFeaturedRecipes(response.data))
      .catch(error => console.error('Error fetching featured recipes:', error));
  }, []);

  return (
    <div>
      <h2>Featured Recipes</h2>
      <ul>
        {featuredRecipes.map(recipe => (
          <li key={recipe._id}>{recipe.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturedRecipes;
