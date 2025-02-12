import React, { useCallback, useEffect, useState } from 'react'
import Recipe from './Recipe';
import SearchFilter from './SearchFilter';
import CreateMealPlan from './CreateMealPlan';
import { useRecipeFilter } from '../hooks/useRecipeFilter';
import { useMealPlanner } from '../hooks/useMealPlanner';
import '../assets/css/RecipeList.css';
import { db } from '../firebase';
import { collection, getDocs, or, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

function RecipeList({isAuth}) {
  const [combinedRecipes, setCombinedRecipes] = useState([]);
  const { user } = useAuth();
  const {
    filteredRecipes = [],
    searchTerm,
    filters,
    handleSearch,
    handleFilterChange
  } = useRecipeFilter(combinedRecipes);

  const {
    mealPlanMains = [],
    mealPlanSides = [],
    handleCreateMealPlan,
    handleSaveMealPlan,
    handleDeleteMeal,
    handleAddMealList
  } = useMealPlanner(filteredRecipes, combinedRecipes);

  const fetchCombinedRecipeData = useCallback(async () => {
    try {
      let userRecipesData = {};
      if (user) {
        const recipeQuery = query(
          collection(db, 'recipes'),
          or(
            where('userId', '==', user.uid),
            where('userId', '==', 'master')
          )
        )
        const recipesSnapshot = await getDocs(recipeQuery);
        const recipesData = recipesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const userRecipesQuery = query(
          collection(db, 'user_recipes'),
          where('userId', '==', user.uid)
        );
        const userRecipesSnapshot = await getDocs(userRecipesQuery);
        userRecipesSnapshot.docs.forEach(doc => {
          const data = doc.data();
          userRecipesData[data.recipeId] = {
            id: doc.id,
            ...data
          };
        });

        const combined = recipesData.map(recipe => ({
          ...recipe,
          userRecipe: userRecipesData[recipe.id] || {
            hasCooked: false,
            wantToCook: false,
            cookCount: 0,
            lastCookedAt: null
          }
        }));
        setCombinedRecipes(combined);
      }
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchCombinedRecipeData();
  }, [fetchCombinedRecipeData]);

  useEffect(() => {
  }, [mealPlanMains, mealPlanSides]);

  if(!isAuth) {
    return (
      <div className='ListWrapper'>
      <div className='mealListWrapper'>

      </div>
      <div className='recipeListWrapper'>
        <h2>レシピ一覧</h2>
        <Link to='/login'><FontAwesomeIcon icon={faRightToBracket} />ログインしてレシピを見る</Link>
      </div>
      </div>
    )
  } else {
    return (
      <div className='ListWrapper'>
      <div className='mealListWrapper'>
        <CreateMealPlan
          mealPlanMains={mealPlanMains}
          mealPlanSides={mealPlanSides}
          onCreateMeals={handleCreateMealPlan}
          onSaveMeals={handleSaveMealPlan}
          handleDeleteMeal={handleDeleteMeal}
        />
      </div>
      <div className='recipeListWrapper'>
        <h2>レシピ一覧</h2>
        <SearchFilter
          searchTerm={searchTerm}
          filters={filters}
          onSearchChange={handleSearch}
          onFilterChange={handleFilterChange}
        />
        {Array.isArray(filteredRecipes) && filteredRecipes.length > 0 && (
          <ul className="recipeListContainer">
            {filteredRecipes.map((combinedRecipe) => (
              <Recipe
              key={combinedRecipe.id}
              combinedRecipe={combinedRecipe}
              onUpdate={fetchCombinedRecipeData}
              handleAddMealList={handleAddMealList}/>
            ))}
          </ul>
        )}
      </div>
      </div>
    )
  }
}

export default RecipeList
