import React from 'react'

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
        <label htmlFor='hasCooked'>作ったことある!</label>

        <input
          type='checkbox'
          id='wantToCook'
          name='wantToCook'
          checked={filters.wantToCook}
          onChange={onFilterChange}
        />
        <label htmlFor='wantToCook'>作りたい！</label>

        <input
          type='checkbox'
          id='never'
          name='never'
          checked={filters.never}
          onChange={onFilterChange}
        />
        <label htmlFor='never'>作ったことない</label>

        <input
          type='checkbox'
          id='dontWant'
          name='dontWant'
          checked={filters.dontWant}
          onChange={onFilterChange}
        />
        <label htmlFor='dontWant'>作りたくない</label>
      </div>
    </div>
  );
}

export default SearchFilter
