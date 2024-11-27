import React, { useEffect, useState } from 'react'

function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch('http://localhost:8080/recipes');
      const resData = await response.json();
      // setRecipes(resData);
      setRecipes(resData.recipes || []);
    }
    fetchRecipes();
  }, []);

  console.log(recipes);


  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <h2>{recipe.title}</h2>
          <p>{recipe.supported_devices}</p>
          <a href={`https://cocoroplus.jp.sharp/kitchen/recipe/hotcook/KN-HW24H/${recipe.id}`}>{`https://cocoroplus.jp.sharp/kitchen/recipe/hotcook/KN-HW24H/${recipe.id}`}</a>
          <img src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipe.id}.jpg`} alt={recipe.title} />
        </div>
      ))}
    </div>
  )
}

export default Home
