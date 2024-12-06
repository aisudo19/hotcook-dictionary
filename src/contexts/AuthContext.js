import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, provider } from '../firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {  } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const useAuth = () => {return useContext(AuthContext)};

export const AuthProvider = ({ children, setIsAuth }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem('isAuth', true);
      setIsAuth(true);
      setUser(result.user);
      await saveUserToFirestore(result.user);
      return result;
    } catch(error) {
      console.error('ログインエラー:', error);
    };
  }

  const saveUserToFirestore = async (user) => {
    if(!user) return;
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      //ユーザが存在しない場合はFirestoreに保存
      try{
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          lastLogin: new Date(),
        });
      } catch (error) {
        console.error('ユーザ情報の保存に失敗しました:', error);
      }
    } else {
      //ユーザが存在する場合は最終ログイン日時を更新
      await setDoc(userRef, {
        lastLogin: new Date()
      }, { merge: true });
    }
  }

  const logout = () => {
    return signOut(auth);
  }

  //認証状態の変更を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    })

    return unsubscribe;
  }, []);

  const value = {
    user,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
