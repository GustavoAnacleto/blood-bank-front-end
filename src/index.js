import React from 'react';
import ReactDOM from 'react-dom/client'; // Correto para React 18+
import App from './App';
import './index.css'; // Ou '../styles/App.css' se estiver usando o caminho correto
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
