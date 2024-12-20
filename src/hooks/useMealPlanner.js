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

  return {
    mealPlanMains,
    mealPlanSides,
    handleCreateMealPlan,
    handleDeleteMeal
  };
};