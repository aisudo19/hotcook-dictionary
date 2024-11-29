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


        // userRecipesSnapshotの内容を確認
        console.log('User recipes found:', userRecipesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));


        // 2. 各user_recipeに対応するrecipeの詳細を取得
        const recipesWithDetails = await Promise.all(
          userRecipesSnapshot.docs.map(async (userRecipeDoc) => {
            const userRecipeData = userRecipeDoc.data();
            // recipesコレクションから対応するレシピを取得
            // ここで、recipeIdをuidとして使用
            const recipeDoc = await getDoc(doc(db, 'recipes', userRecipeData.recipeId));

            // recipesコレクションをクエリで検索
            const recipeQuery = query(
              collection(db, 'recipes'),
              where('uid', '==', userRecipeData.recipeId)
            );
            const recipeSnapshot = await getDocs(recipeQuery);
            console.log("recipeSnapshot:::",recipeSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })));

            // recipesコレクションのドキュメント取得を確認
            console.log('Fetching recipe:', userRecipeData.recipeId);
            console.log('Recipe exists:', recipeDoc.exists());


            if (recipeDoc.exists()) {
              return {
                id: userRecipeDoc.id,
                ...userRecipeData,
                recipeDetails: {
                  ...recipeDoc.data(),
                  id: recipeDoc.id
                }
              };
            }
            return null;
          })
        );

        // デバッグ用のログ
        console.log('Found recipes:', recipesWithDetails);

        // nullを除外して結果を設定
        setRecipes(recipesWithDetails.filter(recipe => recipe !== null));
      } catch (error) {
        console.error('Error fetching cooked recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCookedRecipes();
  }, []);

  return (
    <div>
      <h2>調理済みレシピ一覧</h2>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div>
          {recipes}
          {recipes.map((recipe) => (
            <div key={recipe.id}>
              <h3>{recipe.title}</h3>
              <p>レシピID: {recipe.recipeId}</p>
              {/* その他の表示したい情報 */}
            </div>
          ))}
          <p>全{recipes.length}件</p>
        </div>
      )}
    </div>
  )
}

export default GetCookedRecipes
