import React from 'react'

function CreateMealPlan({mealPlanMains, mealPlanSides,onBtnClick}) {
  return (
    <div>
      <button className="createMeals" onClick={onBtnClick}>献立を作成する</button>
      {mealPlanMains.length > 0 && (
        <div>
          <h3>メイン</h3>
          <ul>
            {mealPlanMains.map((recipe) => (
              <li key={recipe.id}>{recipe.title}</li>
            ))}
          </ul>
        </div>
      )}

      {mealPlanSides.length > 0 && (
        <div>
          <h3>サイド</h3>
          <ul>
            {mealPlanSides.map((recipe) => (
              <li key={recipe.id}>{recipe.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CreateMealPlan
