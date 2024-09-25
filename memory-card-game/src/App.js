import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Board from './components/Board';
import Dashboard from './components/Dashboard';
import {
  initializeGame,
  flipCard,
  checkPair,
  aiTurn,
  setDifficulty,
} from './redux/gameSlice';

function App() {
  const dispatch = useDispatch();
  // ゲームの状態をReduxストアから取得
  const { cards, turns, score, difficulty } = useSelector(
    (state) => state.game
  );

  useEffect(() => {
    // ゲーム初期化：カード値のセット
    dispatch(initializeGame([1, 2, 3, 4, 5, 6, 7, 8]));
  }, [dispatch]);

  // カードクリック時の処理
  const handleCardClick = (id) => {
    dispatch(flipCard(id));
    setTimeout(() => {
      // ペアチェックとAIターンの実行
      dispatch(checkPair());
      dispatch(aiTurn());
    }, 1000); // 1秒待機後にAIターン
  };

  // 難易度変更時の処理
  const handleDifficultyChange = (event) => {
    dispatch(setDifficulty(event.target.value));
  };

  return (
    <div className='App'>
      {/* ダッシュボードコンポーネント：スコア、ターン数、難易度表示 */}
      <Dashboard
        score={score}
        turn={turns}
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
      />
      {/* ボードコンポーネント：カードの表示と操作 */}
      <Board cards={cards} onCardClick={handleCardClick} />
    </div>
  );
}

export default App;
