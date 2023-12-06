import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecipeDetail = ({ match }) => {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/recipe/${match.params.id}`)
      .then(response => setRecipe(response.data))
      .catch(error => console.error('Error fetching recipe:', error));
  }, [match.params.id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{recipe.name}</h2>
      {/* Display other details of the recipe */}
    </div>
  );
};

export default RecipeDetail;
