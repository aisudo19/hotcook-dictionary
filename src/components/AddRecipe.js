import React, { useCallback, useState } from 'react';
import { db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import styles from '../assets/css/AddRecipe.module.css';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@mui/material";
import ImageLogo from "../assets/image/image.svg";

function AddRecipe() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [recipe, setRecipe] = useState({
    title: '',
    servings: '',
    cooking_time: '',
    ingredients: [{ name: '', amount: '' }],
    instructions: [''],
    category: 'main', // デフォルト値
    supported_device: '',
    updated_at: new Date(),
    created_at: new Date()
  });

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

  const createRecipeData = (recipe, customId) => {
    const baseData = {
      title: recipe.title,
      category: recipe.category,
      cooking_time: recipe.cooking_time,
      supported_device: recipe.supported_device,
      updated_at: recipe.updated_at,
      created_at: recipe.created_at,
      userId: user.uid
    };

    return {
      base: {
        ...baseData,
        UID: customId,
      },
      details: {
        ...baseData,
        id: customId,
        servings: recipe.servings,
        ingredients: recipe.ingredients.filter(
          ingredient => ingredient.name.trim() !== '' && ingredient.amount.trim() !== ''
        ),
        instructions: recipe.instructions.filter(
          instruction => instruction.trim() !== ''
      ),
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateRecipe(recipe)) {
        return;
      }

      if(!onFileUpload()) {
        alert("画像のアップロードに失敗しました");
        return;
      }

      const customId = window.crypto.randomUUID();
      const recipeData = createRecipeData(recipe, customId);

      await Promise.all([
        setDoc(doc(db, 'recipes', customId), recipeData.base),
        setDoc(doc(db, 'recipe_details', customId), recipeData.details)
      ]);

      alert('レシピが保存されました！');
      resetForm();
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

  const resetForm = () => {
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
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // プレビュー表示用
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onFileUpload = async() => {
    if(!selectedFile) {
      alert("ファイルを選択してください");
      return false;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(process.env.REACT_APP_REMOTESERVER_URL, {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      if(result.success) {
        alert("アップロードに成功しました");
        setPreview(null);
        setSelectedFile(null);
      } else {
        return false;
      }
    } catch (e) {
      return false;
    } finally {
      setLoading(false);
    }
    return true;
  }

  return (
    <div className={styles.container}>
      <h2>新しいレシピを追加</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>料理名:</label>
          <input
            type="text"
            name="title"
            placeholder='料理名'
            value={recipe.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.outerBox}>
        <div className={styles.title}>
          <p>JpegかPngの画像ファイル</p>
        </div>
        <div
          className={styles.imageUplodeBox}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {preview ? (
            <div className={styles.previewContainer}>
              <img src={preview} alt="プレビュー" className={styles.previewImage} />
            </div>
          ) : (
            <div className={styles.imageLogoAndText}>
              <img src={ImageLogo} alt="imagelogo" />
              <p>ここに画像をドラッグ＆ドロップしてください</p>
            </div>
          )}
          <input
            className={styles.imageUploadInput}
            type="file"
            onChange={handleFileChange}
            accept=".png,.jpeg,.jpg"
          />
        </div>
        <Button
          variant="contained"
          component="label"
          style={{ marginLeft: '10px', marginTop: '15px' }}
        >
          ファイルを選択
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept=".png,.jpeg,.jpg"
          />
        </Button>
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
            placeholder='調理時間'
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
            placeholder='何人分'
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
          レシピを保存
        </button>
      </form>
    </div>
  );
}

export default AddRecipe;