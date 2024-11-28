import React from 'react'
import { Link } from 'react-router-dom';
import './Recipe.css';

function Recipe({recipe}) {
  return (
    <li className="recipeContents">

      <p>{recipe.title}</p>
      <Link to={`https://cocoroplus.jp.sharp/kitchen/recipe/hotcook/KN-HW24H/${recipe.id}`}>
        <p>公式レシピページ</p>
      </Link>
      <p>{recipe.supported_devices}</p>
        <img src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipe.id}.jpg`} alt={recipe.title} />
      <div className="btnContainer">
        <button className="hasCooked">作ったことある！</button>
        <button className='wantToCook'>作りたい！</button>
      </div>
    </li>
  )
}

export default Recipe
