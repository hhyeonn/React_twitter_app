import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'App';
import "styles/index.scss";
// 절대주소jsconfig.json 때문에__ ./붙어야됨

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);