import React, { useState } from 'react'
import '../assets/css/Recipe.css';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Recipe({recipe}) {
  const [isHasCooked, setIsHasCooked] = useState(recipe.hasCooked);
  const [isWantToCook, setIsWantToCook] = useState(recipe.wantToCook);

  const handleToggleCookedList = async (recipeId) => {
    const newIsHasCooked = !isHasCooked;
    try {
      const q = query(
        collection(db, 'recipes'),
        where('UID', '==', recipeId)
      );

      const querySnapshot = await getDocs(q);

      if(!querySnapshot.empty) {
        const firstDocument = querySnapshot.docs[0];
        await updateDoc(firstDocument.ref, {
          hasCooked: newIsHasCooked
        });
      };
      setIsHasCooked(!isHasCooked);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }

  const handleToggleWantsList = async(recipeId) => {
    const newIsWantToCook = !isWantToCook;
    try {
      const q = query(
        collection(db, 'recipes'),
        where('UID', '==', recipeId)
      );

      const querySnapshot = await getDocs(q);

      if(!querySnapshot.empty){
        const firstDoc = querySnapshot.docs[0];
        await updateDoc(firstDoc.ref, {
          wantToCook: newIsWantToCook
        });
      };
      setIsWantToCook(!isWantToCook);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }
  return (
    <li className="recipeContents">
      <p>{recipe.title}</p>
      {/* <Link to={`https://cocoroplus.jp.sharp/kitchen/recipe/hotcook/KN-HW24H/${recipe.UID}`}>
        <p>公式レシピページ</p>
      </Link> */}
      {/* <p>{recipe.category === 'main' ? '主菜' : '副菜'}</p> */}
        <img src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipe.UID}.jpg`} alt={recipe.title} />
      <div className="btnContainer">
        <button onClick={() => {handleToggleCookedList(recipe.UID)}}className={isHasCooked ? "hasCooked isHasCooked" : "hasCooked"}>作ったことある！</button>
        <button onClick={() => {handleToggleWantsList(recipe.UID)}}className={isWantToCook ? "wantToCook isWantToCook" : "wantToCook"}>作りたい！</button>
      </div>
    </li>
  )
}

export default Recipe
