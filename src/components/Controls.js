import React, { useState, useCallback } from "react";
import Swal from "sweetalert2";
import Draggable from "react-draggable";
import "./Controls.css";
function Controls({
  reset,
  score,
  location,
  roundCounter,
  hintSetter,
  highScore,
}) {
  const [numOfHints, setNumOfHints] = useState(1);
  const handleHints = useCallback(() => {
    if (numOfHints > 0) {
      setNumOfHints((prev) => prev - 1);
      hintSetter((prev) => !prev);
    } else {
      Swal.fire("טעות", "נגמרו הרמזים", "error");
    }
  }, [numOfHints]);

  const handleReset = useCallback(
    (e) => {
      if (roundCounter === 4) {
        setNumOfHints(1);
        reset(e, true);
      } else {
        reset(e, false);
      }
    },
    [roundCounter, reset]
  );
  return (
    <Draggable bounds='*'>
      <div className='controls'>
        <h1>מרחק ממטרות: {score} קילומטרים</h1>
        <div>
          <h2>המטרה: {location}</h2>
        </div>
        <h2>תור מספר: {roundCounter + 1}/5</h2>
        {highScore && <h2>תוצאה מירבית: {highScore}</h2>}
        <h2>מספר רמזים שנותרו: {numOfHints}</h2>
        <button className='hint-btn' onClick={handleHints}>
          רמז
        </button>
        <button className='next-turn-btn' onClick={handleReset}>
          תור הבא
        </button>
      </div>
    </Draggable>
  );
}

export default Controls;
