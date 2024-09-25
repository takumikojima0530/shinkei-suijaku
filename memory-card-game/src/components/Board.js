import React, { useEffect } from 'react';
import Card from './Card';
import { flipCard, checkPair, aiTurn } from '../redux/gameSlice';
import { useDispatch, useSelector } from 'react-redux';

const Board = ({ cards, onCardClick }) => {
  const dispatch = useDispatch();
  const currentPlayer = useSelector((state) => state.game.currentPlayer);
  const isChecking = useSelector((state) => state.game.isChecking);
  const flippedCards = useSelector((state) => state.game.flippedCards);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const timer = setTimeout(() => {
        dispatch(checkPair());
        if (currentPlayer === 'ai') {
          dispatch(aiTurn());
        }
      }, 1000); // 1秒後にペアチェックを行い、AIのターンを実行
      return () => clearTimeout(timer);
    }
  }, [flippedCards, dispatch, currentPlayer]);

  const handleCardClick = (card) => {
    if (currentPlayer === 'player' && !isChecking && flippedCards.length < 2) {
      dispatch(flipCard(card.id));
      onCardClick(card);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='grid grid-cols-4 max-w-screen-lg mx-auto justify-items-center gap-4'>
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
