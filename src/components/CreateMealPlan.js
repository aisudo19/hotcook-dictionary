import React from 'react'
import styles from '../assets/css/CreateMealPlan.module.css';

function CreateMealPlan({mealPlanMains, mealPlanSides, onCreateMeals, onShowMeals, handleDeleteMeal}) {
  return (
    <>
      <div className={styles.mealPlanWrapper}>
        <button className={styles.createMeals} onClick={onCreateMeals}>献立を作成する</button>
        <button className={styles.createMeals} onClick={onShowMeals}>献立を参照する</button>
        {mealPlanMains?.length > 0 && mealPlanSides?.length > 0 &&
          <div className={styles.mealBoard}>
            <h3>メイン</h3>
            {mealPlanMains.map((recipe) => (
              <div key={recipe.id} className={styles.mealMain}>
                <button className={styles.deleteBtn} onClick={() => handleDeleteMeal(recipe.id)}>x</button>
                <p>{recipe.title}</p>
                <img className={styles.mealThumImg} src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipe.id}.jpg`} alt={recipe.title} />
              </div>
            ))}
            <h3>サイド</h3>
            {mealPlanSides.map((recipe) => (
              <div key={recipe.id} className={styles.mealSide}>
                <button className={styles.deleteBtn} onClick={() => handleDeleteMeal(recipe.id)}>x</button>
                <p>{recipe.title}</p>
                <img className={styles.mealThumImg} src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipe.id}.jpg`} alt={recipe.title} />
              </div>
            ))}
          </div>
        }
      </div>
    </>
  )
}

export default CreateMealPlan
