import React from 'react'
import '../assets/css/CreateMealPlan.css';

const Popup = ({ mains, sides, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h3>メイン</h3>
        {mains.map((recipe) => (
          <div key={recipe.id}>
            <p>{recipe.title}</p>
          </div>
        ))}
        <h3>サイド</h3>
        {sides.map((recipe) => (
          <div key={recipe.id}>
            <p>{recipe.title}</p>
          </div>
        ))}
      </div>
      <button className="close" onClick={() => {onClose()}}>閉じる</button>
    </div>
  );
};

function CreateMealPlan({mealPlanMains, mealPlanSides, showPopup, setShowPopup, onBtnClick}) {
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div>
        <button className="createMeals" onClick={onBtnClick}>献立を作成する</button>
        {showPopup && <Popup mains={mealPlanMains} sides={mealPlanSides} onClose={handleClosePopup} />}
      </div>
    </>
  )
}

export default CreateMealPlan
