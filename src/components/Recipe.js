// Recipe.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './Recipe.css';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Recipe({recipe}) {
  const [isHasCooked, setIsHasCooked] = useState(recipe.hasCooked);
  const [isWantToCook, setIsWantToCook] = useState(recipe.wantToCook);

  const handleToggleCookedList = async (recipeId) => {
    setIsHasCooked(!isHasCooked);
    console.log("isHasCooked1: ", isHasCooked);
    try {
      const q = query(
        collection(db, 'recipes'),
        where('UID', '==', recipeId)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (document) => {
        await updateDoc(document.ref, {
          hasCooked: isHasCooked
        });
      });
      console.log("isHasCooked2: ", isHasCooked);

      console.log('Update successful');
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }

  const handleToggleWantsList = async(recipeId) => {
    setIsWantToCook(!isWantToCook);
    try {
      const q = query(
        collection(db, 'recipes'),
        where('UID', '==', recipeId)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (document) => {
        await updateDoc(document.ref, {
          wantToCook: isWantToCook
        });
      });

      console.log('Update successful');
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
        {/* TODO
        ・フラグ追加してボタンの見え方を変化させる。
        ・作ったことあればカラフルボタンに
        ・ボタン押下したらフラグ状態を更新する*/}
        <button onClick={() => {handleToggleCookedList(recipe.UID)}}className={isHasCooked ? "hasCooked isHasCooked" : "hasCooked"}>作ったことある！</button>
        <button onClick={() => {handleToggleWantsList(recipe.UID)}}className={isWantToCook ? "wantToCook isWantToCook" : "wantToCook"}>作りたい！</button>
      </div>
    </li>
  )
}

export default Recipe
