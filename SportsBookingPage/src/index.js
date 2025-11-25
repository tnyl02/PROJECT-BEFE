import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // นำเข้า CSS ที่มี Tailwind directives
import App from './App';
// import reportWebVitals from './reportWebVitals'; // หากใช้ CRA

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// หากใช้ CRA
// reportWebVitals();