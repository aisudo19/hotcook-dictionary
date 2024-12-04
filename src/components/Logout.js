import React from 'react'
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase';

function Logout({setIsAuth}) {
  const navigate = useNavigate();
  const logout = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      navigate("/login");
    })
  }
  return (
    <div>
      <button onClick={logout}>ログアウト</button>
    </div>
  )
}

export default Logout
