import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

const RecipeSearch = () => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch the list of all ingredients from your server
    // Update the endpoint based on your server setup
    axios.get('http://localhost:4000/api/ingredients') // Use axios.get instead of fetch
      .then(response => setIngredients(response.data))
      .catch(error => console.error('Error fetching ingredients:', error));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


const handleSearchSubmit = (e) => {
  e.preventDefault();

  // Check if selectedIngredients is empty
  if (selectedIngredients.length === 0) {
    console.error('Please select at least one ingredient before searching.');
    return;
  }

  // Fetch recipes based on selected ingredients
  // Update the endpoint based on your server setup
  const ingredientsArray = selectedIngredients.map(ingredient => ingredient.toLowerCase()); // Convert to lowercase if needed

  axios.get(`http://localhost:4000/api/recipes/by-ingredients`, {
    params: { ingredients: ingredientsArray } // Pass the array as query parameter
  })
    .then(response => {
      console.log('Fetched recipes:', response.data);

      // Check if the data contains an error
      if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].error) {
        console.error('Error from the server:', response.data[0].error);
      } else {
        setAvailableRecipes(response.data);
      }
    })
    .catch(error => console.error('Error fetching recipes:', error));
};



  const handleIngredientClick = (ingredient) => {
    setSelectedIngredients(prevIngredients => [...prevIngredients, ingredient]);
    setSearchTerm('');
  };

  return (
    <div className="recipe-search-container">
      <h2>Recipe Search</h2>
      <div>
        <h3>Ingredients</h3>
        <form onSubmit={handleSearchSubmit}>
          <input
            className="search-input"
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>
        {searchTerm && (
          <div className="search-results">
            <h4>Search Results:</h4>
            <ul>
              {ingredients
                .filter(ingredient => ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((ingredient) => (
                  <li key={ingredient.name} onClick={() => handleIngredientClick(ingredient.name)}>
                    {ingredient.name}
                  </li>
                ))}
            </ul>
          </div>
        )}
        <div className="selected-ingredients">
          {selectedIngredients.length > 0 && (
            <div>
              <h4>Selected Ingredients:</h4>
              <ul>
                {selectedIngredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="available-recipes">
        <h3>Available Recipes</h3>
        <ul>
          {availableRecipes.map((recipe) => (
            <li key={recipe._id}>{recipe.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeSearch;
