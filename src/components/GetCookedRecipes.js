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
        const recipesQuery = query(
          collection(db, 'recipes'),
          where('hasCooked', '==', true)
        );
        const recipesSnapshot = await getDocs(recipesQuery);
        console.log("recipesSnapshot: ", recipesSnapshot.docs.map((doc => doc.data())));

        setRecipes(recipesSnapshot.docs.map((doc) => ({
          id: doc.id,  // ドキュメントIDも含める
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
    <div>
      <h2>調理済みレシピ一覧</h2>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div className='grid gap-4'>
          {recipes.map((recipe) => (
            <div key={recipe.id} className="p-4 border rounded shadow ">
              <div>
                {recipe.title},
                カテゴリー: {recipe.category},
                対応デバイス: {recipe.supported_devices},
                <img src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipe.UID}.jpg`} alt={recipe.title} />
              </div>
            </div>
          ))}
          <p className="mt-4">全{recipes.flat().length}件</p>
        </div>
      )}
    </div>
  )
}

export default GetCookedRecipes
