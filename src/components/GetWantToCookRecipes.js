import React from 'react'
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Recipe from './Recipe';
import '../assets/css/GetWantToCookRecipes.css';

function GetWantToCookRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCookedRecipes = async () => {
      setLoading(true);
      try {
        const recipesQuery = query(
          collection(db, 'recipes'),
          where('wantToCook', '==', true)
        );
        const recipesSnapshot = await getDocs(recipesQuery);

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
  return (
    <div className='want-to-cooke__recipeListWrapper'>
      <h2>作りたい！レシピ一覧</h2>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <ul className='want-to-cooke__recipeListContainer'>
          {recipes.map((recipe) => (
            <Recipe key={recipe.id} recipe={recipe} />
          ))}
          <p className="mt-4">全{recipes.flat().length}件</p>
        </ul>
      )}
    </div>
  )
}

export default GetWantToCookRecipes
