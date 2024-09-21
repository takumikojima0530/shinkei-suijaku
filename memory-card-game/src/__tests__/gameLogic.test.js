import { checkPair } from '../redux/gameSlice';

test('カードのペア判定が正しく行われること', () => {
  const card1 = { value: 1 };
  const card2 = { value: 1 };
  const card3 = { value: 2 };
  expect(checkPair({ firstCard: card1, secondCard: card2 })).toBe(true);
  expect(checkPair({ firstCard: card1, secondCard: card3 })).toBe(false);
});
