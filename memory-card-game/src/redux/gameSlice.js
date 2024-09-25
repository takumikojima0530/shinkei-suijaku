import { createSlice } from '@reduxjs/toolkit';

// 初期状態の定義
const initialState = {
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  turns: 0,
  score: 0,
  playerScore: 0,
  aiScore: 0,
  difficulty: '弱', // デフォルトは「弱」
  aiMemory: {}, // AIがペアを記憶するためのメモリ
  gameOver: false,
  currentPlayer: 'player', // プレイヤーから開始
  isChecking: false, // ペアチェック中かどうかを示すフラグ
};

// カードをシャッフルする関数
const shuffleCards = (cards) => {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};

// ゲームスライスの作成
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // ゲームの初期化
    initializeGame: (state, action) => {
      const values = action.payload;
      const cards = values.flatMap((value) => [
        { id: `${value}-1`, value, isFlipped: false },
        { id: `${value}-2`, value, isFlipped: false },
      ]);
      state.cards = shuffleCards(cards);
      state.flippedCards = [];
      state.matchedPairs = 0;
      state.turns = 0;
      state.score = 0;
      state.playerScore = 0;
      state.aiScore = 0;
      state.aiMemory = {};
      state.gameOver = false;
      state.currentPlayer = 'player';
      state.isChecking = false;
    },
    // カードをめくる
    flipCard: (state, action) => {
      const card = state.cards.find((card) => card.id === action.payload);
      if (
        card &&
        !card.isFlipped &&
        state.flippedCards.length < 2 &&
        state.currentPlayer === 'player' &&
        !state.isChecking
      ) {
        card.isFlipped = true;
        state.flippedCards.push(card);
        if (state.flippedCards.length === 2) {
          state.isChecking = true;
        }
      }
    },

    checkPair: (state) => {
      if (state.flippedCards.length !== 2) {
        console.warn('めくられたカードが2枚ではありません');
        return;
      }

      const [firstCard, secondCard] = state.flippedCards;

      if (!firstCard || !secondCard) {
        console.warn('無効なカードオブジェクト:', { firstCard, secondCard });
        state.flippedCards = [];
        state.isChecking = false;
        return;
      }

      if (firstCard.value === secondCard.value) {
        state.matchedPairs++;
        if (state.currentPlayer === 'player') {
          state.playerScore += 10;
        } else {
          state.aiScore += 10;
        }
        state.score += 10;
        state.aiMemory[firstCard.value] = [firstCard.id, secondCard.id];
      } else {
        state.cards.forEach((card) => {
          if (card.id === firstCard.id || card.id === secondCard.id) {
            card.isFlipped = false;
          }
        });
        state.currentPlayer =
          state.currentPlayer === 'player' ? 'ai' : 'player';
      }

      state.flippedCards = [];
      state.turns++;
      state.isChecking = false;
    },

    aiTurn: (state) => {
      if (state.currentPlayer === 'ai' && !state.isChecking) {
        const availableCards = state.cards.filter(
          (card) => !card.isFlipped && !state.aiMemory[card.value]
        );
        let aiChoice1, aiChoice2;

        if (state.difficulty === '弱') {
          aiChoice1 = weakAI(availableCards);
          aiChoice2 = weakAI(
            availableCards.filter((card) => card !== aiChoice1)
          );
        } else if (state.difficulty === '普通') {
          [aiChoice1, aiChoice2] = normalAI(availableCards, state.aiMemory);
        } else if (state.difficulty === '強') {
          [aiChoice1, aiChoice2] = strongAI(availableCards, state.aiMemory);
        }

        if (aiChoice1 && aiChoice2) {
          aiChoice1.isFlipped = true;
          aiChoice2.isFlipped = true;
          state.flippedCards = [aiChoice1, aiChoice2];
          state.isChecking = true;
        } else {
          console.warn('AIが有効なカードを選択できませんでした');
          state.currentPlayer = 'player';
        }
      }
    },
    // ゲーム終了の確認
    endGame: (state) => {
      if (state.matchedPairs === state.cards.length / 2) {
        state.gameOver = true;
      }
    },
  },
});

// AIのロジック
// 弱いAI：ランダムに選択
const weakAI = (availableCards) => {
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex];
};

// 普通のAI：既知のペアを優先、なければランダム
const normalAI = (availableCards, memory = {}) => {
  const knownPair = Object.keys(memory).find(
    (pair) => memory[pair].length === 2
  );
  if (knownPair) {
    return memory[knownPair];
  }
  return [weakAI(availableCards), weakAI(availableCards)];
};

// 強いAI：既知のペアを優先、なければ最初の2枚のカード
const strongAI = (availableCards, memory) => {
  const knownPair = Object.keys(memory).find(
    (pair) => memory[pair].length === 2
  );
  return knownPair ? memory[knownPair] : [availableCards[0], availableCards[1]];
};

// アクションのエクスポート
export const {
  initializeGame,
  flipCard,
  checkPair,
  setDifficulty,
  aiTurn,
  endGame,
} = gameSlice.actions;
export default gameSlice.reducer;
