import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, provider } from '../firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {  } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children, setIsAuth }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem('isAuth', true);
      setIsAuth(true);
      setUser(result.user);
      await saveUserToFirestore(result.user);
    } catch(error) {
      console.error('ログインエラー:', error);
    };
  }

  const saveUserToFirestore = async (user) => {
    if(!user) return;
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
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
      await setDoc(userRef, {
        lastLogin: new Date()
      }, { merge: true });
    }
  }

  const logout = () => {
    return signOut(auth);
  }

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
    logout,
    loading
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
