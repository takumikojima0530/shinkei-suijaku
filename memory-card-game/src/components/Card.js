import React from 'react';

const Card = ({ card, onClick }) => {
  return (
    <div
      className={`card ${card.isFlipped ? 'flipped' : ''}`}
      onClick={() => onClick(card.id)}
      style={{ width: '100px', height: '150px', position: 'relative' }}
    >
      {card.isFlipped ? (
        // カードのvalueに基づいて、対応するfront画像を表示
        <img
          src={`/front${card.value}.png`}
          alt={`Card Front ${card.value}`}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        // 裏面は共通のback画像を使用
        <img
          src='/back.png'
          alt='Card Back'
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
};

export default Card;
