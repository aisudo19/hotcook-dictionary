import React, { useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Papa from 'papaparse';
import '../assets/css/BulkUpload.css';

const BulkUpload = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [collectionPrimaryKey, setcollectionPrimaryKey] = useState('');
  const correctPassword = process.env.REACT_APP_CORRECT_PASSWORD;
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleCSVUpload = async (event) => {
    if (!collectionName.trim()) {  // コレクション名の入力チェック
      setResult('追加するコレクション名を入力してください');
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          await uploadToFirestore(results.data);
        },
        error: (error) => {
          console.error('CSV解析エラー:', error);
          setResult('CSVの解析に失敗しました');
        }
      });
    } catch (error) {
      console.error('エラー:', error);
      setResult('アップロードに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleJSONUpload = async (event) => {
    if (!collectionName.trim()) {  // コレクション名の入力チェック
      setResult('コレクション名を入力してください');
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await uploadToFirestore(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('エラー:', error);
      setResult('JSONの解析に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const uploadToFirestore = async (data) => {
    try {
      const batch = writeBatch(db);
      const collectionRef = collection(db, collectionName);

      data.forEach((item) => {
        // オブジェクトの各フィールドをチェックしてboolean値を変換
        const convertedItem = Object.entries(item).reduce((acc, [key, value]) => {
          // 文字列の"true"/"false"をboolean値に変換
          if (value === "true" || value === "false" || value === "TRUE" || value === "FALSE") {
            acc[key] = value === "true";
          } else {
            acc[key] = value;
          }
          return acc;
        }, {});
        // 主キーが指定されている場合は、その値をドキュメントIDとして使用
        const docRef = collectionPrimaryKey && item[collectionPrimaryKey]
        ? doc(db, collectionName, item[collectionPrimaryKey])
        : doc(collectionRef);
        batch.set(docRef, convertedItem);
      });

      await batch.commit();
      setResult(`${data.length}件のデータを${collectionName}コレクションに正常にアップロードしました`);
    } catch (error) {
      console.error('Firestoreアップロードエラー:', error);
      setResult('Firestoreへのアップロードに失敗しました');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if(password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('パスワードが違います');
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  if(!isAuthenticated) {
    return (
      <div>
        <h2>パスワードを入力してください</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="パスワードを入力"
            />
            <button
            type="submit">送信</button>
        </form>
      </div>
    )
  } else {
    return (
      <div className='bulk-upload__wrapper'>
        <h2>データ一括アップロード</h2>

        <div>
          <h3>コレクション名</h3>
          <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="コレクション名を入力"
            disabled={loading}
          />
        </div>

        <div>
          <h3>主キー（任意）</h3>
          <input
            type="text"
            value={collectionPrimaryKey}
            onChange={(e) => setcollectionPrimaryKey(e.target.value)}
            placeholder="コレクションの主キー名を入力"
            disabled={loading}
          />
        </div>

        <div>
          <h3>CSVアップロード</h3>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            disabled={loading}
          />
        </div>

        <div>
          <h3>JSONアップロード</h3>
          <input
            type="file"
            accept=".json"
            onChange={handleJSONUpload}
            disabled={loading}
          />
        </div>

        {loading && <p>アップロード中...</p>}
        {result && <p>{result}</p>}
      </div>
    );
  }
};

export default BulkUpload;