import React, { useCallback, useEffect, useState } from 'react'
import Recipe from './Recipe';
import SearchFilter from './SearchFilter';
import { useRecipeFilter } from '../hooks/useRecipeFilter';
import './RecipeList.css';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function RecipeList() {
  const [recipeList, setRecipeList] = useState([]);

  const {
    filteredRecipes,
    searchTerm,
    filters,
    handleSearch,
    handleFilterChange
  } = useRecipeFilter(recipeList);

  const fetchRecipes = useCallback(async () => {
    const data = await getDocs(collection(db, 'recipes'));
    const recipes = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setRecipeList(recipes);
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

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
            <Recipe key={recipe.id} recipe={recipe} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default RecipeList
