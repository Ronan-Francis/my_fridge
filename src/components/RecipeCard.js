import React from 'react';
import './styles.css';

const RecipeCard = ({ recipe }) => {
  // Calculate the total time, adding 2.5 minutes for each 0
  const totalTime = recipe.timers.reduce((acc, timer) => acc + timer + (timer === 0 ? 2.5 : 0), 0);

  // Custom rounding function to round based on the last digit
  const customRound = (value) => {
    const lastDigit = value % 10;
    return value + (lastDigit < 5 ? (5 - lastDigit) : (10 - lastDigit));
  };

  // Round the total time based on the last digit
  const roundedTotalTime = customRound(totalTime);
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      fetch(`http://yourserverurl/api/recipe/${recipe.id}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => console.log('Recipe deleted:', data))
      .catch(error => console.error('Error:', error));
    }
  };


  return (
    <div className="recipe-card">
      <h3>{recipe.name}</h3>
      <img src={recipe.imageURL} alt={recipe.name} style={{ maxWidth: '100%' }} />

      <h4>Ingredients:</h4>
      <ul>
        {recipe.ingredients &&
          recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
      </ul>

      <h4>Steps:</h4>
      <ol>
        {recipe.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      {/* Display the rounded total time based on the last digit */}
      <p>Total Time: {roundedTotalTime} minutes</p>

      {/* Link to the original recipe */}
      <a href={recipe.originalURL} target="_blank" rel="noopener noreferrer">
        Original Recipe Link
      </a>
      <button onClick={handleDelete}>Delete Recipe</button>

    </div>
  );
};


export default RecipeCard;
