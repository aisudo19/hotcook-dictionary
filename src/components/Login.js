import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../assets/css/Login.css';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  }

  return (
    <div>
      <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Googleでログインする</button>
    </div>
  )
}

export default Login
