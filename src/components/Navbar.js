import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faHome, faFilePen, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';

function Navbar({isAuth}) {
  return (
    <nav>
      <Link to='/'><FontAwesomeIcon icon={faHome} />ホーム</Link>
    </nav>
  )
}

export default Navbar
