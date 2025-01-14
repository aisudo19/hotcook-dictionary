import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import styles from '../assets/css/EditRecipe.module.css';
import { useNavigate, useParams } from 'react-router-dom';

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: '',
    servings: '',
    cooking_time: '',
    ingredients: [{ name: '', amount: '' }],
    instructions: [''],
    category: 'main',
    supported_device: '',
    updated_at: new Date(),
    created_at: new Date(),
    deleted_at: null
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeRef = doc(db, 'recipe_details', id);
        const recipeSnapshot = await getDoc(recipeRef);

        if (recipeSnapshot.exists()) {
          const data = recipeSnapshot.data();
          setRecipe({
            ...data,
            updated_at: new Date(),
          });
        } else {
          alert('レシピが見つかりませんでした');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        alert('レシピの取得に失敗しました');
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setRecipe({
      ...recipe,
      [e.target.name]: e.target.value
    });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = recipe.ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [field]: value };
      }
      return ingredient;
    });
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: '', amount: '' }]
    });
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = recipe.instructions.map((instruction, i) => {
      if (i === index) {
        return value;
      }
      return instruction;
    });
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const addInstruction = () => {
    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, '']
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredIngredients = recipe.ingredients.filter(
        ingredient => ingredient.name.trim() !== '' && ingredient.amount.trim() !== ''
      );

      const filteredInstructions = recipe.instructions.filter(
        instruction => instruction.trim() !== ''
      );
      if (filteredIngredients.length === 0) {
        alert('少なくとも1つの材料を入力してください');
        return;
      }

      if (filteredInstructions.length === 0) {
        alert('少なくとも1つの手順を入力してください');
        return;
      }

      await Promise.all([
        setDoc(doc(db, 'recipes', id), {
          UID: id,
          title: recipe.title,
          category: recipe.category,
          cooking_time: recipe.cooking_time,
          supported_device: recipe.supported_device,
          updated_at: new Date(),
          created_at: recipe.created_at
        }),
        setDoc(doc(db, 'recipe_details', id), {
          id: id,
          title: recipe.title,
          servings: recipe.servings,
          cooking_time: recipe.cooking_time,
          ingredients: filteredIngredients,
          instructions: filteredInstructions,
          category: recipe.category,
          supported_device: recipe.supported_device,
          updated_at: new Date(),
          created_at: recipe.created_at
        })
      ]);

      alert('レシピが保存されました！');
      // フォームをリセット
      setRecipe({
        title: '',
        servings: '',
        cooking_time: '',
        ingredients: [{ name: '', amount: '' }],
        instructions: [''],
        category: 'main',
        supported_device: '',
        updated_at: new Date(),
        created_at: new Date(),
        deleted_at: null
      });
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('レシピの保存中にエラーが発生しました');
    }
  };

  const validateRecipe = (recipe) => {
    const filteredIngredients = recipe.ingredients.filter(
      ingredient => ingredient.name.trim() !== '' && ingredient.amount.trim() !== ''
    );
    const filteredInstructions = recipe.instructions.filter(
      instruction => instruction.trim() !== ''
    );

    if (filteredIngredients.length === 0) {
      alert('少なくとも1つの材料を入力してください');
      return false;
    }

    if (filteredInstructions.length === 0) {
      alert('少なくとも1つの手順を入力してください');
      return false;
    }

    return true;
  };

  return (
    <div className={styles.container}>
      <h2>レシピを編集</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>料理名:</label>
          <input
            type="text"
            name="title"
            value={recipe.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>カテゴリー:</label>
          <select
            name="category"
            value={recipe.category}
            onChange={handleChange}
            required
          >
            <option value="main">主菜</option>
            <option value="side">副菜</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>調理時間 (分):</label>
          <input
            type="number"
            name="cooking_time"
            value={recipe.cooking_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>何人分:</label>
          <input
            type="text"
            name="servings"
            value={recipe.servings}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>対応デバイス:</label>
          <select
            name="supported_device"
            value={recipe.supported_device}
            onChange={handleChange}
            required
          >
            <option value="hotcook">ホットクック</option>
            <option value="healsio">ヘルシオ</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>材料:</label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className={styles.ingredientRow}>
              <input
                type="text"
                placeholder="材料名"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="量"
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addIngredient} className={styles.addButton}>
            材料を追加
          </button>
        </div>

        <div className={styles.formGroup}>
          <label>手順:</label>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className={styles.instructionRow}>
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                placeholder={`手順 ${index + 1}`}
              />
            </div>
          ))}
          <button type="button" onClick={addInstruction} className={styles.addButton}>
            手順を追加
          </button>
        </div>

        <button type="submit" className={styles.submitButton}>
          レシピを更新
        </button>
      </form>
    </div>
  );
}

export default EditRecipe;