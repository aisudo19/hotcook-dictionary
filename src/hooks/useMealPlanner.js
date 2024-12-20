import { useState } from 'react';

export const useMealPlanner = (filteredRecipes, combinedRecipes) => {
  const [mealPlanMains, setmealPlanMains] = useState([]);
  const [mealPlanSides, setmealPlanSides] = useState([]);

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
    console.log("selectedMainIds: ",selectedMainIds, selectedSideIds);

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
    handleDeleteMeal,
    handleAddMealList
  };
};