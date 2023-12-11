import React, { useState, useEffect } from 'react';

function RecipeSearch() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch the list of all ingredients when the component mounts
    const fetchIngredients = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/ingredients');
        const data = await response.json();
        setAllIngredients(data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchIngredients();
  }, []); // Run this effect only once when the component mounts

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/recipes/by-ingredients?ingredients=${selectedIngredients.join(',')}`);
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  return (
    <div>
      <h2>Recipe Search</h2>
      <label>
        Select ingredients:
        <select
          multiple
          value={selectedIngredients}
          onChange={(e) => setSelectedIngredients(Array.from(e.target.selectedOptions, option => option.value))}
        >
          {allIngredients.map((ingredient) => (
            <option key={ingredient} value={ingredient}>
              {ingredient}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleSearch}>Search</button>

      <h3>Matching Recipes:</h3>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>{recipe.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeSearch;
