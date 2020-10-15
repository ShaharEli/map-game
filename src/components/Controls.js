import React from "react";
import "./Controls.css";
function Controls({ reset, score, location }) {
  return (
    <div className='controls'>
      <h1>תוצאה: {score}</h1>
      <h2>המטרה: {location}</h2>
      <button>רמז</button>
      <button onClick={reset}>תור הבא</button>
    </div>
  );
}

export default Controls;
