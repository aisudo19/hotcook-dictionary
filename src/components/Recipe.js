// Recipe.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './Recipe.css';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Recipe({recipe}) {
  const [isHasCooked, setIsHasCooked] = useState(true);
  const [isWantToCook, setIsWantToCook] = useState(true);

  const handleAddCookedList = async (recipeId) => {
    setIsHasCooked(!isHasCooked);
    try {
      // recipesコレクションから特定のrecipeIdを持つドキュメントを検索
      const q = query(
        collection(db, 'user_recipes'),
        where('recipeId', '==', recipeId)
      );

      // クエリの実行
      const querySnapshot = await getDocs(q);

      // 該当するドキュメントが見つかった場合、更新を実行
      querySnapshot.forEach(async (document) => {
        await updateDoc(document.ref, {
          hasCooked: true
        });
      });

      console.log('Update successful');
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }

  const handleAddWantsList = async(recipeId) => {
    setIsWantToCook(!isWantToCook);
    try {
      // recipesコレクションから特定のrecipeIdを持つドキュメントを検索
      const q = query(
        collection(db, 'user_recipes'),
        where('recipeId', '==', recipeId)
      );

      // クエリの実行
      const querySnapshot = await getDocs(q);

      // 該当するドキュメントが見つかった場合、更新を実行
      querySnapshot.forEach(async (document) => {
        await updateDoc(document.ref, {
          wantToCook: true
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
      <Link to={`https://cocoroplus.jp.sharp/kitchen/recipe/hotcook/KN-HW24H/${recipe.UID}`}>
        <p>公式レシピページ</p>
      </Link>
      <p>{recipe.category === 'main' ? '主菜' : '副菜'}</p>
        <img src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipe.UID}.jpg`} alt={recipe.title} />
      <div className="btnContainer">
        {/* TODO
        ・フラグ追加してボタンの見え方を変化させる。
        ・作ったことあればカラフルボタンに
        ・ボタン押下したらフラグ状態を更新する*/}
        <button onClick={() => {handleAddCookedList(recipe.UID)}}className={isHasCooked ? "hasCooked isHasCooked" : "hasCooked"}>作ったことある！</button>
        <button onClick={() => {handleAddWantsList(recipe.UID)}}className={isWantToCook ? "wantToCook isWantToCook" : "wantToCook"}>作りたい！</button>
      </div>
    </li>
  )
}

export default Recipe
