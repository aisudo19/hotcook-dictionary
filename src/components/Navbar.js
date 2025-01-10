import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faHome, faRightToBracket,faRightFromBracket, faUpload, faUser, faUtensils } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/Navbar.css';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user } = useAuth();
  return (
    <nav>
      <Link to='/'><FontAwesomeIcon icon={faHome} />ホーム</Link>
      <Link to='/saved-meal-plan-lists'><FontAwesomeIcon icon={faUtensils} />献立一覧</Link>
      {user ? (
        <>
          <div>
            <Link to='/logout'><FontAwesomeIcon icon={faRightFromBracket} />ログアウト</Link>
          </div>
          <div>
            <Link to='/bulk_upload'><FontAwesomeIcon icon={faUpload} />データ一括Upload</Link>
          </div>
          <div>
            <Link to='/new_recipe'>新しいレシピを追加</Link>
          </div>
          <div>
            <Link to='/profile'><FontAwesomeIcon icon={faUser} />{user.displayName}</Link>
          </div>
        </>
      ) : (
        <Link to='/login'><FontAwesomeIcon icon={faRightToBracket} />ログイン</Link>
      )}
    </nav>
  )
}

export default Navbar
