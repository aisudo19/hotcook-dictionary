import React from 'react'
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user, logout } = useAuth();
  if(!user) {
    return <div>ログインしていません</div>
  }
  return (
    <div>
      <h2>プロフィール</h2>
      <img src={user.photoURL} alt={user.displayName} />
      <p>名前: {user.displayName}</p>
      <p>メールアドレス: {user.email}</p>
      <button onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >ログアウト</button>
    </div>
  )
}

export default Profile
