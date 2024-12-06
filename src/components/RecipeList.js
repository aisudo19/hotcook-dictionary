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
  const [recipes, setRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState({});
  const { user } = useAuth();  // 現在のユーザー情報を取得

  const {
    filteredRecipes,
    searchTerm,
    filters,
    handleSearch,
    handleFilterChange
  } = useRecipeFilter(recipes);

  const fetchRecipesWithUserData = useCallback(async () => {
    const recipesSnapshot = await getDocs(collection(db, 'recipes'));
    const recipeData = recipesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    if(user) {
      const userRecipesQuery = query(
        collection(db, 'user_recipes'),
        where('userId', '==' , user.uid)
      )

      const userRecipesSnapshot = await getDocs(userRecipesQuery);
      const userRecipesMap = {};

      userRecipesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        userRecipesMap[data.recipeId] = {
          id: doc.id,
          ...data
        };
      });
      setUserRecipes(userRecipesMap);
    }

    setRecipes(recipeData);
  }, []);

  useEffect(() => {
    fetchRecipesWithUserData();
  }, [fetchRecipesWithUserData]);

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

        <SearchFilter
          searchTerm={searchTerm}
          filters={filters}
          onSearchChange={handleSearch}
          onFilterChange={handleFilterChange}
        />

         {filteredRecipes.length > 0 && (
          <ul className="recipeListContainer">
            {filteredRecipes.map((recipe) => (
              <Recipe key={recipe.id} recipe={recipe} userRecipe={userRecipes[recipe.id]}
              onUpdate={fetchRecipesWithUserData}/>
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default RecipeList
