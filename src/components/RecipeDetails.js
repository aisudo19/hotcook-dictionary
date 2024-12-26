import { doc, getDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase';
import '../assets/css/RecipeDetails.css';

function RecipeDetails() {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchRecipeFromId = useCallback(async () => {
    try {
      const recipeRef = doc(db, 'recipe_details', id);
      const recipeSnapshot = await getDoc(recipeRef);
      const data = recipeSnapshot.data();
      if(data) {
        setRecipeData(data);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally{
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipeFromId();
  }, [fetchRecipeFromId]);

  if(loading){
    return <div>Loading...</div>
  }

  if(!recipeData){
    return <div>レシピが見つかりませんでした。</div>
  }

  return (
    <div>
      <h2>{recipeData.title}</h2>
      <img src={`https://cocoroplus.jp.sharp/kitchen/recipe/photo/${recipeData.id}.jpg`} alt={recipeData.title} />
      <p>{recipeData.servings}</p>
      {recipeData?.ingredients?.map((ingredient, index) => (
        <div key={index}>
          <span>{ingredient?.name}: {ingredient?.amount}</span>
        </div>
      ))}
      {recipeData?.instructions?.map((instruction, index) => (
        <ul key={index} className='instructions'>
          <li>{index+1}. {instruction}</li>
        </ul>
      ))}
    </div>
  )
}

export default RecipeDetails
