import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from './RecipeCard';

function RecipeSearch() {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch ingredients from the API
    axios.get('http://localhost:4000/api/ingredients')
      .then(response => setIngredients(response.data))
      .catch(error => console.error('Error fetching ingredients:', error));

    // Fetch all recipes initially
    axios.get('http://localhost:4000/api/recipes')
      .then(response => setRecipes(response.data))
      .catch(error => console.error('Error fetching recipes:', error));
  }, []);

  useEffect(() => {
    if (selectedIngredients.length > 0) {
      // Fetch recipes based on selected ingredients
      axios.get(`http://localhost:4000/api/recipes?ingredients=${selectedIngredients.join(',')}`)
        .then(response => setRecipes(response.data))
        .catch(error => console.error('Error fetching recipes:', error));
    } else {
      // Fetch all recipes if no ingredients are selected
      axios.get('http://localhost:4000/api/recipes')
        .then(response => setRecipes(response.data))
        .catch(error => console.error('Error fetching recipes:', error));
    }
  }, [selectedIngredients]);

  const toggleIngredientSelection = ingredient => {
    setSelectedIngredients(prevSelectedIngredients => {
      if (prevSelectedIngredients.includes(ingredient)) {
        // Remove the ingredient from the selected list
        return prevSelectedIngredients.filter(item => item !== ingredient);
      } else {
        // Add the ingredient to the selected list
        return [...prevSelectedIngredients, ingredient];
      }
    });
  };

  return (
    <div>
      <h1>Recipe Search</h1>
      <div>
        {ingredients.map(ingredient => (
          <button
            key={ingredient}
            style={{ fontWeight: selectedIngredients.includes(ingredient) ? 'bold' : 'normal' }}
            onClick={() => toggleIngredientSelection(ingredient)}
          >
            {ingredient}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {recipes.map(recipe => <RecipeCard key={recipe._id} recipe={recipe} />)}
      </div>
    </div>
  );
}

export default RecipeSearch;
