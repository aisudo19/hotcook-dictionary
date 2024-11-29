import React from 'react'
import { Link } from 'react-router-dom';
import './Recipe.css';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

import { db } from '../firebase';

function Recipe({recipe}) {
  const handleAddCookedList = async (recipeId) => {
    // console.log('作ったことある！', recipeId);
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

  const handleAddWantsList = (recipeId) => {
    console.log('作りたい！', recipeId);
  }
  return (
    <li className="recipeContents">

      <p>{recipe.title}</p>
      <Link to={`https://cocoroplus.jp.sharp/kitchen/recipe/hotcook/KN-HW24H/${recipe.uid}`}>
        <p>公式レシピページ</p>
      </Link>
      <p>{recipe.category === 'main' ? '主菜' : '副菜'}</p>
        <img src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipe.uid}.jpg`} alt={recipe.title} />
      <div className="btnContainer">
        {/* TODO
        ・フラグ追加してボタンの見え方を変化させる。
        ・作ったことあればカラフルボタンに
        ・ボタン押下したらフラグ状態を更新する*/}
        <button onClick={() => {handleAddCookedList(recipe.uid)}}className="hasCooked">作ったことある！</button>
        <button onClick={() => {handleAddWantsList(recipe.uid)}}className='wantToCook'>作りたい！</button>
      </div>
    </li>
  )
}

export default Recipe
