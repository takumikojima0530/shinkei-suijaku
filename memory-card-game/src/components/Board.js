import React from 'react';
import Card from './Card';

const Board = ({ cards, onCardClick }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map(card => (
        <Card key={card.id} card={card} onClick={onCardClick} />
      ))}
    </div>
  );
};

export default Board;
