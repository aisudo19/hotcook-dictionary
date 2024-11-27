const fs = require('node:fs/promises');

async function getStoredRecipes() {
  const rawFileContent = await fs.readFile('recipes.json', { encoding: 'utf-8' });
  const data = JSON.parse(rawFileContent);
  const storedRecipes = data.recipes ?? [];
  return storedRecipes;
}

function storeRecipes(recipes) {
  return fs.writeFile('recipes.json', JSON.stringify({ recipes: recipes || [] }));
}

exports.getStoredRecipes = getStoredRecipes;
exports.storeRecipes = storeRecipes;