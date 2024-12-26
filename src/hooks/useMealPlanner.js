import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const useMealPlanner = (filteredRecipes, combinedRecipes) => {
  const [mealPlanMains, setmealPlanMains] = useState([]);
  const [mealPlanSides, setmealPlanSides] = useState([]);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateMealPlan = () => {
    const recipes = filteredRecipes.length === 0 ? combinedRecipes : filteredRecipes;

    if(recipes.length === 0) return;

    const recipeMainIds = recipes.filter((recipe) => recipe.category === 'main').map((recipe) => recipe.id);
    const recipeSideIds = recipes.filter((recipe) => recipe.category === 'side').map((recipe) => recipe.id);

    const shuffledMainIds = recipeMainIds.sort(function() {
      const randomValue = Math.random(); // 0から1の乱数
      const compareValue = randomValue - 0.5; // -0.5から0.5の値
      return compareValue;
    });

    const shuffledSideIds = recipeSideIds.sort(function() {
      const randomValue = Math.random(); // 0から1の乱数
      const compareValue = randomValue - 0.5; // -0.5から0.5の値
      return compareValue;
    });

    const selectedMainIds = shuffledMainIds.slice(0, Math.min(7, shuffledMainIds.length));

    const selectedSideIds = shuffledSideIds.slice(0, Math.min(7, shuffledSideIds.length));

    const selectedMains = recipes.filter((recipe) =>
      selectedMainIds.includes(recipe.id)).map((recipe) => (
       recipe
    ));

    const selectedSides = recipes.filter((recipe) =>
      selectedSideIds.includes(recipe.id)).map((recipe) => (
       recipe
    ));
    setmealPlanMains(selectedMains);
    setmealPlanSides(selectedSides);
  }

  const handleDeleteMeal = (id) => {
    setmealPlanMains(prevMains => prevMains.filter((recipe) => recipe.id !== id));
    setmealPlanSides(prevSides => prevSides.filter((recipe) => recipe.id !== id));
  }

  const handleSaveMealPlan = async(id) => {
    if (!loading && !user) {
      alert('献立を保存するにはログインが必要です');
      navigate('/login');
      return;
    }

    if(mealPlanMains.length === 0 && mealPlanSides.length === 0) return;

    try {
      setIsSaving(true);

      const now = new Date();
      const timestamp = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') + '_' +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');

      const docId = `${user.uid}_${timestamp}`;

      const mealPlanData = {
        mains: mealPlanMains.map(recipe => ({
          id: recipe.id,
          title: recipe.title
        })),
        sides: mealPlanSides.map(recipe => ({
          id: recipe.id,
          title: recipe.title
        })),
        createdAt: new Date(),
        userId: user.uid
      }
      await setDoc(doc(db, 'meal_plans', docId), mealPlanData);
      alert('献立を保存しました。');
      navigate('/saved-meal-plan-lists');

    } catch (error) {
      console.error('Error saving meal plan:', error);
    } finally {
      setIsSaving(false);
    }

  }

  const handleAddMealList = (id) => {
    const recipe = combinedRecipes.find((recipe) => recipe.id === id);
    if(!recipe) return;
    //もしメイン・サイドのどちらかにすでに同じレシピが入っていたら追加しない
    if(mealPlanMains.some((meal) => meal.id === id) || mealPlanSides.some((meal) => meal.id === id)) return;
    if(recipe.category === 'main') {
      setmealPlanMains(prevMains => [...prevMains, recipe]);
    } else {
      setmealPlanSides(prevSides => [...prevSides, recipe]);
    }
  }

  return {
    mealPlanMains,
    mealPlanSides,
    handleCreateMealPlan,
    handleSaveMealPlan,
    handleDeleteMeal,
    handleAddMealList
  };
};