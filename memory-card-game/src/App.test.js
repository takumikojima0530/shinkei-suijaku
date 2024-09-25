// @testing-library/reactからrender関数とscreen関数をインポート
import { render, screen } from '@testing-library/react';
// Appコンポーネントをインポート
import App from './App';

// 'learn react'リンクが正しくレンダリングされるかテスト
test('renders learn react link', () => {
  // Appコンポーネントをレンダリング
  render(<App />);
  // 'learn react'というテキストを含む要素を検索
  const linkElement = screen.getByText(/learn react/i);
  // 検索した要素がドキュメント内に存在することを確認
  expect(linkElement).toBeInTheDocument();
});
