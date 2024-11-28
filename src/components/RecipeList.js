import React, { useEffect, useState } from 'react'
import Recipe from './Recipe';
import './RecipeList.css';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch('http://localhost:8080/recipes');
      const resData = await response.json();
      // setRecipes(resData);
      setRecipes(resData.recipes || []);
    }
    fetchRecipes();
  }, []);

  console.log(recipes);
  return (
    <div>
       {recipes.length > 0 && (
        <ul className="recipeListContainer">
          {recipes.map((recipe) => (
            <Recipe key={recipe.id} recipe={recipe} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default RecipeList
