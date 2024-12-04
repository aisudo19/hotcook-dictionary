import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faHome, faStar, faHeart, faRightToBracket,faRightFromBracket, faUpload } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/Navbar.css';

function Navbar({isAuth}) {
  return (
    <nav>
      <Link to='/'><FontAwesomeIcon icon={faHome} />ホーム</Link>
      <Link to='/login'><FontAwesomeIcon icon={faRightToBracket} />ログイン</Link>
      <Link to='/logout'><FontAwesomeIcon icon={faRightFromBracket} />ログアウト</Link>
      <Link to='/bulk_upload'><FontAwesomeIcon icon={faUpload} />データ一括Upload</Link>
    </nav>
  )
}

export default Navbar
