import React from 'react'
import '../assets/css/Recipe.css';
import { collection, setDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function Recipe({combinedRecipe, onUpdate, handleAddMealList }) {
  const { user } = useAuth();

  const updateUserRecipe = async (updates) => {
    try {
      if (combinedRecipe.userRecipe.id) {
        // 既存のuser_recipesドキュメントを更新
        await setDoc(doc(db, 'user_recipes', combinedRecipe.userRecipe.id), {
          userId: user.uid,
          recipeId: combinedRecipe.id,
          ...updates,
          updatedAt: new Date()
        }, { merge: true });
      } else {
        // 新しいuser_recipesドキュメントを作成
        await addDoc(collection(db, 'user_recipes'), {
          userId: user.uid,
          recipeId: combinedRecipe.id,
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
    const newHasCooked = !combinedRecipe.userRecipe.hasCooked;
    updateUserRecipe({
      hasCooked: newHasCooked,
      cookCount: newHasCooked ? (combinedRecipe.userRecipe.cookCount || 0) + 1 : combinedRecipe.userRecipe.cookCount || 0,
      lastCookedAt: newHasCooked ? new Date() : combinedRecipe.userRecipe.lastCookedAt
    })
  };

  const handleToggleWantsList = () => {
    updateUserRecipe({
      wantToCook: !combinedRecipe.userRecipe.wantToCook
    });
  }

  return (
    <li className={combinedRecipe.category === "main" ? "mainDish recipeContents":"sideDish recipeContents"}>
      <p>{combinedRecipe.title}</p>
        <Link to={`/recipe/${combinedRecipe.id}`}>
        <img src={combinedRecipe.imageUrl} alt={combinedRecipe.title} /></Link>
        <p>{combinedRecipe.category === "main" ? "メイン":"サイド"}</p>
      <div className="btnContainer">
        <button onClick={() => {handleToggleCookedList(combinedRecipe.UID)}}
        className={combinedRecipe.userRecipe?.hasCooked ? "hasCooked isHasCooked" : "hasCooked"}
          >作った！ </button>
        <button onClick={handleToggleWantsList}
        className={combinedRecipe.userRecipe?.wantToCook ? "wantToCook isWantToCook" : "wantToCook"}
        >作りたい！</button>
        <button onClick={() => handleAddMealList(combinedRecipe.UID)} className="addMeal">献立に追加</button>
      </div>
    </li>
  )
}

export default Recipe
