import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faHome, faFilePen, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';

function Navbar({isAuth}) {
  return (
    <nav>
      <Link to='/'><FontAwesomeIcon icon={faHome} />ホーム</Link>
      <Link to='/want'><FontAwesomeIcon icon={faHome} />作りたいリスト</Link>
      <Link to='/experienced'><FontAwesomeIcon icon={faHome} />作ったことあるリスト</Link>
      <Link to='/experienced'><FontAwesomeIcon icon={faHome} />ログイン</Link>
      <Link to='/experienced'><FontAwesomeIcon icon={faHome} />ログアウト</Link>
      <Link to='/bulk_upload'><FontAwesomeIcon icon={faHome} />Bulk Upload</Link>
    </nav>
  )
}

export default Navbar
