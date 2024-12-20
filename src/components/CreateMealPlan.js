import React from 'react'
import '../assets/css/CreateMealPlan.css';

function CreateMealPlan({mealPlanMains, mealPlanSides, onBtnClick, handleDeleteMeal}) {
  return (
    <>
      <div className='mealPlanWrapper'>
        <button className="createMeals" onClick={onBtnClick}>献立を作成する</button>
        {mealPlanMains && mealPlanSides &&
          <div className="mealBoard">
            <h3>メイン</h3>
            {mealPlanMains.map((recipe) => (
              <div key={recipe.id} className="mealMain">
                <button className="deleteBtn" onClick={() => handleDeleteMeal(recipe.id)}>x</button>
                <p>{recipe.title}</p>
                <img className="mealThumImg" src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipe.id}.jpg`} alt={recipe.title} />
              </div>
            ))}
            <h3>サイド</h3>
            {mealPlanSides.map((recipe) => (
              <div key={recipe.id} className='mealSide'>
                <button className="deleteBtn" onClick={() => handleDeleteMeal(recipe.id)}>x</button>
                <p>{recipe.title}</p>
                <img className="mealThumImg" src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipe.id}.jpg`} alt={recipe.title} />
              </div>
            ))}
          </div>
        }
      </div>
    </>
  )
}

export default CreateMealPlan
