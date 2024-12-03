import React from 'react'
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../assets/css/GetCookedRecipes.css';
import Recipe from './Recipe';

function GetCookedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCookedRecipes = async () => {
      setLoading(true);
      try {
        const recipesQuery = query(
          collection(db, 'recipes'),
          where('hasCooked', '==', true)
        );
        const recipesSnapshot = await getDocs(recipesQuery);
        console.log("recipesSnapshot: ", recipesSnapshot.docs.map((doc => doc.data())));

        setRecipes(recipesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })));

      } catch (error) {
        console.error('Error fetching cooked recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCookedRecipes();
  }, []);
  console.log("recipes: ", recipes);
  return (
    <div className='cooked-recipes__recipeListWrapper'>
      <h2>作ったことある！レシピ一覧</h2>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <ul className='cooked-recipes__recipeListContainer'>
          {recipes.map((recipe) => (
            <Recipe key={recipe.id} recipe={recipe} />
          ))}
          <p className="mt-4">全{recipes.flat().length}件</p>
        </ul>
      )}
    </div>
  )
}

export default GetCookedRecipes
