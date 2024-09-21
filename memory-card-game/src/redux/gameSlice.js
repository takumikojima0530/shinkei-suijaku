import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  turns: 0,
  score: 0,
  difficulty: '弱',  // デフォルトは「弱」
  aiMemory: {},  // AIがペアを記憶するためのメモリ
  gameOver: false,
};

const shuffleCards = (cards) => {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (state, action) => {
      const values = action.payload;
      const cards = values.flatMap(value => [
        { id: `${value}-1`, value, isFlipped: false },
        { id: `${value}-2`, value, isFlipped: false },
      ]);
      state.cards = shuffleCards(cards);
      state.flippedCards = [];
      state.matchedPairs = 0;
      state.turns = 0;
      state.score = 0;
      state.aiMemory = {};
      state.gameOver = false;
    },
    flipCard: (state, action) => {
      const card = state.cards.find(card => card.id === action.payload);
      if (card && !card.isFlipped && state.flippedCards.length < 2) {
        card.isFlipped = true;
        state.flippedCards.push(card);
      }
    },
    checkPair: (state) => {
      const [firstCard, secondCard] = state.flippedCards;
      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        state.matchedPairs++;
        state.score += 10;
        // AIが覚えるペアを記憶
        state.aiMemory[firstCard.value] = [firstCard.id, secondCard.id];
      } else {
        state.cards.forEach(card => {
          if (card.isFlipped && !state.aiMemory[card.value]) {
            card.isFlipped = false;
          }
        });
      }
      state.flippedCards = [];
      state.turns++;
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload;
    },
    aiTurn: (state) => {
      // 使用可能なカードをフィルタリングし、オブジェクト全体を取得
      const availableCards = state.cards.filter(card => !card.isFlipped && !state.aiMemory[card.value]);
      let aiChoice;
      if (state.difficulty === '弱') {
        aiChoice = weakAI(availableCards);  // カードオブジェクトを渡す
      } else if (state.difficulty === '普通') {
        aiChoice = normalAI(availableCards, state.aiMemory);
      } else if (state.difficulty === '強') {
        aiChoice = strongAI(availableCards, state.aiMemory);
      }
      if (aiChoice) {
        aiChoice.isFlipped = true;  // カードオブジェクトに対して操作
        state.flippedCards.push(aiChoice);  // AIの選んだカードをflippedCardsに追加
      }
    },
    endGame: (state) => {
      if (state.matchedPairs === state.cards.length / 2) {
        state.gameOver = true;
      }
    }
  },
});

// AIのロジック
const weakAI = (availableCards) => {
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex];
};

const normalAI = (availableCards, memory = {}) => {
  const knownPair = Object.keys(memory).find(pair => memory[pair].length === 2);
  if (knownPair) {
    return memory[knownPair][0];  // ペアを優先
  }
  return weakAI(availableCards);  // ランダム選択
};

const strongAI = (availableCards, memory) => {
  const knownPair = Object.keys(memory).find(pair => memory[pair].length === 2);
  return knownPair ? memory[knownPair][0] : availableCards[0];
};

export const {
  initializeGame,
  flipCard,
  checkPair,
  setDifficulty,
  aiTurn,
  endGame
} = gameSlice.actions;

export default gameSlice.reducer;
