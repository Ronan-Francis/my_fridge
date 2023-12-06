import React from 'react';
import './styles.css';

const RecipeCard = ({ recipe }) => {
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
      <h4>Timers:</h4>
      <ul>
        {recipe.timers.map((timer, index) => (
          <li key={index}>{timer} minutes</li>
        ))}
      </ul>
      <a href={recipe.originalURL} target="_blank" rel="noopener noreferrer">
        Original Recipe Link
      </a>
    </div>
  );
};

export default RecipeCard;
