const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(cors());
app.use(function (req, res, next) {
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

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  savedRecipeIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Recipe',
  },
  savedIngredientIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Ingredient',
  },
  additionalInfo: {
    email: String,
    preferences: {
      dietary: [String],
      cuisine: [String],
    },
  },
});

const userModel = mongoose.model('recipes.users', userSchema);



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

// Add a new route for fetching all unique ingredients from recipes
app.get('/api/ingredients', async (req, res) => {
  try {
    const allRecipes = await recipeModel.find({}, 'ingredients');
    const allIngredients = Array.from(new Set(allRecipes.flatMap(recipe => recipe.ingredients)));
    res.json(allIngredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/recipes/by-ingredients', async (req, res) => {
  try {
    const ingredientArray = req.query.ingredients;

    if (!ingredientArray || !Array.isArray(ingredientArray)) {
      return res.status(400).json({ error: 'Invalid or missing ingredients parameter' });
    }

    // Case-insensitive search for recipes containing any of the specified ingredients
    const filter = {
      ingredients: { $in: ingredientArray.map(ingredient => new RegExp(ingredient, 'i')) }
    };

    console.log('Fetching recipes with ingredients:', ingredientArray);
    let recipes = await recipeModel.find(filter);
    console.log('Fetched recipes:', recipes);
    
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes by ingredients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add routes for users

// User Registration
app.post('/api/user/register', async (req, res) => {
  try {
    const { username, password, email, preferences } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if the username is already taken
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Create a new user
    const newUser = await userModel.create({
      _id: new mongoose.Types.ObjectId(),
      username,
      password, // TODO: Hash the password before saving
      additionalInfo: { email, preferences },
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User Login
app.post('/api/user/login', async (req, res) => {
  const { usernameLogin, passwordLogin } = req.body;
  
  console.log("Log in attempt by "+usernameLogin + " , "+ passwordLogin)
  try {

    // Validate required fields
    if (!usernameLogin || !passwordLogin) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await userModel.findOne({ username:usernameLogin})

    if (!user) {
      console.log("User not found");
    } else {
      console.log("Found user:", user);
    }
    

    // Check if the user exists
    if (!user) {
      console.log("Invalid Username");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the password matches (without encryption)
    if (user.password !== passwordLogin) {
      console.log("Invalid Password")
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set user.isAuthenticated to true (if needed)
    user.isAuthenticated = true;

    // Respond with a success message and user details
    res.json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get User Profile
app.get('/api/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update User Profile
app.put('/api/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    // Update the user profile
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete User Account
app.delete('/api/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete the user
    const deletedUser = await userModel.findByIdAndDelete(userId);

    res.json(deletedUser);
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
