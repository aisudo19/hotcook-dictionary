import React, { useCallback, useEffect, useState } from 'react'
import Recipe from './Recipe';
import SearchFilter from './SearchFilter';
import { useRecipeFilter } from '../hooks/useRecipeFilter';
import '../assets/css/RecipeList.css';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

function RecipeList({isAuth}) {
  const [combinedRecipes, setCombinedRecipes] = useState([]);
  const { user } = useAuth();
  const [mealPlanMains, setmealPlanMains] = useState([]);
  const [mealPlanSides, setmealPlanSides] = useState([]);

  const {
    filteredRecipes = [],
    searchTerm,
    filters,
    handleSearch,
    handleFilterChange
  } = useRecipeFilter(combinedRecipes);

  const fetchCombinedRecipeData = useCallback(async () => {
    try {
      // 1. レシピの基本情報を取得
      const recipesSnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = recipesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // 2. ユーザーに紐づくレシピ情報を取得
      let userRecipesData = {};
      if (user) {
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
      }

      // 3. データを結合
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
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchCombinedRecipeData();
  }, [fetchCombinedRecipeData]);

  useEffect(() => {
  }, [mealPlanMains, mealPlanSides]);

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

  if(!isAuth) {
    return (
      <div className='recipeListWrapper'>
        <h2>レシピ一覧</h2>
        <Link to='/login'><FontAwesomeIcon icon={faRightToBracket} />ログインしてレシピを見る</Link>
      </div>
    )
  } else {
    return (
      <div className='recipeListWrapper'>
        <h2>レシピ一覧</h2>
        <button className="createMeals" onClick={handleCreateMealPlan}>献立を作成する</button>
        {mealPlanMains.length > 0 && (
          <div>
            <h3>メイン</h3>
            <ul>
              {mealPlanMains.map((recipe) => (
                <li key={recipe.id}>{recipe.title}</li>
              ))}
            </ul>
          </div>
        )}

        {mealPlanSides.length > 0 && (
          <div>
            <h3>サイド</h3>
            <ul>
              {mealPlanSides.map((recipe) => (
                <li key={recipe.id}>{recipe.title}</li>
              ))}
            </ul>
          </div>
        )}


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
              onUpdate={fetchCombinedRecipeData}/>
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default RecipeList
