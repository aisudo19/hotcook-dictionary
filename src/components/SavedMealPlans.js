import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import styles from '../assets/css/SavedMealPlans.module.css';

function SavedMealPlans() {
  const [mealPlanMains, setMealPlanMains] = useState([]);
  const [mealPlanSides, setMealPlanSides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMealPlans = async () => {
    try {
      const mealPlansSnapshot = await getDocs(collection(db, 'meal_plans'));
      const mealPlanMainIds = mealPlansSnapshot.docs.map(doc => doc.data().mains).flat();
      const mealPlanSideIds = mealPlansSnapshot.docs.map(doc => doc.data().sides).flat();

      const recipeMainPromises = mealPlanMainIds.map(async (id) => {
        const recipeRef = doc(db, 'recipe_details', id);
        const recipeSnapshot = await getDoc(recipeRef);
        return recipeSnapshot.data();
      });
      const recipeMains = await Promise.all(recipeMainPromises);
      setMealPlanMains(recipeMains);

      const recipeSidePromises = mealPlanSideIds.map(async (id) => {
        const recipeRef = doc(db, 'recipe_details', id);
        const recipeSnapshot = await getDoc(recipeRef);
        return recipeSnapshot.data();
      });
      const recipeSides = await Promise.all(recipeSidePromises);
      setMealPlanSides(recipeSides);

    } catch (error) {
      console.error('Error fetching meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealPlans();
  }, []);

  if(loading){
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>保存した献立</h2>
      {mealPlanMains.map((mealPlan, index) => (
        <div key={index}>
          <div>
            <div key={index}>
              <h4>{index + 1}. {mealPlan.title}</h4>
              <div className={styles.flex}>
                <img className={styles.mealThumImg} src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${mealPlan.id}.jpg`} alt={mealPlan.title} />
                <div className= {styles.ingredients}>
                  {mealPlan.ingredients.map((ingredient, index) => (
                    <div key={index}>
                      <span>{ingredient.name}: {ingredient.amount}</span>
                    </div>
                  ))}
                </div>
                <div key={index} className={styles.instructions}>
                  {mealPlan.instructions.map((instruction, index) => (
                    <div>{index+1}. {instruction}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SavedMealPlans
