import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../firebase';
import '../assets/css/RecipeDetails.css';

function RecipeDetails() {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleEditRecipe = (id) => {
    navigate(`/edit_recipe/${id}`);
  }

  const handleRemoveRecipe = async (id) => {
    const isConfirmed = window.confirm('このレシピを削除してもよろしいですか？');

    if (isConfirmed) {
      try {
        const recipeDetailRef = doc(db, 'recipe_details', id);
        const recipesRef = doc(db, 'recipes', id);

        await Promise.all([
          deleteDoc(recipeDetailRef),
          deleteDoc(recipesRef)
        ]);

        alert('レシピを削除しました');
        navigate('/');
      } catch (error) {
        console.error('Error removing recipe:', error);
        alert('レシピの削除に失敗しました');
      }
    }
  }

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
      <div>
        <button onClick={() => {handleEditRecipe(recipeData.id)}}>編集</button>
        <button onClick={() => {handleRemoveRecipe(recipeData.id)}}>削除</button>
      </div>
      <img src={recipeData.imageUrl} alt={recipeData.title} />
      <p>{recipeData.servings}</p>
      {recipeData?.ingredients?.map((ingredient, index) => (
        <div key={index}>
          <span>{ingredient?.name}: {ingredient?.amount}</span>
        </div>
      ))}
      <ul className='instructions'>
        {recipeData?.instructions?.map((instruction, index) => (
          <li key={index}>{index+1}. {instruction}</li>
      ))}
      </ul>
    </div>
  )
}

export default RecipeDetails
