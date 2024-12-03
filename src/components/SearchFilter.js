import React from 'react'
import '../assets/css/SearchFilter.css';

function SearchFilter({ searchTerm, filters, onSearchChange, onFilterChange }) {
  return (
    <div className='search-filter'>
      <div className='search-filter__search'>
        <input
          type='text'
          placeholder='レシピを検索'
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <div className='search-filter__filters'>
        <input
          type='checkbox'
          id='hasCooked'
          name='hasCooked'
          checked={filters.hasCooked}
          onChange={onFilterChange}
        />
        <label className='checkbox01' htmlFor='hasCooked'>作ったことある!</label>

        <input
          type='checkbox'
          id='wantToCook'
          name='wantToCook'
          checked={filters.wantToCook}
          onChange={onFilterChange}
        />
        <label className='checkbox01' htmlFor='wantToCook'>作りたい！</label>

        <input
          type='checkbox'
          id='never'
          name='never'
          checked={filters.never}
          onChange={onFilterChange}
        />
        <label className='checkbox01' htmlFor='never'>作ったことない</label>

        <input
          type='checkbox'
          id='dontWant'
          name='dontWant'
          checked={filters.dontWant}
          onChange={onFilterChange}
        />
          <label className='checkbox01' htmlFor='dontWant'>作りたくない</label>
      </div>
    </div>
  );
}

export default SearchFilter
