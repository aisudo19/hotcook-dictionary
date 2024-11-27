const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getStoredRecipes, storeRecipes } = require('./data/recipes');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Attach CORS headers
  // Required when using a detached backend (that runs on a different domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.get('/recipes', async (req, res) => {
  const storedRecipes = await getStoredRecipes();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ recipes: storedRecipes });
});

app.get('/recipes/:id', async (req, res) => {
  const storedRecipes = await getStoredRecipes();
  const recipe = storedRecipes.find((recipe) => recipe.id === req.params.id);
  res.json({ recipe });
});

app.post('/recipes', async (req, res) => {
  const existingRecipes = await getStoredRecipes();
  const recipeData = req.body;
  const newPost = {
    ...recipeData,
    id: Math.random().toString(),
  };
  const updatedRecipes = [newPost, ...existingRecipes];
  await storeRecipes(updatedRecipes);
  res.status(201).json({ message: 'Stored new recipe.', recipe: newPost });
});

app.listen(8080);
