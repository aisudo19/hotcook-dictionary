import React from 'react'
import '../assets/css/CreateMealPlan.css';

    function CreateMealPlan({mealPlanMains, mealPlanSides, onBtnClick}) {
  return (
    <>
      <div>
        <button className="createMeals" onClick={onBtnClick}>献立を作成する</button>
        {mealPlanMains && mealPlanSides &&
          <div className="popup">
            <div className="popup-content">
              <h3>メイン</h3>
              {mealPlanMains.map((recipe) => (
                <div key={recipe.id}>
                  <p>{recipe.title}</p>
                </div>
              ))}
              <h3>サイド</h3>
              {mealPlanSides.map((recipe) => (
                <div key={recipe.id}>
                  <p>{recipe.title}</p>
                </div>
              ))}
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default CreateMealPlan
