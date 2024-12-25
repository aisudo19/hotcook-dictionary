import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import styles from '../assets/css/SavedMealPlanLists.module.css';

function SavedMealPlanLists() {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMealPlans = async () => {
    try {
      const mealPlansSnapshot = await getDocs(collection(db, 'meal_plans'));
      setMealPlans(mealPlansSnapshot.docs.map(doc => doc.data()));
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMealPlans();
  }, []);

  if(loading){
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>献立一覧</h2>
      {mealPlans.map((mealPlan, index) => (
        <>
          <h4 className={styles.left}>{index + 1}. {mealPlan.createdAt.toDate().toLocaleString()}に保存した献立</h4>
          <div key={index} className={styles.mealBoard}>
            {mealPlan.mains.map((main, i) => (
              <div key={i} className={styles.mealItem}>
                <p>{main.title}</p>
                <img className={styles.mealThumImg} src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${main.id}.jpg`} alt={main.title} />
              </div>
            ))}
          </div>
        </>
      ))}
    </div>
  )
}

export default SavedMealPlanLists
