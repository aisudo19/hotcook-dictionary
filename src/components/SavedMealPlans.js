import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import styles from '../assets/css/SavedMealPlans.module.css';
import { useNavigate, useParams } from 'react-router-dom';

function SavedMealPlans() {
  const { id } = useParams();
  const [ mealPlanMainDetails, setMealPlanMainDetails ] = useState([]);
  const [ mealPlanSideDetails, setMealPlanSideDetails ] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMealPlansFromId = async () => {
    if (!id) {
      setError('IDが見つかりません');
      setLoading(false);
      return;
    }

    try {
      const mealPlansRef = doc(db, 'meal_plans', id);
      const mealPlansSnapshot = await getDoc(mealPlansRef);

      if (!mealPlansSnapshot.exists()) {
        setError('献立が見つかりません');
        setLoading(false);
        return;
      }

      const mealPlan = mealPlansSnapshot.data();

      if (!mealPlan.mains || !Array.isArray(mealPlan.mains)) {
        setError('メイン料理のデータが不正です');
        setLoading(false);
        return;
      }

      const mealPlanMains = await Promise.all(
        mealPlan.mains.map(async (main) => {
          if (!main || !main.id) return null;
          const recipeRef = doc(db, 'recipe_details', main.id);
          const recipeSnapshot = await getDoc(recipeRef);
          if (!recipeSnapshot.exists()) return null;
          return recipeSnapshot.data();
        })
      );

      setMealPlanMainDetails(mealPlanMains.filter(recipe => recipe !== null));

      if (mealPlan.sides && Array.isArray(mealPlan.sides)) {
        const mealPlanSides = await Promise.all(
          mealPlan.sides.map(async (side) => {
            if (!side || !side.id) return null;
            const recipeRef = doc(db, 'recipe_details', side.id);
            const recipeSnapshot = await getDoc(recipeRef);
            if (!recipeSnapshot.exists()) return null;
            return recipeSnapshot.data();
          })
        );
        setMealPlanSideDetails(mealPlanSides.filter(recipe => recipe !== null));
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      setError('データの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMealPlansFromId();
  }, [id]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleOutputFoodList = () => {
    const foodList = [
      ...mealPlanMainDetails.reduce((acc, recipe) => {
        recipe.ingredients.forEach(ingredient => {
          if (!acc.has(ingredient.name)) {
            acc.set(ingredient.name, '');
          }
          acc.set(ingredient.name, acc.get(ingredient.name) + ingredient.amount);
        });
        return acc;
      }, new Map()),
      ...mealPlanSideDetails.reduce((acc, recipe) => {
        recipe.ingredients.forEach(ingredient => {
          if (!acc.has(ingredient.name)) {
            acc.set(ingredient.name, '');
          }
          acc.set(ingredient.name, acc.get(ingredient.name) + ingredient.amount);
        });
        return acc;
      }, new Map())
    ];

    const foodListString = Array.from(foodList).map(([name, amount]) => `${name}: ${amount}`).join('\n');
    navigate('/food-list', { state: { foodListString } });
  }

  return (
    <div className={styles.recipeContainer}>
      <h2>献立詳細</h2>
      <button onClick={handleOutputFoodList}>食材リストの出力</button>
      <h2>メイン</h2>
      {mealPlanMainDetails.length > 0 ? (
        mealPlanMainDetails.map((recipe, index) => (
          recipe && (
            <div key={index} className={styles.recipeCard}>
            <h4>{index + 1}. {recipe.title}</h4>
            <div className={styles.flex}>
              <div>
                <img
                  className={styles.mealThumImg}
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'デフォルト画像のURL';
                  }}
                />
              </div>
              <div className={styles.ingredients}>
                <h5>材料</h5>
                {recipe.ingredients?.map((ingredient, idx) => (
                  <div key={idx}>
                    <span>{ingredient.name}: {ingredient.amount}</span>
                  </div>
                ))}
              </div>
              <div className={styles.instructions}>
                <h5>手順</h5>
                {recipe.instructions?.map((instruction, idx) => (
                  <div key={idx}>{idx+1}. {instruction}</div>
                ))}
              </div>
            </div>
          </div>
          )
        ))
      ) : (
        <div>メイン料理が登録されていません</div>
      )}
      <h2>サイド</h2>
      {mealPlanSideDetails.length > 0 ? (
        mealPlanSideDetails.map((recipe, index) => (
          recipe && (
            <div key={index} className={styles.recipeCard}>
            <h4>{index + 1}. {recipe.title}</h4>
            <div className={styles.flex}>
              <div>
                <img
                  className={styles.mealThumImg}
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'デフォルト画像のURL';
                  }}
                />
              </div>
              <div className={styles.ingredients}>
                <h5>材料</h5>
                {recipe.ingredients?.map((ingredient, idx) => (
                  <div key={idx}>
                    <span>{ingredient.name}: {ingredient.amount}</span>
                  </div>
                ))}
              </div>
              <div className={styles.instructions}>
                <h5>手順</h5>
                {recipe.instructions?.map((instruction, idx) => (
                  <div key={idx}>{idx+1}. {instruction}</div>
                ))}
              </div>
            </div>
          </div>
          )
        ))
      ) : (
        <div className="text-center py-4">サイド料理が登録されていません</div>
      )}
    </div>
  )
}

export default SavedMealPlans