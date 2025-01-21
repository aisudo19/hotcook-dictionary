import React, { useCallback, useState, useEffect } from 'react';
import { db } from '../firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import styles from '../assets/css/AddRecipe.module.css';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@mui/material";
import ImageLogo from "../assets/image/image.svg";
import { useParams, useNavigate } from 'react-router-dom';

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [recipe, setRecipe] = useState({
    title: '',
    servings: '',
    cooking_time: '',
    ingredients: [{ name: '', amount: '' }],
    instructions: [''],
    category: 'main',
    supported_device: '',
    updated_at: new Date(),
    imageUrl: ''
  });

  // レシピデータの取得
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeDoc = await getDoc(doc(db, 'recipe_details', id));
        if (recipeDoc.exists()) {
          const recipeData = recipeDoc.data();
          setRecipe({
            ...recipeData,
            updated_at: new Date()
          });
          if (recipeData.imageUrl) {
            setPreview(recipeData.imageUrl);
          }
        } else {
          alert('レシピが見つかりませんでした');
          navigate('/recipes');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        alert('レシピの取得中にエラーが発生しました');
      } finally {
        setInitialLoad(false);
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

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: newIngredients });
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

  const removeInstruction = (index) => {
    const newInstructions = recipe.instructions.filter((_, i) => i !== index);
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateRecipe(recipe)) {
        return;
      }

      // 画像のアップロード処理
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("userId", user.uid);
        formData.append("recipeId", id);

        const imageUploadResult = await uploadImage(formData);
        if (!imageUploadResult.success) {
          alert("画像のアップロードに失敗しました");
          return;
        }
      }

      // レシピデータの更新
      const updatedRecipe = {
        ...recipe,
        updated_at: new Date()
      };

      // Firestoreの更新
      await Promise.all([
        setDoc(doc(db, 'recipes', id), {
          title: updatedRecipe.title,
          category: updatedRecipe.category,
          cooking_time: updatedRecipe.cooking_time,
          supported_device: updatedRecipe.supported_device,
          updated_at: updatedRecipe.updated_at,
          userId: user.uid,
          imageUrl: updatedRecipe.imageUrl,
          UID: id
        }),
        setDoc(doc(db, 'recipe_details', id), updatedRecipe)
      ]);

      alert('レシピが更新されました！');
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('レシピの更新中にエラーが発生しました');
    }
  };

  const uploadImage = async (formData) => {
    try {
      setLoading(true);
      const response = await fetch(process.env.REACT_APP_REMOTESERVER_URL + '/api/upload.php', {
        method: "POST",
        body: formData
      });
      const textResponse = await response.text();
      let result;
      try {
        result = JSON.parse(textResponse);
        console.log('Parsed response:', result);
      } catch (error) {
        console.error('JSON parse error:', error);
        return { success: false };
      }

      if (result.success) {
        return { success: true, url: result.url };
      }
    } catch (error) {
      console.error('Image upload error:', error);
      return { success: false };
    } finally {
      setLoading(false);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

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

  if (initialLoad) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>レシピを編集</h2>
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
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className={styles.removeButton}
              >
                削除
              </button>
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
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className={styles.removeButton}
              >
                削除
              </button>
            </div>
          ))}
          <button type="button" onClick={addInstruction} className={styles.addButton}>
            手順を追加
          </button>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            {loading ? '更新中...' : 'レシピを更新'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/recipe/${id}`)}
            className={styles.cancelButton}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRecipe;