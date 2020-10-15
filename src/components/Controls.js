import React from "react";
import "./Controls.css";
function Controls({ reset, score, location, roundCounter }) {
  return (
    <div className='controls'>
      <h1>תוצאה: {score}</h1>
      <h2>המטרה: {location}</h2>
      <h2>תור מספר: {roundCounter + 1}</h2>
      <button className='hint-btn'>רמז</button>
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
