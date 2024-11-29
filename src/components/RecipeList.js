import React, { useEffect, useState } from 'react'
import Recipe from './Recipe';
import './RecipeList.css';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function RecipeList() {
  const [recipeList, setRecipeList] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await getDocs(collection(db, 'recipes'));
      setRecipeList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    fetchRecipes();
  }, []);

  // console.log(recipeList);
  return (
    <div>
       {recipeList.length > 0 && (
        <ul className="recipeListContainer">
          {recipeList.map((recipe) => (
            <Recipe key={recipe.id} recipe={recipe} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default RecipeList
