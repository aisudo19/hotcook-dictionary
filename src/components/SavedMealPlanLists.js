  import { collection, query, deleteDoc, doc, getDocs, or, where } from 'firebase/firestore';
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
        // IDの重複を排除
        const searchIdsMain = [...new Set(
          mealPlansSnapshot.docs.flatMap(doc =>
            doc.data().mains.map(main => main.id)
          )
        )];

        const searchIdsSide = [...new Set(
          mealPlansSnapshot.docs.flatMap(doc =>
            doc.data().sides.map(side => side.id)
          )
        )];

        const recipesQuery = query(
          collection(db, 'recipe_details'),
          or(
            where('id', 'in', searchIdsMain),
            where('id', 'in', searchIdsSide)
          )
        );

        const recipeDetailsSnapshot = await getDocs(recipesQuery);
        const recipeDetailsMap = new Map(
          recipeDetailsSnapshot.docs.map(doc => [doc.id, doc.data()])
        );

        const precessedMealPlans = mealPlansSnapshot.docs.map(doc => {
          const mealPlan = doc.data();
          return {
            id: doc.id,
            ...mealPlan,
            mains: mealPlan.mains.map(main => ({
              ...main,
              ...recipeDetailsMap.get(main.id)
            })),
            sides: mealPlan.sides.map(side => ({
              ...side,
              ...recipeDetailsMap.get(side.id)
            }))
          };
        });

        setMealPlans(precessedMealPlans);
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
        {mealPlans.length === 0 ? (
        <div className={styles.noMealPlans}>
          <p>保存された献立がありません。</p>
          <Link to="/">
            <button className={styles.createMealPlanBtn}>
              献立を作成する
            </button>
          </Link>
        </div>
      ) : (
        mealPlans.map((mealPlan, index) => (
          <div key={mealPlan.id}>
            <h4 className={styles.left}>
              {index + 1}.
              {mealPlan.createdAt && mealPlan.createdAt.toDate ?
              `${mealPlan.createdAt.toDate().toLocaleString()}に保存した献立` : `保存した献立`}
              </h4>
            <button className={styles.deleteBtn} onClick={() => {
              handleDeleteMealPlan(mealPlan.id);
            }}>削除</button>
            <Link to={`/saved-meal-plans/${mealPlan.id}`}>
            <button className={styles.showMealPlan}>献立を見る</button>
            </Link>
            <h4>主菜</h4>
            <div className={styles.mealBoard}>
              {mealPlan.mains.map((main, i) => (
                <div key={i} className={styles.mealItem}>
                  <p>{main.title}</p>
                  <img className={styles.mealThumImg} src={main.imageUrl} alt={main.title} />
                </div>
              ))}
              </div>
              <h4>副菜</h4>
              <div className={styles.mealBoard}>
              {mealPlan.sides.map((side, i) => (
                <div key={i} className={styles.mealItem}>
                  <p>{side.title}</p>
                  <img className={styles.mealThumImg} src={side.imageUrl} alt={side.title} />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      </div>
    )
  }

  export default SavedMealPlanLists
