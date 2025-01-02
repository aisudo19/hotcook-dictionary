import React from 'react'
import { useLocation } from 'react-router-dom';
import styles from '../assets/css/FoodList.module.css';

function FoodList() {
  const location = useLocation();
  const { foodListString } = location.state || { foodListString: '' };
  const formattedText = foodListString.split('\n').map((line, index) => (
    <li key={index}>{line}</li>
  ));

  return (
    <div>
      <h1>食材リスト</h1>
      <ul>
        {formattedText}
      </ul>
    </div>
  )
}

export default FoodList
