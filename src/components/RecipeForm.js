import React, { useState } from 'react';
import axios from 'axios';

const RecipeForm = () => {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);
    const [timers, setTimers] = useState([]);
    const [imageURL, setImageURL] = useState('');
    const [originalURL, setOriginalURL] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const recipe = {
            name: name,
            ingredients: ingredients,
            steps: steps,
            timers: timers,
            imageURL: imageURL,
            originalURL: originalURL
        };

        try {
            // Send a POST request to the server
            await axios.post('http://localhost:4000/api/recipe', recipe);

            // Clear the form after successful submission
            setName('');
            setIngredients([]);
            setSteps([]);
            setTimers([]);
            setImageURL('');
            setOriginalURL('');

            console.log('Recipe added successfully');
        } catch (error) {
            console.error('Error adding recipe:', error);
        }
    };

    return (
        <div className="center">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Recipe Name: </label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Ingredients: </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter ingredients, separated by commas"
                        value={ingredients.join(',')}
                        onChange={(e) => setIngredients(e.target.value.split(','))}
                    />
                </div>
                <div className="form-group">
                    <label>Steps: </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter steps, separated by commas"
                        value={steps.join(',')}
                        onChange={(e) => setSteps(e.target.value.split(','))}
                    />
                </div>
                <div className="form-group">
                    <label>Timers: </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter timers, separated by commas"
                        value={timers.join(',')}
                        onChange={(e) => setTimers(e.target.value.split(',').map(Number))}
                    />
                </div>
                <div className="form-group">
                    <label>Image URL: </label>
                    <input
                        type="text"
                        className="form-control"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Original URL: </label>
                    <input
                        type="text"
                        className="form-control"
                        value={originalURL}
                        onChange={(e) => setOriginalURL(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="submit"
                        value="Add Recipe"
                    />
                </div>
            </form>
        </div>
    );
}

export default RecipeForm;
