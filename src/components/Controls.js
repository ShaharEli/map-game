import React from "react";
import "./Controls.css";
function Controls({
  reset,
  score,
  location,
  roundCounter,
  hintSetter,
  highScore,
}) {
  return (
    <div className='controls'>
      <h1>מרחק ממטרות: {score} קילומטרים</h1>
      <h2>המטרה: {location}</h2>
      <h2>תור מספר: {roundCounter + 1}</h2>
      {highScore && <h2>תוצאה מירבית: {highScore}</h2>}
      <button className='hint-btn' onClick={() => hintSetter((prev) => !prev)}>
        רמז
      </button>
      <button
        className='next-turn-btn'
        onClick={
          roundCounter === 4 ? (e) => reset(e, true) : (e) => reset(e, false)
        }
      >
        תור הבא
      </button>
    </div>
  );
}

export default Controls;
