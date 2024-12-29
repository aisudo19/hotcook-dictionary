import React from 'react'
import { useLocation } from 'react-router-dom';

function FoodList() {
  const location = useLocation();
  const { foodListString } = location.state || { foodListString: '' };
  const formattedText = foodListString.split('\n').map((line, index) => (
    <p key={index}>{line}</p>
  ));

  return (
    <div>
      <h1>食材リスト</h1>
        {formattedText}
    </div>
  )
}

export default FoodList
