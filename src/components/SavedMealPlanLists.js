import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import styles from '../assets/css/SavedMealPlanLists.module.css';
import { Link } from 'react-router-dom';

function SavedMealPlanLists() {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMealPlans = async () => {
    try {
      const mealPlansSnapshot = await getDocs(collection(db, 'meal_plans'));
      setMealPlans(mealPlansSnapshot.docs.map(doc => (
        {
          id: doc.id,
          ...doc.data()
        }
      )));
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

  const handleDeleteMealPlan = async(mealPlanId) => {
    if (window.confirm('この献立を削除してもよろしいですか？')) {
      try {
        await deleteDoc(doc(db, 'meal_plans', mealPlanId));

        setMealPlans(prevMealPlans =>
          prevMealPlans.filter(mealPlan => mealPlan.id !== mealPlanId)
        );

        alert('献立が削除されました');
      } catch (error) {
        console.error('Error deleting meal plan:', error);
        alert('削除中にエラーが発生しました');
      }
    }
  }

  return (
    <div className={styles.mealPlanLists}>
      <h2>献立一覧</h2>
      {mealPlans.map((mealPlan, index) => (
        <React.Fragment key={mealPlan.createdAt.toDate().getTime()}>
          <h4 className={styles.left}>{index + 1}. {mealPlan.createdAt.toDate().toLocaleString()}に保存した献立</h4>
          <button className={styles.deleteBtn} onClick={() => {
            handleDeleteMealPlan(mealPlan.id);
          }}>削除</button>
          <Link to={`/saved-meal-plans/${mealPlan.id}`}>
          <button className={styles.showMealPlan}>献立を見る</button>
          </Link>
          <h4>主菜</h4>
          <div key={index} className={styles.mealBoard}>
            {mealPlan.mains.map((main, i) => (
              <div key={i} className={styles.mealItem}>
                <p>{main.title}</p>
                <img className={styles.mealThumImg} src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${main.id}.jpg`} alt={main.title} />
              </div>
            ))}
            </div>
            <h4>副菜</h4>
            <div key={index} className={styles.mealBoard}>
            {mealPlan.sides.map((side, i) => (
              <div key={i} className={styles.mealItem}>
                <p>{side.title}</p>
                <img className={styles.mealThumImg} src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${side.id}.jpg`} alt={side.title} />
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

export default SavedMealPlanLists
