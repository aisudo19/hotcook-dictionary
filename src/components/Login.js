import React, { useState } from 'react'
import { provider, auth } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Login.css';

function Login({setIsAuth}) {
  const navigate = useNavigate();
  const loginWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem('isAuth', true);
      setIsAuth(true);
      navigate("/");
    }).catch((error) => {
      console.error('ログインエラー:', error);
    });
  }

  return (
    <div>
      <button onClick={loginWithGoogle}>Googleでログインする</button>
    </div>
  )
}

export default Login
