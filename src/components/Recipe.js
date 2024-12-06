import React, { useState } from 'react'
import '../assets/css/Recipe.css';
import { collection, query, where, getDocs, updateDoc, setDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

function Recipe({recipe, userRecipe, onUpdate }) {
  const { user } = useAuth();

  const updateUserRecipe = async (updates) => {
    try {
      if (userRecipe) {
        // 既存のuser_recipesドキュメントを更新
        await setDoc(doc(db, 'user_recipes', userRecipe.id), {
          ...userRecipe,
          ...updates,
          updatedAt: new Date()
        }, { merge: true });
      } else {
        // 新しいuser_recipesドキュメントを作成
        await addDoc(collection(db, 'user_recipes'), {
          userId: user.uid,
          recipeId: recipe.id,
          ...updates,
          cookCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      onUpdate();  // 親コンポーネントのデータを更新
    } catch (error) {
      console.error('Error updating user recipe:', error);
    }
  };

  const handleToggleCookedList = () => {
    const newHasCooked = !(userRecipe?.hasCooked ?? false);
    updateUserRecipe({
      hasCooked: newHasCooked,
      cookCount: newHasCooked ? (userRecipe?.cookCount ?? 0) + 1 : userRecipe?.cookCount ?? 0,
      lastCookedAt: newHasCooked ? new Date() : userRecipe?.lastCookedAt
    })
  };

  const handleToggleWantsList = () => {
    updateUserRecipe({
      wantToCook: !(userRecipe?.wantToCook ?? false)
    });
  }

  return (
    <li className="recipeContents">
      <p>{recipe.title}</p>
        <img src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipe.UID}.jpg`} alt={recipe.title} />
      <div className="btnContainer">
        <button onClick={() => {handleToggleCookedList(recipe.UID)}}
        className={userRecipe?.hasCooked ? "hasCooked isHasCooked" : "hasCooked"}
          >作ったことある！ </button>
        <button onClick={handleToggleWantsList}
        className={userRecipe?.wantToCook ? "wantToCook isWantToCook" : "wantToCook"}
        >作りたい！</button>
      </div>
      作った回数({userRecipe?.cookCount ?? 0}回)
    </li>
  )
}

export default Recipe
