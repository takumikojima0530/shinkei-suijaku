import React from 'react';

const DifficultySelect = ({ onSelectDifficulty }) => {
  return (
    <div className="difficulty-select">
      <p>難易度を選択:</p>
      <button onClick={() => onSelectDifficulty('弱')}>弱</button>
      <button onClick={() => onSelectDifficulty('普通')}>普通</button>
      <button onClick={() => onSelectDifficulty('強')}>強</button>
    </div>
  );
};

export default DifficultySelect;
