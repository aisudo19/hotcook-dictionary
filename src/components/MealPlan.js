import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import '../assets/css/MealPlan.css';

function MealPlan() {
  const location = useLocation();
  const { mealPlanMains, mealPlanSides } = location.state;
  const [isSaving, setIsSaving] = useState(false); // 保存中の状態管理
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // 認証状態の確認
  useEffect(() => {
    if (!loading && !user) {
      alert('献立を保存するにはログインが必要です');
      navigate('/login');
    }
    setIsLoading(false);
  }, [user, navigate, loading]);

  const handleSaveMealPlan = async () => {
    if (!loading && !user) {
      alert('献立を保存するにはログインが必要です');
      navigate('/login');
      return;
    }

    if(mealPlanMains.length === 0 && mealPlanSides.length === 0) return;

    try {
      setIsSaving(true);
      const mealPlanData = {
        mains: mealPlanMains.map(recipe => recipe.id),
        sides: mealPlanSides.map(recipe => recipe.id),
        createdAt: new Date(),
        userId: user.uid
      }
      const docRef = await addDoc(collection(db, 'meal_plans'), mealPlanData);
      alert('献立を保存しました。');
      navigate('/saved-meal-plans');

    } catch (error) {
      console.error('Error saving meal plan:', error);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>献立</h2>
      <div>
        <h3>主菜</h3>
        <div className="mealMainWrapper">
          {mealPlanMains.map(recipe => (
            <div key={recipe.id}>{recipe.title}
            <img className="mealThumImg" src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipe.id}.jpg`} alt={recipe.title} /></div>
          ))}
        </div>
        <h3>副菜</h3>
        <div className='mealSideWrapper'>
          {mealPlanSides.map(recipe => (
            <div key={recipe.id}>{recipe.title}
            <img className="mealThumImg" src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipe.id}.jpg`} alt={recipe.title} /></div>
          ))}
        </div>
      </div>
      <button onClick={handleSaveMealPlan} disabled={isSaving}>{isSaving ? '保存中...' : '献立を保存する'}</button>
    </div>
  )
}

export default MealPlan
