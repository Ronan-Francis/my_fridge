const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(cors());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function main() {
  try {
    await mongoose.connect('mongodb+srv://admin:admin@ronancluster.5yrb2kl.mongodb.net/?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

main().catch((err) => console.log(err));

const recipeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
  timers: {
    type: [Number],
  },
  imageURL: String,
  originalURL: String,
});

recipeSchema.index({ name: 'text', ingredients: 'text' });

const recipeModel = mongoose.model('recipes.adminRecipes', recipeSchema);

app.put('/api/recipe/:id', async (req, res) => {
  console.log('Update: ' + req.params.id);
  try {
    let recipe = await recipeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log('Updated recipe:', recipe);
    res.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/recipe', async (req, res) => {
  console.log('Received POST request with body:', req.body);
  try {
    await recipeModel.create({
      _id: req.body._id,
      name: req.body.name,
      steps: req.body.steps,
      timers: req.body.timers,
      imageURL: req.body.imageURL,
      originalURL: req.body.originalURL,
    });
    console.log('Recipe created successfully');
    res.json({ message: 'Recipe created successfully' });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/recipes', async (req, res) => {
  try {
    const searchQuery = req.query.search;
    let filter = {};

    if (searchQuery) {
      // Case-insensitive search for recipes containing the search term in ingredients
      filter = { 'ingredients.name': { $regex: new RegExp(searchQuery, 'i') } };
    }

    console.log('Fetching recipes with filter:', filter);
    let recipes = await recipeModel.find(filter);
    console.log('Fetched recipes:', recipes);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/recipe/:identifier', async (req, res) => {
  console.log('Fetching recipe by ID:', req.params.identifier);
  try {
    let recipe = await recipeModel.findById(req.params.identifier);
    console.log('Fetched recipe:', recipe);
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/recipes/featured', async (req, res) => {
  try {
    // Fetch 4 random recipes
    const featuredRecipes = await recipeModel.aggregate([
      { $sample: { size: 4 } }
    ]);

    console.log('Fetched featured recipes:', featuredRecipes);
    res.json(featuredRecipes);
  } catch (error) {
    console.error('Error fetching featured recipes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/recipe/:id', async (req, res) => {
  console.log('Delete: ' + req.params.id);
  try {
    let deletedRecipe = await recipeModel.findByIdAndDelete(req.params.id);
    console.log('Deleted recipe:', deletedRecipe);
    res.json(deletedRecipe);
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
