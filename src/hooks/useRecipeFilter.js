import { useState, useEffect } from 'react';

export const useRecipeFilter = (recipeList) => {
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    hasCooked: false,
    wantToCook: false,
    never: false,
    dontWant: false,
  });

  useEffect(() => {
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

  return {
    filteredRecipes,
    searchTerm,
    filters,
    handleSearch,
    handleFilterChange
  };
};