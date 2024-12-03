import React, { useCallback, useEffect, useState } from 'react'
import Recipe from './Recipe';
import './RecipeList.css';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function RecipeList() {
  const [recipeList, setRecipeList] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    hasCooked: false,
    wantToCook: false,
    never: false,
    dontWant: false,
  });

  const fetchRecipes = useCallback(async () => {
    const data = await getDocs(collection(db, 'recipes'));
    const recipes = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setRecipeList(recipes);
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    console.log("useEffect2 was called!")
    let filtered = recipeList;

    if (searchTerm) {
      filtered = filtered.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.hasCooked) {
      filtered = filtered.filter((recipe) => recipe.hasCooked);
    }

    if (filters.never) {
      filtered = filtered.filter((recipe) => !recipe.hasCooked);
    }

    if (filters.wantToCook) {
      filtered = filtered.filter((recipe) => recipe.wantToCook);
    }

    if (filters.dontWant) {
      filtered = filtered.filter((recipe) => !recipe.wantToCook);
    }

    setFilteredRecipes(filtered);
  }, [recipeList, searchTerm, filters]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  return (
    <div className='recipeListWrapper'>
      <h2>レシピ一覧</h2>
      <div className='recipeList__search'>
        <input type='text' placeholder='レシピを検索' onChange={handleSearch}/>
      </div>
      <div className='recipeList__filter'>
        <input
          type='checkbox'
          id='hasCooked'
          name='hasCooked'
          checked={filters.hasCooked}
          onChange={handleFilterChange}
        />
        <label htmlFor='hasCooked'>作ったことある!</label>
        <input
          type='checkbox'
          id='wantToCook'
          name='wantToCook'
          checked={filters.wantToCook}
          onChange={handleFilterChange}
        />
        <label htmlFor='wantToCook'>作りたい！</label>
        <input
          type='checkbox'
          id='never'
          name='never'
          checked={filters.never}
          onChange={handleFilterChange}
        />
        <label htmlFor='never'>作ったことない</label>
        <input
          type='checkbox'
          id='dontWant'
          name='dontWant'
          checked={filters.dontWant}
          onChange={handleFilterChange}
        />
        <label htmlFor='dontWant'>作りたくない</label>
      </div>
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
