// GetCookedRecipes.js
import React from 'react'
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

function GetCookedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCookedRecipes = async () => {
      setLoading(true);
      try {
        // 1. まずuser_recipesからhasCookedがtrueのものを取得
        const userRecipesQuery = query(
          collection(db, 'user_recipes'),
          where('hasCooked', '==', true)
        );
        const userRecipesSnapshot = await getDocs(userRecipesQuery);

        // 2. 各user_recipeに対応するrecipeの詳細を取得
        const recipesWithDetails = await Promise.all(
          userRecipesSnapshot.docs.map(async (userRecipeDoc) => {
            const userRecipeData = userRecipeDoc.data();

            const recipesQuery = query(
              collection(db, 'recipes'),
              where('uid', '==', userRecipeData.recipeId)
            );

            const recipesSnapshot = await getDocs(recipesQuery);
            if(recipesSnapshot.empty) {
              return null;
            }else{
              return recipesSnapshot.docs.map(doc => ({
                ...doc.data()
              }));
            }
          })
        );

        // nullを除外して結果を設定
        const filteredRecipe = recipesWithDetails.filter(recipe => recipe !== null);
        setRecipes(filteredRecipe);
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
    <div>
      <h2>調理済みレシピ一覧</h2>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div>
          <div className="grid gap-4">
            {recipes.map((recipeArray, outerIndex) => (
              // 外側の配列に対するmapで、一意のkeyを設定
              <div key={`recipe-group-${outerIndex}`}>
                {/* 内側の配列に対するmap */}
                {recipeArray.map((recipe) => (
                  <ul key={recipe.id} className="p-4 border rounded shadow">
                    <li>{recipe.title}, カテゴリー: {recipe.category}, 対応デバイス: {recipe.supported_devices}, ユーザーID: {recipe.uid}</li>
                  </ul>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-4">全{recipes.flat().length}件</p>

        </div>
      )}
    </div>
  )
}

export default GetCookedRecipes
