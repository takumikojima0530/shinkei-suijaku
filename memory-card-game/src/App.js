import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Board from './components/Board';
import Dashboard from './components/Dashboard';
import { initializeGame, flipCard, checkPair, aiTurn, setDifficulty } from './redux/gameSlice';

function App() {
  const dispatch = useDispatch();
  const { cards, turns, score, difficulty } = useSelector(state => state.game);

  useEffect(() => {
    dispatch(initializeGame([1, 2, 3, 4, 5, 6, 7, 8]));  // カード値のセット
  }, [dispatch]);

  const handleCardClick = (id) => {
    dispatch(flipCard(id));
    setTimeout(() => {
      dispatch(checkPair());
      dispatch(aiTurn());
    }, 1000);  // 1秒待機後にAIターン
  };

  const handleDifficultyChange = (event) => {
    dispatch(setDifficulty(event.target.value));
  };

  return (
    <div className="App">
      <Dashboard score={score} turn={turns} difficulty={difficulty} onDifficultyChange={handleDifficultyChange} />
      <Board cards={cards} onCardClick={handleCardClick} />
    </div>
  );
}

export default App;
