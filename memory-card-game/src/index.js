import React from 'react';
import ReactDOM from 'react-dom/client';  // 'react-dom' から 'react-dom/client' に変更
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';

// ReactDOM.createRoot を使用
const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
