import React from 'react';

const Dashboard = ({ score, turn, difficulty, onDifficultyChange }) => {
  return (
    <div className="dashboard">
      <p>スコア: {score}</p>
      <p>ターン数: {turn}</p>
      <div>
        <label>難易度: </label>
        <select value={difficulty} onChange={onDifficultyChange}>
          <option value="弱">弱</option>
          <option value="普通">普通</option>
          <option value="強">強</option>
        </select>
      </div>
    </div>
  );
};

export default Dashboard;
